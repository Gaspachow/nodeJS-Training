var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');
const { body, validationResult } = require('express-validator');

const async = require('async');

exports.index = function(req, res) {
    async.parallel({
        book_count: (callback) => {
            Book.countDocuments({}, callback);
        },
        book_instance_count: (callback) => {
            BookInstance.countDocuments({}, callback);
        },
        book_instance_available_count: (callback) => {
            BookInstance.countDocuments({status: 'Available'}, callback);
        },
        author_count: (callback) => {
            Author.countDocuments({}, callback);
        },
        genre_count: (callback) => {
            Genre.countDocuments({}, callback);
        },
    }, (err, results) => {
        res.render('index', {title: 'Express Library Index', error: err, data: results });
    });
};

// Display list of all books.
exports.book_list = function(req, res) {
    Book.find({}, 'title author')
        .populate('author')
        .exec((err, list_books) => {
            if (err)
                return (next(err));
            res.render('book_list', {title: 'Book List', book_list: list_books });
        });
};

// Display detail page for a specific book.
exports.book_detail = function(req, res) {
    async.parallel({
        book: (callback) => {
            Book.findById(req.params.id)
                .populate('author')
                .populate('genre')
                .exec(callback);
        },
        book_instance: (callback) => {
            BookInstance.find({'book': req.params.id})
                        .exec(callback);
        },
    }, function(err, results) {
        if (err)
            return (next(err));
        if (results.book == null) {
            let err = new Error;
            err.status = 404;
            return (next(err));
        }
        res.render('book_detail', { title: results.book.title, book: results.book, book_instances: results.book_instance });
    })
};

// Display book create form on GET.
exports.book_create_get = function(req, res) {
    async.parallel({
        authors: (callback) => {
            Author.find(callback);
        },
        genres: (callback) => {
            Genre.find(callback);
        },
    }, (err, results) => {
        if (err)
            return (next(err));
        res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
    });
};

// Handle book create on POST.
exports.book_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre ==='undefined')
            req.body.genre = [];
            else
            req.body.genre = new Array(req.body.genre);
        }
        next();
    },

    // Validate and sanitise fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
    body('author', 'Author must not be empty.').trim().isLength({ min: 1 }),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }),
    body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }),
    body('genre.*'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var book = new Book(
          { title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                authors: function(callback) {
                    Author.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('book_form', { title: 'Create Book',authors:results.authors, genres:results.genres, book: book, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            book.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
                   res.redirect(book.url);
                });
        }
    }
];

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};