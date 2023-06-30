import React from 'react';
import PropTypes from 'prop-types';
import formatNum from '../helpers/FormatNum.js';

function Axis({ scale, width, info }) {
  return scale.ticks().map((tick) => (
    <g key={tick}>
      <line
        x1={-width / 2.05}
        y1={scale(tick)}
        x2={width / 2}
        y2={scale(tick)}
        className="axis-line"
        key={`${tick}line`}
      />
      <text
        x={width / 2}
        y={scale(tick)}
        dy={-5}
        className="axis-label"
        key={`${tick}number`}
      >
        {info
          && formatNum(
            tick,
            info.format,
            info.format === 'percent' ? 0 : info.decimals
          )}
      </text>
    </g>
  ));
}

Axis.propTypes = {
  scale: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  info: PropTypes.shape({}),
};

export default Axis;
