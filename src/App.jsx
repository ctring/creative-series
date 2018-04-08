import React from 'react';
import { Tab } from 'semantic-ui-react';

import SingleSeriesPane from './SingleSeriesPane';
import DynamicTimeWarpingPane from './DynamicTimeWarpingPane';

const panes = [
  { 
    menuItem: 'Single Series', 
    render: () => (
      <Tab.Pane>
        <SingleSeriesPane />
      </Tab.Pane>
    )
  },
  { 
    menuItem: 'Dynamic Time Warping',
    render: () => (
      <Tab.Pane>      
        <DynamicTimeWarpingPane />
      </Tab.Pane>
    ),
  },
];

const App = () => (
  <div className="App">
    <Tab menu={{ attached: false }} panes={panes} />
  </div>
);

export default App;
