import React, { Component } from 'react';
import './App.css';
import { Container, Header, Button, Grid } from 'semantic-ui-react';
import TimeSeriesDrawer from './components/TimeSeriesDrawer.jsx';

class App extends Component {

  render() {
    let series = [1, 20, 30, 15, 2, 3, 12, 3.2, 32.4];
    return (
      <div className="App">
        <Header style={{marginTop: '20px'}} as='h1'textAlign='center'>
          Time Series Drawer
        </Header>
        <Container style={{marginTop: '20px'}}>
          <TimeSeriesDrawer width={1200} height={500} length={50}/>
        </Container>
        <Grid container divided>
          <Grid.Row columns={2}>
            <Grid.Column>
              <div>
                <textarea cols={72} rows={6} style={{resize: 'none'}}
                  placeholder='Enter a series of number, separated by commas'/>
              </div>
              <Button>Set Time Series</Button>
            </Grid.Column>
            <Grid.Column>

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default App;
