/**
 * Setup server IPC handlers
 * @param {IpcMain} ipcMain - Electron IPC main
 * @param {Object} server - Server instance
 */
function setup(ipcMain, server) {
    // Start server
    ipcMain.on('start', (e, newconfig) => {
        try {
            if (server) {
                server.start(newconfig);
                e.reply('status', server.getStatus());
            } else {
                e.reply('error', 'Server not initialized');
            }
        } catch (error) {
            console.error('Error starting server:', error);
            e.reply('error', error.message);
        }
    });

    // Get server status
    ipcMain.on('status', (e) => {
        try {
            if (server) {
                e.reply('status', server.getStatus());
            } else {
                e.reply('status', { working: false });
            }
        } catch (error) {
            console.error('Error getting server status:', error);
            e.reply('error', error.message);
        }
    });

    // Stop server
    ipcMain.on('stop', (e) => {
        try {
            if (server) {
                server.stop();
                e.reply('status', server.getStatus());
            }
        } catch (error) {
            console.error('Error stopping server:', error);
            e.reply('error', error.message);
        }
    });

    // Play simulation
    ipcMain.on('play', (e) => {
        try {
            if (server) {
                server.play();
                e.reply('status', server.getStatus());
            }
        } catch (error) {
            console.error('Error playing simulation:', error);
            e.reply('error', error.message);
        }
    });

    // Pause simulation
    ipcMain.on('pause', (e) => {
        try {
            if (server) {
                server.pause();
                e.reply('status', server.getStatus());
            }
        } catch (error) {
            console.error('Error pausing simulation:', error);
            e.reply('error', error.message);
        }
    });

    // Get server time
    ipcMain.on('clock', (e) => {
        try {
            if (server) {
                e.reply('clock', server.getTime());
            }
        } catch (error) {
            console.error('Error getting server time:', error);
            e.reply('error', error.message);
        }
    });

    // Get server configuration
    ipcMain.on('getConfig', (e) => {
        try {
            if (server) {
                e.reply('getConfig', server.getConfig());
            }
        } catch (error) {
            console.error('Error getting server config:', error);
            e.reply('error', error.message);
        }
    });

    // Get server logs
    ipcMain.on('getLog', (e, last) => {
        try {
            if (server) {
                e.reply('setLog', server.getLogID(), server.getLog(last));
            }
        } catch (error) {
            console.error('Error getting server logs:', error);
            e.reply('error', error.message);
        }
    });
}

module.exports = {
    setup
}; 