import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isJoinClubOpen, setJoinClubOpen] = useState(false);
  const [clubToJoin, setClubToJoin] = useState(null);
  const [isClubEditOpen, setClubEditOpen] = useState(false);
  const [isClubMembersOpen, setClubMembersOpen] = useState(false);
  const [isCreateEventOpen, setCreateEventOpen] = useState(false);

  const openJoinClub = (club) => {
    setClubToJoin(club);
    setJoinClubOpen(true);
  };
  const closeJoinClub = () => {
    setJoinClubOpen(false);
  };

  const openClubEdit = () => setClubEditOpen(true);
  const closeClubEdit = () => setClubEditOpen(false);

  const openClubMembers = () => setClubMembersOpen(true);
  const closeClubMembers = () => setClubMembersOpen(false);

  const openCreateEvent = () => setCreateEventOpen(true);
  const closeCreateEvent = () => setCreateEventOpen(false);

  const value = {
    isJoinClubOpen,
    clubToJoin,
    isClubEditOpen,
    isClubMembersOpen,
    isCreateEventOpen,
    modalMap: {
      openJoinClub,
      closeJoinClub,
      openClubEdit,
      closeClubEdit,
      openClubMembers,
      closeClubMembers,
      openCreateEvent,
      closeCreateEvent,
    },
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModal = () => useContext(ModalContext);
