import React, { Component } from "react";
import "./../styles/Tenting101.css";

// semantic ui components
import {
  Menu,
  Image,
  Button,
  Form,
  Step,
  Divider,
  Message,
  Header,
  Segment,
  Card,
  Grid,
  Table,
  Icon,
  Container
} from "semantic-ui-react";

// redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { push } from "./../actions/router";

// import components
import NavBarAlternate from "./NavBarAlternate";
import Step1 from "./../components/tenting/Step1";
import Essentials from "./../components/tenting/Essentials";
import FAQ from "./../components/tenting/FAQ";

// logos
import * as kvilleLogo from "./../images/kville.png";
import * as logo from "./../images/gthc_verbose.png";

class Tenting101 extends Component {
  render() {
    const { router } = this.props;
    const path = router.location.pathname;
    const square = { width: 175, height: 175 };

    return (
      <div>
        <NavBarAlternate />
        <div className="about-tenting">
          <Container textalign="center">
            <Card centered fluid color="blue" className="tenting101-card">
              <Card.Header
                size="huge"
                content="Tenting 101"
                textAlign="center"
                style={{
                  fontSize: "4em",
                  padding: 30,
                  margin: 24
                }}
              />

              <Card.Content>
                <div className="tenting-graphic">
                  <Segment circular inverted style={square}>
                    <Header as="h2" inverted>
                      {" "}
                      Black Tenting
                      <Header.Subheader>
                        {" "}
                        Best Seats - Longest Form of Tenting{" "}
                      </Header.Subheader>
                    </Header>
                  </Segment>
                  <Segment circular color="blue" style={square}>
                    <Header as="h2" color="blue">
                      {" "}
                      Blue Tenting
                      <Header.Subheader>
                        {" "}
                        Only available if there is room in K-Ville{" "}
                      </Header.Subheader>
                    </Header>
                  </Segment>
                  <Segment circular style={square}>
                    <Header as="h2">
                      {" "}
                      White Tenting
                      <Header.Subheader>
                        {" "}
                        Shortest Form of Tenting{" "}
                      </Header.Subheader>
                    </Header>
                  </Segment>
                </div>
                <div className="tenting-table">
                  <Table celled selectable unstackable size="large">
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell width={5}>Color</Table.HeaderCell>
                        <Table.HeaderCell>Day Occupancy</Table.HeaderCell>
                        <Table.HeaderCell>Night Occupancy</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>Black</Table.Cell>
                        <Table.Cell>2</Table.Cell>
                        <Table.Cell>10</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Blue</Table.Cell>
                        <Table.Cell>1</Table.Cell>
                        <Table.Cell>6 </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>White</Table.Cell>
                        <Table.Cell>1 </Table.Cell>
                        <Table.Cell>2</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </div>
                <div className="tenting-essentials">
                  <Essentials />
                </div>
                <div className="tenting-faq">
                  <FAQ />
                </div>
              </Card.Content>
            </Card>

            <Image src={logo} size="large" centered />
          </Container>
        </div>
      </div>
    );
  }
}

// connecting to redux

const mapStateToProps = state => {
  return {
    router: state.router
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      push: push
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Tenting101);

export { Tenting101 };
