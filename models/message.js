const { DateTime } = require("luxon");
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
        title: {type: String, required: true},
        timestamp: {type: Date, default: Date.now},
        text: {type: String, required: true},
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true}
    }
);

// Virtual for formatted timestamp
MessageSchema
.virtual('timestamp_formatted')
.get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
});

// Export model
module.exports = mongoose.model('Message', MessageSchema);