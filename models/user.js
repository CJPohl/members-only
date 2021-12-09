const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        first_name: {type: String, required: true},
        last_name: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        member: {type: Boolean, required: true},
        admin: {type: Boolean, required: true}
    }
);

// Virtual for user's full name
UserSchema
.virtual('name')
.get(function () {
  return this.first_name + ' ' + this.last_name;
});

// Virtual for user's url
UserSchema
.virtual('url')
.get(function() {
    return '/user/' + this._id;
});

// Export model
module.exports = mongoose.model('User', UserSchema);