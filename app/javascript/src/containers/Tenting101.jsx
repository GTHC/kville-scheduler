import React, { Component } from 'react';

// semantic ui components
import { Menu, Image, Button, Form, Step, Divider, Message, Header, Segment, Card, Grid, Table, Icon } from 'semantic-ui-react';

// import FAQ page
import FAQ from './FAQ';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from './../actions/router';

class Tenting101 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      activeItem: 'tenting101',
    };
    this.handleReset = this.handleReset.bind(this);
  }
  handleClick = (e, data) => {
    console.log('data', data);
    // data.id is the id element in the component that is clicked
    switch (data.id) {
      case 'about':
          this.props.push('/about')
          return;
      default:
        return;
    }
  }
  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };
  handleButtonClick = (e, data) => {
      const { activeStep, } = this.state;
      switch (data.id) {
        case 'back': {
          if (activeStep === 0) {
            return;
          }
          this.setState({ activeStep: activeStep - 1 });
          return;
        }
        case 'next': {
          if (activeStep < 2) {
            this.setState({ activeStep: activeStep + 1 });
          }
          return;
        }
      }
    }

  render() {
    const steps = [
        { key: 'step1', icon: 'list alternate', title: 'Step 1', description: 'Find your team', active: (activeStep === 0) },
        { key: 'step2', active: true, icon: 'users', title: 'Step 2', description: 'Register with the Line Monitors!', active: (activeStep === 1) },
        { key: 'step3', disabled: true, icon: 'bed', title: 'Step 3', description: 'Get your tenting essentials!', active: (activeStep === 2), completed: (activeStep === 0) },
      ];
    const { activeItem, activeStep, value } = this.state;
    const { router, } = this.props;
    const square = { width: 175, height: 175 };
    const url = 'http://www.kvillenation.com/images/navigation/brand/brand-dark.png';
    const path = router.location.pathname;

    return (
      <div className="body">
        <div>
          <Menu secondary>
            <Menu.Item header> GTHC ⛺</Menu.Item>
            <Menu.Item
            id='about'
            active={path === '/about'}
            onClick={this.handleClick}
            >
              About GTHC
            </Menu.Item>
          </ Menu>
        </ div>
        <Step.Group fluid items={steps} />
          { activeStep === 0 &&
           <div className="body">
            <Image centered src={url} size='massive'/>
            <Message centered header='Step 1' size='large' content='Find your tent members and establish a Tent Captain.'/>
            <center>
            <Segment circular inverted style={square}>
              <Header as='h2' inverted> Black Tenting
                <Header.Subheader> Best Seats - Longest Form of Tenting </Header.Subheader>
              </Header>
            </Segment>
            <Segment circular color='blue' style={square}>
              <Header as='h2' color='blue'> Blue Tenting
                <Header.Subheader> Only available if there is room in K-Ville </Header.Subheader>
              </Header>
            </Segment>
            <Segment circular style={square}>
              <Header as='h2'> White Tenting
                <Header.Subheader> Shortest Form of Tenting </Header.Subheader>
              </Header>
            </Segment>
            </center>
            <Message header='Tenting Color' size='large' content='Decide which color tenting your group would want to do.'/>
            <Table celled inverted selectable unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Color</Table.HeaderCell>
                  <Table.HeaderCell>Start Date</Table.HeaderCell>
                  <Table.HeaderCell>End Date</Table.HeaderCell>
                  <Table.HeaderCell>Day Occupancy</Table.HeaderCell>
                  <Table.HeaderCell>Night Occupancy</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Black</Table.Cell>
                  <Table.Cell>January 12th, 2018 at 11PM</Table.Cell>
                  <Table.Cell>January 23rd, 2018 at 11PM</Table.Cell>
                  <Table.Cell textAlign='center'> 2 </Table.Cell>
                  <Table.Cell textAlign='center'> 10 </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Blue</Table.Cell>
                  <Table.Cell>January 23rd, 2018 at 11PM</Table.Cell>
                  <Table.Cell>February 3rd, 2018 at 11PM </Table.Cell>
                  <Table.Cell textAlign='center'> 1 </Table.Cell>
                  <Table.Cell textAlign='center'> 6 </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>White</Table.Cell>
                  <Table.Cell>February 3rd, 2018 at 11PM </Table.Cell>
                  <Table.Cell>February 14th, 2018 at 12PM</Table.Cell>
                  <Table.Cell textAlign='center'> 1 </Table.Cell>
                  <Table.Cell textAlign='center'> 2 </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <FAQ />
           </div>
          }
          { activeStep === 1 &&
            <div>
             <Message header='Step 2' content='Tent Captain - Register your tent with the Line Monitors using the form below.' size='large' />
             <p align="middle">
             <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfrLvNTtp1jxp4SMsTQz_eHUJMYIvE9Dlq4E_TTiZwo9FThbw/viewform?embedded=true" width="700" height="520" frameborder="0" marginheight="0" marginwidth="0" align="middle">Loading...</iframe>
             </p>
            </div>
          }
          { activeStep === 2 &&
            <div>
             <Segment placeholder>
                <Grid columns={2} stackable textAlign='center'>
                  <Divider vertical></Divider>
                  <Grid.Row verticalAlign='middle'>
                    <Grid.Column>
                      <Segment><h1>Tenting Essentials</h1></Segment>
                      <Image centered src="https://kenan.ethics.duke.edu/wp-content/uploads/2017/02/tenting-01-300x300.png"/>
                    </Grid.Column>
                    <Grid.Column>
                    <Segment.Group>
                      <Segment><h3> The following items: </h3></Segment>
                      <Segment.Group>
                        <Segment as='h5' attached>1. Tent </Segment>
                        <Message warning attached='bottom'>
                          <Icon name='warning' />
                              Fire Safe, Large 12 Person Tent
                        </Message>
                        <Segment as='h5' attached>2. Palletes </Segment>
                        <Message attached> (Goes under the tents) </Message>
                        <Segment as='h5' attached>3. Tarp </Segment>
                        <Message attached inverted> (Over the tent, helps with heat and weather) </Message>
                        <Segment as='h5' attached>4. 0 Degree Sleeping Bags </Segment>
                        <Message attached inverted> (It gets cold in K-Ville) </Message>
                        <Segment as='h5' attached>5. Flashlights, Lanterns </Segment>
                        <Message attached inverted> (For the fun late nights in K-Ville)</Message>
                      </Segment.Group>
                    </Segment.Group>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          </div>
          }
        <br />
        { activeStep < 2 ?
          <Button.Group fluid>
            <Button id="back" content='Back' icon='left arrow' labelPosition='left' color="red" onClick={this.handleButtonClick} />
            <Button.Or />
            <Button id="next" content='Next' icon='right arrow' labelPosition='right' color="green" onClick={this.handleButtonClick} />
          </Button.Group> :
          <Button.Group fluid>
            <Button id="back" content='Back' icon='left arrow' labelPosition='left' color="red" onClick={this.handleButtonClick} />
            <Button.Or />
            <Button id="signup" content='Finish and Return' icon='sign in' labelPosition='right' color="green" onClick={this.handleReset} />
          </Button.Group>
        }
        <br />
        <br />
      </div>
    );
  }
}

// connecting to redux

const mapStateToProps = (state) => {
  return {
    router: state.router,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      push: push,
    },
    dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Tenting101);

export {
  Tenting101
};
