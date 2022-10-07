const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const adminSchema=new mongoose.Schema({
    email:{
        type:String,
    },
    password:String
})
adminSchema.pre("save", async function(next){
      
    // console.log(`the current pass is ${this.password}`);
    this.password= await bcrypt.hash(this.password,10)
    // console.log(`the current pass is ${this.password}`);
    

next()
})

const admin=mongoose.model('admin',adminSchema);
module.exports=admin;