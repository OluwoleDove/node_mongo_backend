// adminRoute.js
import express from 'express';
import Admin from '../models/adminModel';
import { isAuth, isAdmin } from '../util';

const router = express.Router();

// Create a new admin (requires admin privileges)
router.post('/create', isAuth, isAdmin, (req, res) => {
    const { adminLevel, permissions } = req.body;

    const admin = new Admin({
        adminLevel,
        permissions,
    });

    admin.save()
        .then((newAdmin) => res.status(201).send(newAdmin))
        .catch((err) => res.status(500).send({ msg: err.message }));
});

// Get all admins (requires admin privileges)
router.get('/', isAuth, isAdmin, (req, res) => {
    Admin.find({})
        .then((admins) => res.send(admins))
        .catch((err) => res.status(500).send({ msg: err.message }));
});

// Update admin permissions (requires admin privileges)
router.put('/:adminId/permissions', isAuth, isAdmin, (req, res) => {
    const { permissions } = req.body;

    Admin.findByIdAndUpdate(req.params.adminId, { permissions }, { new: true })
        .then((updatedAdmin) => {
            if (!updatedAdmin) {
                return res.status(404).send({ msg: 'Admin not found' });
            }
            res.send(updatedAdmin);
        })
        .catch((err) => res.status(500).send({ msg: err.message }));
});

// Delete an admin (requires admin privileges)
router.delete('/:adminId', isAuth, isAdmin, (req, res) => {
    Admin.findByIdAndRemove(req.params.adminId)
        .then((removedAdmin) => {
            if (!removedAdmin) {
                return res.status(404).send({ msg: 'Admin not found' });
            }
            res.send({ msg: 'Admin deleted successfully' });
        })
        .catch((err) => res.status(500).send({ msg: err.message }));
});

export default router;
