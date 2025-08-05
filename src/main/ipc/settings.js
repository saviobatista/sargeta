const fs = require('fs');
const path = require('path');

/**
 * Setup settings IPC handlers
 * @param {IpcMain} ipcMain - Electron IPC main
 * @param {Object} settings - Settings object
 * @param {string} configFile - Configuration file path
 */
function setup(ipcMain, settings, configFile) {
    // Get settings
    ipcMain.on('settingsGet', (e) => {
        try {
            e.reply('settingsGet', settings);
        } catch (error) {
            console.error('Error getting settings:', error);
            e.reply('settingsGet', {});
        }
    });

    // Set settings
    ipcMain.on('settingsSet', (e, data) => {
        try {
            console.log('Received settings:', data);
            
            // Update settings object
            settings.maquina = data.maquina;
            settings.mode = data.mode;
            settings.servidor = data.servidor;
            
            console.log('Updated settings object:', settings);
            
            // Save to file
            fs.writeFileSync(path.resolve(configFile), JSON.stringify(settings, null, 2));
            console.log('Settings saved to file');
            
            // Create appropriate window based on mode
            if (data.mode === 'SERVER') {
                console.log('Creating server window');
                // This will be handled by the main process
                e.reply('settingsSaved', { mode: 'SERVER' });
            } else {
                console.log('Creating client window');
                e.reply('settingsSaved', { mode: 'CLIENT' });
            }
            
        } catch (error) {
            console.error('Error saving settings:', error);
            e.reply('settingsError', { error: error.message });
        }
    });
}

module.exports = {
    setup
}; 