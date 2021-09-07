import React, { useState, useEffect } from "react"
import Login from "./authentication/Login";
import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import PrivateRoute from './authentication/PrivateRoute'
import Navigation from "./authentication/Navigation";
import LandingPage from "./authentication/LandingPage";
import ClaimHolder from "./authentication/ClaimHolder";
import Help from "./authentication/Help";
import IssuePassport from "./authentication/IssuePassport";


function App() {

  useEffect(() => {

  }, []);



  return (
    <>

      <AuthProvider>
        <Router>
          <Navigation />

          <Switch>

            <PrivateRoute exact path="/" component={LandingPage} />
            <Route path="/landing" component={LandingPage} />
            <Route path="/issue" component={IssuePassport} />
            <Route path="/claimholder" component={ClaimHolder} />
            <Route exact path="/login" component={Login} />
            <Route path="/help" component={Help} />

          </Switch>



        </Router>
      </AuthProvider> 
    </>

  )
}

export default App;
