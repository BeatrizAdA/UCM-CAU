"use strict";

const config = require("../config");
const express = require("express");
const mysql = require("mysql");
let moment = require("moment");
const routerAviso = express.Router();
const DAOUsuarios = require("../dao/DAOUsuarios");
const DAOAvisos = require("../dao/DAOAvisos");
const pool = mysql.createPool(config.mysqlConfig);
const daoU = new DAOUsuarios(pool);
const daoA = new DAOAvisos(pool);

routerAviso.get("/", function(request, response, next) {
    if(!request.session.currentUser){
        response.redirect("/login");
    }
    daoU.usuarioTecnico(request.session.currentUser, function(err, result1){
        if(err){
            next(err);
        }
        else{
            daoA.getAvisos(request.session.currentUser, function(err, result2){
                if(err){
                    next(err);
                }
                else {
                    daoU.usuarioPerfilUniversitario(request.session.currentUser, function(err, result3){
                        if(err){
                            next(err);
                        }
                        else{
                            daoU.getNombre(request.session.currentUser, function(err, result4){
                                if(err){
                                    next(err);
                                }
                                else{
                                    result2.forEach(element => {
                                        let fecha = moment(new Date(element.fecha));
                                        element.fecha = fecha.format("DD - MM - YYYY");
                                        let texto = element.texto;
                                        if(texto.length > 200){
                                            element.texto = texto.slice(0, 200) + "...";
                                        }
                                    });
                                    response.render("principal", { tecnico: result1, avisos: result2, usuario: result3, asignar: false, nombre: result4, botonNuevoAviso: true, botonElimnarAvisoEntrante: false, busquedaPorNombre: false });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

routerAviso.get("/busqueda", function(request, response, next){
    if(!request.session.currentUser){
        response.redirect("/login");
    }
    daoU.usuarioTecnico(request.session.currentUser, function(err, result1){
        if(err){
            next(err);
        }
        else{
            if(request.query.usuarios === "on"){
                daoU.busquedaAvisosPorUsuarios(request.query.texto, function(err, result2){
                    if(err){
                        next(err);
                    }
                    else{
                        daoU.usuarioPerfilUniversitario(request.session.currentUser, function(err, result3){
                            if(err){
                                next(err);
                            }
                            else{
                                daoU.getNombre(request.session.currentUser, function(err, result4){
                                    if(err){
                                        next(err);
                                    }
                                    else{
                                        result2.forEach(element => {
                                            let fecha = moment(new Date(element.fecha));
                                            element.fecha = fecha.format("DD - MM - YYYY");
                                        });
                                        response.render("principal", { tecnico: result1, avisos: result2, usuario: result3, asignar: false, nombre: result4, botonNuevoAviso: false, botonElimnarAvisoEntrante: false, busquedaPorNombre: true });
                                    }
                                });
                            }
                        });
                    }
                });
            }
            else{
                if(!result1[0].tecnico){
                    daoA.busquedaAvisosPorTexto(request.session.currentUser, request.query.texto, function(err, result2){
                        if(err){
                            next(err);
                        }
                        else{
                            daoU.usuarioPerfilUniversitario(request.session.currentUser, function(err, result3){
                                if(err){
                                    next(err);
                                }
                                else{
                                    daoU.getNombre(request.session.currentUser, function(err, result4){
                                        if(err){
                                            next(err);
                                        }
                                        else{
                                            result2.forEach(element => {
                                                let fecha = moment(new Date(element.fecha));
                                                element.fecha = fecha.format("DD - MM - YYYY");
                                                let texto = element.texto;
                                                if(texto.length > 200){
                                                    element.texto = texto.slice(0, 200) + "...";
                                                }
                                            });
                                            response.render("principal", { tecnico: result1, avisos: result2, usuario: result3, asignar: false, nombre: result4, botonNuevoAviso: false, botonElimnarAvisoEntrante: false, busquedaPorNombre: false });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                else{
                    daoA.busquedaAvisosPorTextoTecnico(request.query.texto, function(err, result2){
                        if(err){
                            next(err);
                        }
                        else{
                            daoU.usuarioPerfilUniversitario(request.session.currentUser, function(err, result3){
                                if(err){
                                    next(err);
                                }
                                else{
                                    daoU.getNombre(request.session.currentUser, function(err, result4){
                                        if(err){
                                            next(err);
                                        }
                                        else{
                                            result2.forEach(element => {
                                                let fecha = moment(new Date(element.fecha));
                                                element.fecha = fecha.format("DD - MM - YYYY");
                                                let texto = element.texto;
                                                if(texto.length > 200){
                                                    element.texto = texto.slice(0, 200) + "...";
                                                }
                                            });
                                            response.render("principal", { tecnico: result1, avisos: result2, usuario: result3, asignar: false, nombre: result4, botonNuevoAviso: false, botonElimnarAvisoEntrante: false, busquedaPorNombre: false });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                
            }
        }
    });
});

routerAviso.post("/nuevoAviso", function(request, response){
    if(!request.session.currentUser){
        response.redirect("/login");
    }
    let aviso = new Object();
    aviso.fecha = new Date();
    aviso.texto = request.body.textObservaciones;
    aviso.tipo = request.body.selectTipo;
    if(request.body.seleccionar1 === 'AdministracionDigital'){
        aviso.comunicaciones = request.body.selectAdministracionDigital;
    }
    else if(request.body.seleccionar1 === 'Comunicaciones'){
        aviso.comunicaciones = request.body.selectComunicaciones;
    }
    else if(request.body.seleccionar1 === 'Conectividad'){
        aviso.comunicaciones = request.body.selectConectividad;
    }
    else if(request.body.seleccionar1 === 'Docencia'){
        aviso.comunicaciones = request.body.selectDocencia;
    }
    else if(request.body.seleccionar1 === 'Web'){
        aviso.comunicaciones = request.body.selectWeb;
    }
    if(request.body.selectTipo === 'Felicitacion') {
        aviso.comunicaciones = request.body.selectFelicitacion;
    }
    daoA.insertarAviso(request.session.currentUser, aviso, function(err, result){
        response.redirect("/index");
    });
});

routerAviso.get("/aviso", function(request, response, next){
    if(!request.session.currentUser){
        response.redirect("/login");
    }
    daoA.getAviso(request.query.num, function(err, result){
        if(err){
            next(err);
        }
        else{
            let fecha = moment(new Date(result[0].fecha));
            result[0].fecha = fecha.format("DD - MM - YYYY");
            response.json({ aviso: result });
        }
    });
});

routerAviso.get("/avisosEntrantes", function(request, response, next) {
    if(!request.session.currentUser){
        response.redirect("/login");
    }
    daoU.usuarioTecnico(request.session.currentUser, function(err, result1){
        if(err){
            next(err);
        }
        else{
            daoA.getAvisosEntrantes(function(err, result2){
                if(err){
                    next(err);
                }
                else {
                    daoU.getNombre(request.session.currentUser, function(err, result4){
                        if(err){
                            next(err);
                        }
                        else{
                            result2.forEach(element => {
                                let fecha = moment(new Date(element.fecha));
                                element.fecha = fecha.format("DD - MM - YYYY");
                                let texto = element.texto;
                                if(texto.length > 200){
                                    element.texto = texto.slice(0, 200) + "...";
                                }
                            });
                            response.render("principal", { tecnico: result1, avisos: result2, asignar: true, nombre: result4, botonNuevoAviso: false, botonElimnarAvisoEntrante: true, busquedaPorNombre: false });
                        }
                    });
                }
            });
        }
    });
});

routerAviso.get("/asignar", function(request, response, next){
    if(!request.session.currentUser){
        response.redirect("/login");
    }
    daoA.getAviso(request.query.num, function(err, result){
        if(err){
            next(err);
        }
        else{
            daoU.getNombreTecnico(function(err, result2){
                if(err){
                    next(err);
                }
                else{
                    let fecha = moment(new Date(result[0].fecha));
                    result[0].fecha = fecha.format("DD - MM - YYYY");
                    response.json({ aviso: result, nombresTecnicos: result2 });
                }
            });
        }
    });
});

routerAviso.post("/asignarTecnico", function(request, response, next){
    if(!request.session.currentUser){
        response.redirect("/login");
    }
    daoA.asignarTecnicoAviso(request.body.asignarIdAviso, request.body.asignarOpciones, function(err, result){
        if(err){
            next(err);
        }
        else{
            response.redirect("/index/avisosEntrantes");
        }
    });
});

routerAviso.post("/comentarioTecnico", function(request, response, next){
    if(!request.session.currentUser){
        response.redirect("/login");
    }
    daoA.comentarioAviso(request.body.comentarioIdAviso, request.body.textoComentario, request.body.nombreTecnico, function(err, result){
        if(err){
            next(err);
        }
        else{
            response.redirect("/index");
        }
    });
});

routerAviso.get("/historico", function(request, response, next) {
    if(!request.session.currentUser){
        response.redirect("/login");
    }
    daoU.usuarioTecnico(request.session.currentUser, function(err, result1){
        if(err){
            next(err);
        }
        else{
            daoA.historicoAvisos(request.session.currentUser, function(err, result2){
                if(err){
                    next(err);
                }
                else {
                    daoU.usuarioPerfilUniversitario(request.session.currentUser, function(err, result3){
                        if(err){
                            next(err);
                        }
                        else{
                            daoU.getNombre(request.session.currentUser, function(err, result4){
                                if(err){
                                    next(err);
                                }
                                else{
                                    result2.forEach(element => {
                                        let fecha = moment(new Date(element.fecha));
                                        element.fecha = fecha.format("DD - MM - YYYY");
                                        let texto = element.texto;
                                        if(texto.length > 200){
                                            element.texto = texto.slice(0, 200) + "...";
                                        }
                                    });
                                    response.render("principal", { tecnico: result1, avisos: result2, usuario: result3, asignar: false, nombre: result4, botonNuevoAviso: false, botonElimnarAvisoEntrante: false, busquedaPorNombre: false });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = routerAviso;