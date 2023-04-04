const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema(
  {
    messages: [
      {
        content: {
          type: String,
          required: true,
        },
        sender: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        isChatStaff: {
          type: Boolean,
          default: false,
        },
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);
