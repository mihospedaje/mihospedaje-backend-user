const mysql = require('mysql');


/*connection = mysql.createConnection({
    host            : process.env.DATABASE_HOST,
    port            : process.env.MYSQL_PORT,
    user            : process.env.MYSQL_USER,
    password        : process.env.MYSQL_PASSWORD,
    database        : process.env.MYSQL_DATABASE
});*/

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'user'
  });



let UserModel = {};
UserModel.getusers = (callback) => {
    if (connection) {
        connection.query(
            'SELECT * FROM users ORDER BY id',
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

UserModel.getuserscode = (userData,callback) => {
    if (connection) {
        connection.query(
            'SELECT * FROM users where id=?',userData.id,
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
UserModel.getusersByEmail = (username, callback) => {
    if (connection){
        connection.query(
            'SELECT * FROM users where email=?', username,
            (err, row) => {
                if (err){
                    console.log(err);
                } else {
                    callback(null, row);
                }
            }
        )
    }
}
UserModel.insertUser = (userData, callback) => {
    if (connection) {
        
        connection.query('SELECT * from users where email=?',userData.email, function (error, results, fields) {
            console.log(error); // null
            console.log(results.length); // 1
          
        if(results.length==1){callback(null, {
            'message': "Error email existente"
        })}
    else{
        connection.query(
            'INSERT INTO users SET ?', userData,
            (err, result) => {
                if (err) {
                    throw err
                } else {
                    console.log(result.insertId);
                    callback(null, {
                        'insertId': result.insertId
                    })
                }
            }
        )
    }
})}}

UserModel.updateUser = (userData, callback) => {
    if (connection) {
        const sql = `
        UPDATE users SET 
		name = ${connection.escape(userData.name)},
		lastname= ${connection.escape(userData.lastname)},
		birthdate = ${connection.escape(userData.birthdate)},
		email= ${connection.escape(userData.email)},
		password = ${connection.escape(userData.password)},
        idrole=${connection.escape(userData.idrole)}
        WHERE id = ${connection.escape(userData.id)}`;

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

UserModel.deleteUser = (id, callback) => {
    if (connection) {
        let sql = `
        SELECT * FROM users WHERE id = ${connection.escape(id)}`;
        connection.query(sql, (err, row) => {
            if (row) {
                let sql = `DELETE FROM users WHERE id = ${id}`;
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

module.exports = UserModel; 