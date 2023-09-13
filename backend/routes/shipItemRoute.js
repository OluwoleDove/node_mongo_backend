import express from 'express';
import ShipItem from '../models/shipItemModel';
import Item from '../models/itemModel';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../util';

const router = express.Router();

function gen_rand_str(length) {
  var result = '';
  var _chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var char_len = _chars.length;
  for ( var i = 0; i < length; i++ ) {
    result += _chars.charAt(Math.floor(Math.random() * char_len));
 }
 return result;
}


router.get("/:itemID", isAdmin, expressAsyncHandler(async (req, res) => {
  const order = await ShipItem.findOne({ _id: req.params.id });
  if (order) {
    res.send(order);
  } else {
    res.status(404).send("Order Not Found.")
  }
}));


router.post("/", isAuth, expressAsyncHandler(async (req, res) => {
  
  const newShipment = new ShipItem({
    sender_id: req.user._id,
    item_id: req.body.itemid,
    delivery_type: req.body.deliverytype,
    shipping_cost: req.body.shippingcost,
    recipient: {},
    payment: {}
  });
  console.log(newShipment);

  const newShipmentCreated = await newShipment.save();

  if (newShipmentCreated) {
    res.status(201).send({ message: "New Shipment Created", data: newShipmentCreated });
  }else {
    res.status(404).send({ message: 'Error Creating Shipment.' })
  }
  
}));

//Query with item id
router.put("/:itemid/recipient", isAuth, expressAsyncHandler(async (req, res) => {
  const shipitem = await ShipItem.findOne({ item_id: req.params.itemid });

  if (shipitem) {
    shipitem.recipient = {
      first_name: req.body.recipientfirstname,
      last_name: req.body.recipientlastname,
      phone_number: req.body.recipientphone,
      email: req.body.recipientemail,
      address: req.body.recipientaddress,
      country: req.body.recipientcountry,
      zip_code: req.body.recipientzip
    }

    const updatedShipment = await shipitem.save();
    res.send({ message: 'Recipient Saved.', order: updatedShipment });
  } else {
    res.status(404).send({ message: 'Shipment not found.' })
  }
}));

router.put("/:itemid/pay", isAuth, expressAsyncHandler(async (req, res) => {
  //Generate tracking id
  let tracking_code = Date.now() + "-" + gen_rand_str(2);
  let payment_status = isNaN(parseFloat(req.body.shippingcost)) ? false: true
  const shipitem = await ShipItem.findOne({ item_id: req.params.itemid });

  if (shipitem) {
    shipitem.payment = {
      paymentMethod: req.body.paymentmethod,
      payerID: req.body.payerID,
      orderID: req.body.orderID,
      paymentID: req.body.paymentID
    },
    shipitem.shipping_cost = req.body.shippingcost
    shipitem.isPaid = payment_status;
    shipitem.paidAt = Date.now();
    shipitem.tracking_id = tracking_code;

    const updatedShipment = await shipitem.save();
    res.send({ message: 'Shipment Paid.', order: updatedShipment });
  } else {
    res.status(404).send({ message: 'Shipment not found.' })
  }
}));

//Track shipment
router.get("/:trackID/trackshipment", isAuth, expressAsyncHandler(async (req, res) => {
  const checkuser = await ShipItem.findOne({ sender_id: req.user._id });
  //User exists
  if (checkuser){
    const tracked_item = await ShipItem.findOne({ tracking_id: req.params.trackID });
    
    tracked_item ? res.send(tracked_item) : res.status(404).send({ message: 'Shipment not found, Please check that tracking is correct.' });
  }else{
    res.status(404).send({ message: "No such user" })
  }
  
}));

/*Starting Admin Business Logic*/
//Delete Shipment
router.delete('/:shipment_id/delete', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const deleteShipment = await ShipItem.findOne({ _id: req.params.shipment_id });

  if (deleteShipment) {
      await deleteShipment.remove();
      res.send({ message: 'Shipment deleted' });
  } else {
      res.send( 'Error deleting Shipment.' );
  }

}));


router.get("/", isAdmin, async (req, res) => {
  const shipItems = await ShipItem.find({ }).populate('user');
  res.send(shipItems);
});

export default router;