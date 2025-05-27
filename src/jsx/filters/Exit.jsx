import React from 'react';
import PropTypes from 'prop-types';

function Button({ handleExit }) {
  const handleTogglePanel = () => {
    handleExit(false);
  };

  return (
    <button onClick={handleTogglePanel} className="exit-button" type="button">
      <svg
        aria-label="Exit"
        className="lucide lucide-x"
        fill="#6e6259"
        height="24"
        stroke="#6e6259"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  );
}

Button.propTypes = {
  handleExit: PropTypes.func.isRequired,
};
export default Button;
