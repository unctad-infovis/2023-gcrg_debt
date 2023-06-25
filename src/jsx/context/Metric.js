import React, { createContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

export const MetricContext = createContext({});

export function MetricContextProvider({ children }) {
  // set up the variable for storing the selected metric
  const [metric, setMetric] = useState('gov_investment_perc_net_interest');

  const context = useMemo(
    () => ({
      metric,
      setMetric,
    }),
    [metric]
  );

  return (
    <MetricContext.Provider value={context}>{children}</MetricContext.Provider>
  );
}

MetricContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MetricContext;
