let mongoose = require('mongoose');
const { DateTime } = require('luxon');

let Schema = mongoose.Schema;

let AuthorSchema = new Schema(
    {
        first_name: {type: String, required: true, maxLength: 100},
        family_name: {type: String, required: true, maxLength: 100},
        date_of_birth: {type: Date},
        date_of_death: {type: Date},
    }
);

// Virtual for author's full name
AuthorSchema.virtual('name').get(function() {
    return (this.first_name + ' ' + this.family_name);
});

// Virtual for author's lifespan
AuthorSchema.virtual('dates_formatted').get(function() {
    let birth_value;
    let death_value;
    if (this.date_of_birth)
        birth_value = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
    else
        birth_value = "?";
    if (this.date_of_death)
        death_value = DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
    else 
        death_value = "?";
    return ({birth: birth_value, death: death_value});
});

// Virtual for author's lifespan
AuthorSchema.virtual('lifespan').get(function() {
    return ((this.date_of_death.getYear() - this.date_of_birth.getYear()).toString());
});

// Virtual for author's URL
AuthorSchema.virtual('url').get(function () {
    return ('/catalog/author/' + this._id);
});

//Export model
module.exports = mongoose.model('Author', AuthorSchema);
