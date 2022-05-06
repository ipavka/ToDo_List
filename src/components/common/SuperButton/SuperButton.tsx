import React, {ButtonHTMLAttributes, DetailedHTMLProps} from 'react'
import s from './SuperButton.module.css'

// тип пропсов обычной кнопки, children в котором храниться название кнопки там уже описан
type DefaultButtonPropsType = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

type SuperButtonPropsType = DefaultButtonPropsType & {
    red?: boolean
    selected?: boolean
}

export const SuperButton: React.FC<SuperButtonPropsType> = React.memo((
    {
        red, className, selected,
        ...restProps// все остальные пропсы попадут в объект restProps, там же будет children
    }
) => {
    // console.log('SuperButton')
    const finalClassName = `${selected ? s.selected : s.default} ${red ? s.red : s.default} ${className}`

    return (
        <button
            className={finalClassName}
            {...restProps} // отдаём кнопке остальные пропсы если они есть (children там внутри)
        />
    )
})
