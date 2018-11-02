import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom';

import App from './App';
import generatorStore from './store';
import './assets/css/normalize.css';

const store = generatorStore(window.REDUX_STATE)

const jsx = (
    <Provider store={ store }>
        <Router>
            <App/>
        </Router>
    </Provider> 
);

ReactDOM.hydrate(jsx, document.getElementById("root"));





