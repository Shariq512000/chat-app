import { useContext } from "react";
import { GlobalContext } from '../context/Context';
import { useState, useEffect } from "react"
import axios from "axios";
import { Formik, Form, Field, useFormik } from 'formik';
import * as yup from 'yup';
import Avatar from '@mui/material/Avatar';
import moment from "moment";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
// import AlertTitle from '@mui/material/AlertTitle';
// import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import CancelIcon from '@mui/icons-material/Cancel';
// import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';

import coverImage from "../images/coverPhoto1.png";
import profileImage from "../images/profilePhoto1.jpg";
import InfiniteScroll from 'react-infinite-scroller';

// import { AiTwotoneEdit } from 'react-icons/ai';
import { GrUpdate } from 'react-icons/gr';
import SearchAppBar from "./header";
import Grid from '@mui/material/Grid';
import { useParams } from "react-router-dom";
import {io} from 'socket.io-client';
import "./product.css";
// import SearchAppBar from './header'



function ChatScreen() {
  let { state, dispatch } = useContext(GlobalContext);

  const { id } = useParams();

  const [writeMessage, setWriteMessage] = useState("");
  const [previousMessage, setPreviousMessage] = useState(null);
  const [recieverProfile, setRecieverProfile] = useState({});
  const [loadMessage, setLoadMessage] = useState(false);

  const getConversation = async () => {
    try {

      let response = await axios.get(`${state.baseUrl}/messages/${id}`, {
        withCredentials: true
      })

      console.log("PreviousMessage", response)
      setPreviousMessage(response.data);

    } catch (error) {
      console.log("Error", error)
    }
  }

  const getRecieverProfile = async () => {
    try {
      let response = await axios.get(
        `${state.baseUrl}/profile/${id}`, {
        withCredentials: true
      }
      )
      console.log("Reciever", response)
      setRecieverProfile(response.data)
    } catch (error) {
      console.log("Error", error)
    }
  }



  useEffect(() => {

    const socket = io(`${state.baseUrlSocketIo}`);

    socket.on('connect', function () {
      console.log("connected")
    });

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    socket.on('disconnect', function (message) {
      console.log("Socket disconnected from server: ", message);
    });
    // to subcribe to a topic
    socket.on(`${state.user._id}-${id}`, function (data) {
      console.log("Subscribe: ", `${state.user._id}-${id}`)
      console.log(data);
      getConversation();
    });


    return () => {
      socket.close();
    }


  }, [])

  useEffect(() => {
    getRecieverProfile()
    getConversation()
  }, [loadMessage])

  const sendMessage = async (e) => {

    e.preventDefault();


    try {
      const response = await axios.post(`${state.baseUrl}/message`, {
        to: id,
        text: writeMessage
      }, {
        withCredentials: true
      })
      console.log("response ", response.data)
      setWriteMessage("");
      setLoadMessage(!loadMessage)
    } catch (error) {
      console.log("Error ", error)

    }
  }


  return (

    <div>
      <h1>Chat with {recieverProfile?.firstName} {recieverProfile?.lastName}</h1>
      {console.log(recieverProfile)}

      <form onSubmit={sendMessage}>
        <input type="text"
          placeholder="type your message"
          value={writeMessage}
          onChange={(e) => {
            setWriteMessage(e.target.value)
          }}
        />
        <button type="submit">Send</button>
      </form>

      <div className='messageView'>

        {(previousMessage?.length === 0 ? "No Messages found" : null)}
        {(previousMessage === null ? "Loading..." : null)}

        {
          previousMessage?.map((eachMessage, index) => {
            const className = (eachMessage.from._id === id) ? "recipientMessage" : "myMessage"

            return <div
              key={index}
              className={`message ${className}`}>
              <div className='head'>
                <div className='name' >{eachMessage.from.firstName} {eachMessage.from.lastName}</div>
                <div className='time' >{moment(eachMessage.createdOn).fromNow()}</div>
              </div>
              <div className='text' >{eachMessage.text}</div>
            </div>

          })
        }
      </div>


    </div >

  )

}
export default ChatScreen;