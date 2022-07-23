import * as Yup from 'yup';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
// form
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
// @mui
import {Link, Stack, IconButton, InputAdornment, Alert} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import {FormProvider, RHFTextField, RHFCheckbox} from '../../../components/hook-form';
import useAuth from "../../../hooks/useAuth";

// ----------------------------------------------------------------------

export default function LoginForm() {
    const navigate = useNavigate();
    const {login} = useAuth();

    const [showPassword, setShowPassword] = useState(false);

    const LoginSchema = Yup.object().shape({
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const defaultValues = {
        email: '',
        password: '',
        afterSubmit: '',
        remember: true,
    };

    const methods = useForm({
        resolver: yupResolver(LoginSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: {isSubmitting},
    } = methods;

    const onSubmit = async () => {
        const {email, password} = methods.getValues();
        const res = await login(email, password);
        if (res.success) {
            navigate('/dashboard', {replace: true});
        } else {
            methods.setError('afterSubmit', {message: res.message ?? 'Login failed - unknown reason'});
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                {!!methods.formState.errors.afterSubmit && <Alert severity="error">{methods.formState.errors.afterSubmit.message}</Alert>}

                <RHFTextField name="email" label="Email address"/>

                <RHFTextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{my: 2}}>
                <Link variant="subtitle2" underline="hover">
                    Forgot password?
                </Link>
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                Login
            </LoadingButton>
        </FormProvider>
    );
}
