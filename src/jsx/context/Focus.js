import React, { createContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

export const FocusContext = createContext({});

export function FocusContextProvider({ children }) {
  // set up the variable for storing the selected focus + comparisons
  const [id, setId] = useState({ type: 'country', id: 'USA' });
  const [comparisons, setComparisons] = useState([
    { type: 'development_status', id: 'Developing countries' },
    { type: 'region', id: 'Latin America and the Caribbean' },
  ]);

  const context = useMemo(
    () => ({
      id,
      setId,
      comparisons,
      setComparisons,
    }),
    [id, comparisons]
  );

  return (
    <FocusContext.Provider value={context}>{children}</FocusContext.Provider>
  );
}

FocusContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FocusContext;
