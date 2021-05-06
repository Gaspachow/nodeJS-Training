const Genre = require('../models/genre');
const Book = require('../models/book');
const async = require('async');
const { body,validationResult } = require("express-validator");
const dotenv = require('dotenv').config();

// Display list of all Genre.
exports.genre_list = function(req, res, next) {
    Genre.find()
        .sort([['name', 'ascending']])
        .exec((err, list_genres) => {
            if (err)
                return (next(err));
            res.render('genre_list', {title: 'Genre List', genre_list: list_genres});
        });
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
    async.parallel({
        genre: (callback) => {
            Genre.findById(req.params.id)
                .exec(callback);
        },
        genre_books: (callback) => {
            Book.find({ 'genre' : req.params.id })
                .populate('author')
                .exec(callback);
        },
    }, function (err, results) {
        if (err)
            return (next(err));
        if (results.genre == null) {
            let err = new Error('Genre not found');
            err.status = 404;
            return (next(err));
        }
        res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books });
    });
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res, next) {
    res.render('genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST.
exports.genre_create_post = [
    body('name', 'Genre name requires at least 3 characters').trim().isLength({ min: 3 }).escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        // Making sure first letter of each word is capitalized
        req.body.name = req.body.name.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
        var genre = new Genre({ name: req.body.name });
        if (!errors.isEmpty()){
            res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
            return;
        } else {
            Genre.findOne( { 'name': req.body.name } )
                .exec((err, found_genre) => {
                    if (err)
                        return (next(err));
                    else if (found_genre)
                        res.redirect(found_genre.url);
                    else if (!found_genre) {
                        genre.save(err => {
                            if (err)
                                return (next(err));
                            res.redirect(genre.url);
                        });
                    }
                });
        }
    }
];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res, next) {
    async.parallel({
        genre: (cb) => {
            Genre.findById(req.params.id).exec(cb);
        },
        genres_books: (cb) => {
            Book.find({ 'genre': req.params.id }).exec(cb);
        },
    }, (err, results) => {
        if (err)
            return (next(err));
        if (results.genre == null)
            res.redirect('/catalog/genres');
        else
            res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genres_books });
    });
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res, next) {
    async.parallel({
        genre: function(cb) {
          Genre.findById(req.body.genreid).exec(cb);
        },
        genres_books: function(cb) {
          Book.find({ 'genre': req.body.genreid }).exec(cb);
        },
    }, (err, results) => {
        if (err)
            return (next(err));
        let correct_pwd = (req.body.password == process.env.DEL_PWD) ? true : false;
        if (results.genres_books.length > 0 || !correct_pwd) {
            res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genres_books, correct_pwd: correct_pwd });
            return;
        } else {
            Genre.findByIdAndRemove(req.body.genreid, function deleteGenre(err) {
                if (err)
                    return (next(err));
                res.redirect('/catalog/genres');
            })
        }
    });
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};