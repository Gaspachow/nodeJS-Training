var BookInstance = require('../models/bookinstance');
const async = require('async');
const dotenv = require('dotenv').config();

// Display list of all BookInstances.
exports.bookinstance_list = function(req, res, next) {
    BookInstance.find()
        .populate('book')
        .exec((err, list_bookinstances) => {
            if (err)
                return (next(err));
            res.render('bookinstance_list', {title: 'Book Instance List', bookinstance_list: list_bookinstances });
        });
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res, next) {
    BookInstance.findById(req.params.id)
                .populate('book')
                .exec(function (err, bookinstance) {
                    if (err)
                        return (next(err));
                    if (bookinstance == null) {
                        let err = new Error;
                        err.status = 404;
                        return (next(err));
                    }
                    res.render('bookinstance_detail', { title: 'Copy: ' + bookinstance.book.title, bookinstance: bookinstance });
                })
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: BookInstance create GET');
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: BookInstance create POST');
};

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res, next) {
    async.parallel({
        book_instance: (cb) => {
            BookInstance.findById(req.params.id).populate('book').exec(cb);
        },
    }, (err, results) => {
        if (err)
            return (next(err));
        if (results.book_instance == null)
            res.redirect('/catalog/bookinstances');
        else
            res.render('bookinstance_delete', { title: 'Delete Book Copy', book_instance: results.book_instance });
    });
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res, next) {
    async.parallel({
        book_instance: (cb) => {
            BookInstance.findById(req.body.bookinstanceid).populate('book').exec(cb);
        },
    }, (err, results) => {
        if (err)
            return (next(err));
        let correct_pwd = (req.body.password == process.env.DEL_PWD) ? true : false;
        if (!correct_pwd) {
            res.render('bookinstance_delete', { title: 'Delete Book Copy', book_instance: results.book_instance, correct_pwd: correct_pwd });
            return;
        } else {
            BookInstance.findByIdAndRemove(req.body.bookinstanceid, function deleteBookInstance(err) {
                if (err)
                    return (next(err));
                res.redirect('/catalog/bookinstances');
            })
        }
    });
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};