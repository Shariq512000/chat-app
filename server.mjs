import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import {
    stringToHash,
    varifyHash,
} from "bcrypt-inzi";
import { Server as socketIo } from 'socket.io';
import { createServer } from 'http';
import authApis from "./apis/auth.mjs";
import postApis from "./apis/post.mjs";
import { userModel , messageModel } from './dbRepo/models.mjs';

const SECRET = process.env.SECRET || "topsecret";

const app = express()
const port = process.env.PORT || 5001;

app.use(cookieParser());
app.use(express.json());


app.use(cors({
    origin: ['http://localhost:3000', "*"],
    credentials: true
}));

// let products = []; // TODO: connect with mongodb instead


app.use('/api/v1', authApis)

app.use('/api/v1', (req, res, next) => {

    console.log("req.cookies: ", req.cookies);

    if (!req?.cookies?.Token) {
        res.status(401).send({
            message: "include http-only credentials with every request"
        })
        return;
    }

    jwt.verify(req.cookies.Token, SECRET, function (err, decodedData) {
        if (!err) {

            console.log("decodedData: ", decodedData);

            const nowDate = new Date().getTime() / 1000;

            if (decodedData.exp < nowDate) {

                res.status(401);
                res.cookie('Token', '', {
                    maxAge: 1,
                    httpOnly: true,
                    sameSite: "none",
                    secure: true
                });
                res.send({ message: "token expired" })

            } else {

                console.log("token approved");

                req.body.token = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
});

const getUser = async (req, res) => {
    let _id = "";
    console.log("profile===");


    if (req.params.id) {
        _id = req.params.id
    }
    else {
        _id = req.body.token._id
    }

    try {
        const user = await userModel.findOne({ _id: _id }, "firstName lastName email -_id").exec()
        if (!user) {
            res.status(404).send({})
            return;
        }
        else {
            res.status(200).send(user);
            console.log("profile");
        }
    } catch (error) {
        console.log("error", error)
        res.status(500).send({ message: "something went wrong" })
    }
}

app.get('/api/v1/profile', getUser);
app.get('/api/v1/profile/:id', getUser);

app.get('/api/v1/users', async (req, res) => {

    try {

        const myId = req.body.token._id;

        const q = req.query.q

        let query;

        if (q) {
            query = userModel.find({ $text: { $search: q } })
        }
        else {
            query = userModel.find({}).limit(20)
        }

        const users = await query.exec();

        let modifyUser = users.map(eachUser => {

            let users = {
                _id: eachUser._id,
                firstName: eachUser.firstName,
                lastName: eachUser.lastName,
                email: eachUser.email
            }

            if (eachUser._id.toString() === myId) {
                users.me = true
                return users
            } else {
                return users
            }
        })

        res.send(modifyUser);

    } catch (error) {

        console.log("Error ", error)
        res.send([])

    }

})

app.post('/api/v1/message', async (req, res) => {

    if (
        !req.body.text ||
        !req.body.to
    ) {
        res.status("400").send("invalid input")
        return;
    }

    const sent = await messageModel.create({
        from: req.body.token._id,
        to: req.body.to,
        text: req.body.text
    })

    io.emit(`${req.body.to}-${req.body.token._id}` , sent)

    console.log("channel: ", `${req.body.to}-${req.body.token._id}`);

    const populatedMessage = await messageModel
        .findById(sent._id)
        .populate({ path: 'from', select: 'firstName lastName email' })
        .populate({ path: 'to', select: 'firstName lastName email' })
        .exec();
    // io.emit(`${req.body.to}-${req.body.token._id}`, populatedMessage)
    // io.emit(`personal-channel-${req.body.to}`, populatedMessage)

    console.log("populatedMessage: ", populatedMessage)

    res.send("message sent successfully");
})

app.get('/api/v1/messages/:id', async (req, res) => {

    const messages = await messageModel.find({
        $or: [
            {
                from: req.body.token._id,
                to: req.params.id
            },
            {
                from: req.params.id,
                to: req.body.token._id,
            }
        ]
    })
        .populate({ path: 'from', select: 'firstName lastName email' })
        .populate({ path: 'to', select: 'firstName lastName email' })
        .limit(100)
        .sort({ _id: -1 })
        .exec();

    res.send(messages);

})

app.post('/api/v1/change-password', async (req, res) => {
    try {
        const _id = req.body.token._id
        const currentPassword = req.body.currentPassword
        const newPassword = req.body.newPassword

        const user = await userModel.findOne({ _id: _id }, "password",).exec()

        if (!user) throw new Error("User Not Found")

        const isMatch = await varifyHash(currentPassword, user.password)

        if (!isMatch) throw new Error("Current Password is not Match to your Password")

        const newHash = await stringToHash(newPassword);

        await userModel.updateOne({ _id: _id }, { password: newHash }).exec()

        res.send({
            message: "Password Change Successful"
        })



    } catch (error) {

        console.log("Error :", error);
        res.status(500).send({})

    }
}
)

app.use('/api/v1', postApis)

const __dirname = path.resolve();
app.use('/', express.static(path.join(__dirname, './web/build')))
app.use('*', express.static(path.join(__dirname, './web/build')))

const server = createServer(app);

const io = new socketIo(server, {
    cors: {
        origin: ["http://localhost:3000", 'https://mern-chatapp.up.railway.app'],
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log("New client connected with id: ", socket.id);

    // to emit data to a certain client
    socket.emit("topic 1", "some data")

    // collecting connected users in a array
    // connectedUsers.push(socket)

    socket.on("disconnect", (message) => {
        console.log("Client disconnected with id: ", message);
    });
});


// to emit data to a certain client
//  connectedUsers[0].emit("topic 1", "some data")

// setInterval(() => {

//     // to emit data to all connected client
//     // first param is topic name and second is json data
//     io.emit("Test topic", { event: "ADDED_ITEM", data: "some data" });
//     console.log("emiting data to all client");

// }, 2000)

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

