const {app, BrowserWindow, ipcMain} = require('electron'),
path = require('path'),
fs = require('fs'),
converter = require(path.join(__dirname,'converter')),
Servidor = require(path.join(__dirname,'server.module'))
//require('electron-reload')(__dirname, { electron: require(`${__dirname}/node_modules/electron`) })
let settingsFile = 'config.json',
    dev = true,
    settings = {},
    server,
    clientWindow,
    serverWindow,
    settingsWindow
startup = () => {
  //SETTINGS
  ipcMain.on('settingsGet',e=>{ e.reply('settingsGet',settings) })
  ipcMain.on('settingsSet',(e,data)=>{settings.maquina = data.maquina; settings.mode = data.mode; settings.servidor = data.servidor;fs.writeFileSync(settingsFile,JSON.stringify(settings));if(data.mode=='SERVER')createServerWindow();else createClientWindow();settingsWindow.close() })
  //SERVER
  ipcMain.on('start',(e,newconfig)=>{ server.start(newconfig);e.reply('status',server.getStatus()) })
  ipcMain.on('status',e=>{ e.reply('status',server.getStatus()) })
  ipcMain.on('stop',e=>{ server.stop();e.reply('status',server.getStatus()) })
  ipcMain.on('play',e=>{ server.play();e.reply('status',server.getStatus()) })
  ipcMain.on('pause',e=>{ server.pause();e.reply('status',server.getStatus()) })
  ipcMain.on('derrubar',e=>{ server.derrubar();e.reply('status',server.getStatus()) })
  ipcMain.on('levantar',e=>{ server.levantar();e.reply('status',server.getStatus()) })
  ipcMain.on('travar',e=>{ server.travar();e.reply('status',server.getStatus()) })
  ipcMain.on('destravar',e=>{ server.destravar();e.reply('status',server.getStatus()) })
  ipcMain.on('clock',e=>e.reply('clock',server.getTime()))
  ipcMain.on('getConfig',e=>e.reply('getConfig',server.getConfig()))
  ipcMain.on('getLog',(e,last)=>e.reply('setLog',server.getLogID(),server.getLog(last)))
  ipcMain.on('converter',converter.gerarXLSX)
  //CLIENT
  //ipcMain.on('reload',(e)=>{ mainWindow.loadFile(path.join(__dirname, 'index.html')) })
  ipcMain.on('login',e=>require('http').get('http://'+settings.servidor+'/login/'+settings.maquina,res=>{var d='';res.on('data',chunk=>d+=chunk);res.on('end',()=>e.reply('login',JSON.parse(d)))})).on('error',e=>console.error(`Got error: ${e.message}`))
  ipcMain.on('logout',()=>{if(clientWindow!=null)clientWindow.close();if(serverWindow!=null)serverWindow.close();createSettingsWindow() })
  ipcMain.on('change',(e,tipo,acao,valor)=>require('http').get('http://'+settings.servidor+'/change/'+settings.maquina+'/'+tipo+'/'+acao+'/'+valor))
  ipcMain.on('ping',(e,lastChange)=>require('http').get('http://'+settings.servidor+'/ping/'+settings.maquina+'/'+lastChange,res=>{var d='';res.on('data',chunk=>d+=chunk);res.on('end',()=>e.reply('ping',JSON.parse(d)))})).on('error',e=>console.error(`Got error: ${e.message}`))
  /* //COMPLETE
      require('http').get('http://'+settings.servidor+'/login/'+settings.maquina,res=>{
          const { statusCode } = res;
          const contentType = res.headers['content-type'];
          let error;
          if (statusCode !== 200)
              error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
          else if (!/^application\/json/.test(contentType))
              error = new Error('Invalid content-type.\n' +`Expected application/json but received ${contentType}`);
          if (error) { console.error(error.message); res.resume(); return }

          res.setEncoding('utf8');
          let rawData = '';
          res.on('data', (chunk) => { rawData += chunk; });
          res.on('end', () => {
              try {
              const parsedData = JSON.parse(rawData);
              console.log(parsedData);
              e.reply('login',parsedData)
              } catch (err) {
              console.error(err.message);
              }
          })
      }).on('error',e=>console.error(`Got error: ${e.message}`)))
      */

  //WINDOW
  if(fs.existsSync(path.resolve(settingsFile)))
      settings = JSON.parse(fs.readFileSync(path.resolve(settingsFile)))
  if(dev||typeof settings.mode=='undefined')//Não instalado
    createSettingsWindow()
  else if(settings.mode=='CLIENT')
    createClientWindow()
  else if(settings.mode=='SERVER')
    createServerWindow()
  else
    createSettingsWindow()
}
createSettingsWindow = () => {
  settingsWindow = new BrowserWindow({ width: 250, height: 280, resizable:false, maximizable:false, menuBarVisibility:false, autoHideMenuBar: true, webPreferences: { preload: path.resolve(__dirname,'settings.js') } })
  settingsWindow.loadFile(path.resolve(__dirname,'settings.html'))
  settingsWindow.on('closed', () => { settingsWindow = null })
}
createServerWindow = () => {
  server = new Servidor()
  serverWindow = new BrowserWindow({ width: 800, height: 640, resizable:false, maximizable:false, menuBarVisibility:false, autoHideMenuBar: true, webPreferences: { preload: path.resolve(__dirname,'server.js') } })
  serverWindow.loadFile(path.resolve(__dirname,'server.html'))
  serverWindow.on('closed',()=>{serverWindow=null})
  //serverWindow.webContents.openDevTools()
}

createClientWindow = () => {
  clientWindow = new BrowserWindow({ fullscreen:false, menuBarVisibility:false, autoHideMenuBar: true, webPreferences: { preload: path.resolve(__dirname,'client.js') } })
  //clientWindow.setFullScreen(true)
  clientWindow.loadFile(path.resolve(__dirname,'client.html'))
  clientWindow.on('closed',()=>{ clientWindow=null })
  clientWindow.webContents.openDevTools()
}

app.on('ready', startup)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
app.on('activate', () => { if(settingsWindow===null) startup() })