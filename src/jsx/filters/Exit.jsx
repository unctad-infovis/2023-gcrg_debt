import React from 'react';
import PropTypes from 'prop-types';

function Button({ handleExit }) {
  const handleTogglePanel = () => {
    handleExit(false);
  };

  return (
    <button onClick={handleTogglePanel} className="exit-button" type="button">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#6e6259"
        stroke="#6e6259"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-x"
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
