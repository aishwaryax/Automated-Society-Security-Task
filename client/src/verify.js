import React, {Component} from 'react';
import './css/main.css'
import './css/util.css'
import './signup.css'

const axios = require('axios');
export class Verify extends Component {
	constructor(props){
		super(props);
		this.state = {
			verify: false
		};
	}

    



    

	render(){

				
    	return (
			<div>
					
					<div className="limiter">
						<div className="container-login100">
							<div className="wrap-login100 p-l-110 p-r-110 p-t-62 p-b-33">
									<span className="login100-form-title p-b-53">
										Video Feed
									</span>
									<img style={{width: "500px", height: "400px"}} src={'http://localhost:5000/video_feed'} className="App-logo" alt="logo" />
							</div>
						</div>
					</div>
					<div id="dropDownSelect1"></div>
				</div>
		)

	}
}
export default Verify;