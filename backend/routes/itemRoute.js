import express from 'express';
import Item from '../models/itemModel'
import cors from 'cors';
import { isAuth, isAdmin } from '../util';
import expressAsyncHandler from 'express-async-handler';
const router = express.Router();
router.use(cors());

/*Starting Admin Business Logic*/
router.get('/', isAdmin, expressAsyncHandler(async (req, res) => {
    const item = await Item.find({ _id: req.params.id }); 
    if (item) {
        res.send(item);
    } else {
        res.status(404).send({ message: 'Item Not Found' });
    }
}));

//Get a particular item
router.get('/:id/useritem', isAuth, expressAsyncHandler(async (req, res) => {
    const item = await Item.findOne({ _id: req.params.id }); 
    if (item) {
        res.send(item);
    } else {
        res.status(404).send({ message: 'Item Not Found' });
    }
}));

//Get all items for user
router.get('/:userID/useritems', isAuth, expressAsyncHandler(async (req, res) => {
    const items = await Item.find({ user_id: req.params.userID }); 
    if (items) {
        res.send(items);
    } else {
        res.status(404).send({ message: 'No Items found for this user.' });
    }
}));

//Create Item
router.post('/:_id/create', isAuth, expressAsyncHandler(async (req, res) => {
    const item = new Item({
        user_id: req.params._id,
        item: req.body.item,
        img_path: req.body.image,
        weight: req.body.weight,
        isBattery: req.body.isBattery,
        category: req.body.category,
        description: req.body.description
    });
    
    const newItem = await item.save();
     
    if (newItem) {
        res.status(200).json({ msg: "New Item created successfully.", data: newItem });
    } 
    else {
        res.status(500).json({ msg: 'Error creating item.' });
    }                   
}));

//Edit Item
router.put('/:item_id/edit', isAuth, expressAsyncHandler(async (req, res) => {
    const item = await Item.findOne({ _id: req.params.item_id });
    
    if (item) {
        item.user_id = req.body.user_id || item.user_id;
        item.item = req.body.item || item.item;
        item.img_path = req.body.image || item.image;
        item.weight = req.body.weight || item.weight;
        item.isBattery = req.body.isBattery || item.isBattery;
        item.category = req.body.category || item.category;
        item.description = req.body.description || item.description;
        item.status = req.body.status || item.status;

        const editedItem = await item.save();

        if (editedItem) {
            res.status(200).send({ message: 'Item Updated', data: editedItem });
        }    
    }
    else{
        res.status(500).send({ message: 'Error editng item.' });
    }
}));

//Delete Item
router.delete('/:item_id/delete', isAuth, expressAsyncHandler(async (req, res) => {
    const deleteItem = await Item.findById(req.params.item_id);

    if (deleteItem) {
        await deleteItem.remove();
        res.send({ message: 'Item deleted' });
    } else {
        res.send( 'Error deleting item.' );
    }
}));

export default router;