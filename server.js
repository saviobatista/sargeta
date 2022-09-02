const { ipcRenderer } = require('electron')
window.addEventListener('DOMContentLoaded', () => {
  var placas = require('os').networkInterfaces()
  Object.keys(placas).forEach(interface => {
    placas[interface].forEach(placa => {
      if ('IPv4' === placa.family && placa.internal == false) {
        document.getElementById('ip').innerText = placa.address
      }
    })
  })
  window.Bridge.log()
  window.Bridge.config()
  $('#btStart').on('click',e=>{ window.Bridge.start() })
  $('#btStop').on('click',e=>{ window.Bridge.stop() })
  $('#btPlay').on('click',e=>{ window.Bridge.play() })
  $('#btPause').on('click',e=>{ window.Bridge.pause() })
  $('#btTravar').on('click',e=>{ window.Bridge.travar() })
  $('#btDestravar').on('click',e=>{ window.Bridge.destravar() })
  $('#btDerrubar').on('click',e=>{ window.Bridge.derrubar() })
  $('#btLevantar').on('click',e=>{ window.Bridge.levantar() })
  $('#btConverter').on('click',e=>{ window.Bridge.converter() })
  $('#log').css('height','68vh')
  ipcRenderer.send('status')
})
init = () => {
  window.last = 0
  window.Bridge = {
    start:()=>{ var config = {}; if($('#file').val().length)config.file = $('#file')[0].files[0].path; $('#config').serializeArray().forEach(obj=>{ config[obj.name] = obj.value }); ipcRenderer.send('start',config); window.pinger = setInterval(()=>{window.Bridge.clock()},1000) },
    stop:()=>{ ipcRenderer.send('stop');clearInterval(window.pinger) },
    play:()=>{ ipcRenderer.send('play') },
    pause:()=>{ ipcRenderer.send('pause') },
    log:()=>{ ipcRenderer.send('getLog',window.last) },
    config:()=>{ ipcRenderer.send('getConfig') },
    travar:()=>{ ipcRenderer.send('travar') },
    destravar:()=>{ ipcRenderer.send('destravar') },
    derrubar:()=>{ ipcRenderer.send('derrubar') },
    levantar:()=>{ ipcRenderer.send('levantar') },
    clock:()=>{ ipcRenderer.send('clock') },
    converter:()=>{ ipcRenderer.send('converter') }
  }
  ipcRenderer.on('setLog',(e,newlast,newlog)=>{ window.last = newlast; newlog.forEach(element => { $('#log').prepend(element+'<br>') }); setTimeout(()=>{window.Bridge.log()},1000) })
  ipcRenderer.on('getConfig',(e,config)=>{ for(var attr in config) { if(attr!='file')$('#'+attr).val(config[attr]) } })
  ipcRenderer.on('status',(e,status)=>{
    if(!status.working) {
      $('#btStop,#btPlay,#btPause,#btTravar,#btDestravar,#btDerrubar,#btLevantar').attr('disabled',true)
      $('#btStart,#config input,#config textarea').removeAttr('disabled')
      $('#btStop,#btPause,#btDestravar,#btLevantar').addClass('d-none')
      $('#btStart,#btPlay,#btTravar,#btDerrubar').removeClass('d-none')
    } else if(!status.running) {
      $('#btPause,#btTravar,#btDestravar,#btDerrubar,#btLevantar').attr('disabled',true)
      $('#btPlay').removeAttr('disabled')
      $('#btStart,#btPause,#btDestravar,#btLevantar').addClass('d-none')
      $('#btStop,#btPlay,#btTravar,#btDerrubar').removeClass('d-none')
    } else if(status.paused) {
      $('#btPause,#btTravar,#btDestravar,#btDerrubar,#btLevantar').attr('disabled',true)
      $('#btPlay').removeAttr('disabled').removeClass('d-none')
      $('#btPause').addClass('d-none')
    } else if(status.freezed) {
      $('#btTravar,#btDerrubar,#btLevantar').attr('disabled',true)
      $('#btDestravar').removeAttr('disabled').removeClass('d-none')
      $('#btTravar').addClass('d-none')
    } else if(status.locked) {
      $('#btTravar,#btDestravar,#btDerrubar').attr('disabled',true)
      $('#btLevantar').removeAttr('disabled').removeClass('d-none')
      $('#btDerrubar').addClass('d-none')
    } else {
      $('#btPlay,#btDestravar,#btLevantar').attr('disabled',true)
      $('#btTravar,#btDerrubar,#btPause').removeAttr('disabled')
      $('#btStart,#btPlay,#btDestravar,#btLevantar').addClass('d-none')
      $('#btStop,#btPause,#btTravar,#btDerrubar').removeClass('d-none')
    }
  })
  ipcRenderer.on('clock',(e,clock)=>{ $('#clock').text(clock) })
  ipcRenderer.on('error',(e,err)=>{console.log(err);alert(err)})
}
init()