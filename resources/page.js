
window.onload=function(){
    if(navigator.userAgent.includes("Electron")){
        var p=document.createElement("style")
        p.appendChild(document.createTextNode(".desktop{display:flex}"))
        document.head.appendChild(p)}}
var API={
    menu:function(e){
        if(e.children[2].style.width!="95px"){
            e.children[1].style.width="0"
            e.children[2].style.width="95px"
        }else{
            e.children[1].style.width="15px"
            e.children[2].style.width="0px"}}}
            
//object indexing
var taskbar=document.body.children["titlebar"]
var cmd=document.body.children["cmd"]
var app={
    terminal:cmd.children["display"],
    cmd:cmd.children["display"].children[0].children[0],
    buffer:120}
GUI.compile(["Personalize Steam app initalized. No license reserved.",""])
CMD=new Map([
    ["help",["GUI.compile(['?:\>[]',::,''])",["'cls       Clears the screen','','Don\\'t panic! This section of the menu is not required nor used yet.'"]]],
    ["cls",["while(document.body.children['cmd'].children.length-2){document.body.children['cmd'].children[0].remove()};document.body.children['cmd'].children[0].innerText=''"]]])