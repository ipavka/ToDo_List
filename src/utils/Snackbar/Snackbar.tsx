import React from 'react';
import s from './Snackbar.module.css'
import {useSelector} from "react-redux";
import {AppRootStateType} from "../../state/store";

// type SnackbarPropsType = {
//     error: string | null
// }

export const Snackbar = () => {

    const closingHandler = () => {
        console.log('closingHandler');
    }
    const  error = useSelector<AppRootStateType, string | null>(state => state.app.error);
    return (<>
            {error && <div className={s.snackbar}>
                {error}
                <div onClick={closingHandler} className={s.close}></div>
            </div>}
        </>
    );
};

