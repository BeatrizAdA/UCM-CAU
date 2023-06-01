"use strict";

const config = require("../config");
const express = require("express");
const mysql = require("mysql");
const routerUsuario = express.Router();
const DAOUsuarios = require("../dao/DAOUsuarios");
const pool = mysql.createPool(config.mysqlConfig);
const daoU = new DAOUsuarios(pool);
const multer = require("multer");
const multerFactory = multer({ storage: multer.memoryStorage() });
const fs = require('fs');

routerUsuario.get("/", function(request, response){
    response.redirect("/login");
});

routerUsuario.get("/login", function(request, response){
    response.render("login", { msg: null });
});

routerUsuario.post("/login", function(request, response, next){
    daoU.usuarioCorrecto(request.body.email, request.body.password, function(err, result){
        if(err) {
            next(err);
        }
        else {
            if(!result) {
                response.render("login", { msg : "Usuario y/o contraseña incorrectos" });
            }
            else {
                request.session.currentUser = request.body.email;
                response.redirect("/index");
            }            
        }
    });
});

routerUsuario.get("/registro", function(request, response){
    response.render("registro", { msg: null });
});

routerUsuario.post("/registro", multerFactory.single('image'), function(request, response, next){
    daoU.existeUsuario(request.body.email, function(err, result){
        if(err){
            next(err);
        }
        else {
            if(result){
                response.render("registro", { msg: "Email ya existe" });
            }
            else {
                if(!request.body.email.endsWith("@ucm.es")){
                    response.render("registro", { msg: "Email incorrecto" });
                }
                else if(request.body.password !== request.body.confirmPassword) {
                    response.render("registro", { msg: "Las contraseñas no coinciden" });
                }
                else if(request.body.password.length < 8 || request.body.password.length > 16 || !/[0-9]/.test(request.body.password) || !/[A-Z]/.test(request.body.password) || !/[a-z]/.test(request.body.password) || !/[^A-Za-z0-9]/.test(request.body.password)){
                    response.render("registro", { msg: "La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, una mayúscula, una minúscula y un caracter no alfanumérico" });
                }
                else if(request.body.numEmpleado !== "" && !/(\d{4})\-([a-z]{3})/.exec(request.body.numEmpleado)){
                    response.render("registro", { msg: "El número de empleado es incorrecto" });
                }
                else {
                    let usuario = new Object();
                    usuario.email = request.body.email;
                    usuario.password = request.body.password;
                    usuario.nombre = request.body.nombre;
                    if(request.file){
                        usuario.img = request.file.buffer;
                    }
                    else {
                        usuario.img = fs.readFileSync("public/img/noUser.png");
                    }
                    usuario.perfilUniversitario = request.body.option;
                    if(request.body.tecnico === "on"){
                        usuario.tecnico = true;
                    }
                    else{
                        usuario.tecnico = false;
                    }
                    usuario.numEmpleado = request.body.numEmpleado;
                    usuario.fecha = new Date();
                    daoU.insertarUsuario(usuario, function(err, result){
                        if(err){
                            next(err);
                        }
                        else {
                            response.redirect("/login");
                        }
                    });
                }
            }
        }
    });
});

routerUsuario.get("/imagen/:id", function(request, response, next){
    daoU.obtenerImagen(request.params.id, function(err, result){
        if(err){
            next(err);
        }
        else{
            response.end(result);
        }
    });
});

routerUsuario.get("/desconectar", function(request, response){
    request.session.destroy();
    response.render("login", { msg: null });
});

module.exports = routerUsuario;