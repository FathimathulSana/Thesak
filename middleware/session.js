
module.exports = {
    adminSession: (req,res,next)=>{
        if (req.session.loggedIn){
           
            next()
        }else{
            
            res.redirect('/admin')
        }
    },
    userSession: (req,res,next)=>{
        if (req.session.userLoggedIn){
            user:true;
            next()
        }else{
            res.redirect('/login')
        }
    }
}
