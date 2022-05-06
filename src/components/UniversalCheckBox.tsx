import React, {ChangeEvent} from 'react';


type PropsType = {
    callBack: (eventValue: boolean) => void
    isDone: boolean
}

export const UniversalCheckBox: React.FC<PropsType> = (props) => {
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        props.callBack(newIsDoneValue);
    }
    return (
        <input type="checkbox" onChange={onChangeHandler} checked={props.isDone}/>
    );
};

