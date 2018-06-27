import React, { Component } from 'react';
import axios from 'axios'

export default class TestApi extends Component {
  constructor() {
    super();
    this.getTopics = this.getTopics.bind(this);
    this.login = this.login.bind(this);
    this.markAll = this.markAll.bind(this);
  }

  getTopics() {
    axios.get('/api/topics')
      .then(resp=> {
        console.log(resp);
      }).catch(err=>{
        console.log(err)
      });
  }

  login() {
    axios.post('/api/user/login', {
      accessToken: '2b3b94ab-f59b-4c4e-8976-5572e2e9ffec'
    }).then(resp=>{
      console.log(resp);
    }).catch(err=>{
      console.log(err)
    });
  }

  markAll() {
    axios.post('/api/message/mark_all?needAccessToken=true')
    .then(resp=>{
      console.log(resp);
    }).catch(err=>{
      console.log(err)
    });;
  }

  render() {
    return (
      <div>
        <button onClick={this.getTopics}>topics</button>
        <button onClick={this.login}>login</button>
        <button onClick={this.markAll}>markAll</button>
      </div>
    );
  }
}
