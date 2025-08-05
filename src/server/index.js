const express = require('express');
const Excel = require('exceljs');
const path = require('path');
const fs = require('fs');

class Servidor {
    constructor() {
        this._config = {};
        this._service = null;
        this._interval = null;
        this._configfile = 'config.json';
        this._rpl = [];
        this._log = [];
        this._changes = [];
        this._working = false;
        this._running = false;
        this._paused = false;
        this._locked = false;
        this._freezed = false;
        this.clock = new Date();
        this.app = null;

        this.initialize();
    }

    /**
     * Initialize the server
     */
    initialize() {
        this.log('Inicializando serviço...');
        
        try {
            this._config = JSON.parse(fs.readFileSync(path.resolve(this._configfile)));
        } catch (error) {
            console.error('Error loading config:', error);
            this._config = {};
        }

        this.setupExpress();
        this.log('Sistemas prontos.');
    }

    /**
     * Setup Express application
     */
    setupExpress() {
        this.app = express();
        
        // Error handling middleware
        this.app.use((err, req, res, next) => {
            this.log(err.stack, 'ERROR');
            next(err);
        });

        // Routes
        this.app.get('/check', (req, res) => res.send('ok'));
        this.app.get('/rpl', (req, res) => res.json(this._rpl));
        
        this.app.get('/change/:maquina/:tipo/:acao/:valor', (req) => {
            this._changes.push(req.params);
        });

        this.app.get('/login/:maquina', (req, res) => {
            this.log('Cliente conectado: ' + req.params.maquina);
            res.json(this._rpl);
        });

        this.app.get('/ping/:maquina/:last', (req, res) => {
            const ret = {
                time: this.clock,
                lastChange: this._changes.length,
                changes: [],
                freezed: this._freezed,
                locked: this._locked
            };
            
            for (let i = req.params.last; i < this._changes.length; i++) {
                ret.changes.push(this._changes[i]);
            }
            
            res.json(ret);
        });

        this.app.post('/login', (req, res) => {
            res.json({ status: 'ok' });
        });
    }

    /**
     * Set configuration
     */
    setConfig(newconfig) {
        for (const key in newconfig) {
            if (typeof newconfig[key] !== 'undefined') {
                this._config[key] = newconfig[key];
            }
        }
        fs.writeFileSync(path.resolve(this._configfile), JSON.stringify(this._config));
    }

    /**
     * Get configuration
     */
    getConfig() {
        return this._config;
    }

    /**
     * Set flight plans
     */
    setRpl() {
        if (!fs.existsSync(this._config.file)) {
            this.log('Erro fatal! Arquivo de RPL Inválido: "' + this._config.file + '"', 'ERROR');
            return;
        }

        this._rpl = { ARR: [], DEP: [] };
        const workbook = new Excel.Workbook();
        
        workbook.xlsx.readFile(this._config.file).then(() => {
            const modes = ['ARR', 'DEP'];
            modes.forEach(mode => {
                workbook.getWorksheet(mode).eachRow((row, rowNumber) => {
                    if (rowNumber > 11) {
                        this._rpl[mode].push({
                            id: this._rpl[mode].length + 1,
                            indicativo: row.values[3],
                            origem: mode === 'DEP' ? this._config.local : row.values[5],
                            destino: mode === 'DEP' ? row.values[5] : this._config.local,
                            eobt: row.values[mode === 'DEP' ? 9 : 10].replace(':', ''),
                            tipo: row.values[4].substr(0, 4),
                            esteira: row.values[4].substr(-1),
                            nivel: row.values[17],
                            squawk: row.values[6],
                            speed: row.values[16],
                            rota: row.values[18],
                            fixo: '',
                            saida: '',
                            trns: '',
                            obs: '',
                            atis: '',
                            data: new Date(this.clock.getFullYear(), this.clock.getMonth(), this.clock.getDate(), row.values[mode === 'DEP' ? 9 : 10].substr(0, 2), row.values[mode === 'DEP' ? 9 : 10].substr(-2), 0),
                            pos: row.values[mode === 'DEP' ? 13 : 11],
                            status: mode === 'DEP' ? 'nCONF' : 'nCONT',
                            parsed: false
                        });
                    }
                });
            });
            this.log('Carregou ' + (this._rpl.ARR.length + this._rpl.DEP.length) + ' planos de voo.');
        });
    }

    /**
     * Start server
     */
    start(config) {
        this.setConfig(config);
        
        if (!this._config.porta) {
            this.log('Erro fatal! Informe a porta para iniciar o serviço!', 'ERROR');
            return;
        }

        this.setRpl();
        this.clock = new Date();
        
        if (config.hora && config.hora.length) {
            this.clock.setHours(parseInt(config.hora.substr(0, 2)));
            this.clock.setMinutes(parseInt(config.hora.substr(3, 2)));
            this.clock.setSeconds(parseInt(config.hora.substr(6, 2)));
        }

        if (typeof this._interval !== 'undefined') {
            clearInterval(this._interval);
        }
        
        this._interval = setInterval(() => {
            if (this._running) {
                this.clock.setSeconds(this.clock.getSeconds() + 1);
            }
        }, 1000);

        this._service = this.app.listen(this._config.porta, () => {
            this.log('Serviço iniciado. Disponível na porta ' + this._config.porta);
        });
        
        this._working = true;
    }

    /**
     * Stop server
     */
    stop() {
        this._working = false;
        this._running = false;
        this._paused = false;
        this._locked = false;
        
        if (this._service) {
            this._service.close();
        }
        
        this._rpl = [];
        this.log('Serviço finalizado');
    }

    /**
     * Play simulation
     */
    play() {
        this._running = true;
        this._freezed = false;
        this._paused = false;
        this._locked = false;
        this.log('Serviço executando.');
    }

    /**
     * Pause simulation
     */
    pause() {
        this._running = false;
        this._paused = true;
        this.log('Serviço parado.');
    }

    /**
     * Lock simulation
     */
    derrubar() {
        this._locked = true;
        this.log('Serviço travado.');
    }

    /**
     * Unlock simulation
     */
    levantar() {
        this._locked = false;
        this.log('Serviço destravado.');
    }

    /**
     * Freeze simulation
     */
    travar() {
        this._freezed = true;
        this.log('Serviço derrubado.');
    }

    /**
     * Unfreeze simulation
     */
    destravar() {
        this._freezed = false;
        this.log('Serviço normalizado.');
    }

    /**
     * Log message
     */
    log(text, tipo) {
        const d = new Date();
        const timestamp = ('0' + d.getHours()).substr(-2) + ':' + ('0' + d.getMinutes()).substr(-2) + ':' + ('0' + d.getSeconds()).substr(-2);
        const logEntry = timestamp + ' - ' + (tipo || 'INFO') + ': ' + text;
        
        this._log.push(logEntry);
        console.log(text);
    }

    /**
     * Get log ID
     */
    getLogID() {
        return this._log.length;
    }

    /**
     * Get log entries
     */
    getLog(last) {
        const res = [];
        this._log.forEach((valor, idx) => {
            if (idx >= last) {
                res.push(valor);
            }
        });
        return res;
    }

    /**
     * Get current time
     */
    getTime() {
        return ('0' + this.clock.getHours()).substr(-2) + ':' + ('0' + this.clock.getMinutes()).substr(-2) + ':' + ('0' + this.clock.getSeconds()).substr(-2);
    }

    /**
     * Get server status
     */
    getStatus() {
        return {
            working: this._working,
            paused: this._paused,
            freezed: this._freezed,
            locked: this._locked,
            running: this._running
        };
    }
}

module.exports = Servidor; 