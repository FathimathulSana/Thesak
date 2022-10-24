const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    firstName : String,
    lastName : String,
    email:{
        type : String
    },
    phoneNumber : {
        type : Number
    },
    pincode: {
        type: Number,
      
    },
    
    address: {
        type: String,
       
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
      landmark: {
        type: String,
    },


 },{timestamps:true});


 const Address = mongoose.model('Address',addressSchema);
 module.exports=Address; 