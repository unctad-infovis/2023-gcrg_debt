import React, {
  createContext, useState, useMemo, useContext, useRef, useEffect
} from 'react';
import PropTypes from 'prop-types';

import Static_Context from './StaticData.js';

export const MetricContext = createContext({});

export function MetricContextProvider({ children }) {
  const { indicatorData } = useContext(Static_Context);
  // set up the variable for storing the selected metric
  const [metric, setMetric] = useState('gov_spending_perc_net_interest');

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

  const analytics = window.gtag || undefined;
  const changeIdx = useRef(0);
  useEffect(() => {
    if (typeof analytics !== 'undefined') {
      // Only track user initiated changes.
      if (changeIdx.current >= 2) {
        analytics('event', 'Metric', { event_category: '2023-gcrg_debt', event_label: context.metricInfo.indicator_full, transport_type: 'beacon' });
      }
    }
    changeIdx.current += 1;
  }, [analytics, changeIdx, context]);

  return (
    <MetricContext.Provider value={context}>{children}</MetricContext.Provider>
  );
}

MetricContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MetricContext;
