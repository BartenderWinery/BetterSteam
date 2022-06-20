var cmd=document.body.children["cmd"]
app={
    terminal:cmd.children["display"],
    cmd:cmd.children["display"].children[0].children[0],
    buffer:120}
GUI.compile(["Personalize Steam app initalized. No license reserved.",""])
CMD.set("cls","GUI.clear(document.body.children['cmd']);")
var API={
    menu:function(e){
        if(e.children[2].style.width!="95px"){
            e.children[1].style.width="0"
            e.children[2].style.width="95px"
        }else{
            e.children[1].style.width="15px"
            e.children[2].style.width="0px"}}}