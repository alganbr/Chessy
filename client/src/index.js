import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const axios = require('axios')

const url = 'http://localhost:5000/users/'
axios.get(url).then((response) => {
  console.log(response.data)
})
.catch((err) => console.log(err))


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
