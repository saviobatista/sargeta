const os = require('os');

/**
 * Get the current hostname
 * @returns {string} The hostname
 */
function getHostname() {
    return os.hostname();
}

/**
 * Get the local IP address
 * @returns {string} The local IP address
 */
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    let localIP = '127.0.0.1'; // Default fallback
    
    // Find the first non-internal IPv4 address
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            if (interface.family === 'IPv4' && !interface.internal) {
                localIP = interface.address;
                break;
            }
        }
        if (localIP !== '127.0.0.1') break;
    }
    
    return localIP;
}

/**
 * Get all network interfaces
 * @returns {Object} Network interfaces information
 */
function getNetworkInterfaces() {
    return os.networkInterfaces();
}

/**
 * Check if a port is available
 * @param {number} port - Port to check
 * @returns {Promise<boolean>} True if port is available
 */
function isPortAvailable(port) {
    return new Promise((resolve) => {
        const net = require('net');
        const server = net.createServer();
        
        server.listen(port, () => {
            server.close();
            resolve(true);
        });
        
        server.on('error', () => {
            resolve(false);
        });
    });
}

module.exports = {
    getHostname,
    getLocalIP,
    getNetworkInterfaces,
    isPortAvailable
}; 