import React from 'react';
import ReactDOM from 'react-dom';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {Button, TextField, Box, Stack} from "@mui/material";
import {ConnectionStrings} from "../config/connectionStrings";
import Swal from 'sweetalert2'


const validationSchema = yup.object({
    email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string()
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
});

const LoginForm = () => {
        const formik = useFormik({
            initialValues: {
                email: '',
                password: '',
            },
            validationSchema: validationSchema,
            onSubmit: async (values) => {
                alert(JSON.stringify(values, null, 2));

                let res = await fetch(ConnectionStrings.backend + "Account/login", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                }).catch(err => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                        footer: 'Please try again later.'
                    })
                });

                if (!res?.ok)
                    return Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                        footer: 'Please try again later.'
                    })

                let data = await res.json();

                if (data == null || data.accessToken == null)


                if (data.accessToken) {
                    localStorage.setItem("accessToken", data.accessToken);

                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                        footer: 'Please try again later.'
                    });

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 800);
                }

            }
        });

        return (
            <div>
                <form onSubmit={formik.handleSubmit}>
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                        sx={{width: '50%'}}
                    >
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <Button color="primary" variant="contained" fullWidth type="submit">
                            Submit
                        </Button>
                    </Stack>
                </form>
            </div>
        );
    }
;

export default LoginForm;
