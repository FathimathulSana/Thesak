
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
            next()
        }else{
         
            res.redirect('/Login');
        }
    },
}
