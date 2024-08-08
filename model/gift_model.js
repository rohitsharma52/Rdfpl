const mongoose = require('mongoose');
const giftSchema=new mongoose.Schema({
  
          image:{
          type: String,
          required: true,
          },
         
        show_home:{
        type: String,
        default:null,
        }, 
         
});

const Gift = mongoose.model('Gift', giftSchema);
module.exports=Gift;   