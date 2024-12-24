import React from 'react';

import ClubEditModal from './ClubEditModal';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownDivider from 'react-bootstrap/DropdownDivider';

import { useModal } from '../contexts/ModalContext';
import ClubMembersModal from './ClubMembersModal';

const ClubSettings = ({ isModerator, club }) => {
  const { modalMap } = useModal();

  return (
    <>
      <Dropdown align={'end'}>
        <Dropdown.Toggle variant="secondary" id="settings-dropdown">
          Settings
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {isModerator() && <Dropdown.Item onClick={() => modalMap.openClubEdit()}>Edit</Dropdown.Item>}
          <Dropdown.Item onClick={() => modalMap.openClubMembers()}>Members</Dropdown.Item>
          {isModerator() && (
            <>
              <DropdownDivider />
              <Dropdown.Item href="#/action-3">Delete</Dropdown.Item>
            </>
          )}
        </Dropdown.Menu>
      </Dropdown>
      {isModerator() && club && <ClubEditModal club={club} />}
      {club && <ClubMembersModal club={club} />}
    </>
  );
};

export default ClubSettings;
