let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Genre = new Schema(
    {
        name: {type: String, required: true, minLength: 3, maxLength: 100},
    }
);

// Virtual for bookInstance's URL
Genre.virtual('url').get(function() {
    return ('/catalog/genre/' + this._id);
});

// Export model
module.exports = mongoose.model('Genre', Genre);
