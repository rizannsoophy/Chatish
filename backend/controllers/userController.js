const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

const registerUser=asyncHandler( async(req,res)=>{
    const {name,email,password,pic}=req.body

    if(!name||!email||!password){
        res.status(400);
        throw new Error("Please enter all fields")
    }
    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400)
        throw new Error("User already exists")
    }
    const user = await User.create({
        name,
        email,
        password,
        pic,
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id),
        })
    }else{
        res.status(400);
        throw new Error("Failed to create user")
    }
})

const authUser=asyncHandler(async(req,res)=>{
    const {email,password} = req.body
    const user = await User.findOne({email})

    if (user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id),
        })
    }else{
        res.status(401);
        throw new Error("Invalid credentials")
    }
})

//const allUsers= asyncHandler(async(req,res)=>{
   // const keyword = req.query.search ? {
     //   $or:[
    //        {name:{$regex:req.query.search,$options:'i'}},
            //{email:{$regex:req.query.search,$options:'i'}}
     //   ]
  //  }
 //   :{};
   // const users = await User.find(keyword).find({_id:{$ne: req.user._id}})
  //  res.send(users)
//})

const allUsers = asyncHandler(async (req, res) => {
    const { search } = req.query;
  
    let query = { _id: { $ne: req.user._id } }; // Default query to exclude current user
  
    if (search) {
      query = {
        $and: [
          {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } },
            ],
          },
          { _id: { $ne: req.user._id } },
        ],
      };
    }
  
    try {
    const users = await User.find(query);
  
    res.status(200).json(users);
        
    } catch (error) {
        
        res.status(401).json(error)
    }
    
  });

module.exports = {registerUser,authUser,allUsers}