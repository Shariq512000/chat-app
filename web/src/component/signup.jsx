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



function Signup() {

    let { state, dispatch } = useContext(GlobalContext);



    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");





    let handleClose = () => {
        setSuccessOpen(false);
        setErrorOpen(false);
    }

    const validationSchema = yup.object({
        firstName: yup
            .string('Enter a Valid Name')
            .required('Name is Required'),
        lastName: yup
            .string('Enter a Valid Name')
            .required('Name is Required'),
        email: yup
            .string('Enter a Valid Name')
            .email('enter a valid email')
            .required('email is Required'),
        password: yup
            .string('Enter Password')
            .required('Password is Required')
            .min(6)
            .max(12),
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            dispatch({type:'CLICK_LOGIN'});
            console.log("values: ", values);
            axios.post(`${state.baseUrl}/signup`, {

                firstName: formik.values.firstName,
                lastName: formik.values.lastName,
                email: formik.values.email,
                password: formik.values.password,


            })
                .then(response => {
                    dispatch({type:'CLICK_LOGOUT'});
                    let message = response.data.message;
                    console.log("message: ", message)
                    console.log("response: ", response.data);
                    setSuccessOpen(true);
                    formik.resetForm();

                })
                .catch(err => {
                    dispatch({type:'CLICK_LOGOUT'});
                    console.log("error: ", err);
                    setErrorMessage(err.response.data.message);
                    setErrorOpen(true);
                })
        },
    });

    return (
        <div>

            <form className="form" onSubmit={formik.handleSubmit}>
                <TextField
                    id="firstName"
                    name="firstName"
                    label="First Name: "
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                />
                <br />
                <br />

                <TextField
                    id="lastName"
                    name="lastName"
                    label="Last Name: "
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                />
                <br />
                <br />

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
                    Signup
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
                        Signup Successfully!
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

export default Signup;