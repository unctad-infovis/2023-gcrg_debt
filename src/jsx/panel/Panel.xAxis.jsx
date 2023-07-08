import React from 'react';
import PropTypes from 'prop-types';

function Axis({ scale, height, yearLabel }) {
  return scale.ticks().map((tick) => (
    <g key={tick}>
      <text
        // x={scale(tick)}
        // y={height / 2}
        // dy={-5}
        className="xaxis-label"
        key={`${tick}number`}
        transform={`translate(${scale(tick) + 5}, ${height / 2}) rotate(-90)`}
      >
        {yearLabel.find((d) => +d.year === +tick)
          ? yearLabel.find((d) => +d.year === +tick).label
          : ''}
      </text>
    </g>
  ));
}

Axis.propTypes = {
  scale: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  info: PropTypes.shape({}),
  yearData: PropTypes.arrayOf(PropTypes.string),
  yearLabel: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Axis;
