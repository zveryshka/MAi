const socket = io()

const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")
const startBtn = document.getElementById("startBtn")

startBtn.addEventListener("click", () => socket.emit("start"))

let ball = {}
let myId = null
let players = {}

let myY = 100;
canvas.addEventListener("mousemove", (e)=> {
    const rect = canvas.getBoundingClientRect()
    const y = e.clientY - rect.top
    myY = y
    socket.emit("move", y)
})

socket.on("init", (data)=>{
    myId = data.id
    players = data.players
})
function draw(){
    ctx.clearRect(0, 0, 600, 400)

    for(let id in players){
        let p = players[id]
        
        
    
    ctx.fillRect(
        p.sides == "left" ? 10 : 580,
        p.y,
        10,
        100
    )
    }
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 8, 0, 2 * Math.PI)
    ctx.fill()
}

socket.on("state", state => {
    ball = state.ball
    players = state.players
    draw()
})