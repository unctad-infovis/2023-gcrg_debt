import React, {
  createContext, useState, useMemo, useContext
} from 'react';
import PropTypes from 'prop-types';

import Static_Context from './StaticData.js';

export const MetricContext = createContext({});

export function MetricContextProvider({ children }) {
  const { indicatorData } = useContext(Static_Context);
  // set up the variable for storing the selected metric
  const [metric, setMetric] = useState('gov_investment_perc_net_interest');

  const metricInfo = useMemo(
    () => indicatorData.find((d) => d.indicator_key === metric),
    [indicatorData, metric]
  );

  const context = useMemo(
    () => ({
      metric,
      setMetric,
      metricInfo,
    }),
    [metric, metricInfo]
  );

  return (
    <MetricContext.Provider value={context}>{children}</MetricContext.Provider>
  );
}

MetricContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MetricContext;
