const { ipcRenderer } = require('electron')

// Expose ipcRenderer to the window for use after jQuery loads
window.electronAPI = {
    ipcRenderer: ipcRenderer
} 