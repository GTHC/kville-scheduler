import React, { Component } from 'react';

// semantic-ui
import { Header, Image, Table } from 'semantic-ui-react';

// components
import AvailabilityButton from './utils/AvailabilityButton';

// image
import * as defaultSrc from './../../../images/default_image.png';

class TeamTablePane extends Component {

  renderCellWithAvatar = user => {
    const { captain } = this.props.team.data;
    const isCaptain = user.id == captain.user_id;
    const src = user.avatarURL || defaultSrc;
    return (
      <Table.Cell>
        <Header as='h4' image>
          <Image src={src} rounded size='mini' />
          <Header.Content>
            {user.name}
            <Header.Subheader>
              {isCaptain ? 'Captain' : 'Member'}
            </Header.Subheader>
          </Header.Content>
        </Header>
      </Table.Cell>
    );
  };

  render() {
    const data = this.props.team.data;
    const captain = data.captain;

    // sort users by captaincy, then alphabetically
    const users = data.users.sort((a, b) => {
      if (a.id == captain.user_id) {
        return -1;
      } else if (b.id == captain.user_id) {
        return 1;
      }
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });

    return (
      <div>
        <Table
          celled
          striped
          definition
          stackable
        >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Phone</Table.HeaderCell>
              <Table.HeaderCell>Availability</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              users.map(user =>
                <Table.Row key={user.id}>
                  {this.renderCellWithAvatar(user)}
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.phone}</Table.Cell>
                  <Table.Cell>
                    <AvailabilityButton user={user} />
                  </Table.Cell>
                </Table.Row>
              )
            }
          </Table.Body>

        </Table>
      </div>
    );
  }

}

export default TeamTablePane;
