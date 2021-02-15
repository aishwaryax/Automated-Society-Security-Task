import React, { Component } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import Verify from './verify'
import SignUp from './signup'

export class App extends Component {
  render() {
    return (
		<BrowserRouter>
			<Switch>
            <Route exact path = '/' component = { Verify }/> 
            <Route path = '/register' component = { SignUp }/> 
        </Switch>
		</BrowserRouter>
           
    );
  }
}

export default App;