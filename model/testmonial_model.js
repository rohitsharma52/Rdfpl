const mongoose = require('mongoose');
const Testimonial_schema=new mongoose.Schema({
  name:{
          type: String,
          required: true,
          },
          place:{
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

const Testimonial = mongoose.model('Testimonial', Testimonial_schema);
module.exports=Testimonial;   