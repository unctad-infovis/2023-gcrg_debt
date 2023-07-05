import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import Metric_Context from '../context/Metric.js';
import { PanelContext } from '../context/Panel.js';

function Slices({ arcs, shaded }) {
  const { metric, setMetric } = useContext(Metric_Context);
  const shade = shaded.find((d) => d.indicator_key === metric);
  const { setShowPanelValue } = useContext(PanelContext);

  const handleTogglePanel = () => {
    // Toggle the showPanel value (true to false, false to true)
    setShowPanelValue(true);
  };

  const handleSliceClick = (indicatorKey) => {
    handleTogglePanel(); // Show the panel
    setMetric(indicatorKey); // Update the metric state
  };

  return (
    <>
      {arcs.map((arc) => (
        <React.Fragment key={arc.indicator_key}>
          <path
            d={arc.d}
            className={
              arc.indicator_key === metric ? 'slice selected' : 'slice'
            }
            onClick={() => handleSliceClick(arc.indicator_key)}
          />
        </React.Fragment>
      ))}
      {shade && <path d={shade.d} className="focus" />}
    </>
  );
}

Slices.propTypes = {
  arcs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  shaded: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default memo(Slices);
