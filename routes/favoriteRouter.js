const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');
const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate('user')
            .populate('campsites')
            .then(favorites => {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.json(favorites);
            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    req.body.forEach(campsite => {
                        if (!favorite.campsites.includes(campsite._id)) {
                            favorite.campsites.push(campsite._id);
                        }
                    });
                    favorite.save()
                        .then(favorite => {
                            res.setHeader('Content-Type', 'application/json');
                            res.statusCode = 200;
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                } else {
                    Favorite.create({ user: req.user._id })
                    req.body.forEach(campsite => {
                        if (!favorite.campsites.includes(campsite._id)) {
                            favorite.campsites.push(campsite._id);
                        }
                    });
                    favorite.save()
                        .then(favorite => {
                            res.setHeader('Content-Type', 'application/json');
                            res.statusCode = 200;
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                }
            })
            .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.send('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then(response => {
                if (response) {
                    res.setHeader('Content-Type', 'application/json');
                    res.statusCode = 200;
                    res.json(response);
                } else {
                    res.setHeader('Content-Type', 'text/plain');
                    res.send('You do not have any favorites to delete.');
                }
            })
            .catch(err => next(err));
    });

favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.send(`GET operation not supported on /favorites/${req.params.campsiteId}`);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    // Add campsite to favorite.campsites array
                    if (!favorite.campsites.includes(req.params.campsiteId)) {
                        favorite.campsites.push(req.params.campsiteId);
                        favorite.save()
                            .then(favorite => {
                                res.setHeader('Content-Type', 'application/json');
                                res.statusCode = 200;
                                res.json(favorite);
                            })
                            .catch(err => next(err));
                    } else {
                        res.setHeader('Content-Type', 'text/plain');
                        res.send('Campsite already exists in favorites.');
                    }
                } else {
                    Favorite.create({ user: req.user._id, campsites: [req.params.campsiteId] })
                        .then(favorite => {
                            res.setHeader('Content-Type', 'application/json');
                            res.statusCode = 200;
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                }
            })
            .catch(err => next(err));
    })
    .put(cors.cors, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.send('PUT operation not supported on /favorites/:campsiteId');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    const index = favorite.campsites.indexOf(req.params.campsiteId);
                    if (index !== -1) {
                        favorite.campsites.splice(index, 1);
                        favorite.save()
                            .then(favorite => {
                                res.setHeader('Content-Type', 'application/json');
                                res.statusCode = 200;
                                res.json(favorite);
                            })
                            .catch(err => next(err));
                    } else {
                        res.setHeader('Content-Type', 'text/plain');
                        res.send('Campsite not found in favorites.');
                    }
                } else {
                    res.setHeader('Content-Type', 'text/plain');
                    res.send('You do not have any favorites to delete.');
                }
            })
            .catch(err => next(err));
    });

module.exports = favoriteRouter;