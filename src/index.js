/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Main from './App.jsx';
import reportWebVitals from './reportWebVitals';

const API_KEY = 'FFEChJmynaVGREDvL6ZFV3S8M16JPcO9'
const url = 'https://api.giphy.com/v1/stickers/random?api_key=FFEChJmynaVGREDvL6ZFV3S8M16JPcO9&tag=&rating=g';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Main images_source={url} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
