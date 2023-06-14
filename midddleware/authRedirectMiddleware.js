import { validate } from "../utility/validate.js"



export const homeRedirectMiddleware = (req,res,next)=>{
    
    const token = req.cookies.userToken;
    
    if( token && req.session.userId){
        validate(req,res,`You are already logged In`,'/','warning');
    }
    else{
        next()
    }
}