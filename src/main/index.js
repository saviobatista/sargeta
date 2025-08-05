const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Import modules
const SettingsWindow = require('./windows/settings');
const ServerWindow = require('./windows/server');
const ClientWindow = require('./windows/client');

// Import IPC handlers
const settingsIPC = require('./ipc/settings');
const serverIPC = require('./ipc/server');
const clientIPC = require('./ipc/client');

// Import utilities
const { getHostname, getLocalIP } = require('./utils/network');

// Configuration
const CONFIG_FILE = 'config.json';
const DEV_MODE = process.env.NODE_ENV === 'development';

let settings = {};
let server = null;
let settingsWindow = null;
let serverWindow = null;
let clientWindow = null;

/**
 * Initialize the application
 */
function initialize() {
    loadSettings();
    setupIPCHandlers();
    createInitialWindow();
}

/**
 * Load settings from file
 */
function loadSettings() {
    try {
        if (fs.existsSync(path.resolve(CONFIG_FILE))) {
            settings = JSON.parse(fs.readFileSync(path.resolve(CONFIG_FILE)));
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

/**
 * Setup IPC handlers
 */
function setupIPCHandlers() {
    // Settings IPC
    settingsIPC.setup(ipcMain, settings, CONFIG_FILE);
    
    // Server IPC
    serverIPC.setup(ipcMain, server);
    
    // Client IPC
    clientIPC.setup(ipcMain, settings);
    
    // Utility IPC
    ipcMain.on('getHostname', (e) => {
        const hostname = getHostname();
        console.log('Sending hostname:', hostname);
        e.reply('hostname', hostname);
    });
    
    ipcMain.on('getLocalIP', (e) => {
        const localIP = getLocalIP();
        console.log('Sending local IP:', localIP);
        e.reply('localIP', localIP);
    });
}

/**
 * Create initial window based on settings
 */
function createInitialWindow() {
    if (DEV_MODE || !settings.mode) {
        createSettingsWindow();
    } else if (settings.mode === 'CLIENT') {
        createClientWindow();
    } else if (settings.mode === 'SERVER') {
        createServerWindow();
    } else {
        createSettingsWindow();
    }
}

/**
 * Create settings window
 */
function createSettingsWindow() {
    settingsWindow = new SettingsWindow();
    settingsWindow.on('closed', () => {
        settingsWindow = null;
    });
}

/**
 * Create server window
 */
function createServerWindow() {
    const Servidor = require('../server');
    server = new Servidor();
    serverWindow = new ServerWindow();
    serverWindow.on('closed', () => {
        serverWindow = null;
    });
}

/**
 * Create client window
 */
function createClientWindow() {
    clientWindow = new ClientWindow();
    clientWindow.on('closed', () => {
        clientWindow = null;
    });
}

// App event handlers
app.on('ready', initialize);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (settingsWindow === null) {
        initialize();
    }
});

// Export for testing
module.exports = {
    initialize,
    loadSettings,
    createSettingsWindow,
    createServerWindow,
    createClientWindow
}; 