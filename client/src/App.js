import React, { Component } from 'react';
import './App.css';
import Game from './Game/Game'
import Lobby from './lobby'

class App extends Component {

  state = {
    response: ''
  };

  //this hook is provided by guide, not sure I need it
  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  //this function corresponds to the above hook
  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  //simply renders lobby component
  render() {
    return (
      <div className="App">
        <p className="App-intro">{this.state.response}</p>
        <Lobby />
      </div>
    );
  }
}

export default App;