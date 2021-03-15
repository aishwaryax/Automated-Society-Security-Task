import React, { Component } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import Verify from './verify'
import SignUp from './signup'
import Logs from './Logs'
import Database from './Database'
import Menu from './Menu'
export class App extends Component {
  render() {
    return (
		<BrowserRouter>
    <div >
					<nav class="navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm">
						<div id="navbarContent" class="collapse navbar-collapse">
							<ul class="navbar-nav mx-auto">
                <li class="nav-item"><a href="/" class="nav-link font-weight-bold text-uppercase">HOME</a></li>
								<li class="nav-item"><a href="/video-feed" class="nav-link font-weight-bold text-uppercase">FEED</a></li>
								<li class="nav-item"><a href="/logs" class="nav-link font-weight-bold text-uppercase">LOGS</a></li>
								<li class="nav-item"><a href="/database" class="nav-link font-weight-bold text-uppercase">DATABASE</a></li>
							</ul>
						</div>
					</nav>
    		</div>
			<Switch>
            <Route exact path = '/' component = { Menu }/>
            <Route exact path = '/video-feed' component = { Verify }/> 
            <Route exact path = '/register' component = { SignUp }/>
            <Route exact path = '/logs' component = { Logs }/>
            <Route exact path = '/database' component = { Database }/> 
        </Switch>
		</BrowserRouter>
           
    );
  }
}

export default App;