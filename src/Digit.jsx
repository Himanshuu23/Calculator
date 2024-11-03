import { ACTIONS } from './App.jsx'

export function Digit( {name, dispatch} ) {
    return (
        <>
            <button onClick={() => dispatch({ type: ACTIONS.ADD_OPERAND, payload: {name}})} className="btn">{name}</button>
        </>
    )
}