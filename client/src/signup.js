import React, {Component} from 'react';
import './css/main.css';
import './css/util.css';
import './signup.css';

import Sketch from "react-p5";
import { Link, Redirect } from 'react-router-dom';

const axios = require('axios');
let video;
export class Signup extends Component {

    fileObj = [];
    fileArray = [];

    constructor(props) {
        super(props)
        this.state = {
            file: [null], uploaded: false
        }
    }

    uploadMultipleFiles = (e) => {
        this.fileObj.push(e.target.files)
        for (let i = 0; i < this.fileObj[0].length; i++) {
			this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]))
        }
        this.setState({ file: this.fileArray })
    }

    handleUploadImage = (ev) => {
		ev.preventDefault();
		const data = new FormData()
		data.append('name', document.getElementById('name').value)
		data.append('phone', document.getElementById('phone').value)
		var i;
		for (i = 0; i < this.uploadInput.files.length; i++) {
			data.append('files', this.uploadInput.files[i])
			data.append('filenames', this.uploadInput.files[i].name);
		}
	
		fetch('http://127.0.0.1:5000/register', {
		  method: 'POST',
		  body: data,
		}).then((response) => {
		  response.json().then((data) => {
			this.setState({uploaded: true, message: data.message})
		  });
		});
	  }
	
	render(){

		if (this.state.uploaded) {
			return (
				<Redirect to="/" />
			)
		}


    	return (
            <div class="container py-5">
				
				<form onSubmit={this.handleUploadImage}>
                <div class="row">
                    <div class="col-lg-11 mx-auto">
                        <div class="row py-5">
                            {(this.fileArray || []).map(url => (
										<div class="col-lg-4">
										<figure class="rounded p-3 bg-white shadow-sm">
										<img style={{width: "420px", height: "250px"}} src={url} alt="" class="w-100 card-img-top" />
									</figure>
									</div>
							))}
                    </div>
					
					<div className="form-group">
                    	<input ref={(ref) => { this.uploadInput = ref; }} type="file" className="form-control" onChange={this.uploadMultipleFiles} multiple />
                	</div>
                	<div className="container-login100-form-btn m-t-17 text-center">
					<div className="p-t-31 p-b-9">
						<span className="txt1">
							Name
						</span>
					</div>
					<div className="wrap-input100 validate-input" data-validate = "Username is required">
						<input id="name" className="input100" type="text" name="name" />
						<span className="focus-input100"></span>
					</div>
					<div className="p-t-31 p-b-9">
						<span className="txt1">
							Phone No
						</span>
					</div>
					<div className="wrap-input100 validate-input" data-validate = "Phone No is required">
						<input id="phone" className="input100" type="text" name="phone" />
						<span className="focus-input100"></span>
					</div>
					<div className="container-login100-form-btn m-t-17">
						<button type="submit" style={{width: "100px"}} className="login100-form-btn">
							Upload
						</button>
					</div>

					
                    </div>
                </div>
            </div>
			</form>
        </div>
		)
	}
}
export default Signup;