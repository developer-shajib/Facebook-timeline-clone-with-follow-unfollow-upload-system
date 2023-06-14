
import jwt from 'jsonwebtoken';

//Create token
export const createToken = (payload,exp = '1d')=>{
    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn : exp});
    return token;
}

// Verify Token
export const verifyToken = (token)=>{
    return jwt.verify(token,process.env.JWT_SECRET);
}
