import { useContext } from "react";
import { GlobalContext } from '../context/Context';
import { useState, useEffect } from "react"
import axios from "axios";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { io } from 'socket.io-client';
import { Link } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import "./product.css";



function UserList() {
  let { state, dispatch } = useContext(GlobalContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(null);
  const [notifications, setNotifications] = useState([]);




  useEffect(() => {
    getUsers();

  }, [])


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
    socket.on(`personal-channel-${state.user._id}`, function (data) {
      console.log("Subscribe: ", `personal-channel-${state.user._id}`)
      console.log(data);
      // getConversation();
      setNotifications(
        prev => [data, ...prev]
      )
    });


    return () => {
      socket.close();
    }


  }, [])

  const getUsers = async (e) => {

    if (e) e.preventDefault();


    try {
      const response = await axios.get(`${state.baseUrl}/users?q=${searchTerm}`, {
        withCredentials: true
      })
      console.log("response ", response.data)
      setUsers(response.data)
    } catch (error) {
      console.log("Error ", error)

    }
  }

  const dismissNotification = (notification) => {

    setNotifications(
      allNotifications => {
        const filteredNotification = allNotifications.filter(eachItem => eachItem._id !== notification._id)
        return filteredNotification;
      }
    )

  }

  return (
    <div>
      <div className="notificationView">
        {notifications.map((eachNotification, i) => {
          return (
            <div key={i} className="item">
              <Link to={`/chat/${eachNotification.from._id}`} className="linkk">
                <div className="title">{eachNotification.from.firstName} {eachNotification.from.lastName}</div>
                <div>{eachNotification.text.slice(0, 20)}</div>
              </Link>
              <IconButton onClick={
                () => {
                  dismissNotification(eachNotification)
                }
              }><CloseIcon fontSize="small" /></IconButton>
            </div>
          )
        })}
      </div>
      <h1>Search User to Start Chat</h1>

      {console.log("Users", users)}

      <form onSubmit={getUsers} className="sendsms">
        <TextField
          id="email"
          label="Search User: "
          type="search"
          onChange={(e) => {
            setSearchTerm(e.target.value)
          }}
        />
        {/* <button type="submit">Search</button> */}
      </form>

      {(users === null) ? "Loading..." : null}
      {(users?.lenght === 0) ? <h3>No User Found</h3> : null}
      <div className="userView">
        {
          users?.map((eachUser, i) => (
            <div key={i} className="usersList">
              <Link to={`/chat/${eachUser._id}`} className="userLink">
                <h2>{eachUser?.firstName} {eachUser?.lastName}</h2>
                <span>{eachUser?.email}</span>
                {(eachUser?.me) ? <span> <br /> <br /> this is me</span> : null}
              </Link>
            </div>
          ))
        }
      </div>

    </div >

  )

}
export default UserList;