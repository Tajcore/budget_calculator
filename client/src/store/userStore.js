import React, { createContext, useContext, useReducer } from 'react';
import axios from 'axios';

const StoreContext = createContext();
const initialState = {ip: null};

const reducer = (state, action) => {
  switch(action.type) {
    case "GET_IP":
      var ip = null;
      if (!window.localStorage.getItem("ip")){
        axios.get("https://api64.ipify.org?format=json	").then((res) =>{
          ip = res.data.ip;
          window.localStorage.setItem("ip", ip);
        })}
      else{
        ip = window.localStorage.getItem("ip");
        
      }
      return {
        ip: ip
      }
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