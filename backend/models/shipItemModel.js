import mongoose from 'mongoose';
const _Schema_ = mongoose.Schema;

const recipientSchema = new _Schema_(
  {
    first_name: { type: String },
    last_name: { type: String },
    phone_number: { type: String },
    email: { type: String },
    address: { type: String },
    country: { type: String },
    zip_code: { type: String }
  }
);

const paymentSchema = new _Schema_(
  {
    paymentMethod: { type: String },
    payerID: { type: String },
    orderID: { type: String },
    paymentID: { type: String }
  }
);

const shipItemSchema = new _Schema_({
    sender_id: {
      type: _Schema_.Types.ObjectId,
      required: true,
      ref: 'user'
    },
    item_id: { type: String, required: true },
    recipient: recipientSchema,
    payment: paymentSchema,
    delivery_type: { type: String, enum: ['Standard', 'Express'], default: 'Standard'},
    shipping_cost: { type: String, default: 0 },
    tracking_id: { type: String },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date }
}, {
    timestamps: true
});

const shipItemModel = mongoose.model('ShipItem', shipItemSchema);

export default shipItemModel;