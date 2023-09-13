import express from 'express';
import multer from 'multer';
import expressAsyncHandler from 'express-async-handler';
import { isAuth } from '../util';
import fs from 'fs';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

const storage = multer.diskStorage({
  destination(req, file, cb) { 
    const user = req.user._id;
    const _path = 'uploads/'+user;
    fs.mkdirSync(_path, { recursive: true });
    cb(null, _path );
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`); //cb call back: null and name of file
  },
});

const upload = multer({ storage }); //upload middleware

const router = express.Router();

router.post('/', isAuth, upload.single('image'), expressAsyncHandler(async (req, res) => {
  res.send(`/${req.file.path}`);
}));

/*aws.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
});
const s3 = new aws.s3();
const storageS3 = multerS3({
  s3,
  bucket: 'agroexpress-bucket',
  acl: 'piblic-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key(req, file, cb){
    cb(null, file.originalname);
  },
});
const uploadS3 = multer({ storage: storageS3 });
router.post('/s3', uploadS3.single('image'), (req, res) => {
  res.send(req.file.location);
})*/

export default router;