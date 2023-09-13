import mongoose from 'mongoose';
const _Schema_ = mongoose.Schema;


const itemSchema = new _Schema_({
    user_id: {
        type: _Schema_.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    item: { type: String, required: true },
    img_path: { type: String, required: true },
    weight: { type: String, required: true },
    isBattery: { type: Boolean, required: true, default: false },
    category: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Staging', 'Delivered', 'Canceled', 'Out-for-delivery'], default: 'Staging'}
}, {
    timestamps: true
});

const itemModel = mongoose.model('Item', itemSchema);

export default itemModel;
