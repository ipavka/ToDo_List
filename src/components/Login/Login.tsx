import React from 'react';
import s from "./Login.module.css";
import {useFormik} from 'formik';
import SuperCheckbox from "../common/SuperCheckbox/SuperCheckbox";

type LoginFormType = {
    email: string
    password: string
    rememberMe: boolean
}

export const Login = () => {

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });
    return (
        <div className={s.mainBlock}>
            <h1>Login Form</h1>
            <form  className={s.loginForm} onSubmit={formik.handleSubmit}>
                <input
                    className={s.superInput}
                    // type="email"
                    placeholder="Email"
                    {...formik.getFieldProps("email")}
                />
                <input
                    className={s.superInput}
                    type="password"
                    placeholder="Password"
                    {...formik.getFieldProps("password")}
                />
                <SuperCheckbox  {...formik.getFieldProps("rememberMe")}
                                checked={formik.values.rememberMe}>
                    remember me
                </SuperCheckbox>

                <button className={s.superButton} type="submit">LOGIN</button>
            </form>
        </div>

    );
};

