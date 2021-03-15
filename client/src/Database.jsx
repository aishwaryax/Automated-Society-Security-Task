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
        const response = await axios.get('http://localhost:5000/database')
        if(response.data.error) {
            this.setState({error: response.data.error})
        }
        else {
            this.setState({data: response.data.data, error: ""})
        }
    }

    componentDidMount = async () => {
        var date = this.state.startDate
          const response = await axios.get('http://localhost:5000/database')
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
            <div class="container py-5">
                <div class="row">
                    <div class="col-lg-11 mx-auto">
                        <div class="row py-5">
                            {this.state.data ? (this.state.data.map(record => (
                                <div class="col-lg-4">
                                <figure class="rounded p-3 bg-white shadow-sm">
                                    <img style={{width: "420px", height: "250px"}} src={record.image} alt="" class="w-100 card-img-top" />
                                    <figcaption class="p-4 card-img-bottom">
                                    <h2 class="h5 font-weight-bold mb-2 font-italic">{record.name}</h2>
                                    <p class="mb-0 text-small text-muted font-italic">{record.phone}</p>
                                    </figcaption>
                                </figure>
                            </div>
                            ))): <h1>No data</h1>}
                    </div>
                </div>
            </div>
        </div>
    </>)
    }
}