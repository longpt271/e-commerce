const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    products: [
      {
        product: { type: Object, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    user: {
      userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    totalMoney: {
      type: Number,
      required: true,
    },
    totalQuantity: {
      type: Number,
      required: true,
    },
    delivery: {
      type: String,
      default: 'waiting',
    },
    status: {
      type: String,
      default: 'waiting',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
