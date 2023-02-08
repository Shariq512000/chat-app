import express  from "express";
import { userModel , otpModel } from "../dbRepo/models.mjs";
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import {
    stringToHash,
    varifyHash,
} from "bcrypt-inzi";
import { nanoid, customAlphabet } from 'nanoid'
import moment from "moment";



const SECRET = process.env.SECRET || "topsecret";
const router = express.Router()


router.post('/signup', (req, res) => {

    let body = req.body;

    if (!body.firstName
        || !body.lastName
        || !body.email
        || !body.password
    ) {
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }

    req.body.email = req.body.email.toLowerCase();

    // check if user already exist // query email user
    userModel.findOne({ email: body.email }, (err, user) => {
        if (!err) {
            console.log("user: ", user);

            if (user) { // user already exist
                console.log("user already exist: ", user);
                res.status(400)
                res.send({ message: "user already exist, please try a different email" });
                return;

            } else { // user not already exist

                // bcrypt hash
                stringToHash(body.password).then(hashString => {

                    userModel.create({
                        firstName: body.firstName,
                        lastName: body.lastName,
                        email: body.email,
                        password: hashString
                    },
                        (err, result) => {
                            if (!err) {
                                console.log("data saved: ", result);
                                res.status(201).send({ message: "user is created" });
                            } else {
                                console.log("db error: ", err);
                                res.status(500).send({ message: "internal server error" });
                            }
                        });
                })

            }
        } else {
            console.log("db error: ", err);
            res.status(500).send({ message: "db error in query" });
            return;
        }
    })
});

router.post('/login', (req, res) => {

    let body = req.body;
    body.email = body.email.toLowerCase();

    if (!body.email || !body.password) { // null check - undefined, "", 0 , false, null , NaN
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }

    // check if user exist
    userModel.findOne(
        { email: body.email },
        "firstName lastName email password",
        (err, data) => {
            if (!err) {
                console.log("data: ", data);

                if (data) { // user found
                    varifyHash(body.password, data.password).then(isMatched => {

                        console.log("isMatched: ", isMatched);

                        if (isMatched) {

                            const token = jwt.sign({
                                _id: data._id,
                                email: data.email,
                                iat: Math.floor(Date.now() / 1000) - 30,
                                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                            }, SECRET);

                            console.log("token: ", token);

                            res.cookie('Token', token, {
                                maxAge: 86_400_000,
                                httpOnly: true,
                                sameSite: "none",
                                secure: true
                            });

                            res.send({
                                message: "login successful",
                                profile: {
                                    email: data.email,
                                    firstName: data.firstName,
                                    lastName: data.lastName,
                                    age: data.age,
                                    _id: data._id
                                }
                            });
                            return;
                        } else {
                            console.log("password did not match");
                            res.status(401).send({ message: "Incorrect email or password" });
                            return;
                        }
                    })

                } else { // user not already exist
                    console.log("user not found");
                    res.status(401).send({ message: "Incorrect email or password" });
                    return;
                }
            } else {
                console.log("db error: ", err);
                res.status(500).send({ message: "login failed, please try later" });
                return;
            }
        })
});


router.post('/logout', (req, res) => {

    res.cookie('Token', '', {
        maxAge: 1,
        httpOnly: true,
        sameSite: "none",
        secure: true
    });

    res.send({ message: "Logout successful" });
});

router.post('/forget-password' , async(req , res) => {
    try {

        const body = req.body
        const email = body.email.toLowerCase();
        if(!email) {
            res.status(400).send("required parameter missing")
            return;
        }
        const user = userModel.findOne({email: email }, "firstName lastName email" ,).exec()
        if(!user) throw new Error("User not found");

        const nanoid = customAlphabet('1234567890', 5)
        const OTP = nanoid();
        const otpHash = await stringToHash(OTP)

        console.log("OTP: ", OTP);
        console.log("otpHash: ", otpHash);

        otpModel.create({
            otp: otpHash,
            email: email, 
        });

        res.send({
            Otp: OTP,
            message: "OTP sent success",
        });
        return;
        
    } catch (error) {
        
        console.log("error: ", error);
        res.status(500).send({
            message: error.message
        })
        
    }
}
)
router.post('/forget-password-1' , async (req , res) => {
    try {
        const email = req.body.email.toLowerCase()
        const otp = req.body.otp

        if(!email || !otp) {
            res.status(404).send(
                "required parameter missing"
            )
            return
        }

        const otpRecord = await otpModel.findOne({email: email}).sort({_id: -1}).exec()
        if (!otpRecord) throw new Error("invalid OTP")
        if (otpRecord.isUsed) throw new Error("invalid OTP")

        await otpRecord.update({isUsed: true}).exec()

        const now = moment()
        const otpCreatedTime = moment(otpRecord.createdOn)
        const diffInTime = now.diff(otpCreatedTime , "seconds")

        if(diffInTime > 120) throw new Error ("invalid OTP")

        const isMatch = await varifyHash(otp , otpRecord.otp)

        if(!isMatch) throw new Error("invalid OTP")

        res.status(200).send("OTP Matched")

    } catch (error) {

        console.log("error: ", error);
        res.status(500).send({
            message: error.message
        })
        
    }
}
)
router.post('/forget-password-2' , async (req , res) => {
    try {
        const email = req.body.email.toLowerCase()
        const newPassword = req.body.password
        const user = await userModel.findOne({email: email})
        if(!user) throw new Error("User Not Found")
        const newHash = await stringToHash(newPassword)

        await user.update({password: newHash})

        res.status(200).send("Password Reset Success")

        
    } catch (error) {
        console.log("error: ", error);
        res.status(500).send({
            message: error.message
        })
    }   
})

export default router;