const mongoose = require('mongoose');
const adminSchema=new mongoose.Schema({
          name:{
          type: String,
          required: true,
          },
          nav_1:{
          type: String,
          default: null,
          },
          nav_1_link:{
          type: String,
          default: null,
          },
          nav_2:{
          type: String,
          default: null,
          }, 
          nav_2_link:{
          type: String,
          default: null,
          },
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports=Admin;   