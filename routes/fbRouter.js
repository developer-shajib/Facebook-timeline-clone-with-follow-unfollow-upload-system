import express from 'express'
import { changePass, coverPhotoUpdate, followUser, forGetEmailSend, forgetPage, forgetSetPass, forgetTokenVerify, friendProfileShow, galleryPhotoDelete, galleryPhotoUpdate, homePage, logRegPage, ProfilePage, profilePhotoUpdate, regPost, resendEmail, showFriendsPage, showMyFollower, showMyFollowing, unFollowUser, userAccountActivation, userLogin, userLogout } from '../controller/fbController.js';
import {  homeRedirectMiddleware } from '../midddleware/authRedirectMiddleware.js';
import { homeMiddleware } from '../midddleware/homeRedirectMiddleware.js';
import { coverPhotoMiddleware, galleryPhotoMiddleware, profilePhotoMiddleware } from '../midddleware/multer.js';

//init router
const router = express.Router();

//login register page
router.route('/').get(homeMiddleware,homePage);
router.route('/index').get(homeRedirectMiddleware,logRegPage);

// user post request
router.route('/register').post(regPost);
router.route('/login').post(userLogin);

// logout user
router.route('/logout').get(userLogout);

// Resend Email
router.route('/resend').get(resendEmail);

// Forget Password
router.route('/forget').get(forgetPage);

// Forget Email Send
router.route('/forgetEmailSend').post(forGetEmailSend);

// Forget password Page
router.route('/password').get(forgetSetPass);

// Forget Password Set
router.route('/password').post(changePass);

// Profile Page
router.route('/profile').get(homeMiddleware,ProfilePage);

// Profile Photo Update
router.route('/profile-update').post(profilePhotoMiddleware,profilePhotoUpdate);

// Cover Photo Update
router.route('/cover-update').post(coverPhotoMiddleware, coverPhotoUpdate);

// Gallery Photo Update
router.route('/gallery-update').post(galleryPhotoMiddleware, galleryPhotoUpdate);

// Show Friends
router.route('/friends').get(homeMiddleware, showFriendsPage);

// My Follower Page
router.route('/follower-page').get(homeMiddleware, showMyFollower);
// My Following Page
router.route('/following-page').get(homeMiddleware, showMyFollowing);

// Gallery Photo Single Delete
router.route('/gallery/:id').get( galleryPhotoDelete);

// Activation URL
router.route('/activate/:token').get(userAccountActivation);

// Forget Token Verify
router.route('/forgetToken/:token').get(forgetTokenVerify);

// Follow Friend
router.route('/follow/:id').get(followUser);

// UnFollow Friend
router.route('/unfollow/:id').get(unFollowUser);

// Friend Profile
router.route('/friend-profile/:id').get(homeMiddleware, friendProfileShow);




export default router;   