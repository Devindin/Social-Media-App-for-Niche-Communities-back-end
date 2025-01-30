const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
   name:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:true
   },
   gender:{
    type:String,
    required:true
   },
   country:{
    type:String,
    required:true
   },
   password:{
    type:String,
    required:true
   },
   confirmpassword:{
    type:String,
    required:true
   },
   joinedCommunities: { type: [String], default: [] },

});

module.exports = mongoose.model('User' ,userSchema)