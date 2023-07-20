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




function ChangePassword() {

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
        currentPassword: yup
            .string('Enter a Valid Name')
            .required('email is Required'),
        newPassword: yup
            .string('Enter Password')
            .required('Password is Required'),
        confirmPassword: yup
            .string()
            .label('confirm password')
            .required()
            .oneOf([yup.ref('newPassword'), null], 'Passwords must be Same'),
    });

    const formik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword:'',
        },
        validationSchema: validationSchema,
        onSubmit: async(values) => {
            dispatch({type:'CLICK_LOGIN'});
            console.log("values: ", values);

            try{
                let response = await axios.post(`${state.baseUrl}/change-password`, {
                    currentPassword: formik.values.currentPassword,
                    newPassword: formik.values.newPassword,
    
    
                },{
                  withCredentials: true
                })
                    dispatch({type:'CLICK_LOGOUT'});
                    let message = response.data.message;
                    console.log("response :" , response);
                    console.log("message: ", message);
                    console.log("response: ", response.data);
                    setSuccessOpen(true);
                    setSuccessMessage(message);

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
                    id="currentPassword"
                    name="currentPassword"
                    label="Enter your Current Password "
                    type="password"
                    value={formik.values.currentPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
                    helperText={formik.touched.currentPassword && formik.errors.currentPassword}
                />
                <br />
                <br />

                <TextField
                    id="newPassword"
                    name="newPassword"
                    label=" Enter new Password "
                    type="password"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                    helperText={formik.touched.newPassword && formik.errors.newPassword}
                />
                <br />
                <br />
                <TextField
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                />
                <br />
                <br />


                {(state.clickLoad === false) ?
                 
                 <Button color="primary" variant="outlined" type="submit">
                    Change Password
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





        </div>
    )
}
export default ChangePassword;