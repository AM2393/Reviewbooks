import React from 'react';

const GoogleButton = ({ text, callback }) => {
  return (
    <button className="google-button" type="button" onClick={callback}>
      <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google Logo" />
      {text}
    </button>
  );
};

export default GoogleButton;
