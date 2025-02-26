const express=require("express");

const router=express.Router();

const {login,register,isAdmin} =require("../Controllers/Auth");


router.post("/login",login);
router.post("/register",register);
router.post('/add-admin',isAdmin);


module.exports= router;