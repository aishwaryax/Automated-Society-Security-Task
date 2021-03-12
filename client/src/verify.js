import React, {Component} from 'react';
import './css/main.css'
import './css/util.css'
import './signup.css'
import Sketch from "react-p5"
import { Link, Redirect } from 'react-router-dom';
import error from './error.mp3'
import msg from './msg.mp3'
import temp from './temp.mp3'

const axios = require('axios');
let video;
export class Verify extends Component {
	constructor(props){
		super(props);
		this.state = {
			verify: false
		};
	}
	setup(p5, canvasParentRef) {
        p5.noCanvas();
        video = p5.createCapture(p5.VIDEO);
        const v = document.querySelector("video");
        let st = "position: absolute; top: 255px;"
        v.setAttribute("style", st);
    }

    setup2 = async () => {
    	  video.loadPixels();
          console.log(video.canvas);
          const image64 = video.canvas.toDataURL();
          const response = await axios.post('http://localhost:5000/verify', {'image64':image64});
          console.log(response.data.message);
          if(response.data.message){
	        this.setState({
	        	verify:true
			})
			this.beep(msg)
		  }
		  else if (response.data.error) {
			  this.beep(error)
		  }
		  else if (response.data.temperature) {
            this.beep(temp)
        }
	}
	
	beep = (sound) => {
		var audio = new Audio(sound); 
		audio.play(); 
	}

	trainHandler = async () => {
		const response = await axios.post('http://localhost:5000/train')
		console.log(response.data)
  }


    

	render(){

		if (this.state.verify){
			return (<Verify />)
		}
		else {

		let signup = (
				<div>
					
					<div className="limiter">
						<div className="container-login100">
							<div className="wrap-login100 p-l-110 p-r-110 p-t-62 p-b-33">
									<span className="login100-form-title p-b-53">
										Press Capture
									</span>
								    <br/><br/>
									<br/><br/>
									<br/><br/>
									<br/><br/>
									<br/><br/>
									<br/><br/>
									<br/><br/>
									<br></br>
									<br></br>
									<br></br>
									<br></br>
									<br></br>
									<br></br>
									<br></br>
									<Sketch id="s" setup={this.setup} draw={this.draw}/>
									
									<div className="container-login100-form-btn m-t-17">
										<button id="submit" onClick={this.setup2} className="login100-form-btn">
											Capture
										</button>
									</div>						
							</div>
						</div>
					</div>
					<div id="dropDownSelect1"></div>
				</div>
		)

    	return (<div >
					<nav class="navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm">
						<div id="navbarContent" class="collapse navbar-collapse">
							<ul class="navbar-nav mx-auto">
								<li class="nav-item"><a href="/" class="nav-link font-weight-bold text-uppercase">CAPTURE</a></li>
								<li class="nav-item"><a href="/logs" class="nav-link font-weight-bold text-uppercase">LOGS</a></li>
								<li class="nav-item"><a href="/database" class="nav-link font-weight-bold text-uppercase">DATABASE</a></li>
							</ul>
						</div>
					</nav>
    		{ signup }
    		</div>
		)
	}
	}
}
export default Verify;