const fs = require('fs');
const path = require('path');

class ConfigManager {
    constructor() {
        this.config = {};
        this.configPath = path.resolve(__dirname, '../../../config/default.json');
        this.loadConfig();
    }

    /**
     * Load configuration from file
     */
    loadConfig() {
        try {
            if (fs.existsSync(this.configPath)) {
                this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
            } else {
                console.warn('Default config file not found, using empty config');
                this.config = {};
            }
        } catch (error) {
            console.error('Error loading config:', error);
            this.config = {};
        }
    }

    /**
     * Get a configuration value
     * @param {string} key - Configuration key (dot notation supported)
     * @param {*} defaultValue - Default value if key not found
     * @returns {*} Configuration value
     */
    get(key, defaultValue = undefined) {
        const keys = key.split('.');
        let value = this.config;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return defaultValue;
            }
        }

        return value;
    }

    /**
     * Set a configuration value
     * @param {string} key - Configuration key (dot notation supported)
     * @param {*} value - Value to set
     */
    set(key, value) {
        const keys = key.split('.');
        let current = this.config;

        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!(k in current) || typeof current[k] !== 'object') {
                current[k] = {};
            }
            current = current[k];
        }

        current[keys[keys.length - 1]] = value;
    }

    /**
     * Save configuration to file
     */
    save() {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
        } catch (error) {
            console.error('Error saving config:', error);
        }
    }

    /**
     * Get all configuration
     * @returns {Object} Complete configuration object
     */
    getAll() {
        return this.config;
    }
}

module.exports = ConfigManager; 