window.onload=function(){
    if(navigator.userAgent.includes("Electron")){
        var p=document.createElement("style")
        p.appendChild(document.createTextNode(".desktop{display:flex}"))
        p.appendChild(document.createTextNode(".web{display:none}"))
        document.head.appendChild(p)
    }else{
        if(document.title=="Personalize Steam"){
            setTimeout(function(){SYS.compile(["Unfortunally, it doesn't seem like you have installed the application",])},10000)
            setTimeout(function(){SYS.compile(["If you're not sure, you can install it here: https://somewebsite.com/install",""])},12000)}}
    if(document.title=="Personalize Steam"){
        setTimeout(function(){SYS.compile(["Welcome to -undecided-, you can edit how your steam behaves or looks here!"])},500)
        setTimeout(function(){SYS.compile(["","To get started, you can click the first button in the row to the left"])},3000)
        setTimeout(function(){SYS.compile(["You can find themes and plugins here: https://somewebsite.com/"])},5500)
        setTimeout(function(){SYS.compile(["It's suggested that you understand CSS before continuing to edit values in the menu yourself",""])},7500)}}
var API={
    menu:function(e){
        if(e.children[2].style.width!="95px"){
            e.children[1].style.width="0"
            e.children[2].style.width="95px"
        }else{
            e.children[1].style.width="15px"
            e.children[2].style.width="0px"}}}
            
//objects
//var taskbar=document.body.children["titlebar"]
var cmd=document.body.children["cmd"]
if(document.title=="Personalize Steam"){
    var app={
        terminal:cmd.children["display"],
        cmd:cmd.children["display"].children[0].children[0],
        buffer:120}}
    app["cmd"].onchange=function(){}
CMD=new Map([
    ["help",["SYS.compile(['?:\\>[]',::,''])",["'Install     Opens the install menu','cls         Clears the screen','','Don\\'t panic! This section of the menu is not required nor used yet.'"]]],
    ["install",["window.api.send('popout','index.html')"]],
    ["cls",["while(document.body.children['cmd'].children.length-2){document.body.children['cmd'].children[0].remove()};document.body.children['cmd'].children[0].innerText=''"]]])