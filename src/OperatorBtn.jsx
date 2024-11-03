import { ACTIONS } from './App.jsx'

export function OperatorBtn( { operation, dispatch } ){
    return (
        <>
            <button className="btn" onClick={() => {dispatch({type: ACTIONS.CHOOSE_OPERATOR, payload: { operation }})}}>{operation}</button>
        </>
    )
}