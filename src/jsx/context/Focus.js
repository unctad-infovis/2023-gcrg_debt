import React, {
  createContext, useState, useMemo, useContext
} from 'react';
import PropTypes from 'prop-types';

import { StaticDataContext } from './StaticData.js';

export const FocusContext = createContext({});

export function FocusContextProvider({ children }) {
  const { idData } = useContext(StaticDataContext);
  // set up the variable for storing the selected focus + comparisons
  const [id, setId] = useState({ type: 'country', id: 'AFG' });
  const [comparisons, setComparisons] = useState([
    { type: 'development_status', id: 'Developing countries' },
    { type: 'wb_income_classification', id: 'Low income countries' },
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

  const context = useMemo(
    () => ({
      id,
      setId,
      comparisons,
      setComparisons,
      comparisonLists,
    }),
    [id, comparisons, comparisonLists]
  );

  return (
    <FocusContext.Provider value={context}>{children}</FocusContext.Provider>
  );
}

FocusContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FocusContext;
