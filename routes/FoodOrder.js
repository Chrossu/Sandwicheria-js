const express = require('express');
const router = express.Router();

const FoodOrder = require('../models/FoodOrder');
const auth = require('../middleware/auth');

// @route 	 GET api/food-order
// @desc 	 Get all orders
// @access 	 Private
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.userType === 0 ) {
            const foodOrder = await FoodOrder.find({ user: req.user.id }).sort({ date: -1 });
            res.json(foodOrder);
        } else if (req.user.userType === 1) {
            const foodOrder = await FoodOrder.find().sort({ date: -1 });
            res.json(foodOrder);
        }
    } catch (err) {
        console.error(err.msg);
        res.status(400).send('Server error');
    }
})

// @route 	 GET api/food-menu/:id
// @desc 	 Get single menu
// @access 	 Private
router.get('/:id', (req, res) => {
    res.send('Get single menu');
})

// @route 	 POST api/food-menu
// @desc 	 Create new food menu
// @access 	 Private
router.post('/', auth, async (req, res) => {
    const { name, category, description, price, orderDetails  } = req.body;
    try {
        // @todo validate that promo exists (after dispatch this project this tuesday xd)   
        const user = req.user.id;
        const userName = req.user.name;

        let foodOrder = await FoodOrder.create({
            user,
            userName,
            name,
            category,
            description,
            price,
            orderDetails
        })

        return res.json(foodOrder);
    } catch (err) {
        console.error(err.msg);
        res.status(400).send('Server error');
    }
})

// @route 	 PATCH api/food-menu/:id
// @desc 	 Update Menu
// @access 	 Private
router.put('/:id', auth, async (req, res) => {
    try {
        const foodOrder = await FoodOrder.findById(req.params.id)
        let newStatus;

        const { status } = foodOrder;
        if(status === 'en espera') newStatus = 'en preparacion';
        if(status === 'en preparacion') newStatus = 'lista para retirar';
        if(status === 'lista para retirar') newStatus = 'finalizado';

        foodOrder.status = newStatus;

        await foodOrder.save();

        return res.json(foodOrder);
        
    } catch (err) {
        console.error(err);
        res.status(400).send('Server error');
    }
})

// @route 	 DELETE api/food-order/:id
// @desc 	 Remove Order
// @access 	 Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let foodOrder = await FoodOrder.findById(req.params.id);

        if(!foodOrder) return res.status(404).json({ msg: 'El menú no ha sido encontrado'});

        if(foodOrder.status !== 'en espera') {
            return res.status(400).json({ msg: 'No se puede eliminar una orden en proceso o finalizada' }); 
        }

        await FoodOrder.findByIdAndRemove(req.params.id);
        
        res.json({ msg: 'Menú eliminado exitosamente'});
    } catch (err) {
        console.error(err.msg);
        res.status(500).send('Server error');
    }
})

module.exports = router;