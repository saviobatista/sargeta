const { BrowserWindow } = require('electron');
const path = require('path');

class ServerWindow {
    constructor() {
        this.window = new BrowserWindow({
            width: 800,
            height: 640,
            resizable: false,
            maximizable: false,
            menuBarVisibility: false,
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                preload: path.resolve(__dirname, '../../renderer/server/preload.js')
            }
        });

        this.window.loadFile(path.resolve(__dirname, '../../renderer/server/index.html'));
        
        // Enable developer tools in development
        if (process.env.NODE_ENV === 'development') {
            this.window.webContents.openDevTools();
        }

        this.window.on('closed', () => {
            this.window = null;
        });
    }

    /**
     * Close the window
     */
    close() {
        if (this.window) {
            this.window.close();
        }
    }

    /**
     * Check if window is closed
     */
    isClosed() {
        return this.window === null;
    }

    /**
     * Add event listener
     */
    on(event, callback) {
        if (this.window) {
            this.window.on(event, callback);
        }
    }
}

module.exports = ServerWindow; 