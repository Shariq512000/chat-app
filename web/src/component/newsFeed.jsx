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
import "./product.css";
// import SearchAppBar from './header'



function PostFeed() {
  let { state, dispatch } = useContext(GlobalContext);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [failDeleteOpen, setFailDeleteOpen] = useState(false);
  const [updatedOpen, setUpdatedOpen] = useState(false);
  const [failUpdatedOpen, setFailUpdatedOpen] = useState(false);
  const [loadPosts, setLoadPosts] = useState(false);
  const [clickEdit, setClickEdit] = useState(false);
  const [currentPosts, setCurrentPosts] = useState(null);
  const [failedMessage, setFailedMessage] = useState("");
  const [eof, setEof] = useState(false);
  const [preview, setPreview] = useState("");




  const getAllPosts = async () => {
    if (eof) return;
    try {
      const response = await axios.get(`${state.baseUrl}/postFeed?page=${posts.length}`, {
        withCredentials: true
      })
      if (response.data.data.length === 0) setEof(true);
      console.log("response: ", response);
      console.log("data: ", response.data)
      setPosts((prev) => {
        return [...prev, ...response.data.data]
      });
      console.log("posts: ", posts);
    }
    catch (error) {
      console.log("error in getting all Products: ", error);
    }
  }

  useEffect(() => {
    getAllPosts();

  }, [loadPosts])



  let handleClose = () => {
    setOpen(false);
    setErrorOpen(false);
    setDeleteOpen(false);
    setFailDeleteOpen(false);
    setUpdatedOpen(false);
    setFailUpdatedOpen(false);
  }

  // let deletePost = async (_id) => {
  //   try {
  //     const response = await axios.delete(`${state.baseUrl}/post/${_id}`)
  //     console.log("response: ", response.data);
  //     setLoadPosts(!loadPosts);
  //     setDeleteOpen(true);
  //   }
  //   catch (error) {
  //     console.log("requested failed: ", error);
  //     setFailDeleteOpen(true);
  //   }
  // }
  // let editPost = (post) => {
  //   setClickEdit(!clickEdit);
  //   setCurrentPosts(post);
  //   editFormik.setFieldValue("name", post.name)
  //   editFormik.setFieldValue("price", post.price)
  //   editFormik.setFieldValue("description", post.description)
  // }





  const validationSchema = yup.object({
    text: yup
      .string('Enter Post Text')
      .required('Text is Required'),
  });
  const formik = useFormik({
    initialValues: {
      text: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch({ type: 'CLICK_LOGIN' });
      console.log("values: ", values);

      let postImage = document.getElementById("pictures");
      console.log("picture :", postImage.files[0]);
      let formData = new FormData();
      formData.append("myFile", postImage.files[0]);
      formData.append("text", formik.values.text);

      axios({
        method: "post",
        url: `${state.baseUrl}/post`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(response => {
          dispatch({ type: 'CLICK_LOGOUT' });
          let message = response.data.message;
          console.log("message: ", message)
          console.log("response: ", response.data);
          setOpen(true);
          setLoadPosts(!loadPosts);
          setPreview("");
          formik.resetForm();
        })
        .catch(err => {
          dispatch({ type: 'CLICK_LOGOUT' });
          console.log("error: ", err);
          setFailedMessage(err.data.message);
          setErrorOpen(true);
        })
    },
  });
  // const editFormik = useFormik({
  //   initialValues: {
  //     text: '',
  //   },
  //   validationSchema: validationSchema,
  //   onSubmit: (values) => {
  //     console.log("values: ", values);
  //     setClickEdit(!clickEdit);
  //     axios.put(`${state.baseUrl}/post/${currentPosts._id}`, {

  //       text: editFormik.values.text,
  //     })
  //       .then(response => {
  //         setUpdatedOpen(true);
  //         let message = response.data.message;
  //         console.log("message: ", message)
  //         console.log("response: ", response.data);
  //         setLoadPosts(!loadPosts);


  //       })
  //       .catch(err => {
  //         setFailUpdatedOpen(true);
  //         console.log("error: ", err);
  //       })
  //   },
  // });




  return (
    <div>
      {/* <SearchAppBar /> */}
      <form className="form" onSubmit={formik.handleSubmit}>
        <TextField


          multiline
          rows={5}
          variant="filled"

          id="text"
          name="text"
          label="Text:"
          placeholder="What's on your mind"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <br />
        <br />
        <input
          type="file"
          id="pictures"
          accept="image/*"
          onChange={(e) => {
            let url = URL.createObjectURL(e.currentTarget.files[0]);
            console.log("URL :", url);
            setPreview(url);
          }}
        />
        <br />
        {(preview.length >= 1)?
        <img src={preview} width={200} alt="" />
        :
        null
        }
        <br />
        <br />
        {(state.clickLoad === false) ?

          <Button color="primary" variant="contained" type="submit">
            Post
          </Button>
          :
          <CircularProgress />
        }



        {/* Successfully Alert */}

        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Posted!
          </Alert>
        </Snackbar>

        {/* Error Alert */}

        <Snackbar open={errorOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {failedMessage}!
          </Alert>
        </Snackbar>

        {/* Succfull Alert */}

        <Snackbar open={deleteOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            PostFeed deleted Successfully!
          </Alert>
        </Snackbar>

        {/* Error Alert */}

        <Snackbar open={failDeleteOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            Requested failed to Delete PostFeed!
          </Alert>
        </Snackbar>

      </form>
      <Snackbar open={updatedOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          PostFeed Edited Successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={failUpdatedOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Requested failed to Edit PostFeed!
        </Alert>
      </Snackbar>
      <br />
      <br />
      <InfiniteScroll
        pageStart={0}
        loadMore={getAllPosts}
        hasMore={!eof}
        loader={<center><div className="loader" key={0}><CircularProgress /></div></center>}
      >
        <div style={{ alignSelf: "center" }}>
          {posts?.map((eachPost, i) => (
            <div key={i} className="card">
              <div className="postP">
                <Avatar className="pof" src={profileImage} sx={{ height: 55, width: 55, top: 17 }} />
                <div className="nam">
                  <h3><b>{eachPost?.owner?.firstName} {eachPost?.owner?.lastName}</b></h3>
                  <p>{moment(eachPost.createdOn).fromNow()}</p>
                </div>
              </div>
              <p>{eachPost?.text}</p>
              <br />
              {(eachPost.imageUrl) ?
                <img src={eachPost.imageUrl} alt="post image" />
                :
                null
              }



              {/* <IconButton aria-label="delete" size="large" color="red" style={{ color: "red" }} onClick={() => {
              deletePost(eachPost?._id)
            }} >
              <DeleteIcon fontSize="inherit" color="red" />
            </IconButton>
            {
              (clickEdit && currentPosts._id === eachPost._id) ? <IconButton aria-label="cancel" size="large" color="orange" style={{ color: "orange" }} onClick={() => {
                editPost(eachPost)
              }} >
                <CancelIcon fontSize="inherit" color="orange" />
              </IconButton> :
                <IconButton aria-label="edit" size="large" color="green" style={{ color: "green" }} onClick={() => {
                  editPost(eachPost)
                }} >
                  <EditIcon fontSize="inherit" color="green" />
                </IconButton>
            } */}

              {/* {
              (clickEdit && currentPosts._id === eachPost._id) ?
                <div>
                  <form className="form" onSubmit={editFormik.handleSubmit}>
                    <TextField
                      id="name"
                      name="name"
                      label="Name: "
                      value={editFormik.values.name}
                      onChange={editFormik.handleChange}
                      error={editFormik.touched.name && Boolean(editFormik.errors.name)}
                      helperText={editFormik.touched.name && editFormik.errors.name}
                    />
                    <br />
                    <br />

                    <TextField
                      id="price"
                      name="price"
                      label="price: "
                      type="number"
                      value={editFormik.values.price}
                      onChange={editFormik.handleChange}
                      error={editFormik.touched.price && Boolean(editFormik.errors.price)}
                      helperText={editFormik.touched.price && editFormik.errors.price}
                    />
                    <br />
                    <br />

                    <TextField
                      id="description"
                      name="description"
                      label="description: "
                      type="textarea"
                      value={editFormik.values.description}
                      onChange={editFormik.handleChange}
                      error={editFormik.touched.description && Boolean(editFormik.errors.description)}
                      helperText={editFormik.touched.description && editFormik.errors.description}
                    />
                    <br />
                    <br />

                    <IconButton color="primary" variant="contained" type="submit">

                      <GrUpdate />

                    </IconButton>


                  </form>

                </div>
                : null
            } */}



            </div>

          ))
          }
        </div>
      </InfiniteScroll>



    </div >

  )

}
export default PostFeed;