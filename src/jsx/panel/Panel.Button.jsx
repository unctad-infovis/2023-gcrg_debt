import React, { useContext } from 'react';

import { PanelContext } from '../context/Panel.js';

function Button() {
  const { setShowPanelValue } = useContext(PanelContext);

  const handleTogglePanel = () => {
    // Toggle the showPanel value (true to false, false to true)
    setShowPanelValue(false);
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
export default Button;
