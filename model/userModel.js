const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const signupSchema=new mongoose.Schema({
    fname:String,
    lname:String,
    email:{
        type:String,
    },
    phonenumber:Number,
    password:String,
    confirmpassword:String,
    active:{
        type:Boolean,
        default:true
    },
   
});



signupSchema.pre("save", async function(next){
      
    // console.log(`the current pass is ${this.password}`);
    this.password= await bcrypt.hash(this.password,10)
    // console.log(`the current pass is ${this.password}`);
   
    

next()
})

const User=mongoose.model('User',signupSchema);
module.exports=User;