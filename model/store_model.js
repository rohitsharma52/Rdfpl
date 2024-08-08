const mongoose = require('mongoose');
const Store_schema=new mongoose.Schema({
         title:{
          type: String,
          required: true,
          },
          Heading:{
          type: String,
          required: true,
          },
          Descripation:{
          type: String,
          required: true,
          },
          image:{
          type: String,
          required: true,
          },
         
         
});

const Store = mongoose.model('Store', Store_schema);
module.exports=Store;   