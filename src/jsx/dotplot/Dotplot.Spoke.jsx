import React, { useContext } from 'react';
import PropTypes from 'prop-types';
// components
import Axis from '../radial/Radial.Spoke.Axis.jsx';
import Circle from '../radial/Radial.Spoke.Circle.jsx';
import { PanelContext } from '../context/Panel.js';
import Metric_Context from '../context/Metric.js';

function Spoke({
  i, settings, data, setTooltip, xPos
}) {
  const angle = 0;

  const { setShowPanelValue } = useContext(PanelContext);
  const { setMetric } = useContext(Metric_Context);

  const handleTogglePanel = () => {
    // Toggle the showPanel value (true to false, false to true)
    setShowPanelValue(true);
  };

  const handleSliceClick = (keys) => {
    handleTogglePanel(); // Show the panel
    setMetric(keys); // Update the metric state
  };

  return (
    <g
      transform={`translate(${xPos / 2},${50 * (i + 1) - 25})`}
      className="g-hover"
    >
      <rect
        width={settings.line_length}
        y="-15px"
        height="30px"
        fill="hsl(0, 0%, 100%, 0)"
        onClick={() => handleSliceClick(data.indicator_key)}
      />
      <Axis settings={settings} angle={angle} data={data} />
      <Circle settings={settings} data={data} setTooltip={setTooltip} />
    </g>
  );
}

Spoke.propTypes = {
  data: PropTypes.shape({
    indicator_key: PropTypes.string,
    circles: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  i: PropTypes.number.isRequired,
  xPos: PropTypes.number.isRequired,
  // key: PropTypes.string.isRequired,
  settings: PropTypes.shape({
    section_gap: PropTypes.number,
    line_length: PropTypes.number,
  }).isRequired,
  setTooltip: PropTypes.func.isRequired,
};

export default Spoke;
