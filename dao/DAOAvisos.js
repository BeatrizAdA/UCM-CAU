"use strict";

class DAOAvisos {

    constructor(pool) {
        this.pool = pool;
    }

    getAvisos(email, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT USU.nombre, AVI.id, AVI.fecha, AVI.texto, AVI.tipo, AVI.nombreTecnico FROM UCM_AW_CAU_USU_Usuarios USU JOIN UCM_AW_CAU_USUAVI_UsuarioAviso USUAVI ON USU.id = USUAVI.idUsuario JOIN UCM_AW_CAU_AVI_Avisos AVI ON USUAVI.idAviso = AVI.id WHERE USU.email = ? AND AVI.activo = ?" , [email, true],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            callback(null, rows);
                        }
                    });
            }
        });
    }

    busquedaAvisosPorTexto(email, texto, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT USU.nombre, AVI.id, AVI.fecha, AVI.texto, AVI.tipo, AVI.nombreTecnico FROM UCM_AW_CAU_USU_Usuarios USU JOIN UCM_AW_CAU_USUAVI_UsuarioAviso USUAVI ON USU.id = USUAVI.idUsuario JOIN UCM_AW_CAU_AVI_Avisos AVI ON USUAVI.idAviso = AVI.id WHERE USU.email = ? AND AVI.texto LIKE CONCAT('%', ?, '%')" , [email, texto],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            callback(null, rows);
                        }
                    });
            }
        });
    }

    busquedaAvisosPorTextoTecnico(texto, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT DISTINCT AVI.id, AVI.fecha, AVI.texto, AVI.tipo, AVI.nombreTecnico FROM UCM_AW_CAU_USU_Usuarios USU JOIN UCM_AW_CAU_USUAVI_UsuarioAviso USUAVI ON USU.id = USUAVI.idUsuario JOIN UCM_AW_CAU_AVI_Avisos AVI ON USUAVI.idAviso = AVI.id WHERE AVI.texto LIKE CONCAT('%', ?, '%')" , [texto],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            callback(null, rows);
                        }
                    });
            }
        });
    }

    insertarAviso(email, aviso, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT id FROM UCM_AW_CAU_USU_Usuarios WHERE email = ?" , [email],
                    function(err, rows1) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            connection.query("INSERT INTO UCM_AW_CAU_AVI_Avisos (fecha, texto, tipo, comunicaciones, activo) VALUES (?, ?, ?, ?, ?)" , [aviso.fecha, aviso.texto, aviso.tipo, aviso.comunicaciones, true],
                            function(err, rows2) {
                                if (err) {
                                    callback(new Error("Error de acceso a la base de datos"));
                                }
                                else {
                                    connection.query("INSERT INTO UCM_AW_CAU_USUAVI_UsuarioAviso (idUsuario, idAviso) VALUES (?, ?)" , [rows1[0].id, rows2.insertId],
                                    function(err, rows3) {
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos"));
                                        }
                                        else {
                                            callback(null);
                                        }
                                    });
                                }
                            });
                        }
                    });
            }
        });
    }

    getAviso(id, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT USU.nombre, USU.perfilUniversitario, AVI.fecha, AVI.texto, AVI.tipo, AVI.comunicaciones, AVI.comentario FROM UCM_AW_CAU_USU_Usuarios USU JOIN UCM_AW_CAU_USUAVI_UsuarioAviso USUAVI ON USU.id = USUAVI.idUsuario JOIN UCM_AW_CAU_AVI_Avisos AVI ON USUAVI.idAviso = AVI.id WHERE AVI.id = ?" , [id],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            callback(null, rows);
                        }
                    });
            }
        });
    }

    getAvisosEntrantes(callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT id, fecha, texto, tipo, nombreTecnico FROM UCM_AW_CAU_AVI_Avisos WHERE activo = ?", [true],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            callback(null, rows);
                        }
                    });
            }
        });
    }

    asignarTecnicoAviso(id, nombre, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("UPDATE UCM_AW_CAU_AVI_Avisos SET nombreTecnico = ? WHERE id = ?", [nombre, id],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            connection.query("SELECT id FROM UCM_AW_CAU_USU_Usuarios WHERE nombre = ?", [nombre],
                            function(err, rows2) {
                                if (err) {
                                    callback(new Error("Error de acceso a la base de datos"));
                                }
                                else {
                                    connection.query("INSERT INTO UCM_AW_CAU_USUAVI_UsuarioAviso (idUsuario, idAviso) VALUES (?, ?)", [rows2[0].id, id],
                                    function(err, rows) {
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos"));
                                        }
                                        else {
                                            callback(null);
                                        }
                                    });
                                }
                            });
                        }
                    });
            }
        });
    }

    comentarioAviso(id, comentario, nombreTecnico, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("UPDATE UCM_AW_CAU_AVI_Avisos SET comentario = ?, activo = ?, nombreTecnico = ? WHERE id = ?", [comentario, false, nombreTecnico, id],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            callback(null);
                        }
                    });
            }
        });
    }

    historicoAvisos(email, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT USU.nombre, AVI.id, AVI.fecha, AVI.texto, AVI.tipo, AVI.nombreTecnico FROM UCM_AW_CAU_USU_Usuarios USU JOIN UCM_AW_CAU_USUAVI_UsuarioAviso USUAVI ON USU.id = USUAVI.idUsuario JOIN UCM_AW_CAU_AVI_Avisos AVI ON USUAVI.idAviso = AVI.id WHERE USU.email = ? AND AVI.activo = ?" , [email, false],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            callback(null, rows);
                        }
                    });
            }
        });
    }

}

module.exports = DAOAvisos;