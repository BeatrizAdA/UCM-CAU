"use strict";

class DAOUsuarios {

    constructor(pool) {
        this.pool = pool;
    }

    usuarioCorrecto(email, contraseña, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT id FROM UCM_AW_CAU_USU_Usuarios WHERE email = ? AND password = ?" , [email, contraseña],
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(null, false);
                        }
                        else {
                            callback(null, rows[0].id);
                        }
                    }
                });
            }
        });
    }

    insertarUsuario(usuario, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                if(!usuario.tecnico){
                    connection.query("INSERT INTO UCM_AW_CAU_USU_Usuarios (email, password, nombre, img, perfilUniversitario, tecnico, fecha) VALUES (?, ?, ?, ?, ?, ?, ?)" , [usuario.email, usuario.password, usuario.nombre, usuario.img, usuario.perfilUniversitario, usuario.tecnico, usuario.fecha],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                    });
                }
                else {
                    connection.query("INSERT INTO UCM_AW_CAU_USU_Usuarios (email, password, nombre, img, perfilUniversitario, tecnico, numEmpleado, fecha) VALUES (?, ?, ?, ?, ?, ?, ?, ?)" , [usuario.email, usuario.password, usuario.nombre, usuario.img, usuario.perfilUniversitario, usuario.tecnico, usuario.numEmpleado, usuario.fecha],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                    });
                }
                callback(null);
            }
        });
    }

    existeUsuario(email, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT id FROM UCM_AW_CAU_USU_Usuarios WHERE email = ?" , [email],
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(null, false);
                        }
                        else {
                            callback(null, true);
                        }
                    }
                });
            }
        });
    }

    usuarioTecnico(email, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT tecnico FROM UCM_AW_CAU_USU_Usuarios WHERE email = ?" , [email],
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

    usuarioPerfilUniversitario(email, callback){
        this.pool.getConnection(function(err, connection){
            if(err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT perfilUniversitario FROM UCM_AW_CAU_USU_Usuarios WHERE email = ?" , [email],
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

    getNombreTecnico(callback){
        this.pool.getConnection(function(err, connection){
            if(err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT nombre FROM UCM_AW_CAU_USU_Usuarios WHERE tecnico = true",
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

    getNombre(email, callback){
        this.pool.getConnection(function(err, connection){
            if(err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT id, nombre FROM UCM_AW_CAU_USU_Usuarios WHERE email = ?", [email],
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

    obtenerImagen(id, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT img FROM UCM_AW_CAU_USU_Usuarios WHERE id = ?" , [id],
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(null, false);
                        }
                        else {
                            callback(null, rows[0].img);
                        }
                    }
                });
            }
        });
    }

    busquedaAvisosPorUsuarios(texto, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT USU.nombre, USU.tecnico, USU.fecha FROM UCM_AW_CAU_USU_Usuarios USU WHERE USU.nombre LIKE CONCAT('%', ?, '%')" , [texto],
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

module.exports = DAOUsuarios;