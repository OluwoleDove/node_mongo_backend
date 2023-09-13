import mongoose from 'mongoose';
const _Schema_ = mongoose.Schema;

const profileSchema = new _Schema_({
    user_id: {
        type: _Schema_.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    zipcode: {type: String, required: true },
    
  });

const tokenModel = mongoose.model('Usercode', tokenSchema);

export default tokenModel;