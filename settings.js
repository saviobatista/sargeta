const { ipcRenderer } = require('electron')
window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send('settingsGet')
    $('#btSalvar').click(window.Bridge.save)
    $('input[type=radio]').click(window.Bridge.validate)
    window.Bridge.validate()
})
init = () => {
    window.Bridge = {
        save: () => {
            if(!$('#maquina').val().length) alert('Informe o nome da máquina!')
            else if($('[name=mode]:checked').val()=='undefined')alert('Selecione o modo de uso!')
            else ipcRenderer.send('settingsSet',{mode:$('[name=mode]:checked').val(),maquina:$('#maquina').val(),servidor:$('#servidor').val()})
        },
        validate: () => {
            if($('[name=mode]:checked').val()=='CLIENT')$('.client').removeClass('invisible')
            else $('.client').addClass('invisible')
        }
    }
    ipcRenderer.on('settingsGet',(e,settings)=>{
        $('[value='+settings.mode+']').prop('checked', true);
        $('#servidor').val(settings.servidor)
        $('#maquina').val(settings.maquina)
        window.Bridge.validate()
    })
}
init()