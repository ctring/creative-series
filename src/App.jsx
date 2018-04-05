import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TimeSeriesDrawer from './components/TimeSeriesDrawer.jsx';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TimeSeriesDrawer width={500} height={300}/>
      </div>
    );
  }
}

export default App;
