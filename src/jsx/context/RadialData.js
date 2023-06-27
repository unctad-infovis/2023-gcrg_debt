import React, { createContext, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';

// context
import { groups, descending } from 'd3';
import Static_Context from './StaticData.js';
import Focus_Context from './Focus.js';

// helpers

export const RadialDataContext = createContext({});

export function RadialDataContextProvider({ children }) {
  // pull in the latest
  const { latestData, indicatorData } = useContext(Static_Context);
  // get the selected ID and comparisons
  const { id, comparisons } = useContext(Focus_Context);

  // filter the latest data down to only the values of the focus id + comparisons. then group by indicator.
  const circleData = useMemo(
    () => groups(
      latestData
        .filter(
          (d) => d.id === id.id || comparisons.find((c) => c.id === d.id)
        )
        .map((d) => ({
          ...d,
          value: d.value === 'NA' ? null : +d.value,
          sorto:
              d.id === id.id
                ? 2
                : comparisons[0] && d.id === comparisons[0].id
                  ? 1
                  : 0,
          focus_type:
              d.id === id.id
                ? 'focus'
                : comparisons[0] && d.id === comparisons[0].id
                  ? 'comparison_1'
                  : comparisons[1] && d.id === comparisons[1].id
                    ? 'comparison_2'
                    : '',
        })),
      (d) => d.indicator
    ).map((d) => ({
      indicator_key: d[0],
      indicator_info: indicatorData.find((i) => i.indicator_key === d[0]),
      circles: d[1].sort((a, b) => descending(+a.sorto, +b.sorto)),
    })),
    [id, comparisons, latestData, indicatorData]
  );

  const context = useMemo(
    () => ({
      circleData,
    }),
    [circleData]
  );

  return (
    <RadialDataContext.Provider value={context}>
      {children}
    </RadialDataContext.Provider>
  );
}

RadialDataContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RadialDataContext;
