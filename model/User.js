import mongoose from 'mongoose';

//user schema create
const userSchema = mongoose.Schema({
    firstName : {
        type : String,
        trim : true,
        required : true
    },
    surName : {
        type : String,
        trim : true,
        required : true
    },
    email : {
        type : String,
        trim : true,
        required : true,
        unique : true
    },
    phone : {
        type : Number,
        trim : true
    },
    bDay : {
        type : Number,
        trim : true
    },
    bMonth : {
        type : Number,
        trim : true
    },
    bYear : {
        type : Number,
        trim : true
    },
    password : {
        type : String,
        trim : true,
        required : true
    },
    profile : {
        type : String,
        trim : true
    },
    cover_photo : {
        type : String,
        trim : true
    },
    gallery : { 
        type : Array,
        trim : true
    },
    follower : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "User",
    },
    following : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "User",
    },
    skill : {
        type : String,
        trim : true,
        enum : ['MERN Stack',"PHP Devs","Python","C","C#","C++","Java","JavaScript"]
    },
    gender : {
        type : String,
        trim : true,
        enum : ["Male","Female","Custom"]
    },
    isAdmin : {
        type : Boolean,
        default : true
    },
    isActivate : {
        type : Boolean,
        default : false
    },
    accessToken : {
        type : String,
        trim : true
    },
},
{
    timestamps : true
})


export default mongoose.model('User',userSchema);