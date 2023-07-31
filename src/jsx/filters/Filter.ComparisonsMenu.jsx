import React, { useContext } from 'react';
import PropTypes from 'prop-types';

// Load helpers.
import { groups } from 'd3';
import { FocusContext } from '../context/Focus.js';
import { StaticDataContext } from '../context/StaticData.js';
import Exit from './Exit.jsx';

function Comparisons({ setCompOpen }) {
  const { textData } = useContext(StaticDataContext);
  const { setComparisons, optionsList } = useContext(FocusContext);

  const comparisonsG = groups(optionsList, (d) => d.category_display).map(
    (d) => ({
      group: d[0],
      values: d[1],
    })
  );

  const handleOnChange = (position) => {
    const updatedCheckedState = optionsList.map((item, index) => ({
      ...item,
      checked: index === position ? !item.checked : item.checked,
    }));

    const numberChecked = updatedCheckedState.filter(
      (d) => d.checked === true
    ).length;

    if (numberChecked <= 2) {
      const indices = updatedCheckedState
        .map((d) => d.checked)
        .reduce((out, bool, index) => (bool ? out.concat(index) : out), []);

      let c = [];
      if (numberChecked === 0) {
        c = [];
      } else if (numberChecked === 1) {
        c = [optionsList[indices]];
      } else {
        const c1 = indices[0] !== position
          ? optionsList[indices[0]]
          : optionsList[indices[1]];
        const c2 = indices[0] !== position
          ? optionsList[indices[1]]
          : optionsList[indices[0]];
        c = [c1, c2];
      }

      const format = c
        && c.map((d) => ({
          id: d.id,
          type: d.type,
        }));
      setComparisons(format);
    }
  };

  return (
    <ul className="comparison-menu">
      <span className="instructions">
        {textData.find((d) => d.id === 'comparisons_instructions').text}
        <Exit handleExit={setCompOpen} />
      </span>
      {comparisonsG.map(({ group, values }) => (
        <div className="group" key={group}>
          <span className="name">{group}</span>
          {values.map((item) => (
            <div
              className="item"
              key={item.id}
              onClick={() => handleOnChange(item.order)}
              role="presentation"
            >
              <input
                type="checkbox"
                id={`custom-checkbox-${item.order}`}
                name={item.id_display}
                value={item.id}
                checked={item.checked}
                onChange={() => handleOnChange(item.order)}
              />
              <label htmlFor={`custom-checkbox-${item.order}`}>
                {item.id_display}
              </label>
            </div>
          ))}
        </div>
      ))}
      <span className="description">
        {textData.find((d) => d.id === 'comparisons_star').text}
      </span>
    </ul>
  );
}

Comparisons.propTypes = {
  setCompOpen: PropTypes.func.isRequired,
};

export default Comparisons;
