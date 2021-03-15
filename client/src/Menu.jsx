import React, {Component} from 'react';
import './css/main.css'
import './css/util.css'
import './signup.css'
import {Link} from 'react-router-dom'
import { BallTriangle, LoaderProvider } from '@agney/react-loading'

const axios = require('axios');

export class Menu extends Component {
	constructor(props){
		super(props);
		this.state = {
            verify: false, message: "", loading: false
		};
	}

    

	trainHandler = async () => {
        this.setState({loading: true})
		const response = await axios.post('http://localhost:5000/train')
        console.log(response.data)
        this.setState({message: response.data.message, loading: false})

  }


    

	render(){


    	return (
            <div>
					
            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100 p-l-110 p-r-110 p-t-62 p-b-33">
                            <span className="login100-form-title p-b-53">
                                ASST 6
                            </span>
                            { this.state.loading ? (<div class="loader"></div>
                             ): 
                            (<></>)}
                            {this.state.message ? (
                            <div class="alert alert-success" role="alert">
                                {this.state.message}
                              </div>
                              
                            ): 
                            (<></>)}
                            
                            <div className="container-login100-form-btn m-t-17">
                                <Link to="/video-feed" className="login100-form-btn">
                                    Video Feed
                                </Link>
                            </div>
                            <div className="container-login100-form-btn m-t-17">
                                <Link id="submit" to="/register" className="login100-form-btn">
                                    Add User
                                </Link>
                            </div>
                            <div className="container-login100-form-btn m-t-17">
                                <button onClick={this.trainHandler} className="login100-form-btn">
                                    Train Model
                                </button>
                            </div>
                            <div className="container-login100-form-btn m-t-17">
                                <Link id="submit" to="/logs" className="login100-form-btn">
                                    Check Logs
                                </Link>
                            </div>
                            <div className="container-login100-form-btn m-t-17">
                                <Link id="submit" to="/databse" className="login100-form-btn">
                                    Check Database
                                </Link>
                            </div>
                    </div>
                </div>
            </div>
            <div id="dropDownSelect1"></div>
        </div>

		)
	}
	}

export default Menu;