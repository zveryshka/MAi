import { createServer } from 'http';
import chalk from 'chalk';
import {  readFile } from "fs/promises";
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from "socket.io";

const server = createServer(async(req, res)=> {
    try{
        logger(req)
        if(await getStaticFiles(req, res)) return;
        switch(req.url){
            default:
            res.statusCode = 404;
            res.setHeader("content-type", "text/plain")
            res.end("not found")
        }
    }catch(error){
        console.error(error);
        res.statusCode = 500;
        res.end(error.message);
    }  
})

const io = new Server(server)

io.on("connection", (socket)=>{
    console.log(
        chalk.green("user connected with id:"),
        chalk.yellow(socket.id)
    )
})

server.listen(3000, ()=> console.log("server on!"))


function logger(req){
    let url = chalk.green(req.url);
    let time = chalk.red (new Date().toLocaleTimeString())
    let method = chalk.blue(req.method);
    console.log(`${time}: ${method} - ${url}`)
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
console.log(__dirname)


async function getStaticFiles(req, res){
    try{
        let fileName = req.url.substring(1)
        if(req.url == "/") fileName = "index.html"
        let pathToFile = path.join(__dirname, 'static', fileName)
        let file = await readFile(pathToFile)
        res.statusCode = 200
        res.end(file)
        return true
    }catch(err){
        return false
    }
}