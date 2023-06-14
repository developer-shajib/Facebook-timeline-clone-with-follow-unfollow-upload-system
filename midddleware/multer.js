import multer from 'multer';
import path, { resolve } from 'path';
const __dirname = resolve();


// Create Storage
const storage = multer.diskStorage({

    destination: (req,file,cb)=>{

        // Profile Photo
        if(file.fieldname == 'profile'){
            cb(null, path.join(__dirname,'/public/assets/profile/profile_img'))
        }

        // Cover Photo
        if(file.fieldname == 'cover_pic'){
            cb(null, path.join(__dirname,'/public/assets/profile/cover_img'))
        }

        // Gallery Photo
        if(file.fieldname == 'gallery'){
            cb(null, path.join(__dirname,'/public/assets/profile/gal_img'))
        }

    },

    filename : (req,file,cb)=>{
        cb(null, Date.now() +'_'+ file.originalname);
    }
    
})


// Profile Photo
export const profilePhotoMiddleware = multer({storage}).single('profile');

// Cover Photo
export const coverPhotoMiddleware = multer({storage}).single('cover_pic');

// Gallery Photo
export const galleryPhotoMiddleware = multer({storage}).array('gallery', 10);