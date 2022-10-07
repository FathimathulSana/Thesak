$.validator.addMethod('Name',function(value, element){
    return /^[a-zA-Z]*$/.test(value)
},'Name must be characters');

$.validator.addMethod('Phone', function(number, element) {
    number = number.replace(/\s+/g, "");
    return this.optional(element) || number.length > 9 && 
    number.match(/^(\+?1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
}, "Please specify a valid phone number");

$.validator.addMethod('Email',function(email,element){
    return /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email)
},'Please enter a valid email');
$("#signupform").validate({
      
    rules: {
       fname:{
           required:true,
           minlength:3,
           Name:true
       },
       lname:{
        required:true,
        minlength:3,
        Name:true
       },
       phonenumber:{
        required:true,
        Phone:true,
        Name:false
       },
       email: {
       required: true,
       Email:true,
       Name:false
       },
       password: {
       required: true,
       minlength: 8
       },
       confirmpassword:{
        required:true,
        equalTo:"#floatingPassword"
       }
    },
    messages:{
       fname:{
           required:"Please enter your name",
           minlength:"Name must be atleast 3 letters"
       },
       email:{
           required:"Enter your email"
       },
       password:{
           required:"Please provide a password",
           minlength:"Your password must be atleast 8 characters"
       },
       confirmpassword:{
            required:"Please provide a password", 
            equalTo:"Password did not match"
       }
    },
     submitHandler: function(form) {
    form.submit();
    }
       });