import React from 'react';

import { useAuth } from '../contexts/AuthContext';

const Welcome = () => {
  const { state } = useAuth();
  return (
    <div className="welcome">
      <h1>Welcome, {state.user?.first_name ? state.user?.first_name : 'unknown'}!</h1>
    </div>
  );
};

export default Welcome;
