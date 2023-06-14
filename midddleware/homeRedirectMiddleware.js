import User from "../model/User.js";
import { verifyToken } from "../utility/jwt.js";
import { validate } from "../utility/validate.js";

export const homeMiddleware = async (req, res, next) => {
    try {
        //get & verify token
        const token = req.cookies.userToken;

        if (token && req.session.userId) {
            // token verify & validation
            const tokenVerify = verifyToken(token);

            if (!tokenVerify) {
                delete req.session.userId;
                res.clearCookie("userToken");
                validate(req, res, "Invalid Token!", "/index", "warning");
            } else {
                const userData = await User.findById(tokenVerify.id);

                if (userData) {
                    next();

                } else {
                    
                    delete req.session.userId;
                    res.clearCookie("userToken");
                    validate(req, res, "User Data not Found!", "/index", "warning");
                }
            }
        } else {
            delete req.session.userId;
            res.clearCookie("userToken");
            validate(req, res, "You are not allowed!", "/index", "warning");
        }
    } catch (error) {
        delete req.session.userId;
        res.clearCookie("userToken");
        validate(req, res, error.message, "/index", "error");
    }
};
