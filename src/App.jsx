import React from 'react';
import { Tab } from 'semantic-ui-react';

import SingleSeriesPane from './SingleSeriesPane';
import DynamicTimeWarpingPane from './DynamicTimeWarpingPane';

const panes = [
  { 
    menuItem: 'Dynamic Time Warping',
    render: () => (
      <DynamicTimeWarpingPane />
    ),
  },
  { 
    menuItem: 'Single Series', 
    render: () => (
      <SingleSeriesPane />
    )
  },
];

const App = () => (
  <div className="App">
    <Tab menu={{ attached: false }} panes={panes} />
  </div>
);

export default App;
