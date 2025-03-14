const http = require('http');
const express = require('express');
const app = express()
const signup = require('./router/signup')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(signup)


const server = http.createServer(app)

server.listen(3000,() => {
    console.log('Server is working on port 3000');
})