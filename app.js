const http = require('http');
const express = require('express');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const app = express()
const signup = require('./router/signup')
const login = require('./router/login');
const home = require('./router/home')

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(home)
app.use(login)
app.use(signup)


const server = http.createServer(app)

server.listen(3000,() => {
    console.log('Server is working on port 3000');
})