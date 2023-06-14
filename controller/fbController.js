import User from "../model/User.js";
import { validate } from "../utility/validate.js";
import { CheckPass, makeHash } from "../utility/bcrypt.js";
import { createToken, verifyToken } from "../utility/jwt.js";
import { createMail } from "../utility/mail.js";
import {unlinkSync} from 'fs';
import path, { resolve } from 'path';
const __dirname = resolve();

/**
 * @desc Show Home page
 * @name GET /
 * @access private
 */
export const homePage = (req, res) => {
    res.render("home");
};

/**
 * @desc show login and register page
 * @name GET /index
 * @access private
 */
export const logRegPage = (req, res) => {
    res.render("index");
};

/**
 * @desc Get Register page user data
 * @name POST /register
 * @access private
 */
export const regPost = async (req, res) => {
    try {
        //get user data to form
        const { firstName, surName, email, bDay, bMonth, bYear, gender, password } = req.body;

        //form validate
        if (!firstName || !surName || !email || !bDay || !bMonth || !bYear || !gender || !password) {
            validate(req, res, "All fields are required!", "/index", "warning");
        } else {
            //email validate
            const emailCheck = await User.findOne().where("email").equals(email);

            if (emailCheck) {
                validate(req, res, "Email already exists!", "/index", "error");
            } else {
                // store data to database
                const data = await User.create({ firstName, surName, email, bDay, bMonth, bYear, gender, password: makeHash(password) });

                // crate token
                const token = createToken({ id: data._id }, "15d");

                // Email Activation Link
                const activation_link = `${process.env.APP_URL}:${process.env.PORT}/activate/${token}`;

                // email verification
                createMail(email, "Activate Your Account", { surName, email, link: activation_link });

                validate(req, res, "Account Created Successful.Please activate your account.", "/index", "success");
            }
        }
    } catch (error) {
        validate(req, res, error.message, "/index", "error");
    }
};

/**
 * @desc Email Activation Link
 * @name GET /activate/:token
 * @access private
 */
export const userAccountActivation = async (req, res) => {
    try {
        const { token } = req.params;
        delete req.session.logEmail;
        // Token Verify
        const tokenVerify = verifyToken(token);

        // Token Validation
        if (!tokenVerify) {
            validate(req, res, "Verify Email has been Expired!", "/index", "warning");
        } else {
            // Get data from DB
            const getUserFromDB = await User.findById(tokenVerify.id);

            // User Activate
            if (getUserFromDB.isActivate == true) {
                validate(req, res, "Account Already Activated.Please Login.", "/index", "success");
            } else {
                await User.findByIdAndUpdate(tokenVerify.id, { isActivate: true });
                validate(req, res, "Account Activated Successfully. Please Login", "/index", "success");
            }
        }
    } catch (error) {
        validate(req, res, error.message, "/index", "error");
    }
};

/**
 * @desc user login
 * @name POST /login
 * @access private
 */
export const userLogin = async (req, res) => {
    try {
        //get form data
        const { email, password } = req.body;

        //form validate
        if (!email || !password) {
            validate(req, res, "All fields are required!", "/index", "warning");
        } else {
            //emailCheck
            const emailCheck = await User.findOne().where("email").equals(email);

            if (!emailCheck) {
                validate(req, res, `Email does not exists!`, "/index", "error");
            } else {
                //Check Password
                const passCheck = CheckPass(password, emailCheck.password);

                if (!passCheck) {
                    req.session.forgetEmail = email;
                    validate(req, res, `Wrong Password! Try Again.`, "/index", "warning");
                } else {
                    if (emailCheck.isActivate == false) {
                        // Create Token and Link
                        const token = createToken({ id: emailCheck._id }, "15d");
                        const activation_link = `${process.env.APP_URL}:${process.env.PORT}/activate/${token}`;

                        // Push Data from Session Storage
                        req.session.surName = emailCheck.surName;
                        req.session.link = activation_link;
                        req.session.logEmail = email

                        validate(req, res, ` `, "/index", "warning");
                    } else {

                        //Create Token
                        const token = createToken({ id: emailCheck._id }, "7d");

                        // setup date for login user
                        res.cookie("userToken", token, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) });
                        req.session.userId = emailCheck._id;

                        req.session.profile_img = emailCheck.profile
                        req.session.user_data = emailCheck

                        validate(req, res, `Login Successful`, "/", "success");
                    }
                }
            }
        }
    } catch (error) {
        validate(req, res, error.message, "/index", "error");
    }
};

/**
 * @desc Resend Email
 * @name GET /resend
 * @access private
 */
export const resendEmail = (req, res) => {
    try {
        // Get Data form Session Storage
        const email = req.session.logEmail;
        const surName = req.session.surName;

        // Resend Email
        createMail(email, "Activate Your Account", { surName, email, link: req.session.link });

        // Delete Session Data
        delete req.session.logEmail;
        delete req.session.surName;
        delete req.session.link;

        validate(req, res, "Email Sent Successful. Check Your Inbox!", "/index", "success");
    } catch (error) {
        validate(req, res, error.message, "/index", "error");
    }
};

/**
 * @desc user logout
 * @name GET /logout
 * @access private
 */
export const userLogout = (req, res) => {
    try {
        // delete user data from browser
        delete req.session.userId;
        delete req.session.logEmail;
        delete req.session.profile_img
        delete req.session.user_data

        res.clearCookie("userToken");


        validate(req, res, `Logout Successful`, "/index", "success");
    } catch (error) {
        validate(req, res, error.message, "/", "error");
    }
};

/**
 * @desc Forget Page
 * @name GET /forget
 * @access private
 */
export const forgetPage = (req, res) => {
    res.render("forget");
};

/**
 * @desc Forget Email sent
 * @name GET /forget
 * @access private
 */
export const forGetEmailSend = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            validate(req, res, "This fields are required!", "/forget", "warning");
        } else {
            const isEmail = await User.findOne({ email: email });

            if (!isEmail) {
                validate(req, res, "Email does not exists!", "/forget", "warning");
            } else {
                const surName = isEmail.surName;

                // Create Token and Link
                const token = createToken({ id: isEmail._id }, "180s");
                const activation_link = `${process.env.APP_URL}:${process.env.PORT}/forgetToken/${token}`;

                createMail(email, "Forget Email", { surName, email, link: activation_link });
                delete req.session.forgetEmail;

                validate(req, res, "Email Send Successfully. Check Inbox!", "/forget", "success");
            }
        }
    } catch (error) {
        validate(req, res, error.message, "/forget", "error");
    }
};

/**
 * @desc Password Page
 * @name GET /password
 * @access private
 */
export const forgetSetPass = (req, res) => {
    res.render("password");
};

/**
 * @desc Forget Token Verify
 * @name GET /forgetToken
 * @access private
 */
export const forgetTokenVerify = (req, res) => {
    try {
        const { token } = req.params;

        const checkToken = verifyToken(token);

        if (!checkToken) {
            validate(req, res, `Activation Link has been Expired! Try Again`, "/forget", "warning");
        } else {
            req.session.passToken = token;
            validate(req, res, `Please Set Your Password`, "/password", "success");
        }
    } catch (error) {
        validate(req, res, "Activation Link has been Expired! Try Again", "/forget", "error");
    }
};

/**
 * @desc Forget Token Verify
 * @name GET /forgetToken
 * @access private
 */
export const changePass = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            validate(req, res, "Please Input a Password", "/password", "warning");
        
        } else {
            const token = req.session.passToken;

            if (!token) {

                delete req.session.passToken;
                validate(req, res, "Token Not Found! Try Again", "/forget", "error");

            } else {

                const tokenCheck = verifyToken(token);

                if (!tokenCheck) {
                    delete req.session.passToken;
                    validate(req, res, "Activation Link has been Expired! Try Again", "/forget", "error");
                
                } else {

                    const findUser = await User.findByIdAndUpdate(tokenCheck.id, { password: makeHash(password) });
                    delete req.session.passToken;

                    validate(req, res, "Password Change Successfully. Now Login", "/index", "success");
                }
            }
        }
    } catch (error) {
        validate(req, res, error.message, "/password", "error");
    }
};



/**
 * @desc Profile Page
 * @name GET /profile
 * @access private
 */
export const ProfilePage = async (req,res)=>{

    try {
        const userData = await User.findById(req.session.userId);
        req.session.profile_img = userData.profile
        
        res.render('profile')

    } catch (error) {
        validate(req, res, error.message, "/", "error");

    }

}

/**
 * @desc Profile Photo Update
 * @name POST /profile-update
 * @access private
 */
export const profilePhotoUpdate = async (req,res)=>{
    
    try {
            
        const profile_img = req.file.filename;
        
        if(!profile_img){
            validate(req, res, 'Image Not Selected', "/profile", "error");

        }else{

            const id = req.session.userId;
            const old_img = await User.findById(id);

            const storeDone = await User.findByIdAndUpdate(id,{profile : req.file.filename});
            if(storeDone){

                // delete Old Profile Photo
                if (old_img.profile) {

                    unlinkSync(`${__dirname}/public/assets/profile/profile_img/${old_img.profile}`);
                }
                const profile_img = await User.findById(id);
                req.session.profile_img = profile_img.profile

                validate(req, res, 'Profile Changed Successfully', "/profile", "success");

            }else{
                validate(req, res, 'Profile Not Change', "/profile", "error");

            }
        }

    } catch (error) {
        validate(req, res, `Image Not Select`, "/profile", "error");

    }


}


/**
 * @desc Cover Photo Update
 * @name POST /cover-update
 * @access private
 */
 export const coverPhotoUpdate = async (req,res)=>{
    
    try {
            
        const cover_img = req.file.filename;
        
        if(!cover_img){
            validate(req, res, 'Image Not Selected', "/profile", "error");

        }else{

            const id = req.session.userId;
            const old_img = await User.findById(id);

            const storeDone = await User.findByIdAndUpdate(id,{cover_photo : req.file.filename});
            if(storeDone){

                // delete Old Profile Photo
                if (old_img.cover_photo) {

                    unlinkSync(`${__dirname}/public/assets/profile/cover_img/${old_img.cover_photo}`);
                }

                const cover_img = await User.findById(id);

                req.session.user_data = cover_img;
                
                validate(req, res, 'Cover Photo Changed Successfully', "/profile", "success");

            }else{
                validate(req, res, 'Cover Photo Not Change', "/profile", "error");

            }
        }

    } catch (error) {

        validate(req, res, error.message, "/profile", "error");

    }


}


/**
 * @desc Gallery Photo Update
 * @name POST /gallery-update
 * @access private
 */
 export const galleryPhotoUpdate = async (req,res)=>{
    
    try {

        if(!req.files[0]){
            validate(req, res, 'Image Not Selected', "/profile", "error");

        }else{
                for(let i=0; i < req.files.length; i++){

                await User.findByIdAndUpdate(req.session.userId, { $push : { gallery : req.files[i].filename}})

                }
                const get_data = await User.findById(req.session.userId);

                req.session.user_data = get_data;
                
                validate(req, res, 'Image Uploaded Successfully', "/profile", "success");

        }

    } catch (error) {

        validate(req, res, 'Image Not Selected', "/profile", "error");

    }


}


/**
 * @desc Gallery single Photo delete
 * @name GET /gallery/:id
 * @access public
 */
 export const galleryPhotoDelete = async (req, res) => {
    const { id } = req.params;

    try {

        await User.findByIdAndUpdate(req.session.userId, { $pull: { gallery: req.session.user_data.gallery[id] } });

        unlinkSync(`${__dirname}/public/assets/profile/gal_img/${req.session.user_data.gallery[id]}`);

        req.session.user_data = await User.findById(req.session.userId);

        validate(req, res, "Photo has been deleted.", "/profile", "success");
    } catch (error) {
        validate(req, res, error.message, "/profile",'error');
    }
};


/**
 * @desc show Friends Page
 * @name GET /friends
 * @access public
 */
 export const showFriendsPage = async (req, res) => {
    try {
            const friends = await User.find().where('email').ne(req.session.user_data.email);
           res.render('friends',{friends})
    } catch (error) {
        validate(req, res, error.message, "/",'error');

    }

};


/**
 * @desc Follow Friend
 * @name GET /follow/:id
 * @access public
 */
export const followUser = async (req,res)=>{
    try {
        
        const {id} = req.params;

        await User.findByIdAndUpdate(req.session.userId,{$push : { following : id}});
        await User.findByIdAndUpdate(id,{$push : { follower : req.session.userId}});

        const data = await User.findById(req.session.userId);

        req.session.user_data = data

        validate(req, res, 'Follow Done', "/friends",'success');

    } catch (error) {
        validate(req, res, error.message, "/friends",'error');
    }
}

/**
 * @desc UnFollow Friend
 * @name GET /unfollow/:id
 * @access public
 */
export const unFollowUser = async (req,res)=>{
    try {
        
        const {id} = req.params;

        await User.findByIdAndUpdate(req.session.userId,{$pull : { following : id}});
        await User.findByIdAndUpdate(id,{$pull : { follower : req.session.userId}});

        const data = await User.findById(req.session.userId);

        req.session.user_data = data

        validate(req, res, 'UnFollow Done', "/friends",'success');

    } catch (error) {
        validate(req, res, error.message, "/friends",'error');
    }
}


/**
 * @desc Show My Follower Page
 * @name GET /follower-page
 * @access public
 */
export const showMyFollower = async (req,res)=>{
    try {

        const myFollower = await User.findById(req.session.userId).populate('follower');

        res.render('followerPage',{myFollower});

    } catch (error) {
        validate(req, res, error.message, "/profile",'error');
    }
}

/**
 * @desc Show My Following Page
 * @name GET /following-page
 * @access public
 */
export const showMyFollowing = async (req,res)=>{
    try {

        const myFollowing = await User.findById(req.session.userId).populate('following');

        res.render('followingPage',{myFollowing});

    } catch (error) {
        validate(req, res, error.message, "/profile",'error');
    }
}

/**
 * @desc Friend Profile Page
 * @name GET /friend-profile/:id
 * @access public
 */
export const friendProfileShow = async (req,res)=>{
    try {

        const {id} = req.params;

        const friend_single_data = await User.findById(id);

        res.render('friendProfile',{friend_single_data})

    } catch (error) {
        validate(req, res, error.message, "/profile",'error');
    }
}