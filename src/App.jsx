import { Digit } from "./Digit.jsx";
import { OperatorBtn } from "./OperatorBtn.jsx";
import './App.css'
import { useReducer } from "react";

export const ACTIONS = {
  ADD_OPERAND: 'add-operand',
  CHOOSE_OPERATOR: 'choose-operator',
  ACTIONS_CLEAR: 'actions-clear', 
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch(type) {
    case ACTIONS.ADD_OPERAND:
      if (state.overwrite) {
        return {
          ...state,
          currOperand: payload.name,
          overwrite: false,
        }
      }
      if (state.currOperand === "0" && payload.name === "0") {
        return state
      }
      return {...state, currOperand: `${state.currOperand || ""}${ payload.name }`}
    case ACTIONS.CHOOSE_OPERATOR:
      if (state.currOperand == null && state.prevOperand == null) { return state}
      if (state.currOperand == null) {
        return {...state, operation: payload.operation}
      }
      if (state.prevOperand == null) {
        return {...state, operation: payload.operation, prevOperand: state.currOperand, currOperand: null}
      }
      return {
        ...state, prevOperand: evaluate(state), operation: payload.operation, currOperand: null
      }
    case ACTIONS.ACTIONS_CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state, overwrite: false, currOperand: null
        }
      }
      if (state.currOperand == null) return state
      if (state.currOperand.length == 1) return {...state, currOperand: null}
      return {
        ...state, currOperand: state.currOperand.slice(0, -1)
      }
    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currOperand == null || state.prevOperand == null) {return state}
      return {...state, overwrite: true,  prevOperand: null, operation: null, currOperand: evaluate(state)}
  }
}

function evaluate( { currOperand, prevOperand, operation }) {
  const prev = parseFloat(prevOperand)
  const current = parseFloat(currOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ''
  switch (operation) {
    case '+':
      computation = prev + current
      break
    case '-':
      computation = prev - current
      break
    case '*':
      computation = prev * current
      break
    case '÷':
      computation = prev / current
      break
    case '%':
      computation = prev % current
      break
  }

  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("eng-us", {
  maximumFractionDigits: 0
})

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(operand)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

export default function App() {
  const [{ currOperand, prevOperand, operation }, dispatch] = useReducer(reducer, { })

  return (
    <>
      <div className="grid-container">
        <div className="prev-value">{formatOperand(prevOperand)} {operation}</div>
        <div className="curr-value">{formatOperand(currOperand)}</div>
        <button className="btn span-two" onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        <button className="btn" onClick={() => dispatch({ type: ACTIONS.ACTIONS_CLEAR })}>AC</button>
        <OperatorBtn operation='*' dispatch={dispatch}/>
        <Digit name='9' dispatch={dispatch}/> 
        <Digit name='8' dispatch={dispatch}/> 
        <Digit name='7' dispatch={dispatch}/> 
        <OperatorBtn operation='-' dispatch={dispatch}/>
        <Digit name='6' dispatch={dispatch}/> 
        <Digit name='5' dispatch={dispatch}/> 
        <Digit name='4' dispatch={dispatch}/> 
        <OperatorBtn operation='+' dispatch={dispatch}/> 
        <Digit name='3' dispatch={dispatch}/> 
        <Digit name='2' dispatch={dispatch}/> 
        <Digit name='1' dispatch={dispatch}/> 
        <OperatorBtn operation='÷' dispatch={dispatch}/> 
        <Digit name='0' dispatch={dispatch}/> 
        <Digit name='.' dispatch={dispatch}/> 
        <OperatorBtn operation='%' dispatch={dispatch}/> 
        <button onClick={() => dispatch({ type: ACTIONS.EVALUATE})} className="btn">=</button> 
      </div>
    </>
  )
}