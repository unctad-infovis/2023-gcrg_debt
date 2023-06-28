import React, { useContext, useMemo } from 'react';

// Load helpers.
import { groups } from 'd3';
import { StaticDataContext } from '../context/StaticData.js';
import { FocusContext } from '../context/Focus.js';

function Comparisons() {
  const { idData } = useContext(StaticDataContext);

  const { setComparisons, checkedState, setCheckedState } = useContext(FocusContext);

  const comparisonData = useMemo(
    () => idData
      .filter((d) => d.category !== '')
      .map((d, i) => ({ ...d, order: i })),
    [idData]
  );
  const comparisonsG = groups(comparisonData, (d) => d.category).map((d) => ({
    group: d[0],
    values: d[1],
  }));

  // const [checkedState, setCheckedState] = useState(
  //   new Array(comparisonData.length || 12).fill(false)
  //   // comparisonData.map(
  // );

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) => (index === position ? !item : item));
    const numberChecked = updatedCheckedState.filter((d) => d === true).length;

    if (numberChecked <= 2) {
      setCheckedState(updatedCheckedState);

      const indices = updatedCheckedState.reduce(
        (out, bool, index) => (bool ? out.concat(index) : out),
        []
      );
      let c = [];
      if (numberChecked === 0) {
        c = [];
      } else if (numberChecked === 1) {
        c = [comparisonData[indices]];
      } else {
        const c1 = indices[0] !== position
          ? comparisonData[indices[0]]
          : comparisonData[indices[1]];
        const c2 = indices[0] !== position
          ? comparisonData[indices[1]]
          : comparisonData[indices[0]];
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
      {comparisonsG.map(({ group, values }) => (
        <div className="group" key={group}>
          {group}
          {values.map((item) => (
            <div className="item" key={item.id}>
              <input
                type="checkbox"
                id={`custom-checkbox-${item.order}`}
                name={item.id_display}
                value={item.id}
                checked={checkedState[item.order]}
                onChange={() => handleOnChange(item.order)}
              />
              <label htmlFor={`custom-checkbox-${item.order}}`}>
                {item.id_display}
              </label>
            </div>
          ))}
        </div>
      ))}
    </ul>
  );
}

export default Comparisons;
