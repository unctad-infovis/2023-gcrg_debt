import React from 'react';
import PropTypes from 'prop-types';

function Axis({
  scale, height, yearLabel, width
}) {
  const num = yearLabel[0].label.includes('-') ? null : width < 1150 ? 2 : 4;
  const axisTicks = scale.ticks(num).map((tick) => {
    const label = yearLabel.find((d) => +d.year === +tick);
    return {
      label_1: label ? label.label.split('-')[0] : null,
      label_2: label ? label.label.split('-')[1] : null,
      tick,
    };
  });

  return axisTicks.map(({ tick, label_1, label_2 }) => (
    <g key={tick}>
      <text x={scale(tick)} y={height / 2} dy={-15} className="xaxis-label">
        {label_1}
        {label_2 ? '-' : null}
      </text>
      <text x={scale(tick)} y={height / 2} dy={0} className="xaxis-label">
        {label_2}
      </text>
    </g>
  ));
}

Axis.propTypes = {
  scale: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  info: PropTypes.shape({}),
  yearData: PropTypes.arrayOf(PropTypes.string),
  yearLabel: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Axis;
