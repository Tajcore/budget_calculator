import React, { createContext, useContext, useReducer } from 'react';
import actions from '../actions/actions'

const StoreContext = createContext();
const initialState = {ip: null, id:null};

const reducer = (state, action) => {
  switch(action.type) {
    case actions.SET_IP:
      if(action.payload){
        return {
            ...state, ip: action.payload
          }
      }
      return 
    case actions.SET_ID:
      if(action.payload){
        return {
          ...state, id: action.payload
        }
      }
      return
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{state, dispatch}}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext);