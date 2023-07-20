import { useContext } from "react";
import { GlobalContext } from '../context/Context';

import axios from "axios";
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';


import { useState } from "react";
import "./signup.css";
import { Link } from "react-router-dom";




function Login() {

  let { state, dispatch } = useContext(GlobalContext);



    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");





    let handleClose = () => {
        setSuccessOpen(false);
        setErrorOpen(false);
    }

    const validationSchema = yup.object({
        email: yup
            .string('Enter a Valid Name')
            .email('enter a valid email')
            .required('email is Required'),
        password: yup
            .string('Enter Password')
            .required('Password is Required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async(values) => {
            dispatch({type:'CLICK_LOGIN'});
            console.log("values: ", values);

            try{
                let response = await axios.post(`${state.baseUrl}/login`, {
                    email: formik.values.email,
                    password: formik.values.password,
    
    
                },{
                  withCredentials: true
                })
                    dispatch({type:'CLICK_LOGOUT'});
                    let message = response.data.message;
                    console.log("message: ", message)
                    console.log("response: ", response.data);
                    setSuccessOpen(true);
                    setSuccessMessage(message);
                    dispatch({type: 'USER_LOGIN', payload: response.data.profile })
                    formik.resetForm();

                }
                catch (error) {
                    dispatch({type:'CLICK_LOGOUT'});
                    console.log("error: ", error);
                    setErrorMessage(error.response.data.message);
                    setErrorOpen(true);
                }
        },
    });

    return (
        <div>

            <form className="form" onSubmit={formik.handleSubmit}>
                
                <TextField
                    id="email"
                    name="email"
                    label="Email: "
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <br />
                <br />

                <TextField
                    id="password"
                    name="password"
                    label="Password: "
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
                <br />
                <br />

                {(state.clickLoad === false) ?
                 
                 <Button color="primary" variant="outlined" type="submit">
                    Login
                </Button>
                 :
                 <CircularProgress/> 
                }

                

                {/* Successfully Alert */}

                <Snackbar open={successOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        {successMessage}
                    </Alert>
                </Snackbar>

                {/* Error Alert */}

                <Snackbar open={errorOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        {errorMessage};
                    </Alert>
                </Snackbar>
            </form>

            <center><Link to={"/forget-password"}>Forget Password?</Link></center>

        </div>
    )
}
export default Login;
