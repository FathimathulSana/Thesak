// $(document).ready(function(){
    $("#login").validate({
        errorClass: "valierrors",
    
        rules:{
          Name:{
            lettersonly : true,
            required:true,
            minlength:4
          },
    
          Email:{
            required:true,
            email:true
          },
    
          phone:{
            required:true,
            minlength:10,
            maxlength:10
            
          },
    
          Password:{
            required:true,
            minlength: 5
          },
          c_Password:{
              required:true,
              equalTo:'#password'
          }
        },messages : {
          name : {
            lettersonly : 'only letters are allowed'
          }
        }
      })
  
  
      $("#login").validate({
          errorClass: "valierrors",
      
          rules:{
            
            Email:{
              required:true,
              email:true
            },
      
            
      
            Password:{
              required:true,
              minlength: 5
            },
            
          }
        })
    
  
  
  
  