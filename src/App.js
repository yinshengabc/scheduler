/*
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/

import React from 'react';//makes React available to the JavaScript

const schedule = {
  title: "CS Courses for 2018-2019"
};

const App = () =>  (
  <div>
    <h1>{ schedule.title }</h1>
  </div>
);

export default App;//makes the function App available to any script that imports this file