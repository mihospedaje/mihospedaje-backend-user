const ldap = require('ldapjs');
const jwt = require('jsonwebtoken');

module.exports = function(app){

    // Creacion del cliente LDAP 
    var client = ldap.createClient({
        url: 'ldap://52.72.5.188:389',
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

    //modificar contraseña
    app.post("/update", (req, res) => {
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
                var change = new ldap.Change({
                    operation: 'replace',
                    modification: {
                        userPassword: password,
                    }
                  });
                client.modify( dn, change, function(err) {
                    if(err){
                        res.status(200).json({success: false,data: 'LDAP: contraseña no modificada'})
                    }else{
                        res.status(200).json({success: true,data: 'LDAP: contraseña modificada'})
                    }   
                });
            }
        });
    });

}

