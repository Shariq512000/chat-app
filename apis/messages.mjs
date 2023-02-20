// import  express  from "express";
// import { userModel } from "../dbRepo/models.mjs";
// import { messageModel } from "../dbRepo/models.mjs";
// import { Server as socketIo } from 'socket.io';



// const router = express.Router()



// router.get('/users', async (req, res) => {

//     try {

//         const myId = req.body.token._id;

//         const q = req.query.q

//         let query;

//         if (q) {
//             query = userModel.find({ $text: { $search: q } })
//         }
//         else {
//             query = userModel.find({}).limit(20)
//         }

//         const users = await query.exec();

//         let modifyUser = users.map(eachUser => {

//             let users = {
//                 _id: eachUser._id,
//                 firstName: eachUser.firstName,
//                 lastName: eachUser.lastName,
//                 email: eachUser.email
//             }

//             if (eachUser._id.toString() === myId) {
//                 users.me = true
//                 return users
//             } else {
//                 return users
//             }
//         })

//         res.send(modifyUser);

//     } catch (error) {

//         console.log("Error ", error)
//         res.send([])

//     }

// })

// router.post('/message', async (req, res) => {

//     if (
//         !req.body.text ||
//         !req.body.to
//     ) {
//         res.status("400").send("invalid input")
//         return;
//     }

//     const sent = await messageModel.create({
//         from: req.body.token._id,
//         to: req.body.to,
//         text: req.body.text
//     })

//     const populatedMessage = await messageModel
//         .findById(sent._id)
//         .populate({ path: 'from', select: 'firstName lastName email' })
//         .populate({ path: 'to', select: 'firstName lastName email' })
//         .exec();
//     io.emit(`${req.body.to}-${req.body.token._id}`, populatedMessage)
//     io.emit(`personal-channel-${req.body.to}`, populatedMessage)

//     console.log("populatedMessage: ", populatedMessage)

//     res.send("message sent successfully");
// })

// router.get('/api/v1/messages/:id', async (req, res) => {

//     const messages = await messageModel.find({
//         $or: [
//             {
//                 from: req.body.token._id,
//                 to: req.params.id
//             },
//             {
//                 from: req.params.id,
//                 to: req.body.token._id,
//             }
//         ]
//     })
//         .populate({ path: 'from', select: 'firstName lastName email' })
//         .populate({ path: 'to', select: 'firstName lastName email' })
//         .limit(100)
//         .sort({ _id: -1 })
//         .exec();

//     res.send(messages);

// })

// const server = createServer(app);

// const io = new socketIo(server, {
//     cors: {
//         origin: ["http://localhost:3000", 'https://mern-chatapp.up.railway.app'],
//         credentials: true
//     }
// });

// io.on("connection", (socket) => {
//     console.log("New client connected with id: ", socket.id);

//     if (typeof socket?.request?.headers?.cookie !== "string") {
//         socket.disconnect(true)
//         return;
//     }

//     const token = socket?.request?.headers?.cookie

//     console.log("tokennn :", token)

//     const cookieData = cookie.parse(token);

//     console.log("cookieData: ", cookieData);

//     if (!cookieData?.Token) {
//         socket.disconnect(true);
//         return;
//     }

//     jwt.verify(cookieData?.Token, SECRET, function (err, decodedData) {
//         if (!err) {

//             console.log("decodedData: ", decodedData);

//             const nowDate = new Date().getTime() / 1000;

//             if (decodedData.exp < nowDate) {

//                 socket.disconnect(true);
//             }
//         } else {
//             socket.disconnect(true);
//         }
//     });

//     // to emit data to a certain client
//     socket.emit("topic 1", "some data")

//     // collecting connected users in a array
//     // connectedUsers.push(socket)

//     socket.on("disconnect", (message) => {
//         console.log("Client disconnected with id: ", message);
//     });
// });


// to emit data to a certain client
//  connectedUsers[0].emit("topic 1", "some data")

// setInterval(() => {

//     // to emit data to all connected client
//     // first param is topic name and second is json data
//     io.emit("Test topic", { event: "ADDED_ITEM", data: "some data" });
//     console.log("emiting data to all client");

// }, 2000)

// server.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })

// export default router;
