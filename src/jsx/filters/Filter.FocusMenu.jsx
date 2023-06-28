import React, { useContext } from 'react';
import PropTypes from 'prop-types';

// Load helpers.
import { StaticDataContext } from '../context/StaticData.js';
import { FocusContext } from '../context/Focus.js';

function FocusMenu({ setMenuOpen }) {
  const { idData } = useContext(StaticDataContext);

  const { setId } = useContext(FocusContext);

  const handleIdChange = (e) => {
    setId({
      id: e.id,
      id_display: e.id_display,
      type: e.type,
    });
    setMenuOpen(false);
  };

  return (
    <div className="focus-menu">
      <div className="selections">
        {idData
          && idData.map((item) => (
            <div
              key={item.id}
              className="item"
              onClick={() => handleIdChange(item)}
              onKeyDown={() => handleIdChange(item)}
              role="presentation"
            >
              <input type="radio" id={item.id} name="country-values" />
              <label htmlFor={item.id}>{item.id_display}</label>
            </div>
          ))}
      </div>
    </div>
  );
}

FocusMenu.propTypes = {
  setMenuOpen: PropTypes.func.isRequired,
};

export default FocusMenu;
