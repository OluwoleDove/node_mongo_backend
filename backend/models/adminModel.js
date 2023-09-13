// adminModel.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    adminLevel: { type: String, required: true }, // E.g., "Super Admin," "Manager," "Operator"
    permissions: [{ type: String }], // E.g., "CreateUser", "ManageOrders", "ViewReports"
    // Add other fields specific to admins
}, {
    timestamps: true,
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
