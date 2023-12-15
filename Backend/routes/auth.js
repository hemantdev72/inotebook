const express = require('express');
const User = require('../models/Users');
const router = express.Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const JWT_SECRET="adaskjdaksdb";
const fetchuser=require('../middleware/fetchUser');

router.post('/createuser', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!email || !name || !password) {
            res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        } else {
            const user = await User.findOne({ email: email });

            if (user) {
                res.status(400).json({
                    success: false,
                    message: 'User already exists'
                });
            } else {
                const salt= await bcrypt.genSalt(10);
                const secPass=await bcrypt.hash(password,salt);

                const newUser =await User.create({ name, email, password:secPass });

                const data={
                    user:{
                        id:newUser._id
                    }
                }

                const authToken=jwt.sign(data,JWT_SECRET);
                res.status(200).json({
                    success: true,
                    authToken
                });
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
            return; // Add a return statement to exit the function if the user doesn't exist
        }

        const compare = await bcrypt.compare(password, user.password);
        if (!compare) {
            res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
            return; // Add a return statement to exit the function if the password doesn't match
        }

        const data = {
            user: {
                id: user._id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        res.status(200).json({
            success: true,
            authToken
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});


router.post('/getuser',fetchuser,async (req,res)=>{
    try{
        userId=req.user._id;
        const user=await User.findOne({userId}).select('-password');
        res.status(200).json({
            user
        })
    } catch(error){
        res.status(401).json({
            message:"internal server error"
        })
    }
})

module.exports = router;
