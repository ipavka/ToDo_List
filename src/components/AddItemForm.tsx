import React, {ChangeEvent, KeyboardEvent, useCallback, useState} from 'react';
import {SuperButton} from "./common/SuperButton/SuperButton";
import {SuperInputText} from "./common/SuperInput/SuperInputText";

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

export const AddItemForm: React.FC<AddItemFormPropsType> = React.memo(({addItem,}) => {
    // console.log('AddItemForm')

    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const addItemHandler = () => {
        if (title.trim() !== "") {
            addItem(title);
            setTitle("");
        } else {
            setError("Title is required");
        }
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error) setError(null);
        if (e.key === 'Enter') {
            addItemHandler();
        }
    }
    const mouseOverHandler = () => {

    }
    return <div className={"addItemForm"}>
        <SuperInputText value={title}
                        onChange={onChangeHandler}
                        onKeyPress={onKeyPressHandler}
                        error={error}>

        </SuperInputText>
        {/* ToDo: Возможно ли убрать перерисовку кнопки в момент набора текста в инпуте? */}
        <SuperButton onMouseOver={mouseOverHandler} onClick={addItemHandler}>add</SuperButton>
    </div>
})
