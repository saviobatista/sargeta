const http = require('http');

/**
 * Setup client IPC handlers
 * @param {IpcMain} ipcMain - Electron IPC main
 * @param {Object} settings - Settings object
 */
function setup(ipcMain, settings) {
    // Login to server
    ipcMain.on('login', (e) => {
        try {
            const url = `http://${settings.servidor}/login/${settings.maquina}`;
            http.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        e.reply('login', response);
                    } catch (error) {
                        console.error('Error parsing login response:', error);
                        e.reply('error', 'Invalid server response');
                    }
                });
            }).on('error', (error) => {
                console.error('Login error:', error);
                e.reply('error', 'Connection failed');
            });
        } catch (error) {
            console.error('Error in login:', error);
            e.reply('error', error.message);
        }
    });

    // Logout
    ipcMain.on('logout', () => {
        // This will be handled by the main process window management
        console.log('Logout requested');
    });

    // Send change to server
    ipcMain.on('change', (e, tipo, acao, valor) => {
        try {
            const url = `http://${settings.servidor}/change/${settings.maquina}/${tipo}/${acao}/${valor}`;
            http.get(url, (res) => {
                // Change sent successfully
            }).on('error', (error) => {
                console.error('Change error:', error);
            });
        } catch (error) {
            console.error('Error sending change:', error);
        }
    });

    // Ping server
    ipcMain.on('ping', (e, lastChange) => {
        try {
            const url = `http://${settings.servidor}/ping/${settings.maquina}/${lastChange}`;
            http.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        e.reply('ping', response);
                    } catch (error) {
                        console.error('Error parsing ping response:', error);
                        e.reply('error', 'Invalid server response');
                    }
                });
            }).on('error', (error) => {
                console.error('Ping error:', error);
                e.reply('error', 'Connection failed');
            });
        } catch (error) {
            console.error('Error in ping:', error);
            e.reply('error', error.message);
        }
    });
}

module.exports = {
    setup
}; 