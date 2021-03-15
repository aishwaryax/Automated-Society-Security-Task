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

        this.state = { startDate: new Date(), search: ""}
    }
    setStartDate = (date) => {
        this.setState({startDate: date, data: []})

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


    handleDownload = async () => {
        var date = this.state.startDate
        const response = await axios.post('http://localhost:5000/download', {date: date})
        if(response.data.error) {
            this.setState({error: response.data.error})
        }
        else {
            const element = document.createElement("a");
            const file = new Blob([response.data], {type: 'text/plain'});
            element.href = URL.createObjectURL(file);
            element.download = "data.txt";
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();
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

    handleChange = (event) => {
        this.setState({ search: event.target.value });
    }



    render() {

        const { data, search } = this.state
        if (data) {
            console.log(search)
            const filteredData = data.filter(record => record.name.toLowerCase().includes(search))
            console.log(filteredData)
            return (
                <>
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
                                    <div style={{marginTop: "10%"}} className="row">
                                    <div class="col-12 col-sm-6 col-md-6">
                                    <button onClick={this.handleSubmit} className="btn btn-primary btn-sm px-4 rounded-pill text-uppercase font-weight-bold shadow-sm">Show</button>
                                    </div>
                                    <div class="col-12 col-sm-6 col-md-6">
                                    <button onClick={this.handleDownload} className="btn btn-primary btn-sm px-4 rounded-pill text-uppercase font-weight-bold shadow-sm">Download</button>
                                    </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        <div className="container py-5">
    
                            <div className="row py-5">
                                <div className="col-lg-10 mx-auto">
                                    <div className="card rounded shadow border-0">
                                    <input value={this.state.search} onChange={this.handleChange} type="text" className="search" name="search" placeholder="Search.." />
    
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
                                                        {
                                                    
                                                            filteredData.map(record => (
                                                            <tr>
                                                            <td>{record.timestamp}</td>
                                                            <td>{record.name}</td>
                                                            <td>{record.probability}</td>
                                                            <td>{record.temperature}</td>
                                                            </tr>
                                                        ))}
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
        else{
            return (
                <h1>
                    No Data
                </h1>
            )
        }


    }
}