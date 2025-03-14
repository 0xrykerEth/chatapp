const http = require('http');
const express = require('express');
const path = require('path');
const app = express()

const server = http.createServer(app)

app.use('/',(req,res) => {
    res.sendFile(path.join(__dirname,'views','signup.html'))
})

server.listen(3000,() => {
    console.log('Server is working on port 3000');
})