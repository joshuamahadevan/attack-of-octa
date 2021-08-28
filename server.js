const express=require("express")
const socket=require("socket.io")
const app=express()

app.use(express.static("public"))

const server=app.listen(300)

const io=socket(server)

var player_log=[]

io.on("connect", (socket)=>{
    socket.emit("init-player", socket.id)

    socket.emit("init-player-info", player_log)

    socket.on("new-player", function (data){
        console.log("new-player",data)
        socket.broadcast.emit("new-player", data)
        player_log.push(data)
    })

    socket.on("move", function (data){
        socket.broadcast.emit("move", data)
    })


})