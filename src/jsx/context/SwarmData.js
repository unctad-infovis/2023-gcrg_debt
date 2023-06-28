import React, { createContext, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';

// context
import Static_Context from './StaticData.js';
import Metric_Context from './Metric.js';
import { FocusContext } from './Focus.js';

// helpers

export const SwarmDataContext = createContext({});

export function SwarmDataContextProvider({ children }) {
  // pull in the latest
  const { valuesData } = useContext(Static_Context);
  const { metric } = useContext(Metric_Context);
  const {
    comparisonLists, id, comparisons, focusList
  } = useContext(FocusContext);

  const lineData = useMemo(
    () => valuesData
      .filter((d) => d.indicator === metric && d.value !== 'NA')
      .map((d) => ({
        ...d,
        class:
            d.id === id.id
              ? 'focus_line'
              : comparisons[0] && d.id === comparisons[0].id
                ? 'comparison_1_line'
                : comparisons[1] && d.id === comparisons[1].id
                  ? 'comparison_2_line'
                  : 'no_highlight_line',
      })),
    [valuesData, metric, id, comparisons]
  );

  const swarmData = useMemo(
    () => lineData
      && lineData
        .filter((d) => +d.latest_year === 1 && d.type === 'country')
        .map((d) => {
          const one = comparisonLists.comparison_1.find((c) => c.id === d.id);
          const two = comparisonLists.comparison_2.find((c) => c.id === d.id);
          const focus = focusList.find((c) => c.id === d.id);

          return {
            ...d,
            r: d.id === id.id ? 9 : 5,
            class:
              d.id === id.id
                ? 'focus_circle'
                : focus
                  ? 'focus_circle'
                  : one && two
                    ? 'both_comparisons_circle'
                    : one
                      ? 'comparison_1_circle'
                      : two
                        ? 'comparison_2_circle'
                        : 'no_highlight_circle',
          };
        }),
    [lineData, comparisonLists, id, focusList]
  );

  const context = useMemo(
    () => ({
      lineData,
      swarmData,
    }),
    [swarmData, lineData]
  );

  return (
    <SwarmDataContext.Provider value={context}>
      {children}
    </SwarmDataContext.Provider>
  );
}

SwarmDataContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SwarmDataContext;
