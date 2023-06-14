
export const localMiddleware = (req,res,next)=>{

    res.locals.msg = req.session.msg;
    res.locals.icon = req.session.icon;
    delete req.session.msg
    delete req.session.icon

    res.locals.logEmail = req.session.logEmail;
    res.locals.forgetEmail = req.session.forgetEmail;

    res.locals.profile_img = req.session.profile_img;

    res.locals.user_data = req.session.user_data;

   next() 
}