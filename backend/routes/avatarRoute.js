import express from 'express';
import Profile from '../model/ProfileModel';
import multer from 'multer';
import { isAuth, isAdmin } from '../util';

const router = express.Router();

/////////////////Avatar Image Upload//////////////////
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/avatars/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('image'), isAuth, async (req, res) => {
  const saveAvt = await Merchant.update(
    {
      profileimage : "/"+req.file.path
    },
    {where: { userid : req.user._id }}
  );
   res.send(`/${req.file.path}`);
});

export default router;
