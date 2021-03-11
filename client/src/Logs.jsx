import React, { useState, Component } from 'react'
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import "react-datepicker/dist/react-datepicker.css";
import './css/main.css';
import './css/util.css';
import './signup.css';
import axios from 'axios'


export default class Logs extends Component {
    constructor(props) {
        super(props)

        this.state = { startDate: new Date()}
    }
    setStartDate = (date) => {
        this.setState({startDate: date})

    }

    handleSubmit = async () => {
        var date = this.state.startDate
        const response = await axios.post('http://localhost:5000/logs', {date: date})
        if(response.data.error) {
            this.setState({error: response.data.error})
        }
        else {
            this.setState({data: response.data.data, error: ""})
        }
    }

    componentDidMount = async () => {
        var date = this.state.startDate
          const response = await axios.post('http://localhost:5000/logs', {date: date})
          if(response.data.error) {
            this.setState({error: response.data.error})
        }
        else {
            this.setState({data: response.data.data, error: ""})
        }
    }


    render() {

        return (
            <>
            <nav class="navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm">
                <div id="navbarContent" class="collapse navbar-collapse">
                    <ul class="navbar-nav mx-auto">
                        <li class="nav-item"><a href="/" class="nav-link font-weight-bold text-uppercase">CAPTURE</a></li>
                        <li class="nav-item"><a href="/logs" class="nav-link font-weight-bold text-uppercase">LOGS</a></li>
                        <li class="nav-item"><a href="/database" class="nav-link font-weight-bold text-uppercase">DATABASE</a></li>
                    </ul>
                </div>
            </nav>
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 mx-auto">
                            <div className="py-4 text-center"><i className="fa fa-calendar fa-5x"></i></div>
                                <div className="form-group mb-4">
                                    <div className="datepicker date input-group p-0 shadow-sm">
                                </div>
                            </div>
                            <div className="text-center">
                            <DatePicker selected={this.state.startDate} onChange={date => this.setStartDate(date)} />
                                <p className="font-italic text-muted mb-0">You're checking logs for the date</p>
                                <button onClick={this.handleSubmit} className="btn btn-primary btn-sm px-4 rounded-pill text-uppercase font-weight-bold shadow-sm">Show</button>
                            </div>
                            
                        </div>
                    </div>
                    <div className="container py-5">
                        <div className="row py-5">
                            <div className="col-lg-10 mx-auto">
                                <div className="card rounded shadow border-0">
                                    <div className="card-body p-5 bg-white rounded">
                                            {this.state.error? <h1>{this.state.error}</h1>:<div className="table-responsive">
                                            <table id="example" style={{width:"100%"}} className="table table-striped table-bordered">
                                                <thead>
                                                    <tr>
                                                    <th>Timestamp</th>
                                                    <th>Name</th>
                                                    <th>Probability</th>
                                                    <th>Temperature</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.data ? 
                                                    (
                                                        this.state.data.map(record => (
                                                        <tr>
                                                        <td>{record.timestamp}</td>
                                                        <td>{record.name}</td>
                                                        <td>{record.probability}</td>
                                                        <td>{record.temperature}</td>
                                                        </tr>
                                                    ))):
                                                    (<h1>{this.state.error}</h1>)}
                                                </tbody>
                                            </table>
                                        </div>
                                    }</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div></>
        )
    }
}