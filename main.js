const{app,BrowserWindow,ipcMain}=require("electron")
const fs=require("fs")

//require("electron-reload")(__dirname)
//require("electron-reload")(__dirname, {
//    electron:require(`${__dirname}/node_modules/electron`)})

//create loading screen later
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
            preload:(__dirname+"/preload.js")}})
        win.loadFile(__dirname+"/"+page)
        setTimeout(function(){win.show()}),500}
async function main(){
    popout([580,300],"index.html")
    fs.readFile(__dirname+"/"+"config/app.txt",'utf8',(e,data)=>{
        if(e)return
        if(!String(data).includes("active")){
            BrowserWindow.getAllWindows()[0].webContents.executeJavaScript("dis()")
            fs.appendFile(__dirname+"/"+"config/app.txt",";active",(e)=>{if(e)return})}})}
app.on("ready",main)
var sys={
    compile:function(){
        fs.readdir(__dirname+"/cache",function(e,lib){
            if(e)return
            for(var i=0;i<lib.length;i++)
                fs.unlink(__dirname+"/cache/"+lib[i],(e)=>{
                    if(e)return})})
        fs.readdir(__dirname+"/mods",function(e,lib){
            if(e)return
            for(var i=0;i<lib.length;i++)
                fs.readFile(__dirname+"/mods/"+lib[i],(e,d)=>{
                    if(e)return
                    var d=JSON.parse(d)
                    var dat=Object.keys(d)
                    for(var _i=0;_i<dat.length;_i++)
                        for(var __i=0;__i<d[dat[_i]].length;__i++)
                            fs.appendFile(__dirname+"/cache/"+dat[_i]+".js",d[dat[_i]][__i],(e)=>{
                                if(e)return})})})},
    overwrite:function(path,d){
        try{
            fs.writeFile(path,d,(e)=>{
                if(e)return}) 
            return true
        }catch(e){}}}
ipcMain.on("minimize",()=>{BrowserWindow.getFocusedWindow().minimize()})
ipcMain.on("maximize",()=>{BrowserWindow.getFocusedWindow().maximize()})
ipcMain.on("close",()=>{BrowserWindow.getFocusedWindow().close()})
ipcMain.on("popout",(events,args)=>{popout([400,220],args)})
ipcMain.on("reboot",()=>{
    app.relaunch()
	app.exit(0)})
ipcMain.on("verify",()=>{
    var wins=BrowserWindow.getAllWindows()
    fs.readFile(__dirname+"/config/path.txt",(e,d)=>{
        if(e||!d){
            wins.at(0).webContents.executeJavaScript("log(\"No API access detected, Build required.\")")
            return}
        fs.readdir(__dirname+"/resources/libraries",(e,lib)=>{
            if(e){
                wins.at(-1).webContents.executeJavaScript("SYS.compile(['Library failure, please vaildate your files.'])")
                return}
            for(var i=0;i<lib.length;i++)
                fs.readFile(__dirname+"/resources/libraries/"+lib[i],'utf8',(e,dat)=>{
                    if(e){
                        wins.at(-1).webContents.executeJavaScript("SYS.compile(['Failure, please check permissions.'])")
                        return}
                    var j=JSON.parse(dat)
                    fs.readFile(d+j["path"],(e,data)=>{
                        if(e)return
                        if(String(data).includes("<meta bettersteam>")){
                            var ids=j["success"]["ids"].split(";")
                            for(var i=0;i<ids.length;i++)
                                wins[0].webContents.executeJavaScript("document.body.children[1].children["+ids[i][0]+"].children[1].children["+ids[i][2]+"].style.color='#00eb00'")}})})})})})
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
                fs.readdir(__dirname+"/resources/libraries",function(e,lib){
                    if(e){
                        wins.at(-1).webContents.executeJavaScript("SYS.compile(['Library failure, please vaildate your files.'])")
                        return}
                    for(var i=0;i<lib.length;i++)
                        fs.readFile(__dirname+"/resources/libraries/"+lib[i],'utf8',(e,data)=>{
                            if(e){
                                wins.at(-1).webContents.executeJavaScript("SYS.compile(['Failure, please check permissions.'])")
                                return}
                            var j=JSON.parse(data)
                            var ids=j["success"]["ids"].split(";")
                            if(sys.overwrite(args[1]+j["path"],j[args[0]].replace("{PATH}",__dirname+"/cache/global.js").replace("{MODPATH}",__dirname+"/cache/"+j["path"].split("/").at(-1)))){
                                switch(args[0]){
                                    case "uninstall":
                                        fs.writeFile(__dirname+"/config/path.txt","",(e)=>{
                                            if(e)return})
                                        wins.at(-1).webContents.executeJavaScript("SYS.compile(['Steam modifications uninstalled; Files recovered'])")
                                        if(wins[0])
                                            for(var i=0;i<ids.length;i++)
                                                wins[0].webContents.executeJavaScript("document.body.children[1].children["+ids[i][0]+"].children[1].children["+ids[i][2]+"].style.color='red'")
                                        break
                                    case "install":
                                        fs.writeFile(__dirname+"/config/path.txt",args[1],(e)=>{
                                            if(e)return})
                                        wins.at(-1).webContents.executeJavaScript("SYS.compile(['Steam has been successfully modified'])")
                                        wins[0].webContents.executeJavaScript("log('"+j["success"]["log"]+"');"+(wins[0].getTitle()=="Install for Steam"?"document.activeElement.value='';document.activeElement.parentElement.innerText='"+args[1]+"'":""))
                                        wins.at(-1).webContents.executeJavaScript("SYS.compile(['"+j["success"]["log"]+"'])")
                                        for(var i=0;i<ids.length;i++)
                                            if(wins[0])wins[0].webContents.executeJavaScript("document.body.children[1].children["+ids[i][0]+"].children[1].children["+ids[i][2]+"].style.color='#00eb00'")
                                        sys.compile()
                                        break}
                                return}})})})}})