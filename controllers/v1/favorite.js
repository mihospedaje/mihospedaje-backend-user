const mysql = require('mysql');


connection = mysql.createConnection({
    host            : process.env.DATABASE_HOST,
    port            : process.env.MYSQL_PORT,
    user            : process.env.MYSQL_USER,
    password        : process.env.MYSQL_PASSWORD,
    database        : process.env.MYSQL_DATABASE
});

/*var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'user'
  });
*/


let FavoriteModel = {};
FavoriteModel.getfavorite = (callback) => {
    if (connection) {
        connection.query(
            'SELECT * FROM favorite ORDER BY id',
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

FavoriteModel.getfavoriteuser= (user_id,callback) => {
    if (connection) {
        connection.query(
            'SELECT * FROM favorite where user_id=?',user_id,
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

FavoriteModel.getfavoritecode = (favoriteData,callback) => {
    if (connection) {
        connection.query(
            'SELECT * FROM favorite where id=?',favoriteData.id,
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

FavoriteModel.insertFavorite = (favoriteData, callback) => {
        connection.query(
            'INSERT INTO favorite SET ?', favoriteData,
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


FavoriteModel.deleteFavorite = (id, callback) => {
    if (connection) {
        let sql = `
        SELECT * FROM favorite WHERE id = ${connection.escape(id)}`;
        connection.query(sql, (err, row) => {
            if (row) {
                let sql = `DELETE FROM favorite WHERE id = ${id}`;
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

module.exports = FavoriteModel; 