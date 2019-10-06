'use strict';

const express = require('express');
const User = require('../controllers/v1/user');
const { wrapper } = require('../middleware/error');
const { check, validationResult } = require('express-validator');

module.exports = function (app) {
    app.get('/users', (req, res) => {
        User.getusers((err, data) => {
            res.status(200).json(data);
        });
    });
    app.get('/users/:id', (req, res) => {
        const userData = {
            id: parseInt(req.params.id)};
        User.getuserscode(userData,(err, data) => {
            res.status(200).json(data);
        });
    });
    app.post('/users',[ 
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
            created_at: new Date(),
            updated_at: new Date(),
        };
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
        User.insertUser(userData, (err, data) => {
            if (data && data.insertId) {
                res.json({
                    success: true,
                    data: userData
                })
            } else {
                res.status(500).json({
                    success: false,
                    data: data.message
                })
            }
        })
    });

    app.put('/users/:id',[ 
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
            created_at: new Date(),
            updated_at: new Date()
        };

        User.updateUser(userData, (err, data) => {
            if (data && data.message) {
                res.json({
                    success: true,
                    data: userData
                })
            } else {
                res.status(500).json({
                    success: false,
                    msg: 'Error'
                })
            }
        })
    });

    app.delete('/users/:id', (req, res) => {
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