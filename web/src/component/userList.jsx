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
import { Link } from "react-router-dom";
import "./product.css";
// import SearchAppBar from './header'



function UserList() {
  let { state, dispatch } = useContext(GlobalContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(null);
  // const [ loadUsers , setLoadUsers ] = useState(false);




  useEffect(() => {
    getUsers();

  }, [])

  const getUsers = async (e) => {

    if (e) e.preventDefault();


    try {
      const response = await axios.get(`${state.baseUrl}/users?q=${searchTerm}`, {
        withCredentials: true
      })
      console.log("response ", response.data)
      setUsers(response.data)
      // setLoadUsers(!loadUsers);
    } catch (error) {
      console.log("Error ", error)

    }
  }


  return (
    <div>
      <h1>Search User to Start Chat</h1>

      {console.log("Users", users)}

      <form onSubmit={getUsers}>
        <input type="search"
          onChange={(e) => {
            setSearchTerm(e.target.value)
          }}
        />
        <button type="submit">Search</button>
      </form>

      {(users === null) ? "Loading..." : null}
      {(users?.lenght === 0) ? <h3>No User Found</h3> : null}
      {
        users?.map((eachUser, i) => (
          <div key={i} className="usersList">
            <Link to={`/chat/${eachUser._id}`}>
              <h2>{eachUser?.firstName} {eachUser?.lastName}</h2>
              <span>{eachUser?.email}</span>
              {(eachUser?.me) ? <span> <br /> <br /> this is me</span> : null}
            </Link>
          </div>
        ))
      }

    </div >

  )

}
export default UserList;