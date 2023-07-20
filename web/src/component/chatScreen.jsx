import { useContext } from "react";
import { GlobalContext } from '../context/Context';
import { useState, useEffect } from "react"
import axios from "axios";
import moment from "moment";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import { useParams } from "react-router-dom";
import { io } from 'socket.io-client';
import "./product.css";



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

    const socket = io(`${state.baseUrlSocketIo}`, {
      withCredentials: true
    });

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
      // getConversation();
      setPreviousMessage(
        prev => [data, ...prev]
      );
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

      <form onSubmit={sendMessage} className="sendsms">
        
        <TextField

          multiline
          rows={1}
          value={writeMessage}
          variant="filled"
          id="text"
          placeholder="Write Some Thing"
          onChange={(e) => {
            setWriteMessage(e.target.value)
          }}
        />
        <br />
        <br />
        <IconButton type="submit"><SendIcon /></IconButton>
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
              <br />
              <div className='text' >{eachMessage.text}</div>
            </div>

          })
        }
      </div>


    </div >

  )

}
export default ChatScreen;