"use strict";

const config = require("./config");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const DAOUsuarios = require("./dao/DAOUsuarios");
const DAOAvisos = require("./dao/DAOAvisos");
const { dirname } = require("path");

let moment = require("moment");

// Crear un servidor Express.js
const app = express();

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: false}));

const ficherosEstaticos = path.join(__dirname, "public");
app.use(express.static(ficherosEstaticos));

const session = require("express-session");

const mysqlSession = require("express-mysql-session");

const MySQLStore = mysqlSession(session);
 
const sessionStore = new MySQLStore({
    host: "localhost",
    user: "root",
    password: "",
    database: "UCM-CAU"
});

const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});

app.use(middlewareSession);

const daoU = new DAOUsuarios(pool);
const daoA = new DAOAvisos(pool);
const routerU = require("./routes/usuario");
const routerA = require("./routes/aviso");

app.use("/", routerU);
app.use("/login", routerU);
app.use("/registro", routerU);
app.use("/index", routerA)

app.use(function(request, response, next){
    response.status(400);
    response.render("error404", { url: request.url });
});

app.use(function(error, request, response, next){
    response.status(500);
    response.render("error500", { mensaje: error.message, pila: error.stack });
});

// Arrancar el servidor
app.listen(config.port, function(err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});