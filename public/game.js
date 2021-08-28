const canvas=document.getElementById("canvas")
const c=canvas.getContext("2d")

c.canvas.background="rgba(50,50,50,.8)"

function resize(){
    c.canvas.width=innerWidth-5;
    c.canvas.height=innerHeight-5;
}
resize()

addEventListener("resize", resize);

addEventListener("mousemove", (e) => {
    player.mx=e.clientX;
    player.my=e.clientY;
})

class Player{
    constructor(id){
        this.id=id
        this.x=innerWidth/2;
        this.y=innerHeight/2;
        this.moveLeft=false;
        this.moveRight=false;
        this.moveUp=false;
        this.moveDown=false;
        this.state="idle";
        this.mx=this.x;
        this.my=this.y;
        this.angle;
    }
    draw(){
        this.update()
        const img=new Image()
        img.src="./svgs/player.svg"
        c.save()
        c.translate(this.x,this.y)
        c.rotate(this.angle+Math.PI/2)
        c.drawImage(img,-50, -50, 100,100)

        c.restore();
    }
    update(){
        this.angle=Math.atan2(this.my-this.y, this.mx-this.x);
        if(this.moveDown||this.moveUp||this.moveLeft||this.moveRight){
            let speed=5;
            if(this.moveDown)this.y+=speed;
            if(this.moveUp)this.y-=speed;
            if(this.moveRight)this.x+=speed;
            if(this.moveLeft)this.x-=speed;

            return true
        }else{
            return false
        }
    }
}

addEventListener("keydown", (e)=>{
    if(e.key=="a" || e.key=="ArrowLeft" || e.key=="A"){
        player.moveLeft=true
    }else if(e.key=="w" || e.key=="ArrowUp" ||e.key=="W"){
        player.moveUp=true
    }else if(e.key=="s" || e.key=="ArrowDown" || e.key=="S"){
        player.moveDown=true
    }else if(e.key=="d" || e.key=="ArrowRight" || e.key=="D"){
        player.moveRight=true
    }
})

addEventListener("keyup", (e)=>{
    if(e.key=="a" || e.key=="ArrowLeft" || e.key=="A"){
        player.moveLeft=false
    }else if(e.key=="w" || e.key=="ArrowUp" ||e.key=="W"){
        player.moveUp=false
    }else if(e.key=="s" || e.key=="ArrowDown" ||e.key=="S"){
        player.moveDown=false
    }else if(e.key=="d" || e.key=="ArrowRight" || e.key=="D"){
        player.moveRight=false
    }
})
class Enemy{
    constructor(id,x,y,state){
        this.id=id
        this.x=x;
        this.y=y;
        this.state=state;
    }
    draw(){
        c.beginPath();
        c.arc(this.x,this.y,40,0,2*Math.PI);    
        c.stroke();   
    }
}

function DrawAll(){
    c.clearRect(0,0,innerWidth,innerHeight)
    player.draw()
    enemies.forEach( (enemy) =>{
        enemy.draw()
    })
}

var player
var enemies=[];

var socket=io.connect("http://localhost:300")

socket.on("init-player", (data)=>{
    player=new Player(data)
    socket.emit("new-player", {id:player.id, state:player.state, x:player.x, y:player.y})

    socket.on("new-player", function (data){
        enemies.push(new Enemy(data.id, data.x, data.y, data.state))
        console.log(enemies)
    })

    socket.on("init-pllayer-info", function (data){
        data.forEach( (p)=>{
            enemies.push(new Enemy(p.id, p.x,p.y, p.state))
        })
    })

    function gameLoop(){
        requestAnimationFrame(gameLoop)
        if(player.update()) {
            socket.emit("move", {id:player.id, x:player.x, y:player.y})
        }
        DrawAll()
        
    }
    gameLoop()

    socket.on("move", function (data){
        console.log(enemies, data)
        enemies.find(enemy => enemy.id===data.id ).x=data.x
        enemies.find(enemy => enemy.id===data.id ).y=data.y

    })
})

