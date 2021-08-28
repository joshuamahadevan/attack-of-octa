const express=require("express")
const socket=require("socket.io")
const app=express()

app.use(express.static("public"))

const server=app.listen(300)

const io=socket(server)

var player_log=[]

io.on("connect", (socket)=>{
    socket.emit("init-player", socket.id)

    socket.on("new-player", function (data){
        console.log("new-player",data)
        socket.broadcast.emit("new-player", data)
        player_log.push(data)
    })

    socket.on("move", function (data){
        console.log("move",data)
        socket.broadcast.emit("move", data)
    })
})