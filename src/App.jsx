import React, { Component } from 'react';
import './App.css';
import TimeSeriesDrawer from './components/TimeSeriesDrawer.jsx';

class App extends Component {
  render() {
    let points = [1, 20, 30, 15, 2, 3, 12, 3.2, 32.4];
    return (
      <div className="App">
        <TimeSeriesDrawer width={500} height={300} points={points}/>
      </div>
    );
  }
}

export default App;
