const express = require('express'),
  Excel = require('exceljs'),
  path = require('path'),
  fs = require('fs')
module.exports = class Servidor {
  _config
  _service
  _interval
  _configfile = 'config.json'
  _rpl = []
  _log = []
  _changes = []
  _working = false
  _running = false
  _paused = false
  _locked = false
  _freezed = false
  clock = new Date()
  app

  constructor() {
    this.log('Inicializando serviço...')
    this._config = JSON.parse(fs.readFileSync(path.resolve(this._configfile)))
    this.app = express()
    this.app.use((err,req,res,next)=>{ this.log(err.stack,'ERROR'); next(err) })
    
    this.app.get('/check',(req,res)=>res.send('ok'))
    this.app.get('/rpl',(req,res)=>res.json(this._rpl))
    this.app.get('/change/:maquina/:tipo/:acao/:valor',req=>{this._changes.push(req.params)})
    this.app.get('/login/:maquina',(req,res)=>{
      this.log('Cliente conectado: '+req.params.maquina)
      res.json(this._rpl)
    })
    this.app.get('/ping/:maquina/:last',(req,res)=>{
      var ret = {time:this.clock,lastChange:this._changes.length,changes:[],freezed:this._freezed,locked:this._locked}
      for(var i=req.params.last;i<this._changes.length;i++)
        ret.changes.push(this._changes[i])
      res.json(ret)
    })

    this.app.post('/login')
    this.log('Sistemas prontos.')
  }
  setConfig(newconfig) { 
    for(var i in newconfig)
      if(typeof newconfig[i]!='undefined')
        this._config[i] = newconfig[i]
    fs.writeFileSync(path.resolve(this._configfile),JSON.stringify(this._config))
  }
  getConfig() { return this._config }
  setRpl() {
    if(!fs.existsSync(this._config.file)) {
      this.log('Erro fatal! Arquivo de RPL Inválido: "'+this._config.file+'"','ERROR')
      return;
    }
    this._rpl = { ARR:[], DEP:[] }
    var workbook = new Excel.Workbook()
    workbook.xlsx.readFile(this._config.file).then(()=>{
      var modes = ['ARR','DEP']
      modes.forEach(mode=>workbook.getWorksheet(mode).eachRow((row,rowNumber)=>{
        if(rowNumber>11)this._rpl[mode].push({
          id:this._rpl[mode].length+1,
          indicativo:row.values[3],
          origem:mode=='DEP'?this._config.local:row.values[5],
          destino:mode=='DEP'?row.values[5]:this._config.local,
          eobt:row.values[mode=='DEP'?9:10].replace(':',''),
          tipo:row.values[4].substr(0,4),
          esteira:row.values[4].substr(-1),
          nivel:row.values[17],
          squawk:row.values[6],
          speed:row.values[16],
          rota:row.values[18],
          fixo:'',
          saida:'',
          trns:'',
          obs:'',
          atis:'',
          data:new Date(this.clock.getFullYear(),this.clock.getMonth(),this.clock.getDate(),row.values[mode=='DEP'?9:10].substr(0,2),row.values[mode=='DEP'?9:10].substr(-2),0),
          pos:row.values[mode=='DEP'?13:11],
          status:mode=='DEP'?'nCONF':'nCONT',
          parsed:false
        })
      }))
      this.log('Carregou '+(this._rpl.ARR.length+this._rpl.DEP.length)+' planos de voo.')
    })
  }
  start(config) {
    this.setConfig(config)
    if(!this._config.porta)
      this.log('Erro fatal! Informe a porta para iniciar o serviço!','ERROR')
    else {
      this.setRpl()
      this.clock = new Date()
      if(config.hora.length) {
        this.clock.setHours(parseInt(config.hora.substr(0,2)))
        this.clock.setMinutes(parseInt(config.hora.substr(3,2)))
        this.clock.setSeconds(parseInt(config.hora.substr(6,2)))
      }
      if(typeof this._interval!=='undefined')clearInterval(this._interval)
      this._interval = setInterval(()=>{if(this._running)this.clock.setSeconds(this.clock.getSeconds()+1)},1000)
      this._service = this.app.listen(this._config.porta,this.log('Serviço iniciado. Disponível na porta '+this._config.porta))
      this._working = true;
    }
  }
  stop() { this._working=false;this._running = false;this._paused = false;this._locked=false;this._service.close();this._rpl=[];this.log('Serviço finalizado') }
  play() { this._running = true;this._freezed = false;this._paused = false;this._locked=false;this.log('Serviço executando.') }
  pause() { this._running = false; this._paused = true;this.log('Serviço parado.') }
  derrubar() { this._locked = true;this.log('Serviço travado.') }
  levantar() { this._locked = false;this.log('Serviço destravado.') }
  travar() { this._freezed = true;this.log('Serviço derrubado.') }
  destravar() { this._freezed = false;this.log('Serviço normalizado.') }
  log(text,tipo) { var d = new Date(); this._log.push(('0'+d.getHours()).substr(-2)+':'+('0'+d.getMinutes()).substr(-2)+':'+('0'+d.getSeconds()).substr(-2)+' - '+(tipo || 'INFO')+': '+text); console.log(text) }
  getLogID() { return this._log.length }
  getLog(last) { var res = []; this._log.forEach((valor,idx)=>{ if(idx>=last)res.push(valor) }); return res }
  getTime() { return ('0'+this.clock.getHours()).substr(-2)+':'+('0'+this.clock.getMinutes()).substr(-2)+':'+('0'+this.clock.getSeconds()).substr(-2) }
  getStatus() { return { working:this._working, paused:this._paused, freezed:this._freezed, locked:this._locked, running:this._running } }
}