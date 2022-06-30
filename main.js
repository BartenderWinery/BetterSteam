const{app,BrowserWindow,ipcMain}=require("electron")
const path=require("path")
const fs=require("fs")
//require("electron-reload")(__dirname)
require("electron-reload")(__dirname, {
    electron:require(`${__dirname}/node_modules/electron`)})

function popout(bounds,page){
    var win=new BrowserWindow({
        width:bounds[0],
        height:bounds[1],
        frame:false,
        show:false,
        backgroundColor:"#383838",
        webPreferences:{
            nodeIntegration:false,
            contextIsolation:true,
            enableRemoteModule:false,
            preload:path.join(__dirname,"preload.js")}})
        win.loadFile(path.join(__dirname,page))
        setTimeout(function(){win.show()}),500}
async function main(){popout([580,300],"index.html")}
app.on("ready",main)
var rcon={
    verify:function(path,keyword){fs.access(path,fs.constants.R_OK|fs.constants.W_OK,(err,data)=>{if(data.includes(keyword)){return true}})},
    inject:function(path,k,d){
        try{
            fs.readFile(path,'utf8',(err,data)=>{
                if(err)return
                //Change comments to start/end comments per line to reserve comments instead of removing them
                var pack=data.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'').replace(/[\r\n]+/g,"")
                fs.writeFile(path,pack.replace(k,d),(err)=>{
                    if(err)return})})
            return true
        }catch(e){}},
    overwrite:function(path,d){
        try{
            fs.writeFile(path,d,(err)=>{
                if(err)return}) 
            return true
        }catch(e){}}}
ipcMain.on("minimize",()=>{BrowserWindow.getFocusedWindow().minimize()})
ipcMain.on("maximize",()=>{BrowserWindow.getFocusedWindow().maximize()})
ipcMain.on("close",()=>{BrowserWindow.getFocusedWindow().close()})
ipcMain.on("popout",(events,args)=>{popout([400,220],args)})

    //create callback function to update the other if one is executed, such as uninstaller decolorizing APIs dyanmically if install is open
ipcMain.on("modify",(events,args)=>{
    switch(args[0],args[1]){
        case "install","undefined":
            popout([400,220],"resources/install.html")
            return
        default:
            var wins=BrowserWindow.getAllWindows()
            fs.access(args[1],fs.constants.R_OK|fs.constants.W_OK,(e,d)=>{
                if(e){
                    wins.at(-1).webContents.executeJavaScript("SYS.compile(['Build dictionary wasn't found, please check the path.',''])")
                    wins[0].webContents.executeJavaScript("log(\"Build dictionary wasn\'t found, please check the path.\");document.activeElement.value=''")
                    return}
                wins.at(-1).webContents.executeJavaScript("SYS.compile(['Build dictionary verified.',''])")
                wins[0].webContents.executeJavaScript("log(\"Build dictionary verified.\")")
                fs.readdir(path.join(__dirname+"/resources/libraries"),function(er,lib){
                    if(er){
                        wins.at(-1).webContents.executeJavaScript("SYS.compile(['Library failure, please vaildate your files.'])")
                        return}
                    for(var i=0;i<lib.length;i++){
                        fs.readFile(path.join(__dirname+"/resources/libraries/"+lib[i]),'utf8',(err,data)=>{
                            if(err){
                                wins.at(-1).webContents.executeJavaScript("SYS.compile(['Fail failure, please check permissions.'])")
                                return}
                            var j=JSON.parse(data)
                            if(rcon.overwrite(args[1]+j["path"],j[args[0]])){
                                switch(args[0]){
                                    case "uninstall":
                                        wins.at(-1).webContents.executeJavaScript("SYS.compile(['Steam modifications uninstalled; Files recovered'])")
                                        break
                                    case "install":
                                        wins.at(-1).webContents.executeJavaScript("SYS.compile(['Steam has been successfully modified'])")
                                        wins[0].webContents.executeJavaScript("log('"+j["success"]["log"]+"');document.activeElement.value='';document.activeElement.parentElement.innerText='"+args[1]+"'")
                                        wins.at(-1).webContents.executeJavaScript("SYS.compile(['"+j["success"]["log"]+"'])")
                                        var ids=j["success"]["ids"].split(";")
                                        for(var i=0;i<ids.length;i++){
                                            wins[0].webContents.executeJavaScript("document.body.children[1].children["+ids[i][0]+"].children[1].children["+ids[i][2]+"].style.color='#00eb00'")}
                                        break}
                                return  }
                            //for(var i=0;i<"+j["success"]["id"]+".length){document.body.children[1].children[1].children["+j["success"]["id"]+"[i][0]].children["+j["success"]["id"]+"[i][1]].style.color='#00eb00'
                            //switch(args[0]){
                            //    case "uninstall":
                            //        break
                            //    case "install":
                            //        if(rcon.overwrite(args[1]+j["path"],j[args[0]]))
                            //        break}
                            })}})})}})
    
//replace <script injected>(keep name attrbute) and </script injected> with | and split; move to index 1 and you have your index