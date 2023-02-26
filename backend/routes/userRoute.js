const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');


//? USER ROUTES
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, pic } = req.body
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({
                message: 'user already exist',
                success: false
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            pic,
        })

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                pic: user.pic,
                token: generateToken(user._id),
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                pic: user.pic,
                token: generateToken(user._id),
            })
        } else {
            res.status(400).send({
                message: 'Invalid Details',
                success: 'false',
            })
        }

    } catch (error) {

    }
});

router.post('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.pic = req.body.pic || user.pic
        user.password == req.body.password || user.password

        // if (req.body.password) {
        // }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            pic: updatedUser.pic,
            token: generateToken(updatedUser._id)
        })
    } else {
        res.status(404).json({
            message: "User not found!",
            status: false
        })
    }
});

// router.get('/get-user', async (req, res) => {
//     try {
//         const user = await User.findById('63de8d67cb9b0bfe9c00bb19');
//         if (!user) {
//             res.status(400).send({
//                 message: 'user not found',
//                 success: false
//             });
//         }
//         res.status(200).send({
//             message: 'user fetched successfully',
//             success: true,
//             data: user
//         })
//     } catch (error) {
//         res.status(500).send({
//             message: error.message,
//             success: false
//         });
//     }
// });

module.exports = router;