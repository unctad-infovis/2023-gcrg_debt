import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import formatNum from '../helpers/FormatNum.js';
import { MetricContext } from '../context/Metric.js';

function Axis({ settings, angle, data }) {
  const {
    indicator_short, format, decimals, max_label
  } = data.indicator_info || {};

  const { inner_radius, line_length } = settings;

  const { metric } = useContext(MetricContext);

  const side = angle > 90 ? 'left' : 'right';
  const reverse = side === 'left' ? 'right' : 'left';
  const transform = side === 'left' ? `rotate(180, ${inner_radius}, ${10})` : null;
  const space = side === 'left' ? -5 : 5;

  const x = side === 'left' ? -line_length + inner_radius : inner_radius + line_length;
  const y = (side === 'left' ? 1 : -1) * 10;

  const focus = data.circles.find((d) => d.focus_type === 'focus');

  const selected = focus.indicator === metric;

  return (
    <g className={`axis ${selected ? 'selected' : ''}`}>
      <line
        x1={inner_radius}
        x2={line_length + inner_radius}
        y1={0}
        y2={0}
        className="line"
      />

      <g transform={transform}>
        <text
          className={`max ${reverse}`}
          x={x + space}
          y={side === 'left' ? 24 : 4}
        >
          {formatNum(max_label, format, format === 'percent' ? 0 : decimals)}
        </text>
        <text className={`name ${side}`} x={x} y={y}>
          {indicator_short}
        </text>
        <text
          x={x + space}
          y={y}
          className={`number ${reverse} ${focus.value ? 'focus' : 'no_value'}`}
        >
          {(focus.value) ? formatNum(focus.value, format, decimals) : '–'}
        </text>
      </g>
    </g>
  );
}

Axis.propTypes = {
  settings: PropTypes.shape({
    inner_radius: PropTypes.number,
    line_length: PropTypes.number,
  }).isRequired,
  angle: PropTypes.number.isRequired,
  data: PropTypes.shape({
    indicator: PropTypes.string,
    indicator_info: PropTypes.shape({
      indicator_short: PropTypes.string,
      format: PropTypes.string,
      decimals: PropTypes.string,
      max_label: PropTypes.string,
    }),
    circles: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};

export default memo(Axis);
