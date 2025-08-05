// Vanilla JavaScript approach - no jQuery dependency
document.addEventListener('DOMContentLoaded', function() {
    console.log('Settings page loaded with vanilla JS');
    console.log('electronAPI available:', !!window.electronAPI);
    console.log('ipcRenderer available:', !!(window.electronAPI && window.electronAPI.ipcRenderer));
    
    // Initialize the bridge object
    window.Bridge = {
        save: function() {
            console.log('Save button clicked'); // Debug log
            var maquina = document.getElementById('maquina').value;
            var modeElement = document.querySelector('input[name="mode"]:checked');
            var mode = modeElement ? modeElement.value : undefined;
            var servidor = document.getElementById('servidor').value;
            
            console.log('Form values:', {mode: mode, maquina: maquina, servidor: servidor}); // Debug log
            
            if(!maquina || maquina.length === 0) {
                alert('Informe o nome da máquina!')
            }
            else if(!mode || mode === undefined) {
                alert('Selecione o modo de uso!')
            }
            else {
                console.log('Sending settings to main process'); // Debug log
                window.electronAPI.ipcRenderer.send('settingsSet', {
                    mode: mode, 
                    maquina: maquina, 
                    servidor: servidor
                });
            }
        },
        validate: function() {
            var modeElement = document.querySelector('input[name="mode"]:checked');
            var clientElements = document.querySelectorAll('.client');
            
            if(modeElement && modeElement.value == 'CLIENT') {
                clientElements.forEach(function(el) {
                    el.classList.remove('invisible');
                });
            } else {
                clientElements.forEach(function(el) {
                    el.classList.add('invisible');
                });
            }
        }
    };
    
    // Set up event handlers
    document.getElementById('btSalvar').addEventListener('click', function(e) {
        e.preventDefault(); // Prevent form submission
        window.Bridge.save();
        return false; // Additional prevention
    });
    
    // Radio button change handlers
    document.querySelectorAll('input[name="mode"]').forEach(function(radio) {
        radio.addEventListener('change', window.Bridge.validate);
    });
    
    // Also prevent form submission directly
    document.getElementById('config').addEventListener('submit', function(e) {
        e.preventDefault();
        window.Bridge.save();
        return false;
    });
    
    // Set up IPC listener for settings
    window.electronAPI.ipcRenderer.on('settingsGet', function(e, settings) {
        console.log('Received settings:', settings);
        if(settings.mode) {
            var radio = document.querySelector('input[value="' + settings.mode + '"]');
            if(radio) radio.checked = true;
        }
        if(settings.servidor) {
            document.getElementById('servidor').value = settings.servidor;
        }
        if(settings.maquina) {
            document.getElementById('maquina').value = settings.maquina;
        }
        window.Bridge.validate();
    });
    
    // Initial validation and request settings
    window.Bridge.validate();
    window.electronAPI.ipcRenderer.send('settingsGet');
    
    console.log('Settings initialization complete');
});