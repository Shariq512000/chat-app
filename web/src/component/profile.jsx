import { useContext } from "react";
import { GlobalContext } from '../context/Context';
import { useState, useEffect } from "react"
import axios from "axios";
import { Formik, Form, Field, useFormik } from 'formik';
import * as yup from 'yup';
import Avatar from '@mui/material/Avatar';
import moment from "moment"
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
import "./product.css";
// import SearchAppBar from './header'



function Profile() {
  let { state, dispatch } = useContext(GlobalContext);

  



  return (
    <div>
      <div className="cover">
        <img src={coverImage} alt="" />
      </div>
      <div className="profile">
        <img src={profileImage} alt="" />
        <span> {state?.user?.firstName}  {state?.user?.lastName} </span>
      </div>
    </div>

  )

}
export default Profile;