import React from 'react';
import {Switch, Route, Redirect} from "react-router-dom";
import Auth from "./pages/Auth";
import Main from "./pages/Main"
import "./App.css"
function App() {
  return (
    <div className="wrapper">
      <Switch>
        <Route path={"/auth"} component={Auth}/>
        <Route path={"/main"} component={Main}/>

        <Redirect from={"/"} to={"/auth"} />
      </Switch>
    </div>
  );
}

export default App;
