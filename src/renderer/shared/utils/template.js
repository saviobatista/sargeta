module.exports.getStripIn = (obj) => {
        return $(`
<div id="${obj.id}" class="strip" data-status="${obj.status}" data-eobt="${obj.eobt}" data-id="${obj.id}" data-time="${obj.data}" data-cron="">
<div class="mini">
<div class="row">
  <div class="col-7"><h3>${obj.indicativo}</h3></div><div class="col-5"><p class="posicao">C12${obj.pos}</p></div>
</div>
<div class="row">
  <div class="col-7"><p>${obj.destino}</p></div><div class="col-5"><p class="eobt">${obj.eobt}</p></div>
</div>
<!--<div>
  <div class="link icon"></div>
  <div class="check icon"></div>
</div>-->
</div>
<div class="full">
<div class="col-3 center">
  <div><h2>${obj.indicativo}</h2></div>
  <div class="col-5 bold locale"><p>${obj.origem}</p></div>
  <div class="col-5 locale"><p>${obj.destino}</p></div>
</div>
<div class="col-2 divisor center">
    <div class="col-12"><p class="time">${obj.eobt}</p></div>
    <div class="col-7"><p>${obj.tipo}</p></div>
    <div class="col-3"><p>${obj.esteira}</p></div>
    <div class="col-3"><p>S</p></div>
    <div class="col-3"><p>I</p></div>
    <div class="col-3"><p>W</p></div>
</div>
<div class="col-2 divisor center">
    <div class="col-12 bold"><p>F${obj.nivel}</p></div>
    <div class="col-12"><p>${obj.squawk}</p></div>
    <div class="col-12"><p>${obj.speed}</p></div>
</div>
<div class="col-3 divisor">
  <div class="col-12"><p>&nbsp;</p></div>
  <div class="col-12">
    <div class="col-5">&nbsp;</div>
    <div class="col-3 divisor right middle"><h3>${obj.pos}</h3></div>
    <div class="col-3 divisor right middle"><h2 oncontextmenu="onChange(this,'RWY');return false">${pista}</h2></div>
  </div>
</div>
<div class="divisor status">
  <div class="col-12 bold"><p class="stat">${obj.status}</p><span class="cron"></span></div>
</div>
</div>
</div>
`).click(e=>{
  if(window.Bridge.freezed||window.Bridge.locked)return false;//Freeze
  $('.strip,.box').removeClass('active')
  $(e.currentTarget).addClass('active')
  $(e.currentTarget).parents('.box').addClass('active')
})
    }
    module.exports.getStripOut = (obj) => {
        return $(`
<div id="${obj.id}" class="strip" data-status="${obj.status}" data-eobt="${obj.eobt}" data-id="${obj.id}" data-time="${obj.data}" data-cron="">
<div class="mini">
<div class="row">
  <div class="col-7"><h3>${obj.indicativo}</h3></div><div class="col-5"><p class="posicao">C12${obj.pos}</p></div>
</div>
<div class="row">
  <div class="col-7"><p>${obj.destino}</p></div><div class="col-5"><p class="eobt">${obj.eobt}</p></div>
</div>
</div>
<!--<div>
  <div class="link icon"></div>
  <div class="check icon"></div>
</div>-->
<div class="full">
<div class="col-2 center">
  <div><h2>${obj.indicativo}</h2></div>
  <div class="col-5 locale"><p>${obj.origem}</p></div>
  <div class="col-6 locale bold"><p>${obj.destino}</p></div>
</div>
<div class="col-1 divisor center">
    <div><p class="time">${obj.eobt}</p></div>
    <div class="col-8"><p>${obj.tipo}</p></div>
    <div class="col-3"><p>${obj.esteira}</p></div>
    <div class="col-3"><p>S</p></div>
    <div class="col-3"><p>I</p></div>
    <div class="col-3"><p>W</p></div>
</div>
<div class="col-1 divisor center">
    <div class="bold"><p>F${obj.nivel}</p></div>
    <div class=""><p>${obj.squawk}</p></div>
    <div class=""><p>${obj.speed}</p></div>
</div>
<div class="col-6 divisor">
  <div class="col-12 rota"><p>${obj.rota}</p></div>
  <div class="col-12">
    <div class="col-7">
      <div class="col-12">
        <div class="col-2">${obj.fixo}</div>
        <div class="col-5 bold" oncontextmenu="onChange(this,'SID');return false">${obj.saida}</div>
        <div class="col-4" oncontextmenu="onChange(this,'TRNS');return false">${obj.trns}</div>
      </div>
      <div class="col-12">
        <div class="col-10">${obj.obs}</div>
        <div class="col-1 divisor center">${obj.atis}</div>
      </div>
    </div>
    <div class="col-2 divisor center middle"><h3>${obj.pos}</h3></div>
    <div class="col-2 divisor center middle"><h2 oncontextmenu="onChange(this,'RWY');return false">${pista}</h2></div>
  </div>
</div>
<div class="divisor status">
  <div class="col-8">
    <!--<div class="col-12">
      <div class="col-5 right highlight">0</div>
      <div class="col-5 right">0</div>
    </div>-->
    <div class="col-12 bold"><p class="stat">${obj.status}</p></div>
    <div class="col-12 small">OPR&nbsp;<span class="cron"></span></div>
  </div>
  <!--<div class="col-3"><div class="link icon"></div></div>-->
</div>
</div>
</div>
`).click(e=>{
  if(window.Bridge.freezed||window.Bridge.locked)return false;//Freeze
  $('.strip,.box').removeClass('active')
  $(e.currentTarget).addClass('active')
  $(e.currentTarget).parents('.box').addClass('active')
})
    }
    module.exports.getStripUtil = () => {
        return $(`
  <div class="strip funcional">
    <div class="col-2 icone">!</div>
    <div class="col-3"><h1><input type="text"></h1></div>
    <div class="col-7"><p><input type="text"></p></div>
  </div>
  `)
        
    }