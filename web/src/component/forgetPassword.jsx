import { useContext } from "react";
import { GlobalContext } from '../context/Context';

import axios from "axios";
import { useFormik } from 'formik';
import { useNavigate } from "react-router-dom";
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';


import { useState } from "react";
import "./signup.css";




function ForgetPassword() {

    let { state, dispatch } = useContext(GlobalContext);

    const navigate = useNavigate();



    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [getEmail, setGetEmail] = useState("");
    const [getOtp, setGetOtp] = useState("");
    const [getNewPassword, setGetNewPassword] = useState("");
    const [loadOtp, setLoadOtp] = useState(false);
    const [putOtp, setPutOtp] = useState(false);





    let handleClose = () => {
        setSuccessOpen(false);
        setErrorOpen(false);
    }

    const validationSchema = yup.object({
        email: yup
            .string('Enter a Valid Email')
            .email('Enter a Valid Email')
            .required('email is Required'),
        otp: yup
            .string("Enter a Valid OTP")
            .required("Enter OTP")
            .min(5)
            .max(5),
        newPassword: yup
            .string("Enter a Valid Password")
            .required("Enter Password")
            .min(6, "enter minimum 6 letters")
            .max(12, "Enter maximum 12 letters")
    });

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log("Clicked");
            dispatch({ type: 'CLICK_LOGIN' });
            console.log("values: ", values);
            setGetEmail(formik.values.email);

            try {
                let response = await axios.post(`${state.baseUrl}/forget-password`, {
                    email: formik.values.email,

                }, {
                    withCredentials: true
                })

                setLoadOtp(true)
                dispatch({ type: 'CLICK_LOGOUT' });
                let message = response.data.message;
                console.log("response :", response);
                console.log("message: ", message);
                console.log("response: ", response.data);
                setSuccessOpen(true);
                setSuccessMessage(message);

            }
            catch (error) {
                dispatch({ type: 'CLICK_LOGOUT' });
                console.log("error: ", error);
                setErrorMessage(error.response.data.message);
                setErrorOpen(true);
            }
        },
    });

    const formikOtp = useFormik({
        initialValues: {
            otp: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            dispatch({ type: 'CLICK_LOGIN' });
            console.log("values: ", values);
            setGetOtp(formikOtp.values.otp)

            try {
                let response = await axios.post(`${state.baseUrl}/forget-password-1`, {
                    email: getEmail,
                    otp: formikOtp.values.otp

                }, {
                    withCredentials: true
                })
                setPutOtp(true);
                dispatch({ type: 'CLICK_LOGOUT' });
                let message = response.data.message;
                console.log("response :", response);
                console.log("message: ", message);
                console.log("response: ", response.data);
                setSuccessOpen(true);
                setSuccessMessage(message);

            }
            catch (error) {
                dispatch({ type: 'CLICK_LOGOUT' });
                console.log("error: ", error);
                setErrorMessage(error.response.data.message);
                setErrorOpen(true);
            }
        },
    });

    const formikPassword = useFormik({
        initialValues: {
            newPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            dispatch({ type: 'CLICK_LOGIN' });
            console.log("values: ", values);

            try {
                let response = await axios.post(`${state.baseUrl}/forget-password-2`, {
                    email: getEmail,
                    otp: getOtp,
                    password: formikPassword.values.newPassword

                }, {
                    withCredentials: true
                })
                dispatch({ type: 'CLICK_LOGOUT' });
                let message = response.data.message;
                console.log("response :", response);
                console.log("message: ", message);
                console.log("response: ", response.data);
                navigate("/");
                console.log("navigate");
                formikPassword.resetForm();
                setSuccessOpen(true);
                setSuccessMessage(message);

            }
            catch (error) {
                dispatch({ type: 'CLICK_LOGOUT' });
                console.log("error: ", error);
                setErrorMessage(error.response.data.message);
                setErrorOpen(true);
            }
        },
    });

    let sendOtp = async (e) => {
        e.preventDefault();
        console.log("Clicked");
        dispatch({ type: 'CLICK_LOGIN' });


        try {
            let response = await axios.post(`${state.baseUrl}/forget-password`, {
                email: getEmail,

            }, {
                withCredentials: true
            })

            setLoadOtp(true)
            dispatch({ type: 'CLICK_LOGOUT' });
            let message = response.data.message;
            console.log("Your OTP :", response.data.Otp);
            console.log("message: ", message);
            console.log("response: ", response.data);
            setSuccessOpen(true);
            setSuccessMessage(message);

        }
        catch (error) {
            dispatch({ type: 'CLICK_LOGOUT' });
            console.log("error: ", error);
            setErrorMessage(error.response.data.message);
            setErrorOpen(true);
        }
    };

    let confirmOtp = async(e) => {
        e.preventDefault();

        dispatch({ type: 'CLICK_LOGIN' });

            try {
                let response = await axios.post(`${state.baseUrl}/forget-password-1`, {
                    email: getEmail,
                    otp: getOtp

                }, {
                    withCredentials: true
                })
                setPutOtp(true);
                dispatch({ type: 'CLICK_LOGOUT' });
                let message = response.data.message;
                console.log("response :", response);
                console.log("message: ", message);
                console.log("response: ", response.data);
                setSuccessOpen(true);
                setSuccessMessage(message);
            }
            catch (error) {
                dispatch({ type: 'CLICK_LOGOUT' });
                console.log("error: ", error);
                setErrorMessage(error.response.data.message);
                setErrorOpen(true);
            }
    }
    let changePassword = async(e) => {

            e.preventDefault();

            dispatch({ type: 'CLICK_LOGIN' });

            try {
                let response = await axios.post(`${state.baseUrl}/forget-password-2`, {
                    email: getEmail,
                    otp: getOtp,
                    password: getNewPassword

                }, {
                    withCredentials: true
                })
                dispatch({ type: 'CLICK_LOGOUT' });
                let message = response.data.message;
                console.log("response :", response);
                console.log("message: ", message);
                console.log("response: ", response.data);
                setSuccessOpen(true);
                setSuccessMessage("Password Changed");
                e.reset();
                navigate("/");
                console.log("navigate");
                formikPassword.resetForm();

            }
            catch (error) {
                dispatch({ type: 'CLICK_LOGOUT' });
                console.log("error: ", error);
                setErrorMessage(error.response.data.message);
                setErrorOpen(true);
            }

    }

    return (
        <div>

            {(!loadOtp && !putOtp) ?
                <form className="form" onSubmit={sendOtp}>

                    <TextField
                        id="email"
                        name="email"
                        label="Enter your Email"
                        type="email"
                        onChange={
                            (e) => {
                                setGetEmail(e.target.value)
                            }
                        }
                    />
                    <br />
                    <br />

                    {(state.clickLoad === false) ?

                        <Button color="primary" variant="outlined" type="submit">
                            Send OTP
                        </Button>
                        :
                        <CircularProgress />
                    }

                </form>
                :
                null
            }

            {(loadOtp && !putOtp) ?
                <form className="form" onSubmit={confirmOtp}>

                    <TextField
                        id="otp"
                        name="otp"
                        label="Enter 5 Digit OTP"
                        type="text"
                        onChange={
                            (e) => {
                                setGetOtp(e.target.value)
                            }
                        }
                    />
                    <br />
                    <br />

                    {(state.clickLoad === false) ?

                        <Button color="primary" variant="outlined" type="submit">
                            Confirm OTP
                        </Button>
                        :
                        <CircularProgress />
                    }
                </form>
                :
                null
            }

            {(loadOtp && putOtp) ?
                <form className="form" onSubmit={changePassword}>


                    <TextField
                        id="newPassword"
                        name="newPassword"
                        label="Enter New Password"
                        type="password"
                        onChange={(e) => {
                            setGetNewPassword(e.target.value)
                        }}
                    />
                    <br />
                    <br />

                    {(state.clickLoad === false) ?

                        <Button color="primary" variant="outlined" type="submit">
                            Change Password
                        </Button>
                        :
                        <CircularProgress />
                    }
                </form>
                :
                null
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
        </div>
    )
}
export default ForgetPassword;