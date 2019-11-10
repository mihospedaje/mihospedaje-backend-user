'use strict';

const express = require('express');
const User = require('../controllers/v1/user');
const { wrapper } = require('../middleware/error');
const { check, validationResult } = require('express-validator');

module.exports = function (app) {
    app.get('/api/v1/users', (req, res) => {
        User.getusers((err, data) => {
            res.status(200).json(data);
        });
    });
    
    app.get('/api/v1/users/email/:username', (req, res) => {
        console.log("params: ", req.params.username);
            User.getusersByEmail(req.params.username, (err, data) => {
                if (err){
                    throw err
                }else{
                    res.status(200).json({
                        id: data[0].id,
                        name: data[0].name,
                        lastname: data[0].lastname,
                        birthdate: data[0].birthdate,
				        email: data[0].email,
                        password: data[0].password,
                        idrole: data[0].idrole,
                        image: data[0].image,
                    });
                }
            })
        });
    app.get('/api/v1/users/:id', (req, res) => {
        const userData = {
            id: parseInt(req.params.id)};
        User.getuserscode(userData,(err, data) => {
            res.status(200).json({
				id: data[0].id,
                name: data[0].name,
                lastname: data[0].lastname,
                birthdate: data[0].birthdate,
				email: data[0].email,
                password: data[0].password,
				idrole: data[0].idrole,
                image: data[0].image,
                created_at: data[0].created_at,
				updated_at: data[0].updated_at
			});
        });
    });
        
app.post('/api/v1/users',[ 
  check('name').isString(),
  check('lastname').isString(),
  check('email').isEmail(),
  check('password').isLength({ min: 8 }),
  check('idrole').isNumeric()]
  , (req, res) => {
        const userData = {
            id: null,
            name: req.body.name,
            lastname: req.body.lastname,
            birthdate: req.body.birthdate,
            email: req.body.email,
            password: req.body.password,
            idrole:req.body.idrole,
            image: req.body.image,
            created_at: new Date(),
            updated_at: new Date(),
        };
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
        User.insertUser(userData, (err, data) => {
            if (data && data.insertId) {
                res.status(201).json({
                    id: data.insertId,
                    name: userData.name,
					lastname: userData.lastname,
					birthdate: userData.birthdate,
					email: userData.email,
					password: userData.password,
                    idrole:userData.idrole,
                    image: userData.image
                })
            } else {
                res.status(500).json({
                    success: false,
                    data: data.message
                })
            }
        })
    });

    app.put('/api/v1/users/:id',[ 
        check('name').isString(),
        check('lastname').isString(),
        check('email').isEmail(),
        check('password').isLength({ min: 8 }),
        check('idrole').isNumeric()],
         (req, res) => {
        const userData = {
            id: parseInt(req.params.id),
            name: req.body.name,
            lastname: req.body.lastname,
            birthdate: req.body.birthdate,
            email: req.body.email,
            password: req.body.password,
            idrole:req.body.idrole,
            image: req.body.image,
            created_at: new Date(),
            updated_at: new Date()
        };

        User.updateUser(userData, (err, data) => {
            if (data && data.message) {
                res.status(201).json({
                    id: userData.id,
                    name: userData.name,
					lastname: userData.lastname,
					birthdate: userData.birthdate,
					email: userData.email,
					password: userData.password,
                    idrole:userData.idrole,
                    image: userData.image
                })
            } else {
                res.status(500).json({
                    success: false,
                    msg: 'Error'
                })
            }
        })
    });

    app.delete('/api/v1/users/:id', (req, res) => {
        User.deleteUser(parseInt(req.params.id), (err, data) => {
            if (data && data.message == 'deleted' || data.message == 'not exists') {
                res.json({
                    success: true,
                    data
                })
            }else{
                res.status(500).json({
                    message: "error"
                })
            }
        })
    });

}