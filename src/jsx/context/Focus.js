import React, {
  createContext, useState, useMemo, useContext
} from 'react';
import PropTypes from 'prop-types';

import { StaticDataContext } from './StaticData.js';

export const FocusContext = createContext({});

export function FocusContextProvider({ children }) {
  const { idData } = useContext(StaticDataContext);
  // set up the variable for storing the selected focus + comparisons
  const [id, setId] = useState({
    type: 'development',
    id: 'Developing countries',
    id_display: 'Developing countries',
  });
  const [comparisons, setComparisons] = useState([
    { type: 'development', id: 'Developed countries' },
  ]);

  const comparisonLists = useMemo(
    () => ({
      comparison_1:
        idData && comparisons[0]
          ? idData.filter((d) => d[comparisons[0].type] === comparisons[0].id)
          : [],
      comparison_2:
        idData && comparisons[1]
          ? idData.filter((d) => d[comparisons[1].type] === comparisons[1].id)
          : [],
    }),
    [idData, comparisons]
  );

  const focusList = useMemo(
    () => (idData && id ? idData.filter((d) => d[id.type] === id.id) : []),
    [idData, id]
  );

  const [checkedState, setCheckedState] = useState([
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const context = useMemo(
    () => ({
      id,
      setId,
      comparisons,
      setComparisons,
      comparisonLists,
      checkedState,
      setCheckedState,
      focusList,
    }),
    [id, comparisons, comparisonLists, checkedState, focusList]
  );

  return (
    <FocusContext.Provider value={context}>{children}</FocusContext.Provider>
  );
}

FocusContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FocusContext;
