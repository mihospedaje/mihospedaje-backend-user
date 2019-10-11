const mysql = require('mysql');


connection = mysql.createConnection({
    host            : process.env.DATABASE_HOST,
    port            : process.env.MYSQL_PORT,
    user            : process.env.MYSQL_USER,
    password        : process.env.MYSQL_PASSWORD,
    database        : process.env.MYSQL_DATABASE
});

let RoleModel = {};
RoleModel.getrole = (callback) => {
    if (connection) {
        connection.query(
            'SELECT * FROM role ORDER BY id',
            (err, rows) => {
                if (err) {
                    throw err
                } else {
                    callback(null, rows)
                }
            }
        )
    }
}
RoleModel.getrolecode = (roleData,callback) => {
    if (connection) {
        connection.query(
            'SELECT * FROM role where id=?',roleData.id,
            (err, rows) => {
                if (err) {
                    throw err
                } else {
                    callback(null, rows)
                }
            }
        )
    }
}

RoleModel.insertRole = (roleData, callback) => {
    if (connection) {
        connection.query('SELECT * from role where namerole=?',roleData.namerole, function (error, results, fields) {
            console.log(error); // null
            console.log(results.length); // 1
          
        if(results.length==1){callback(null, {
            'message': "Error Rol existente"
        })}
    else{
        connection.query(
            'INSERT INTO role SET ?', roleData,
            (err, result) => {
                if (err) {
                    throw err
                } else {
                    callback(null, {
                        'insertId': result.insertId
                    })
                }
            }
        )
    }
})}}

RoleModel.updateRole = (roleData, callback) => {
    if (connection) {
        const sql = `
        UPDATE role SET 
        namerole = ${connection.escape(roleData.namerole)}
         WHERE id = ${connection.escape(roleData.id)}`;

        connection.query(sql, (err, result) => {
            if (err) {
                throw err
            } else {
                callback(null, {
                    "message": "success"
                })
            }
        })
    };
}

RoleModel.deleteRole = (id, callback) => {
    if (connection) {
        let sql = `
        SELECT * FROM role WHERE id = ${connection.escape(id)}`;
        connection.query(sql, (err, row) => {
            if (row) {
                let sql = `DELETE FROM role WHERE id = ${id}`;
                connection.query(sql, (err, result) => {
                    if (err) {
                        throw err
                    } else {
                        callback(null, {
                            "message": "deleted"
                        })
                    }
                })
            } else {
                callback(null, {
                    "message": "not exists"
                })
            }
        })
    }
}

module.exports = RoleModel; 