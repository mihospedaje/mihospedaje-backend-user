'use strict';

const express = require('express');
const Favorite = require('../controllers/v1/favorite');
const { wrapper } = require('../middleware/error');
const { check, validationResult } = require('express-validator/check');

module.exports = function (app) {
    app.get('/api/v1/favorite', (req, res) => {
        Favorite.getfavorite((err, data) => {
            res.status(200).json(data);
        });
    });
    app.get('/api/v1/favorite/:id', (req, res) => {
        const favoriteData = {
            id: parseInt(req.params.id)};
            
        Favorite.getfavoritecode(favoriteData,(err, data) => {
            if(err){
                throw err
            }else{
            res.status(200).json({
                id: data[0].id,
                user_id: data[0].user_id,
                lodging_id: data[0].lodging_id
            });}
        });
    });
    app.get('/api/v1/favorite/user/:user_id', (req, res) => {
        console.log("params: ", req.params.user_id);
        Favorite.getfavoriteuser(req.params.user_id,(err, data) => {
            if(err){
                throw err
            }else{
                res.status(200).json(data);
            }
            
        });
    });
    app.post('/api/v1/favorite',[check('user_id').isInt(),check('lodging_id').isInt()], (req, res) => {
        const favoriteData = {
            id: null,
            user_id: req.body.user_id,
            lodging_id: req.body.lodging_id,
            created_at: new Date(),
            updated_at: new Date()
        };
        console.log(favoriteData);
        Favorite.insertFavorite(favoriteData, (err, data) => {
            if (data && data.insertId) {
                res.status(201).json({
                    id: data.insertId,
                    user_id: favoriteData.user_id,
                    lodging_id: favoriteData.lodging_id,
				
                })
            } else {
                res.status(500).json({
                    success: false,
                    data: data.message
                })
            }
        })
    });

    app.delete('/api/v1/favorite/:id', (req, res) => {
        Favorite.deleteFavorite(parseInt(req.params.id), (err, data) => {
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