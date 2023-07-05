import React from 'react';
import PropTypes from 'prop-types';
// components
import Axis from '../radial/Radial.Spoke.Axis.jsx';
import Circle from '../radial/Radial.Spoke.Circle.jsx';

function Spoke({
  i, settings, data, setTooltip, setInteraction
}) {
  const angle = 0;

  return (
    <g transform={`translate(0,${60 * i})`}>
      <Axis settings={settings} angle={angle} data={data} />
      <Circle
        settings={settings}
        data={data}
        setTooltip={setTooltip}
        setInteraction={setInteraction}
      />
    </g>
  );
}

Spoke.propTypes = {
  data: PropTypes.shape({
    indicator: PropTypes.string,
    circles: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  i: PropTypes.number.isRequired,

  settings: PropTypes.shape({ section_gap: PropTypes.number }).isRequired,
  setTooltip: PropTypes.func.isRequired,
  setInteraction: PropTypes.func.isRequired,
};

export default Spoke;
