const express = require('express');
const jwt = require("jsonwebtoken");
const config = require("./auth.config.js");
const authJwt = require("./authJwt.js");

function createRouter(db) {
  const router = express.Router();

  //login
  router.post('/login', (req, res, next) => {
    db.query(
      'SELECT id, name, surname, email, username, rol_id FROM user WHERE username=? AND activo=1',
      (req.body.username),
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          var token = jwt.sign({ id: results[0].id }, config.secret, {
            expiresIn: 86400 // 24 hours
          });
          res.status(200).json({ user: results[0], accessToken: token });
        }
      }
    );
  });

  //getUsers
  //router.get('/users', [authJwt.verifyToken], function (req, res, next) {
  router.get('/users', function (req, res, next) {
    db.query(
      'SELECT user.id, user.name, user.surname, user.email, user.username, user.rol_id, user.activo, rol.name as rol_name FROM user, rol WHERE user.rol_id = rol.id ORDER BY user.id',
      //'SELECT id, name, surname, email, username FROM user WHERE id=? ORDER BY date LIMIT 10 OFFSET ?',
      //[req.body.id, 10*(req.params.page || 0)],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  //getUserById
  router.get('/users/:id', function (req, res, next) {
    db.query(
      'SELECT user.id, user.name, user.surname, user.email, user.username, user.rol_id, user.activo, rol.name as rol_name FROM user, rol WHERE user.rol_id = rol.id AND user.id=?',
      [req.params.id],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  //createUser
  router.post('/users/new', (req, res, next) => {
    db.query(
      'INSERT INTO user (name, surname, email, username, password, rol_id) VALUES (?,?,?,?,?,?)',
      [req.body.name, req.body.surname, req.body.email, req.body.username, req.body.password, req.body.rol_id],//new Date(req.body.date)],
      (error) => {
        if (error) {
          console.error(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json({ status: 'ok' });
        }
      }
    );
  });
  //updateUser
  router.put('/users/update', function (req, res, next) {
    db.query(
      'UPDATE user SET name=?, surname=?, email=?, username=?, rol_id=?, activo=? WHERE id=?',
      [req.body.name, req.body.surname, req.body.email, req.body.username, req.body.rol_id, req.body.activo, req.body.id],
      (error) => {
        if (error) {
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json({ status: 'ok' });
        }
      }
    );
  });
  //getEmpresasByUserId
  router.get('/users/:id/empresas', function (req, res, next) {
    db.query(
      'SELECT empresa.id, empresa.name, empresa.activo,empresa.numero_identificacion FROM user_empresa, empresa, user WHERE user_empresa.empresa_id = empresa.id AND user_empresa.user_id = user.id AND empresa.activo=1 AND user.activo=1 AND user_empresa.user_id=?',
      [req.params.id],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  //updateEmpresasByUserId
  router.post('/users/:id/empresas/update', function (req, res, next) {
    let delete_error = "";
    let insert_error = "";
    db.query(
      'DELETE FROM user_empresa WHERE user_id=?',
      [req.body.user_id],
      (error) => {
        if (error) {
          delete_error = error;
        }
      }
    );
    for (let i = 0; i < req.body.empresas.length; i++) {
      db.query(
        'INSERT INTO user_empresa (user_id, empresa_id) VALUES (?,?)',
        [req.body.user_id, req.body.empresas[i]],
        (error) => {
          if (error) {
            insert_error = error;
          }
        }
      );
    }
    if (delete_error != "" || insert_error != "") {
      res.status(500).json({ status: 'error: ' + delete_error + "; " + insert_error });
    } else {
      res.status(200).json({ status: 'ok' });
    }
  });

  //getRoles
  router.get('/roles', function (req, res, next) {
    db.query(
      'SELECT rol.id, rol.name, rol.activo FROM rol ORDER BY rol.id',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  //getRolById
  router.get('/roles/:id', function (req, res, next) {
    db.query(
      'SELECT rol.id, rol.name, rol.activo FROM rol WHERE rol.id=?',
      [req.params.id],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  //createRol
  router.post('/roles/new', (req, res, next) => {
    db.query(
      'INSERT INTO rol (name) VALUES (?)',
      [req.body.name],
      (error) => {
        if (error) {
          console.error(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json({ status: 'ok' });
        }
      }
    );
  });
  //updateRol
  router.put('/roles/update', function (req, res, next) {
    db.query(
      'UPDATE rol SET name=?, activo=? WHERE id=?',
      [req.body.name, req.body.activo, req.body.id],
      (error) => {
        if (error) {
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json({ status: 'ok' });
        }
      }
    );
  });

  //getPermisos
  router.get('/permisos', function (req, res, next) {
    db.query(
      'SELECT permiso.id, permiso.name FROM permiso ORDER BY permiso.id',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  //getPermisoById
  router.get('/permisos/:id', function (req, res, next) {
    db.query(
      'SELECT permiso.id, permiso.name FROM permiso WHERE permiso.id=?',
      [req.params.id],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  //getPermisosByRolId
  router.get('/permisos/rol/:rol_id', function (req, res, next) {
    db.query(
      'SELECT permiso.id, permiso.name, permiso.code_name FROM rol_permiso, permiso WHERE rol_permiso.permiso_id=permiso.id AND rol_permiso.activo=1 AND rol_permiso.rol_id=?',
      [req.params.rol_id],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });

  //getEmpresas
  router.get('/empresas', function (req, res, next) {
    db.query(
      'SELECT empresa.id, empresa.name, empresa.activo,empresa.numero_identificacion FROM empresa ORDER BY empresa.id',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  //getEmpresaById
  router.get('/empresas/:id', function (req, res, next) {
    db.query(
      'SELECT empresa.id, empresa.name, empresa.activo,empresa.numero_identificacion FROM empresa WHERE empresa.id=?',
      [req.params.id],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  //createEmpresa
  router.post('/empresas/new', (req, res, next) => {
    db.query(
      'INSERT INTO empresa (name,numero_identificacion) VALUES (?,?)',
      [req.body.name, req.body.numero_identificacion],
      (error) => {
        if (error) {
          console.error(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json({ status: 'ok' });
        }
      }
    );
  });
  //updateEmpresa
  router.put('/empresas/update', function (req, res, next) {
    db.query(
      'UPDATE empresa SET name=?, activo=?,numero_identificacion=? WHERE id=?',
      [req.body.name, req.body.activo, req.body.numero_identificacion, req.body.id],
      (error) => {
        if (error) {
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json({ status: 'ok' });
        }
      }
    );
  });
  //getUsersByEmpresasId - para el rol de Administrador de empresas
  router.post('/empresas/users', function (req, res, next) {
    db.query(
      'SELECT DISTINCT user.id, user.name, user.surname, user.username, user.activo FROM user_empresa, empresa, user WHERE user_empresa.empresa_id = empresa.id AND user_empresa.user_id = user.id AND empresa.activo=1 AND user.rol_id != 1 AND user_empresa.empresa_id IN ' + '(' + JSON.parse(req.body.empresas_id) + ')',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  //updateUsuariosByEmpresaId
  router.post('/empresas/:id/users/update', function (req, res, next) {
    let delete_error = "";
    let insert_error = "";
    db.query(
      'DELETE FROM user_empresa WHERE empresa_id=?',
      [req.body.empresa_id],
      (error) => {
        if (error) {
          delete_error = error;
        }
      }
    );
    for (let i = 0; i < req.body.usuarios.length; i++) {
      db.query(
        'INSERT INTO user_empresa (empresa_id, user_id) VALUES (?,?)',
        [req.body.empresa_id, req.body.usuarios[i]],
        (error) => {
          if (error) {
            insert_error = error;
          }
        }
      );
    }
    if (delete_error != "" || insert_error != "") {
      res.status(500).json({ status: 'error: ' + delete_error + "; " + insert_error });
    } else {
      res.status(200).json({ status: 'ok' });
    }
  });

  //getNiveles
  router.get('/niveles', function (req, res, next) {
    db.query(
      'SELECT nivel.id, nivel.name, nivel.color, nivel.activo FROM nivel ORDER BY nivel.id',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  //getNivelById
  router.get('/niveles/:id', function (req, res, next) {
    db.query(
      'SELECT nivel.id, nivel.name, nivel.color, nivel.activo FROM nivel WHERE nivel.id=?',
      [req.params.id],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  //createNivel
  router.post('/niveles/new', (req, res, next) => {
    db.query(
      'INSERT INTO nivel (name, color) VALUES (?,?)',
      [req.body.name, req.body.color],
      (error) => {
        if (error) {
          console.error(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json({ status: 'ok' });
        }
      }
    );
  });
  //updateNivel
  router.put('/niveles/update', function (req, res, next) {
    db.query(
      'UPDATE nivel SET name=?, color=?, activo=? WHERE id=?',
      [req.body.name, req.body.color, req.body.activo, req.body.id],
      (error) => {
        if (error) {
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json({ status: 'ok' });
        }
      }
    );
  });

  //getAllNotificaciones
  router.get('/notificaciones', function (req, res, next) {
    db.query(
      'SELECT n.id, n.mensaje, n.creador_id, n.nivel_id, n.fecha_creacion, n.activo, u.name as user_name, u.surname as user_surname, ni.name as nivel_name FROM notificacion n, user u, nivel ni WHERE n.creador_id = u.id AND n.nivel_id = ni.id ORDER BY n.fecha_creacion DESC',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  //getNotificacionesByCreador
  router.get('/notificaciones/creados/:creador_id', function (req, res, next) {
    db.query(
      'SELECT n.id, n.mensaje, n.creador_id, n.nivel_id, n.fecha_creacion, n.activo, u.name as user_name, u.surname as user_surname, ni.name as nivel_name FROM notificacion n, user u, nivel ni WHERE n.creador_id = u.id AND n.nivel_id = ni.id AND n.creador_id = ? ORDER BY n.fecha_creacion DESC',
      [req.params.creador_id],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  //getNotificacionesByEmpresas
  router.post('/notificaciones/empresa', function (req, res, next) {
    db.query(
      'SELECT DISTINCT n.id, n.mensaje, n.creador_id, n.nivel_id, n.fecha_creacion, n.activo, ni.name as nivel_name FROM notificacion_empresa ne, notificacion n, nivel ni WHERE ne.notificacion_id = n.id AND n.nivel_id = ni.id AND n.activo = 1 AND ne.empresa_id IN (' + JSON.parse(req.body.empresas_id) + ')',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  //getNotificacionById
  router.get('/notificaciones/:id', function (req, res, next) {
    db.query(
      'SELECT notificacion.id, notificacion.mensaje, notificacion.creador_id, notificacion.nivel_id, notificacion.activo, user.name as user_name, user.surname as user_surname,notificacion.id_grupo,notificacion.id_familia,notificacion.id_periodo,notificacion.fecha_ejecucion FROM notificacion, user WHERE notificacion.creador_id=user.id AND notificacion.id=?',
      [req.params.id],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  //createNotificacion
  router.post('/notificaciones/new', (req, res, next) => {
    let insert_notificacion_error = "";
    let insert_notificacion_empresa_error = "";
    db.query(
      'INSERT INTO notificacion (mensaje, nivel_id, creador_id, activo,id_periodo,id_grupo,id_familia,fecha_ejecucion) VALUES (?,?,?,?,?,?,?,?)',
      [req.body.mensaje, req.body.nivel_id, req.body.creador_id, req.body.activo, req.body.id_periodo, req.body.id_grupo, req.body.id_familia, req.body.fecha_ejecucion],
      (error, result) => {
        if (error) {
          insert_notificacion_error = error;
        } else {
          for (let i = 0; i < req.body.empresas.length; i++) {
            db.query(
              'INSERT INTO notificacion_empresa (notificacion_id, empresa_id) VALUES (?,?)',
              [result.insertId, req.body.empresas[i]],
              (error) => {
                if (error) {
                  insert_notificacion_empresa_error = error;
                }
              }
            );
          }
        }
      }
    );
    if (insert_notificacion_error != "" || insert_notificacion_empresa_error != "") {
      res.status(500).json({ status: 'error: ' + insert_notificacion_error + "; " + insert_notificacion_empresa_error });
    } else {
      res.status(200).json({ status: 'ok' });
    }
  });
  //updateNotificacion
  router.put('/notificaciones/update', function (req, res, next) {
    let update_notificacion_error = "";
    let delete_notificacion_empresa_error = "";
    let insert_notificacion_empresa_error = "";
    db.query(
      'UPDATE notificacion SET mensaje=?, nivel_id=?, activo=?,id_periodo=?,id_grupo=?,id_familia=?,fecha_ejecucion=? WHERE id=?',
      [req.body.mensaje, req.body.nivel_id, req.body.activo, req.body.id_periodo, req.body.id_grupo, req.body.id_familia, req.body.fecha_ejecucion, req.body.id],
      (error) => {
        if (error) {
          update_notificacion_error = error;
        }
      }
    );

    db.query(
      'DELETE FROM notificacion_empresa WHERE notificacion_id=?',
      [req.body.id],
      (error) => {
        if (error) {
          delete_notificacion_empresa_error = error;
        }
      }
    );
    for (let i = 0; i < req.body.empresas.length; i++) {
      db.query(
        'INSERT INTO notificacion_empresa (notificacion_id, empresa_id) VALUES (?,?)',
        [req.body.id, req.body.empresas[i]],
        (error) => {
          if (error) {
            insert_notificacion_empresa_error = error;
          }
        }
      );
    }
    if (update_notificacion_error != "" || delete_notificacion_empresa_error != "" || insert_notificacion_empresa_error != "") {
      res.status(500).json({ status: 'error: ' + update_notificacion_error + "; " + delete_notificacion_empresa_error + "; " + insert_notificacion_empresa_error });
    } else {
      res.status(200).json({ status: 'ok' });
    }
  });
  //getEmpresasByNotificacionId
  router.get('/notificaciones/:id/empresas', function (req, res, next) {
    db.query(
      'SELECT empresa.id, empresa.name, empresa.activo FROM notificacion_empresa, empresa, notificacion WHERE notificacion_empresa.empresa_id = empresa.id AND notificacion_empresa.notificacion_id = notificacion.id AND empresa.activo=1 AND notificacion_empresa.notificacion_id=?',
      [req.params.id],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  //getallgrupos
  router.get('/grupos', function (req, res, next) {
    db.query(
      'SELECT grupo_principal.id, grupo_principal.nombre FROM grupo_principal ORDER BY grupo_principal.id',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  //familia-grupo
  router.get('/familias/grupo/:id', function (req, res, next) {
    db.query(
      'SELECT familia_alerta.id, familia_alerta.nombre,familia_alerta.id_grupo FROM familia_alerta WHERE familia_alerta.id_grupo=? ORDER BY familia_alerta.id',
      [req.params.id],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  //periocidades
  router.get('/periocidad', function (req, res, next) {
    db.query(
      'SELECT periodo_alerta.id, periodo_alerta.nombre,periodo_alerta.meses,periodo_alerta.es_periodica,periodo_alerta.dias_mensaje_amarillo,periodo_alerta.dias_mensaje_naranja FROM periodo_alerta ORDER BY periodo_alerta.id',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  //ejecuciones
  router.get('/ejecuciones', function (req, res, next) {
    var sql = '';

    db.query('SELECT   DATE_FORMAT(DATE(eje.fecha_ejecucion), '+" '%d/%m/%Y'"+') as fecha, eje.id, eje.id_padre, eje.mensaje,niv.name, niv.color,  gp.nombre as grupo, fa.nombre as familia FROM alertas.ejecucion eje inner join alertas.nivel niv  on eje.nivel_id=niv.id inner join grupo_principal gp on eje.id_grupo=gp.id inner join familia_alerta fa on eje.id_familia=fa.id inner join alertas.periodo_alerta ape on ape.id=eje.id_periodo WHERE estado=0',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });

  router.get('/ejecuciones/:id', function (req, res, next) {
    db.query(
      'SELECT   estado,DATE_FORMAT(DATE(eje.fecha_ejecucion), '+" '%d/%m/%Y'"+') as fecha, eje.id, eje.id_padre, eje.mensaje,niv.name, niv.color,  gp.nombre as grupo, fa.nombre as familia FROM alertas.ejecucion eje inner join alertas.nivel niv  on eje.nivel_id=niv.id inner join grupo_principal gp on eje.id_grupo=gp.id inner join familia_alerta fa on eje.id_familia=fa.id inner join alertas.periodo_alerta ape on ape.id=eje.id_periodo WHERE estado=0 and eje.id=?',
      [req.params.id],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  router.put('/ejecuciones/:id', function (req,res,next){ 
    db.query(
      'UPDATE ejecucion SET estado=? WHERE id=?',
      [req.body.estado, req.body.id],
      (error) => {
        if (error) {
          res.status(500).json({ status: 'error' });
        }
        else {
          res.status(200).json({ status: 'ok' });
        }
      }
    );
  });


  router.get('/alertas/:id', function (req, res, next) {
    db.query(
      // ' select alert.ID, nombre, (select count(*) from ejecucion where id_grupo=alert.id and estado=1) as ejecutadas ,(select count(*) from ejecucion where id_grupo=alert.id and estado=0) as vencidas ,(SELECT  COUNT(*)FROM (SELECT N.id_grupo,N.id_familia,DATEDIFF(DATE_ADD(N.FECHA_EJECUCION, INTERVAL PA.MESES MONTH), NOW()) - dias_mensaje_naranja AS count FROM notificacion N INNER JOIN periodo_alerta PA ON N.id_periodo = PA.id WHERE id_grupo = ?) AS T INNER JOIN familia_alerta alerta ON t.id_familia = alerta.id WHERE t.count = 0 and alerta.id=alert.id )  as porvencerNaranja, ( SELECT  COUNT(*) FROM (SELECT N.id_grupo,N.id_familia,DATEDIFF(DATE_ADD(N.FECHA_EJECUCION, INTERVAL PA.MESES MONTH), NOW()) - dias_mensaje_amarillo AS count FROM notificacion N INNER JOIN periodo_alerta PA ON N.id_periodo = PA.id  WHERE id_grupo = ?) AS T INNER JOIN familia_alerta alerta ON t.id_familia = alerta.id WHERE t.count = 0  and alerta.id=alert.id )  as porvencerAmarillo from familia_alerta  alert where id_grupo=?;',

     'SELECT  alert.ID, nombre, (SELECT COUNT(*) FROM ejecucion WHERE id_grupo = alert.id AND estado = 1) AS ejecutadas, (SELECT COUNT(*) FROM ejecucion WHERE id_grupo = alert.id AND estado = 0) AS vencidas, (select count(*) from (SELECT n.id, n.mensaje,N.id_grupo,N.id_familia, N.FECHA_EJECUCION,pa.meses, DATEDIFF(DATE_ADD(N.FECHA_EJECUCION, INTERVAL PA.MESES MONTH), NOW()) - dias_mensaje_amarillo AS count FROM notificacion N INNER JOIN periodo_alerta PA ON N.id_periodo = PA.id WHERE id_grupo = alert.id) as t where t.count=0) AS porvencerAmarillo  FROM familia_alerta alert WHERE id_grupo = ?',

      [req.params.id],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });


  return router;
}

module.exports = createRouter;