const asyncHandler = require('express-async-handler');
const client = require('../config/dbConnection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//@desc register user
//@route POST /toddle/user/register
//@access Public

const registerUser = asyncHandler(async(req, res) => {
    const user = req.body;
    if(!user.name || !user.email || !user.password || !user.role){
        res.status(400).send({message: "Please enter all fields"});
    }
    const hashedpassword = await bcrypt.hash(user.password, 10);
    user.password = hashedpassword;
    const person = await client.query(`INSERT INTO Users (name, email, password,role) VALUES ('${user.name}', '${user.email}', '${user.password}', '${user.role}')`);
    if(person){
        res.status(201).send({message: "User registered successfully"});
    }
    else{
        res.status(400).send({message: "Invalid user data"});
    }
});

//@desc login user
//@route POST /toddle/user/login
//@access Public
const loginuser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        res.send({message: "Please enter all fields"});
    }
    const user = await client.query(`Select * from users where email = '${email}'`);
    if(user.rows[0] == null){
        res.status(400).send({message: "User does not exist"});
    }
    else{
        if(await bcrypt.compare(password, user.rows[0].password)){
            const accessToken = jwt.sign({
                user:{
                    email: user.rows[0].email,
                    role: user.rows[0].role,
                },
            }, process.env.ACCESS_TOKEN_SECRET, 
            {expiresIn: '15m'});
            res.status(201).json({accessToken});
            }
    else{
        res.status(400).send({message: "Invalid credentials"});
    }
}
});

//@desc get all users
//@route GET /toddle/users/getall
//@access all

const getAllUsers = asyncHandler(async(req, res) => {
    const users = await client.query(`Select * from users`);
    if(users){
        res.status(201).json(users.rows);
    }
    else{
        res.status(400).send({message: "Invalid credentials"});
    }
});

module.exports = {registerUser, loginuser, getAllUsers};
