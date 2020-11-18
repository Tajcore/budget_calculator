import './App.css';
import {Sidebar} from './layouts/Sidebar.js'
import { useStore } from "./store/userStore";
import { useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {BudgetInfo} from './layouts/Budget_Info';
import {Budget_Form} from './layouts/Budget_Form';

function App() {
  
  const {state, dispatch} = useStore();
  useEffect(()=>{
    dispatch({type : "GET_IP"});

  },[])
  return (
    <Router>
    <div className="App">
      <div style={{height: "80vh"}}>
          <Switch>
            <Route exact path="/budget/:id" component={BudgetInfo}></Route>
            <Route exact path ="/" component = {Budget_Form}></Route>
          </Switch>
      </div>
      <Sidebar></Sidebar>
    </div>
    </Router>

  );
}

export default App;
