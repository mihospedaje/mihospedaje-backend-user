const ldap = require('ldapjs');
const jwt = require('jsonwebtoken');

module.exports = function(app){

    // Creacion del cliente LDAP 
    var client = ldap.createClient({
        url: 'ldap://18.190.94.157:389',
        version: 3
    });

    // verificar un token
    app.post("/validate", (req, res) => {
        
        jwt.verify(req.body.token, 'secret_key', function(err, user) {
            
            if (err) {
                res.status(200).json({
                    message: 'Token Invalido'
                })
            } else {
                res.status(200).json({
                    message: 'Token Valido'
                })
            }
        })
    });
    // Autenticar un usuario
    app.post("/auth", (req, res) => {
        
        const email = 'cn='+req.body.email+',ou=mihospedaje,dc=arqsoft,dc=unal,dc=edu,dc=co';
        const password = req.body.password;
        
        // generar token
        const body = JSON.stringify(req.body)
        //console.log(body)
        // el Token dura una hora
        const token = jwt.sign({body},'secret_key',{
            expiresIn: 60 * 60 * 1
        });
        
        var opts = { filter: '(objectclass=user)',scope: 'sub',attributes: ['objectGUID']};
               
        client.bind(email, password , function (err) {        
            if(err){
                res.status(200).json({
                    success: false,
                    data: 'Usuario no autenticado',
                    token: ""
                })
        
            } else {
                res.status(200).json({
                    success: true,
                    data: 'Usuario autenticado',
                    token: token
                })
        
            }
            
        });
        
    });

    // Autenticar un administrador
    app.post("/authAdmin", (req, res) => {
        
        const email = 'cn='+req.body.email+',ou=administrador,dc=arqsoft,dc=unal,dc=edu,dc=co';
        const password = req.body.password;
        const body = JSON.stringify(req.body)
        const token = jwt.sign({body},'secret_key');
        var opts = { filter: '(objectclass=user)',scope: 'sub',attributes: ['objectGUID']};
        
        client.bind(email, password , function (err) {        
            if(err){
                res.status(200).json({
                    success: false,
                    data: 'Admin no autenticado',
                    token: ""
                })
            } else {
                res.status(200).json({
                    success: true,
                    data: 'Admin autenticado',
                    token: token
                })
            }
        });
    });

    // Crear un nuevo usuario
    app.post("/add", (req, res) => {
        const email = 'cn=admin,dc=arqsoft,dc=unal,dc=edu,dc=co';
        const password = 'admin'
        
        client.bind(email, password , function (err) {
            if(err){
                res.status(200).json({
                    success: false,
                    data: 'LDAP: sin acceso'
                })

            } else {

                const email = req.body.email;
                const password = req.body.password;
                const dn = 'cn='+req.body.email+',ou=mihospedaje,dc=arqsoft,dc=unal,dc=edu,dc=co';
                uid = Math.random(100000);
                var entry = {
                    cn: email,
                    objectclass: ["top", "inetorgperson"],
                    sn: email,
                    mail: email,
                    userPassword: password,
                    uid: uid
                };
                client.add( dn, entry, function(err) {
                    if(err){
                        res.status(200).json({success: false,data: 'LDAP: usuario no creado'})
                    }else{
                        res.status(200).json({success: true,data: 'LDAP: usuario creado'})
                    }   
                });
            }
        });
    });
    
    // Crear un administrador nuevo
    app.post("/addAdmin", (req, res) => {
        const email = 'cn=admin,dc=arqsoft,dc=unal,dc=edu,dc=co';
        const password = 'admin'
        
        client.bind(email, password , function (err) {
            if(err){
                res.status(200).json({
                    success: false,
                    data: 'LDAP: sin acceso'
                })
            } else {
                const email = req.body.email;
                const password = req.body.passw;
                const dn = 'cn='+req.body.email+',ou=administrador,dc=arqsoft,dc=unal,dc=edu,dc=co';
                uid = Math.random(100000);
                var entry = {
                    cn: email,
                    objectclass: ["top", "inetorgperson"],
                    sn: email,
                    mail: email,
                    userPassword: password,
                    uid: uid
                };
                client.add( dn, entry, function(err) {
                    if(err){
                        res.status(200).json({success: false,data: 'LDAP: admin no creado'})
                    }else{
                        res.status(200).json({success: true,data: 'LDAP: admin creado'})
                    }   
                });
            }
        });
    });
}