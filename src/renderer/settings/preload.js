const { ipcRenderer } = require('electron')

// Expose ipcRenderer directly to the window (nodeIntegration enabled)
window.electronAPI = {
    ipcRenderer: ipcRenderer
}