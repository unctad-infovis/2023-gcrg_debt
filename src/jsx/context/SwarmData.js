import React, { createContext, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';

// context
import { descending } from 'd3';
import Static_Context from './StaticData.js';
import Metric_Context from './Metric.js';
import { FocusContext } from './Focus.js';
import viewPort from '../helpers/viewPort';

// helpers

export const SwarmDataContext = createContext({});

export function SwarmDataContextProvider({ children }) {
  // pull in the latest
  const { valuesData, indicatorData, idData } = useContext(Static_Context);
  const { metric } = useContext(Metric_Context);
  const {
    comparisonLists, id, comparisons, focusList
  } = useContext(FocusContext);

  const { width, hidePanelWidth } = viewPort();
  const swarmRadius = width <= 1150 ? 3 : width <= 1300 ? 4 : hidePanelWidth ? 4 : 4;

  const lineData = useMemo(
    () => valuesData
      .filter((d) => d.indicator === metric && d.value !== 'NA')
      .map((d) => ({
        ...d,
        indicator_info: indicatorData.find(
          (i) => i.indicator === d.indicator
        ),
        id_info: idData.find((i) => i.id === d.id),
        class:
            d.id === id.id
              ? 'focus_line'
              : comparisons[0] && d.id === comparisons[0].id
                ? 'comparison_1_line'
                : comparisons[1] && d.id === comparisons[1].id
                  ? 'comparison_2_line'
                  : 'no_highlight_line',
      })),
    [valuesData, metric, id, comparisons, idData, indicatorData]
  );

  const swarmData = useMemo(
    () => lineData
      && lineData
        .filter((d) => +d.latest_year === 1 && d.id.length === 2)
        .map((d) => {
          const one = comparisonLists.comparison_1.find((c) => c.id === d.id);
          const two = comparisonLists.comparison_2.find((c) => c.id === d.id);
          const focus = focusList.find((c) => c.id === d.id);

          return {
            ...d,
            r: d.id === id.id ? 7 : swarmRadius,

            class:
              d.id === id.id || focus
                ? 'focus_circle'
                : id.type !== 'country'
                  ? 'no_highlight_circle'
                  : one && two
                    ? 'both_comparisons_circle'
                    : one
                      ? 'comparison_1_circle'
                      : two
                        ? 'comparison_2_circle'
                        : 'no_highlight_circle',
          };
        }),
    [lineData, comparisonLists, id, focusList, swarmRadius]
  );

  const referenceLines = useMemo(
    () => lineData
      && lineData
        .filter(
          (d) => +d.latest_year === 1
            && ((comparisons[0] && comparisons[0].id === d.id)
              || (comparisons[1] && comparisons[1].id === d.id))
        )
        .map((d) => ({
          ...d,
          class:
            comparisons[0] && comparisons[0].id === d.id
              ? 'comparison_1_line_thin'
              : 'comparison_2_line_thin',
        }))
        .sort((a, b) => descending(+a.value, +b.value)),
    [lineData, comparisons]
  );

  const context = useMemo(
    () => ({
      lineData,
      swarmData,
      referenceLines,
    }),
    [swarmData, lineData, referenceLines]
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
