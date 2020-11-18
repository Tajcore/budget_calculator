import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";
import { useStore } from "./store/reducers/userStore";
import actions from "./store/actions/actions";
import useFetch from "./customHooks/useFetch";
import BudgetCalculator from "./components/BudgetCalculator";
import BudgetSummary from "./components/BudgetSummary";
import axios from 'axios'; 
import { Spin } from "antd";
function App() {
  const [userIP, setUserIP] = useState();
  const { data, loading} = useFetch(
    "https://api64.ipify.org?format=json"
  );
  
  const { dispatch } = useStore();

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setUserIP((oldIP) => data["ip"]);
      if(userIP){
        dispatch({ type: actions.SET_IP, payload: userIP });
        axios.post("http://localhost:5000/api/user", {'ip': userIP}).then((res) => 
        dispatch({type: actions.SET_ID, payload: res.data._id}) )
      }
    }
    return () => {
      isMounted = false;
    };
  }, [userIP, data, dispatch]);


  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Spin spinning={loading}>
              <BudgetCalculator />
            </Spin>
          </Route>
          <Route path="/budget/summary/:id">
            <BudgetSummary />
          </Route>
          <Route></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
