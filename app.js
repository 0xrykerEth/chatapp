const http = require('http');
const express = require('express');
const cors = require("cors");
const sequelize = require('./util/database')
const cookieParser = require('cookie-parser');
const app = express()
const signup = require('./router/signup')
const login = require('./router/login');
const home = require('./router/home')
const messages = require('./router/messages')
const logged = require('./router/logged')
const create = require('./router/createGroup')
const seeGroups = require('./router/seeGroups');
const join = require('./router/join')
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(join)
app.use(seeGroups)
app.use(logged)
app.use(messages)
app.use(create);
app.use(home)
app.use(login)
app.use(signup)


const server = http.createServer(app)



server.listen(3000, () => {
  console.log("Server is running on port 3000");
})
// sequelize.sync()
//   .then(() => {
//     console.log("Database synced successfully!");
//     server.listen(3000, () => {
//       console.log("Server is running on port 3000");
//     });
//   })
//   .catch((err) => {
//     console.error("Unable to sync database:", err);
//   });
