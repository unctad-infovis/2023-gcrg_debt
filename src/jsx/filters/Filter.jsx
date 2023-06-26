import React, { useContext } from 'react';

// Load helpers.
import { StaticDataContext } from '../context/StaticData.js';
import { FocusContext } from '../context/Focus.js';

function Filter() {
  const { idData } = useContext(StaticDataContext);

  const { setId } = useContext(FocusContext);

  const handleIdChange = (e) => {
    setId({ id: e.target.value });
  };

  return (
    <div className="filters">
      {idData && (
        <select onChange={handleIdChange}>
          {idData.map((item) => (
            <option value={item.id} key={item.id}>
              {item.id_display}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default Filter;
