import mongoose from 'mongoose';
// import { string } from 'yup/lib/locale';

let postSchema = new mongoose.Schema({
    text: { type: String, required: true },
    owner: { type: mongoose.ObjectId, ref: "Users" , required: true },
    image: { type: String },
    imageUrl: {type: String},
    // likes: [{ type: mongoose.ObjectId }],
    // comments: [ {
    //     user: { type: mongoose.ObjectId },
    //     commentText: String
    // } ],
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now }
});
export const postModel = mongoose.model('posts', postSchema);


const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },

    createdOn: { type: Date, default: Date.now },
});

userSchema.index({firstName: 'text' , lastName: 'text'})
export const userModel = mongoose.model('Users', userSchema);

const otpSchema = new mongoose.Schema({
    email: { type: String} ,
    otp: { type: String},
    isUsed: { type: Boolean , default: false },
    createdOn: { type: Date, default: Date.now },
});
export const otpModel = mongoose.model('Otps', otpSchema);

const mongodbURI = process.env.mongodbURI || "mongodb+srv://dbuser:dbpassword@cluster0.9u53wmy.mongodb.net/abcdatabase?retryWrites=true&w=majority";

/////////////////////////////////////////////////////////////////////////////////////////////////
mongoose.connect(mongodbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////