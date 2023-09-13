import mongoose from 'mongoose';
const _Schema_ = mongoose.Schema;

const EnquirySchema = new _Schema_({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true},
    phone_number: { type: String, required: true },
    message: { type: String, required: true }
},
{
    timestamps: true,
}
);

const enquiryModel = mongoose.model('Enquiry', EnquirySchema);

export default enquiryModel;