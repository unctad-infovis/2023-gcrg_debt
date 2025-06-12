import React, { createContext, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';

// context
import { groups, descending, ascending } from 'd3';
import Static_Context from './StaticData.js';
import Focus_Context from './Focus.js';

// helpers

export const RadialDataContext = createContext({});

export function RadialDataContextProvider({ children }) {
  // pull in the latest
  const { latestData, indicatorData, idData } = useContext(Static_Context);
  // get the selected ID and comparisons
  const { id, comparisons } = useContext(Focus_Context);

  // filter the latest data down to only the values of the focus id + comparisons. then group by indicator.
  const circleData = useMemo(() => {
    const filteredData = latestData.filter(
      (d) => (d.id && id.id && d.id === id.id)
        || (d.id && comparisons && comparisons.find((c) => c && c.id === d.id))
    );
    const mappedData = filteredData.map((d) => {
      const idDataItem = idData.find((i) => i.id === d.id);
      return {
        ...d,
        value: (d.value === 'NA' || d.value === '') ? null : +d.value,
        type: idDataItem ? idDataItem.type : undefined,
        sorto:
          d.id === id.id
            ? 2
            : comparisons && comparisons[0] && d.id === comparisons[0].id
              ? 1
              : 0,
        focus_type:
          d.id === id.id
            ? 'focus'
            : comparisons && comparisons[0] && d.id === comparisons[0].id
              ? 'comparison_1'
              : comparisons && comparisons[1] && d.id === comparisons[1].id
                ? 'comparison_2'
                : '',
      };
    });
    const groupedData = groups(mappedData, (d) => d.indicator).map((d) => ({
      indicator_key: d[0],
      indicator_info: indicatorData.find((i) => i.indicator_key === d[0]),
      circles: d[1].sort((a, b) => descending(+a.sorto, +b.sorto)),
    }));
    return groupedData.sort((a, b) => ascending(
      a.indicator_info && a.indicator_info.number
        ? +a.indicator_info.number
        : 0,
      b.indicator_info && b.indicator_info.number
        ? +b.indicator_info.number
        : 0
    ));
  }, [id, comparisons, latestData, indicatorData, idData]);

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
