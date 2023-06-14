

export const validate = (req,res,msg,redirect,icon)=>{
    req.session.msg = msg;
    req.session.icon = icon;
    res.redirect(redirect)
}