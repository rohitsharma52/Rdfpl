const mongoose = require('mongoose');
const silderSchema=new mongoose.Schema({
  
          image:{
          type: String,
          required: true,
          },
         
     
         
});

const Slider = mongoose.model('Slider', silderSchema);
module.exports=Slider;   