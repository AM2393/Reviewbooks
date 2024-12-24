import React from 'react';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownDivider from 'react-bootstrap/DropdownDivider';

const EventSettings = ({ event }) => {
  return (
    <>
      <Dropdown align={'end'}>
        <Dropdown.Toggle variant="secondary" id="settings-dropdown">
          Settings
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item>Edit</Dropdown.Item>
          <Dropdown.Item>Archive</Dropdown.Item>
          <DropdownDivider />
          <Dropdown.Item>Delete</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default EventSettings;
