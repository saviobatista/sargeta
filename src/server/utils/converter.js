const {app, BrowserWindow, ipcMain, dialog } = require('electron'),
{spawn} = require('child_process'),
xl = require('excel4node'),
path = require('path'),
fs = require('fs')
exports.gerarXLSX = (e) => {
    try{
        let pln = new RegExp("   [0-9]{6} [A-Z0-9 ]{6} [0-9]{7} ([A-Z0-9]{7}) ([A-Z0-9]{4})\/([A-Z]) ([A-Z]{4})([0-9]{4}) ([A-Z0-9]{5}) ([A-Z0-9]{3}) ([A-Z0-9 \/]+)[ ]{1,}([A-Z]{4})([0-9]{4}) ")
        let xtr = new RegExp("[ ]{59}([A-Z0-9\/]+[0-9A-Z \/]*) {10}[A-Z]{3}\/")
        let src = dialog.showOpenDialogSync(null,{title:'Abrir arquivo do CGNA',properties:['openFile']})
        let data = fs.readFileSync(src[0], 'UTF-8')
        var wb = new xl.Workbook();
        let lD = 12, lA = 12,
            DEP = wb.addWorksheet('DEP',{pageSetup:{paperSize:'A4_PAPER',orientation:'landscape'}}),
            ARR = wb.addWorksheet('ARR',{pageSetup:{paperSize:'A4_PAPER',orientation:'portrait'}}),
            modo = null,
            rota = null
        let style = {
            pretitulo: wb.createStyle({font:{size:10}}),
            titulo: wb.createStyle({font:{size:16,bold:true},alignment:{horizontal:'center'}}),
            barraazul: wb.createStyle({fill:{type:'pattern',patternType:'solid',fgColor:'002060'}}),
            bordagrossa: wb.createStyle({border:{left:{style:'thick'},right:{style:'thick'},top:{style:'thick'},bottom:{style:'thick'}}}),
            subtitulo: wb.createStyle({font:{size:13,bold:true}}),
            tempos: wb.createStyle({numberFormat:'hh:mm',font:{size:8,bold:true},alignment:{horizontal:'center',vertical:'center'}}),
            table: wb.createStyle({border:{left:{style:'thin'},right:{style:'thin'},top:{style:'thin'},bottom:{style:'thin'}}}),
            tableOperDEP: wb.createStyle({fill:{type:'pattern',patternType:'solid',fgColor:'FCE4D6'},alignment:{horizontal:'center',vertical:'center'},border:{left:{style:'thin'},right:{style:'thin'},top:{style:'thin'},bottom:{style:'thin'}}}),
            tableOperARR: wb.createStyle({fill:{type:'pattern',patternType:'solid',fgColor:'D9E1F2'},alignment:{horizontal:'center',vertical:'center'},border:{left:{style:'thin'},right:{style:'thin'},top:{style:'thin'},bottom:{style:'thin'}}}),
            tituloDEP: wb.createStyle({font:{size:9,bold:true},fill:{type:'pattern',patternType:'solid',fgColor:'F8CBAD'},alignment:{horizontal:'center',vertical:'center'},border:{left:{style:'thin'},right:{style:'thin'},top:{style:'thin'},bottom:{style:'thin'}}}),
            tituloARR: wb.createStyle({alignment:{wrapText:true},font:{size:9,bold:true},fill:{type:'pattern',patternType:'solid',fgColor:'D9E1F2'},alignment:{horizontal:'center',vertical:'center'},border:{left:{style:'thin'},right:{style:'thin'},top:{style:'thin'},bottom:{style:'thin'}}}),
            dados: wb.createStyle({font:{size:11},alignment:{horizontal:'center',vertical:'center'},border:{left:{style:'thin'},right:{style:'thin'},top:{style:'thin'},bottom:{style:'thin'}}}),
            dadosHora: wb.createStyle({numberFormat:'hh:mm',font:{size:11},alignment:{horizontal:'center',vertical:'center'},border:{left:{style:'thin'},right:{style:'thin'},top:{style:'thin'},bottom:{style:'thin'}}})
        }
        //HEADERS
        DEP.addImage({ path: path.join(__dirname, 'assets','logohorizontal2d.png'), type: 'picture', position: { type: 'absoluteAnchor', x: '0.2cm', y: '0.2cm' } })
        ARR.addImage({ path: path.join(__dirname, 'assets','logohorizontal2d.png'), type: 'picture', position: { type: 'absoluteAnchor', x: '0.2cm', y: '0.2cm' } })
        DEP.cell(1,4).string('EPTA VIRACOPOS/CAMPINAS - TAKP').style(style.pretitulo)
        ARR.cell(1,4).string('EPTA VIRACOPOS/CAMPINAS - TAKP').style(style.pretitulo)
        DEP.cell(2,4).string('COORDENAÇÃO DE AVALIAÇÃO OPERACIONAL DA TAKP - TAKP-4').style(style.pretitulo)
        ARR.cell(2,4).string('COORDENAÇÃO DE AVALIAÇÃO OPERACIONAL DA TAKP - TAKP-4').style(style.pretitulo)
        DEP.cell(4,1).string('Exercício:').style(style.subtitulo)
        ARR.cell(4,1).string('Exercício:').style(style.subtitulo)
        DEP.cell(5,1).string('Situação simulada:').style(style.subtitulo)
        ARR.cell(5,1).string('Situação simulada:').style(style.subtitulo)
        DEP.cell(8,1,8,14,true).string('PLANEJAMENTO DO EXERCÍCIO - DEP').style(style.titulo)
        ARR.cell(8,1,8,12,true).string('PLANEJAMENTO DO EXERCÍCIO - ARR').style(style.titulo)
        DEP.cell(9,1,9,14).style(style.barraazul)
        ARR.cell(9,1,9,12).style(style.barraazul)
        DEP.cell(4,1).style({border:{left:{style:'thick'},top:{style:'thick'}}})
        DEP.cell(5,1).style({border:{left:{style:'thick'}}})
        DEP.cell(6,1).style({border:{left:{style:'thick'},bottom:{style:'thick'}}})
        DEP.cell(4,14).style({border:{right:{style:'thick'},top:{style:'thick'}}})
        DEP.cell(5,14).style({border:{right:{style:'thick'}}})
        DEP.cell(6,14).style({border:{right:{style:'thick'},bottom:{style:'thick'}}})
        DEP.cell(4,2,4,13).style({border:{top:{style:'thick'}}})
        DEP.cell(6,2,6,13).style({border:{bottom:{style:'thick'}}})
        
        ARR.cell(4,1).style({border:{left:{style:'thick'},top:{style:'thick'}}})
        ARR.cell(5,1).style({border:{left:{style:'thick'}}})
        ARR.cell(6,1).style({border:{left:{style:'thick'},bottom:{style:'thick'}}})
        ARR.cell(4,12).style({border:{right:{style:'thick'},top:{style:'thick'}}})
        ARR.cell(5,12).style({border:{right:{style:'thick'}}})
        ARR.cell(6,12).style({border:{right:{style:'thick'},bottom:{style:'thick'}}})
        ARR.cell(4,2,4,11).style({border:{top:{style:'thick'}}})
        ARR.cell(6,2,6,11).style({border:{bottom:{style:'thick'}}})

        DEP.cell(10,10).string('00:02').style(style.tempos)
        DEP.cell(10,11).string('00:03').style(style.tempos)
        DEP.cell(10,12).string('00:03').style(style.tempos)
        DEP.row(7).setHeight(6)
        DEP.row(10).setHeight(10)
        DEP.row(11).setHeight(24)
        ARR.row(7).setHeight(6)
        ARR.row(10).setHeight(10)
        ARR.row(11).setHeight(24)
        DEP.cell(11,1).string('Nº').style(style.tituloDEP)
        DEP.cell(11,2).string('Operação').style(style.tituloDEP)
        DEP.cell(11,3).string('Identificação').style(style.tituloDEP)
        DEP.cell(11,4).string('Tipo').style(style.tituloDEP)
        DEP.cell(11,5).string('DESTINO').style(style.tituloDEP)
        DEP.cell(11,6).string('Transponder').style(style.tituloDEP)
        DEP.cell(11,7).string(' ').style(style.tituloDEP)
        DEP.cell(11,8).string('DIF').style(style.tituloDEP)
        DEP.cell(11,9).string('ATIVAÇÃO').style(style.tituloDEP)
        DEP.cell(11,10).string('CLR').style(style.tituloDEP)
        DEP.cell(11,11).string('PUSH').style(style.tituloDEP)
        DEP.cell(11,12).string('TAXI').style(style.tituloDEP)
        DEP.cell(11,13).string('Pos').style(style.tituloDEP)
        DEP.cell(11,14).string('RWY').style(style.tituloDEP)
        ARR.cell(11,1).string('Nº').style(style.tituloARR)
        ARR.cell(11,2).string('Operação').style(style.tituloARR)
        ARR.cell(11,3).string('Identificação').style(style.tituloARR)
        ARR.cell(11,4).string('Tipo').style(style.tituloARR)
        ARR.cell(11,5).string('Proced').style(style.tituloARR)
        ARR.cell(11,6).string('Sqwak').style(style.tituloARR)
        ARR.cell(11,7).string('FIXO').style(style.tituloARR)
        ARR.cell(11,8).string('ENTRADA').style(style.tituloARR)
        ARR.cell(11,9).string('EM VOO').style(style.tituloARR)
        ARR.cell(11,10).string('ETA').style(style.tituloARR)
        ARR.cell(11,11).string('Pos').style(style.tituloARR)
        ARR.cell(11,12).string('RWY').style(style.tituloARR)
        //TABELA
        DEP.column(1).setWidth(5)
        DEP.column(2).setWidth(7)
        DEP.column(3).setWidth(9)
        DEP.column(4).setWidth(7)
        DEP.column(5).setWidth(7)
        DEP.column(6).setWidth(7)
        DEP.column(7).setWidth(22)
        DEP.column(8).setWidth(8)
        DEP.column(9).setWidth(8)
        DEP.column(10).setWidth(8)
        DEP.column(11).setWidth(8)
        DEP.column(12).setWidth(8)
        DEP.column(13).setWidth(5)
        DEP.column(14).setWidth(8)
        DEP.column(16).setWidth(0)
        DEP.column(17).setWidth(0)
        DEP.column(18).setWidth(0)
        ARR.column(1).setWidth(5)
        ARR.column(2).setWidth(7)
        ARR.column(3).setWidth(9)
        ARR.column(4).setWidth(8)
        ARR.column(5).setWidth(6)
        ARR.column(6).setWidth(6)
        ARR.column(7).setWidth(7)
        ARR.column(8).setWidth(7)
        ARR.column(9).setWidth(7)
        ARR.column(10).setWidth(7)
        ARR.column(11).setWidth(5)
        ARR.column(12).setWidth(4)
        ARR.column(15).setWidth(0)
        ARR.column(16).setWidth(0)
        ARR.column(17).setWidth(0)
        ARR.column(18).setWidth(0)
        //DATA
        data.split(/\r?\n/).forEach(line => {
            if(match = line.match(pln)) {
            rota = match[8].trim().replace(/ DCT$/g,'')
            if(match[4]=='SBKP') {
                modo = 'DEP'
                DEP.cell(lD,1).number(lD-11).style(style.dados)//Nº
                DEP.cell(lD,2).string('DEP').style(style.tableOperDEP)//Operação
                DEP.cell(lD,3).string(match[1]).style(style.dados)//Identificação
                DEP.cell(lD,4).string(match[2]+'/'+match[3]).style(style.dados)//Tipo
                DEP.cell(lD,5).string(match[9]).style(style.dados)//DESTINO
                DEP.cell(lD,6).number(parseInt((Math.round(Math.random())+3).toString()+(Math.round(Math.random()*7)).toString()+(Math.round(Math.random()*7)).toString()+(Math.round(Math.random()*7)).toString())).style(style.dados)//Transponder
                DEP.cell(lD,7).string(' ').style(style.dados)//espaço para copia
                DEP.cell(lD,8).formula('IF(I'+(lD-1)+'<>"ATIVAÇÃO",I'+lD+'-'+'I'+(lD-1)+',"")').style(style.dadosHora)//DIF
                DEP.cell(lD,9).string(match[5].substr(0,2)+':'+match[5].substr(2,2)).style(style.dadosHora)//Ativação
                DEP.cell(lD,10).formula('J10+'+'I'+lD).style(style.dadosHora)//CLR
                DEP.cell(lD,11).formula('K10+'+'J'+lD).style(style.dadosHora)//PUSH
                DEP.cell(lD,12).formula('L10+'+'K'+lD).style(style.dadosHora)//TAXI
                DEP.cell(lD,13).string(' ').style(style.dados)//Estacionamento
                DEP.cell(lD,14).number(18).style(style.dados)//RWY

                DEP.cell(lD,16).string(match[6])//Velocidade
                DEP.cell(lD,17).string(match[7])//Nivel
                DEP.cell(lD,18).string(rota)//Rota

                DEP.row(lD).setHeight(18)

                lD++
            } else {
                modo = 'ARR'
                ARR.cell(lA,1).number(lA-11).style(style.dados)//Nº
                ARR.cell(lA,2).string('ARR').style(style.tableOperARR)//Operação
                ARR.cell(lA,3).string(match[1]).style(style.dados)//Identificação
                ARR.cell(lA,4).string(match[2]+'/'+match[3]).style(style.dados)//Tipo
                ARR.cell(lA,5).string(match[4]).style(style.dados)//PROCEDENCIA
                ARR.cell(lA,6).number(parseInt((Math.round(Math.random())+3).toString()+(Math.round(Math.random()*7)).toString()+(Math.round(Math.random()*7)).toString()+(Math.round(Math.random()*7)).toString())).style(style.dados)//Transponder
                ARR.cell(lA,7).formula('LOOKUP(O'+lA+',[MAPEAMENTO.xlsx]FIXOS!A:A,[MAPEAMENTO.xlsx]FIXOS!B:B)').style(style.dados)//FIXO Entrada
                ARR.cell(lA,8).formula('J'+lA+'-I'+lA).style(style.dadosHora)//HORA ENTRADA FIXO
                ARR.cell(lA,9).formula('VLOOKUP(CONCATENATE(L'+lA+'," - ",G'+lA+'),[MAPEAMENTO.xlsx]DESEMPENHO!C:H,MATCH(D'+lA+',[MAPEAMENTO.xlsx]DESEMPENHO!C1:H1))').style(style.dadosHora)//Tempo Voo até ARR
                ARR.cell(lA,10).string(match[10].substr(0,2)+':'+match[10].substr(2,2)).style(style.dadosHora)//Hora ARR Simulador
                ARR.cell(lA,11).string(' ').style(style.dados)//Estacionamento
                ARR.cell(lA,12).number(18).style(style.dados)//RWY

                ARR.cell(lA,15).string(rota.substr(rota.lastIndexOf(' '))).style(style.dados)//Fixo de star
                ARR.cell(lA,16).string(match[6]).style(style.dados)//Velocidade
                ARR.cell(lA,17).string(match[7]).style(style.dados)//Nivel
                ARR.cell(lA,18).string(rota).style(style.dados)//Rota

                ARR.row(lA).setHeight(18)

                lA++
            }
            } else if(match = line.match(xtr)) {
            rota += match[1].trim().replace(/ DCT$/g,'')
            if(modo=='DEP')
                DEP.cell(lD-1,18).string(rota)
            else if(modo=='ARR') {
                ARR.cell(lA-1,15).string(rota.substr(rota.lastIndexOf(' ')))
                ARR.cell(lA-1,18).string(rota)
            }
            }
        })
        //FINISH STYLE
        DEP.setPrintArea(1,1,lD-1,14)
        ARR.setPrintArea(1,1,lD-1,12)
        //CLOSING
        let dst = dialog.showSaveDialogSync({title:'Salvar XLS como...',filters:[{name:'XLSX Excel',extensions:['xlsx']}]})
        wb.write(dst,e=>{
            var child = spawn("cmd.exe", ["/c", "start", dst], {env: process.env});child.unref();
            app.quit()
        })
        } catch(err) {
        console.log(err)
        //e.reply('error',err)
        }
}

/*  try{
    
    let date = new Date()
    let pln = new RegExp("   ([0-9]{6}) [A-Z0-9 ]{6} [0-9]{7} ([A-Z0-9]{7}) ([A-Z0-9]{4})\/([A-Z]) ([A-Z]{4})([0-9]{4}) ([A-Z0-9]{5}) ([A-Z0-9]{3}) ([A-Z0-9 \/]+)[ ]{1,}([A-Z]{4})([0-9]{4}) ")
    let xtr = new RegExp("[ ]{59}([A-Z0-9\/]+[0-9A-Z \/]*) {10}[A-Z]{3}\/")
    let src = dialog.showOpenDialogSync(serverWindow,{title:'Abrir arquivo do CGNA',properties:['openFile']})
    let data = fs.readFileSync(src[0], 'UTF-8')
    let planos = { DEP:[], ARR:[] }
    let plano
    data.split(/\r?\n/).forEach((line,idx) => {
      if(match = line.match(pln)) {
        if(typeof plano!= 'undefined'){
          if(plano.origem=='SBKP'){
            plano.numero = planos.DEP.length+1
            planos.DEP.push(plano)
          } else {
            plano.rota = plano.rota.replace(new RegExp(' DCT$'),'')
            plano.numero = planos.ARR.length+1
            planos.ARR.push(plano)
          }
        }
        //console.log('PLN',idx,line.match(pln))
        plano = {
          operacao:match[5]=='SBKP'?'DEP':'ARR',
          indicativo:match[2],
          origem:match[5],
          destino:match[10],
          //eobt:match[5]=='SBKP'?match[6]:match[11],
          eobt:match[5]=='SBKP'?match[6].substr(0,2)+':'+match[6].substr(2,2)+':00':match[11].substr(0,2)+':'+match[11].substr(2,2)+':00',
          //tipo:match[3],
          //esteira:match[4],
          tipo:match[3]+'/'+match[4],
          nivel:match[8],
          speed:match[7],
          rota:match[9].trim(),
          rwy:typeof settings.pista == 'undefined' ? '15' : settings.pista,
          //ativa:match[5]=='SBKP'?match[6].substr(0,2)+':'+match[6].substr(2,2)+':00':match[11]+':00'
          //ativa:new Date(date.getFullYear(),date.getMonth(),date.getDate(),'SBKP'?match[6].substr(0,2):match[11].substr(0,2),'SBKP'?match[6].substr(-2):match[11].substr(-2),0,0)
          //ativa:new Date(0,0,0,0,'SBKP'?match[6].substr(0,2):match[11].substr(0,2),'SBKP'?match[6].substr(-2):match[11].substr(-2),0,0)
        }
      } else if(match = line.match(xtr)) {
        plano.rota += " "+match[1].trim()
      }
    })
    let dst = dialog.showSaveDialogSync({title:'Salvar XLS como...',filters:[{name:'XLSX Excel',extensions:['xlsx']}]})
    workbook = new Excel.Workbook()
    var logo = workbook.addImage({filename:path.join(__dirname, 'assets','logohorizontal2d.png'),extension:'png'})
    var modes = ['DEP','ARR']
    modes.forEach(modo=>{
      worksheet = workbook.addWorksheet(modo,{pageSetup:{paperSize: 9, orientation:'landscape',printTitlesRow: '11:11', error:'blank'}})
      if(modo=='DEP') {
        worksheet.columns = [
          { header: 'Nº', key: 'numero', width: 5, font: { bold: true, size:8 }, alignment: { vertical:'middle', horizontal:'center' } },
          { header: 'Operação', key: 'operacao', width: 7},
          { header: 'Identificação', key: 'indicativo', width: 11},
          { header: 'Tipo', key: 'tipo', width: 9},
          { header: 'Origem', key: 'origem', width: 0},
          { header: 'Destino', key: 'destino', width: 7},
          { header: 'EOBT', key: 'eobt', width: 0},
          { header: 'Rota', key: 'rota', width: 0},
          { header: '', key: '', width: 45},
          { header: 'Nivel', key: 'nivel', width: 0},
          { header: 'Vel', key: 'speed', width: 0},
          { header: 'DIF', key: 'dif', width: 7, numFmt:'hh:mm'},
          { header: 'ATIVA', key: 'ativa', width: 7, numFmt:'hh:mm'},
          { header: 'CLR', key: 'clr', width: 7, numFmt:'hh:mm'},
          { header: 'PUSH', key: 'push', width: 7, numFmt:'hh:mm'},
          { header: 'TAXI', key: 'taxi', width: 7, numFmt:'hh:mm'},
          { header: 'Posição', key: '', width: 6},
          { header: 'RWY', key: 'rwy', width: 5},
        ]
        for(var i=65;i<83;i++){
          cell = String.fromCharCode(i)+'1'
          worksheet.getCell(cell).font = { bold: true, size:8 }
          worksheet.getCell(cell).fill = { type: 'pattern',pattern:'solid', fgColor:{argb:'FFF8CBAD'} }
          worksheet.getCell(cell).alignment = { vertical:'middle', horizontal:'center' }
        }
      } else {
        worksheet.columns = [
          { header: 'Nº', key: 'numero', width: 6},
          { header: 'Operação', key: 'operacao', width: 10},
          { header: 'Identificação', key: 'indicativo', width: 10},
          { header: 'Tipo', key: 'tipo', width: 8},
          { header: 'Origem', key: 'origem', width: 10},
          { header: 'FIXO STAR', key: 'star', width: 12},
          { header: 'FIXO Entrada', key: 'fixo', width: 12},
          { header: 'HORA Entrada', key: 'hora', width: 12},
          { header: 'Tempo Voo til ARR', key: 'voo', width: 12},
          { header: 'ETA', key: 'eobt', width: 10},
          { header: 'Posição', key: '', width: 6},
          { header: 'RWY', key: 'rwy', width: 5},
          { header: 'Destino', key: 'destino', width: 0},
          { header: 'Rota', key: 'rota', width: 0},
          { header: 'Nivel', key: 'nivel', width: 0},
          { header: 'Vel', key: 'speed', width: 0},
        ]
        for(var i=65;i<79;i++){
          cell = String.fromCharCode(i)+'1'
          worksheet.getCell(cell).font = { bold: true, size:8 }
          worksheet.getCell(cell).fill = { type: 'pattern',pattern:'solid', fgColor:{argb:'FFD9E1F2'} }
          worksheet.getCell(cell).alignment = { vertical:'middle', horizontal:'center' }
        }
      }
      
      worksheet.getColumn(1).alignment = { vertical:'middle', horizontal:'center' }
      worksheet.getColumn(2).alignment = { vertical:'middle', horizontal:'center' }
      var counter = 0;
      planos[modo].sort((a,b)=>{
        if(parseInt(a.eobt)>parseInt(b.eobt))return 1
        else if(parseInt(a.eobt)<parseInt(b.eobt))return -1
        else return 0
      }).forEach(plano=>{
        plano.hora = { formula:'J'+(12+counter)+'-I'+(11+counter), result:'00:00' }
        plano.dif = { formula:'M'+(12+counter)+'-M'+(11+counter), result:'00:00' }
        plano.ativa = { formula:'G'+(12+counter)+'+0', result:'00:00:00' }
        plano.clr = { formula:'M'+(12+counter)+'+N10', result:'00:00:00' }
        plano.push = { formula:'N'+(12+counter)+'+O10', result:'00:00:00' }
        plano.taxi = { formula:'O'+(12+counter)+'+P10', result:'00:00:00' }
        plano.fixo = { formula:'LOOKUP(F'+(12+counter)+';[MAPEAMENTO.xlsx]FIXOS!$A:$A;[MAPEAMENTO.xlsx]FIXOS!$B:$B)' }
        //plano.voo = { formula:'PROCV(CONCATENAR(L'+(12+counter)+';" - ";G'+(12+counter)+');[MAPEAMENTO.xlsx]DESEMPENHO!$C:$H;3)', result:'00:00:00' }
        //plano.voo = { formula:'PROCV(CONCATENATE(L'+(12+counter)+';" - ";G'+(12+counter)+');[MAPEAMENTO.xlsx]DESEMPENHO!$C:$H;3)', result:'00:00:00' }
        plano.numero = counter+1
        plano.star = plano.rota.substr(-1*(plano.rota.length-plano.rota.lastIndexOf(' '))).trim()
        var existe = false
        worksheet.eachRow(row=>{ if(row.values[3]==plano.indicativo) existe = true })
        if(!existe){
          counter++;
          worksheet.addRow(plano)

        }
      })
      worksheet.getColumn(2).eachCell((cell,rowNumber)=>{
        if(rowNumber>1) cell.fill = { type: 'pattern',pattern:'solid', fgColor:{argb:modo=='ARR'?'FFD9E1F2':'FFFCE4D6'} }
      })
      worksheet.eachRow(row=>{
        row.alignment = { vertical:'middle', horizontal:'center' }
        row.eachCell({ includeEmpty: true },cell=>cell.border={top:{style:'thin'},left:{style:'thin'},bottom:{style:'thin'},right:{style:'thin'}})
        row.getCell(12).numFmt = 'hh:mm'
        row.getCell(13).numFmt = 'hh:mm'
        row.getCell(14).numFmt = 'hh:mm'
        row.getCell(15).numFmt = 'hh:mm'
        row.getCell(16).numFmt = 'hh:mm'

      })
      for(var i=0;i<10;i++)worksheet.spliceRows(1,0,[])
      if(modo=='DEP') {
        worksheet.getRow(10).font = { size:8, bold:true }
        worksheet.getRow(10).alignment = { vertical:'middle', horizontal:'center' }
        worksheet.getCell('N10').value = "00:02:00"
        worksheet.getCell('O10').value = "00:03:00"
        worksheet.getCell('P10').value = "00:03:00"
        worksheet.getCell('N10').numFmt = 'mm:ss'
        worksheet.getCell('O10').numFmt = 'mm:ss'
        worksheet.getCell('P10').numFmt = 'mm:ss'
        worksheet.getCell('N10').type = Excel.ValueType.Time
        worksheet.mergeCells('A8:R8')
        worksheet.mergeCells('A9:R9')
      } else {
        worksheet.mergeCells('A8:K8')
        worksheet.mergeCells('A9:K9')
      }

      worksheet.getRow(11).height = 24

      worksheet.addImage(logo,{tl:{col:0.5,row:0.5},ext:{width:120,height:21}})
      worksheet.getCell('D1').value = 'EPTA VIRACOPOS/CAMPINAS - TAKP'
      worksheet.getCell('D2').value = 'COORDENAÇÃO DE AVALIAÇÃO OPERACIONAL DA TAKP - TAKP-4'
      worksheet.getCell('A4').value = 'Exercício:'
      worksheet.getCell('A5').value = 'Situação simulada:'
      worksheet.getCell('A8').value = 'PLANEJAMENTO DO EXERCÍCIO - ___ - '+modo
      worksheet.getCell('A9').fill = { type: 'pattern',pattern:'solid', fgColor:{argb:'FF002060'}}

      worksheet.getCell('D1').font = { size: 10 }
      worksheet.getCell('D2').font = { size: 10 }
      worksheet.getCell('A4').font = { size: 13, bold:true }
      worksheet.getCell('A5').font = { size: 13, bold:true }
      worksheet.getCell('A8').font = { size: 15, bold:true }
      worksheet.getCell('A4').alignment = { horizontal:'left' }
      worksheet.getCell('A5').alignment = { horizontal:'left' }
      worksheet.getCell('A8').alignment = { horizontal:'center' }
    })
    worksheet = workbook.addWorksheet('STAR')

    workbook.xlsx.writeFile(dst).then(()=>{
      console.log('gravou arquivo '+dst)
      var child = spawn("cmd.exe", ["/c", "start", dst], {env: process.env});child.unref();
    })
    //.catch(err=>console.log("Ops... aconteceu um problema...",err)
  } catch(err) {
    console.log(err)
    //e.reply('error',err)
  }*/