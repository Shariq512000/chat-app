import express from 'express';
import path from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { Server as socketIo } from 'socket.io';
import cookie from "cookie";
import { createServer } from 'http';
import authApis from "./apis/auth.mjs";
import postApis from "./apis/post.mjs";
import { userModel, messageModel } from './dbRepo/models.mjs';

const SECRET = process.env.SECRET || "topsecret";

const app = express()
const port = process.env.PORT || 5001;

app.use(cookieParser());
app.use(express.json());


app.use(cors({
    origin: ['http://localhost:3000', "*"],
    credentials: true
}));



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
        const user = await userModel.findOne({ _id: _id }, "firstName lastName email _id").exec()
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

    const populatedMessage = await messageModel
        .findById(sent._id)
        .populate({ path: 'from', select: 'firstName lastName email' })
        .populate({ path: 'to', select: 'firstName lastName email' })
        .exec();
    io.emit(`${req.body.to}-${req.body.token._id}`, populatedMessage)
    io.emit(`personal-channel-${req.body.to}`, populatedMessage)

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

    if( typeof socket?.request?.headers?.cookie !== "string")
    {
        socket.disconnect(true)
        return;
    }

    const token = socket?.request?.headers?.cookie

    console.log("tokennn :" , token)

    const cookieData = cookie.parse(token);

    console.log("cookieData: " , cookieData);

    if (!cookieData?.Token) {
        socket.disconnect(true);
        return;
    }

    jwt.verify(cookieData?.Token, SECRET, function (err, decodedData) {
        if (!err) {

            console.log("decodedData: ", decodedData);

            const nowDate = new Date().getTime() / 1000;

            if (decodedData.exp < nowDate) {

                socket.disconnect(true);
            }
        } else {
            socket.disconnect(true);
        }
    });

    
    socket.emit("topic 1", "some data")


    socket.on("disconnect", (message) => {
        console.log("Client disconnected with id: ", message);
    });
});


server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

