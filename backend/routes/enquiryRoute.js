import express from 'express';
import Enquiry from '../models/enquiryModel';
import cors from 'cors';
import { isAdmin } from '../util';
import expressAsyncHandler from 'express-async-handler';
const nodemailer = require('nodemailer');
const router = express.Router();
router.use(cors());

router.post('/', expressAsyncHandler(async (req, res) => {
   
    const enquiry = new Enquiry({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone_number: req.body.phone_number,
        message: req.body.message
    });

    if(enquiry.firstname == '' || enquiry.lastname == '' || enquiry.email == '' || enquiry.firstname == '' || enquiry.message == ''){
        res.status(401).send('All fields are required');
    }
    else{
        const newEnquiry = await enquiry.save();
        if (newEnquiry) {
            //Mail the user
            const transporter = nodemailer.createTransport({
                host: 'mail.nodemongobackend.com',
                port: 465,
                auth: {
                    user: 'info@nodemongobackend.com',
                    pass: ''
                }
            });

            const mailOptions = {
                from: newEnquiry.email,
                to: 'info@nodemongobackend.com',
                subject: 'NEW ENQUIRY FORM nodemongobackend',
                text: newEnquiry.message
            };

            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                }else{
                    res.status(200).json({ msg: "Mesage delivered" });
                }
            });
            //////////////////////////////////////////////////////////////////////
            res.status(200).json({ msg: "Message delivered" });//remove this line in production
        } else {
            res.status(500).json({ msg: 'Error creating enquiry.' });
        }
    }                        
}));

router.get('/',  isAdmin, expressAsyncHandler(async (req, res) => {
    const enquiries = await Enquiry.find({ }); 
    if (enquiries) {
        res.send(enquiries);
    } else {
        res.status(404).send({ message: 'Item Not Found' });
    }
}));

//Delete Enquiry
router.delete('/:item_id/delete', isAdmin, expressAsyncHandler(async (req, res) => {
    const deleteEnquiry = await Enquiry.findById(req.params._id);

    if (deleteEnquiry) {
        await deleteEnquiry.remove();
        res.send({ message: 'Enquiry deleted' });
    } else {
        res.send( 'Error deleting Enquiry.' );
    }
}));
export default router;