
const { ipcRenderer } = require('electron'),
      template = require('./template')
let pingInterval = 1000,//Milisegundos
    progresso = {
      'nCONF':'wCLR',
      'wCLR':'rCLR',
      'rCLR':'dCLR',
      'dCLR':'wPUSH',
      'wPUSH':'cPUSH',
      'cPUSH':'wTAXI',
      'wTAXI':'cTAXI',
      'cTAXI':'HOLD',
      'HOLD':'cRWY',
      'cRWY':'cDEP',
      'cDEP':'DEP',
      'DEP':'del',

      'nCONT':'SEQ',
      'SEQ':'wARR',
      'wARR':'cARR',
      'cARR':'ARR',
      'ARR':'TAXI',
      'TAXI':'wPOS',
      'wPOS':'cPOS',
      'cPOS':'BLKon',
      'BLKon':'del'
    }
init = () => {
  window.lastChange = 0
  window.Bridge = {
    locked:false,
    freezed:false,
    settings: () => { ipcRenderer.send('settingsGet') },
    login: () => { ipcRenderer.send('login') },
    logout: () => { ipcRenderer.send('logout') },
    ping: () => { ipcRenderer.send('ping',window.lastChange) },
    change: (tipo,acao,valor) => { ipcRenderer.send('change',tipo,acao,valor) },
    parseRPL: () => {
      window.rpl.DEP.forEach((obj,idx)=>{
        var diff = Math.round((new Date(obj.data)-window.time) / 60000)
        if(diff>=0&&diff<=parseInt(window.settings.tempo)&&!obj.parsed){
          template.getStripOut(obj).appendTo('#holder-nCONF')
          window.rpl.DEP[idx].parsed = true
        }
      })
      window.rpl.ARR.forEach((obj,idx)=>{
        var diff = Math.round((new Date(obj.data)-window.time) / 60000)
        if(diff>=0&&diff<=parseInt(window.settings.tempo)&&!obj.parsed){
          template.getStripIn(obj).insertAfter('#seq')
          window.rpl.ARR[idx].parsed = true
        }
      })
      //vencidas
      $('#holder-nCONF .strip').each((idx,el)=>{if(Math.round((window.time-new Date($(el).data('time'))) / 60000)>=0)$(el).addClass('vencido')})
      recount()
      setTimeout(window.Bridge.parseRPL,60000)
    }
  }
  ipcRenderer.on('settingsGet',(e,s)=>{ window.settings = s; window.Bridge.login() })
  ipcRenderer.on('login',(e,rpl)=>{
    window.rpl = rpl;
    setRunway(window.settings.pista)
    window.settings.pistas.split(',').forEach((pista)=>{ $('#pistas').append(`<li><a href="javascript:void(0)" onclick="setRunway(${pista})"><h1>${pista}</h1></a></li>`) })
    ready()
  })
  ipcRenderer.on('ping',(e,res)=>{
    window.time = new Date(res.time)
    $('#hora').text(("0"+window.time.getHours()).substr(-2)+":"+("0"+window.time.getMinutes()).substr(-2)+":"+("0"+window.time.getSeconds()).substr(-2))
    if(res.lastChange>window.lastChange)res.changes.forEach((item)=>{
      if(item.maquina!=window.settings.maquina)
      switch (item.tipo) {
        case 'strip':
          setStripStatus(item.valor,item.acao,true)
          break;
      }
    })
    window.lastChange = res.lastChange
    if(typeof window.connected=='undefined'){ window.connected = true; window.Bridge.parseRPL(); $('#loading,#windowBackground').hide() }
    window.Bridge.freezed = res.freezed
    window.Bridge.locked = res.locked
    if(window.Bridge.locked) $('#blackout').show()
    else $('#blackout').hide()
    if(!window.Bridge.freezed)
      //Cronometro
      $('.strip').each((idx,el)=>{
        if($(el).data('cron')!='')$(el).data('cron',$(el).data('cron')-1).find('.cron').text(Math.floor($(el).data('cron')/60)+':'+$(el).data('cron')%60)
      })
    setTimeout(()=>{ window.Bridge.ping() },pingInterval)
  })
}
init()
window.addEventListener('DOMContentLoaded', () => {
  window.$ = window.jQuery = require('jquery')
  $(document).ready(()=>window.Bridge.settings())
  $(document).keydown(e=>bindKeys(e))
  /* Para usar resizable baixar https://github.com/RickStrahl/jquery-resizable
  $('#GND').resizable({
    handleSelector: ".separador.solo",
    resizeWidth: false
  });*/
})
ready = () => {
  $(window).on('contextmenu',e=>e.preventDefault())
  if(localStorage.getItem('modo'))setDesktop(localStorage.getItem('modo'),true)
  if(localStorage.getItem('conditions'))setConditions(localStorage.getItem('conditions'))
  if(localStorage.getItem('praticabilidade'))setConditions(localStorage.getItem('praticabilidade'))
  $('#praticabilidadeMotivo').val(localStorage.getItem('praticabilidadeMotivo'))
  $('.box').click(e=>{
    if(window.Bridge.freezed||window.Bridge.locked)return false;
    if(!$(e.target).parents('.strip').length&&!$(e.target).hasClass('strip')) {
      $('.strip,.box').removeClass('active')
      $(e.currentTarget).addClass('active').find('.strip:first').addClass('active')
    }
  })
  $('#btDesktop').click(e=>showWindow('wDesktop'))
  $('#btRunway').click(e=>showWindow('wRunway'))
  $('#btConditions').click(e=>showWindow('wConditions'))
  $('#btPraticabilidade').click(e=>showWindow('wPraticabilidade'))
  $('#btLogin').click(e=>showWindow('wLogin'))
  $('#btSair').click(e=>{if(confirm('Confirma sair do cliente?'))window.Bridge.logout()})
  $('#windowBackground,#loginCancel').click(e=>hideWindow())
  $('#loginOk').click(e=>{$('#btLogin h3').text($('#loginUser').val());hideWindow()})
  $('#cronOk').click(e=>{
    if($('#cronTempo').val().length)
      $('.strip.active:visible').data('cron',$('#cronTempo').val()*60)
    else
      $('.strip.active:visible').data("cron",'').find('.cron').text('')
    $('.window,#windowBackground').hide()
  })
  $('#wDesktop a').click(e=>setDesktop($(e.currentTarget).data('target')))
  recount()
  window.Bridge.ping()
}
recount = () => { ['CLR','nCONF','AUTH','GND','SEQ'].forEach(place=>$('#count-'+place).text($('#'+place+' .strip:visible').length+' strip'+($('#'+place+' .strip:visible').length!=1?'s':''))) }
/**
* Define o modo de uso
*/
setDesktop = (mode,direct) => {
  var labels = { T:'Torre',G:'Autorização + Solo',F:'Autorização + Solo + Torre' }
  var classes = { T:'TWR',G:'CLR-GND',F:'CLR-GND-TWR'}
  if((typeof direct!='undefined'&&direct)||confirm('Tem certeza que deseja trocar a área de trabalho para o modo '+labels[mode]+'?')) {
    $('body').attr('class',classes[mode])
    localStorage.setItem('modo',mode)
    $('#btDesktop h3').text(labels[mode])
  }
  hideWindow()
}
setRunway = (opt) => {
  pista = opt
  localStorage.setItem('pista',opt)
  $('.pista').text(pista)
  hideWindow()
}
setConditions = (opt) => {
  localStorage.setItem('conditions',opt)
  $('#conditions').text(opt)
  hideWindow()
}
setPraticabilidade = (mode) => {
  localStorage.setItem('praticabilidade',mode)
  localStorage.setItem('praticabilidadeMotivo',$('#praticabilidadeMotivo').val())
  $('#praticabilidade').text(mode)
  $('#btPraticabilidade').data('tooltip',$('#praticabilidadeMotivo').val())
  hideWindow()
}

showWindow = id => $('#'+id+',#windowBackground').show()
hideWindow = () => $('.window,#windowBackground').hide()

onChange = (obj,tipo) => {
  var input = '--'
  switch (tipo) {
    case 'SID':
      input = $('<select />')
      saidas.forEach((value)=>{ 
        var option = $('<option />')
        option.value = value
        option.append(value)
        if(value==$(obj).text())option.attr('selected',true)
        input.append(option)
      })
      input.on('change',onChangeBack)
      input.bind('focusout',onChangeBack)
      break;
    case 'TRNS':
      input = $('<select />')
      transicoes.forEach((value)=>{ 
        var option = $('<option />')
        option.value = value
        option.append(value)
        if(value==$(obj).text())option.attr('selected',true)
        input.append(option)
      })
      input.bind('change',onChangeBack)
      input.bind('focusout',onChangeBack)
      break;
    case 'RWY':
      input = $('<select />')
      pistas.forEach((value)=>{ 
        var option = $('<option />')
        option.value = value
        option.append(value)
        if(value==$(obj).text())option.attr('selected',true)
        input.append(option)
      })
      input.bind('change',onChangeBack)
      input.bind('focusout',onChangeBack)
      break;
    default:break;
  }
  $(obj).html(input)
}
onChangeBack = e => $(e.currentTarget).parent().html(e.currentTarget.value)
/**
 * setStripStatus
 * @param id (integer or null)
 * @param status (string or boolean or null)
 */
setStripStatus = (id,step,auto) => {
  var strip = id != null ? $('#'+id) : $('.strip.active')
  if(!strip.length) return
  else if(step=='+'){
    var status = progresso[strip.data('status')]
    switch (status) {
      case 'wCLR':strip.appendTo('#holder-CLR');break
      case 'dCLR':strip.appendTo('#holder-AUTH');break
      case 'wPUSH':strip.insertAfter('#park');break
      case 'wTAXI':strip.insertAfter('#solo');break
      case 'HOLD':strip.insertAfter('#torre');break
      case 'SEQ':strip.insertAfter('#nCONT');break
      case 'wARR':strip.insertAfter('#arr-twr');break
      case 'TAXI':strip.insertAfter('#arr-gnd');break
    }
  } else if(step=='-') {
    progresso = {
      'nCONF':'wCLR',
      'wCLR':'rCLR',
      'rCLR':'dCLR',
      'dCLR':'wPUSH',
      'wPUSH':'cPUSH',
      'cPUSH':'wTAXI',
      'wTAXI':'cTAXI',
      'cTAXI':'HOLD',
      'HOLD':'cRWY',
      'cRWY':'cDEP',
      'cDEP':'DEP',
      'DEP':'del',

      'nCONT':'SEQ',
      'SEQ':'wARR',
      'wARR':'cARR',
      'cARR':'ARR',
      'ARR':'TAXI',
      'TAXI':'wPOS',
      'wPOS':'cPOS',
      'cPOS':'BLKon',
      'BLKon':'del'
    }
    var status = Object.keys(progresso)[Object.values(progresso).indexOf(strip.data('status'))]
    switch (status) {
      case 'nCONF':strip.appendTo('#holder-nCONF');break
      case 'rCLR':strip.appendTo('#holder-CLR');break
      case 'dCLR':strip.appendTo('#holder-AUTH');break
      case 'cPUSH':strip.insertAfter('#park');break
      case 'cTAXI':strip.insertAfter('#solo');break
      case 'HOLD':strip.insertAfter('#torre');break
      case 'SEQ':strip.insertAfter('#nCONT');break
      case 'nCONT':strip.insertAfter('#seq');break
      case 'ARR':strip.insertAfter('#arr-twr');break
      case 'TAXI':strip.insertAfter('#arr-gnd');break
    }
  }
  strip.data('status',status).attr('class','strip active '+status).find('.stat').text(status)
  if(status=='del'){
    strip.addClass('deleted').parents('.box').find('.strip:first').addClass('active')
  } else if(status=='DEP'||status=='ARR'){
    var d = new Date()
    strip.data('time',("0"+d.getHours()).substr(-2)+("0"+d.getMinutes()).substr(-2))
    strip.find('.time').text(strip.data('time')).addClass('bold')
    window.Bridge.change('TIME',strip.data('time'),strip.data('id'))
  } else
    strip.find('.time').text(strip.data('eobt')).removeClass('bold')
  $('.box').removeClass('active')
  strip.parents('.box').addClass('active')
  if(typeof auto=='undefined')window.Bridge.change('strip',step,strip.data('id'))
  recount()
}
bindKeys = e => {
  if(window.Bridge.freezed||window.Bridge.locked)return false;
  switch(e.which) {
    case 13: // enter
      if($('.strip.active:not(.funcional)').length)
        setStripStatus(null,'+')
        break
    case 27: // esc
      if($('.strip.active:not(.funcional)').length&&$('.strip.active').data('status')!='nCONF'&&$('.strip.active').data('status')!='nCONT'&&confirm('Confirma desfazer evolução da strip?'))
        setStripStatus(null,'-')
        break
    case 46: // delete
      if($('.strip.active').length&&confirm('Tem certeza que deseja excluir a strip?'))
        window.Bridge.change('strip','del',$('.strip.active').addClass('deleted').data('id'))
        break
    case 37: // left
      switch ($('.box.active').removeClass('active').attr('id')) {
        case 'nCONF':$('#SEQ').addClass('active');break;
        case 'SEQ':$('#ARR').addClass('active');break;
        case 'ARR':$('#GND').addClass('active');break;
        case 'GND':$('#AUTH').addClass('active');break;
        case 'AUTH':$('#CLR').addClass('active');break;
        case 'CLR':$('#nCONF').addClass('active');break;
        default:$('#nCONF').addClass('active');break;
      }
      $('.strip').removeClass('active')
      $('.box.active .strip:first').addClass('active')
    break
    case 39: // right
      switch ($('.box.active').removeClass('active').attr('id')) {
        case 'nCONF':$('#CLR').addClass('active');break
        case 'CLR':$('#AUTH').addClass('active');break
        case 'AUTH':$('#GND').addClass('active');break
        case 'GND':$('#ARR').addClass('active');break
        case 'ARR':$('#SEQ').addClass('active');break
        case 'SEQ':$('#nCONF').addClass('active');break
        default:$('#nCONF').addClass('active');break
      }
      $('.strip').removeClass('active')
      $('.box.active .strip:first').addClass('active')
    break;
    case 38: // up
      if($('.strip.active').prev('.strip').length)
        $('.strip.active').removeClass('active').prev('.strip').addClass('active')
    break;
    case 40: // down
      if($('.strip.active').next('.strip').length)
        $('.strip.active').removeClass('active').next('.strip').addClass('active')
    break
    case 114: // F3
      //Abre a janela pra criar nova strip se for chegada ou saida
      if($('.box.active:visible').attr('id')=='SEQ')
        $('#newChegada').show()
      else if($('.box.active:visible').attr('id')=='nCONF')
        $('#newSaida').show()
      break
    case 118: // F7 - cronometro
      if($('.strip.active').length)$('#wCronometro,#windowBackground').show()
      break
    case 119: // F8 - strip funcional
      if(['GND','CLR','ARR'].indexOf($('.box.active').attr('id'))>-1)
        template.getStripUtil().bind('click',e=>{
          if(window.Bridge.freezed||window.Bridge.locked)return false;//Freeze
          $('.strip,.box').removeClass('active')
          $(e.currentTarget).addClass('active')
          $(e.currentTarget).parents('.box').addClass('active')
        }).prependTo('.box.active .strips').find('input')
        .focusout(e=>$(e.currentTarget).parent().text($(e.currentTarget).val().length>0?$(e.currentTarget).val():'_____'))
        .parent().contextmenu(e=>$(e.currentTarget).html($('<input />').val($(e.currentTarget).text()).focusout(e=>$(e.currentTarget).parent().text($(e.currentTarget).val().length>0?$(e.currentTarget).val():'_____')))).focus()

      break
    default: return
  }
  e.preventDefault()
}