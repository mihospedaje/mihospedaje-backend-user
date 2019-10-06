'use strict';

const express = require('express');
const Role = require('../controllers/v1/role');
const { wrapper } = require('../middleware/error');
const { check, validationResult } = require('express-validator/check');

module.exports = function (app) {
    app.get('/role', (req, res) => {
        Role.getrole((err, data) => {
            res.status(200).json(data);
        });
    });
    app.get('/role/:id', (req, res) => {
        const roleData = {
            id: parseInt(req.params.id)};
        Role.getrolecode(roleData,(err, data) => {
            res.status(200).json(data);
        });
    });
    app.post('/role',[check('namerole').isString()], (req, res) => {
        const roleData = {
            id: null,
            namerole: req.body.namerole,
            created_at: new Date(),
            updated_at: new Date()
        };
        console.log(roleData);
        Role.insertRole(roleData, (err, data) => {
            if (data && data.insertId) {
                res.json({
                    success: true,
                    data: roleData
                })
            } else {
                res.status(500).json({
                    success: false,
                    data: data.message
                })
            }
        })
    });

    app.put('/role/:id',[check('namerole').isString()],(req, res) => {
        const roleData = {
            id: parseInt(req.params.id),
            namerole: req.body.namerole,
            created_at: new Date(),
            updated_at: new Date()
        };

        Role.updateUser(roleData, (err, data) => {
            if (data && data.message) {
                res.json({
                    success: true,
                    data: roleData
                })
            } else {
                res.status(500).json({
                    success: false,
                    msg: 'Error'
                })
            }
        })
    });

    app.delete('/role/:id', (req, res) => {
        Role.deleteUser(parseInt(req.params.id), (err, data) => {
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