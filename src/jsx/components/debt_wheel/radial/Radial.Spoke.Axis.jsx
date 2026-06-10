import { memo, useContext } from 'react';
import { MetricContext } from '../context/Metric';
import formatNum from '../helpers/FormatNum.js';

function Axis({ settings, angle, data }) {
  const { indicator_short, format, decimals, max_label } = data.indicator_info || {};

  const { inner_radius, line_length } = settings;

  const { metric } = useContext(MetricContext);

  const side = angle > 90 ? 'left' : 'right';
  const reverse = side === 'left' ? 'right' : 'left';
  const transform = side === 'left' ? `rotate(180, ${inner_radius}, ${10})` : null;
  const space = side === 'left' ? -5 : 5;

  const x = side === 'left' ? -line_length + inner_radius : inner_radius + line_length;
  const y = (side === 'left' ? 1 : -1) * 10;

  const focus = data.circles.find(d => d.focus_type === 'focus');

  if (!focus) return null;

  const selected = focus.indicator === metric;

  return (
    <g className={`axis ${selected ? 'selected' : ''}`}>
      <line x1={inner_radius} x2={line_length + inner_radius} y1={0} y2={0} className="line" />
      <g transform={transform}>
        <text className={`max ${reverse}`} x={x + space} y={side === 'left' ? 24 : 4}>
          {formatNum(max_label, format, format === 'percent' ? 0 : decimals)}
        </text>
        <text className={`name ${side}`} x={x} y={y}>
          {indicator_short}
        </text>
        <text x={x + space} y={y} className={`number ${reverse} ${focus.value ? 'focus' : 'no_value'}`}>
          {focus.value ? formatNum(focus.value, format, decimals) : '–'}
        </text>
      </g>
    </g>
  );
}

export default memo(Axis);
