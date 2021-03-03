import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import * as serviceWorker from './serviceWorker';
import './index.css';

const basename = process.env.NODE_ENV === 'production' ? '/admin' : '/';

ReactDOM.render((
    <BrowserRouter basename={ basename }>
        <App />
    </BrowserRouter>
), document.getElementById('root'));

serviceWorker.unregister();
