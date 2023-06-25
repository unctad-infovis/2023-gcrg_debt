import React from 'react';
import PropTypes from 'prop-types';
import { scaleLinear } from 'd3';

function Circle({ data, settings }) {
  const { max_label } = data.indicator_info;
  const { inner_radius, line_length } = settings;

  const extent = [0, +max_label];

  const scale = scaleLinear()
    .domain(extent)
    .range([inner_radius, inner_radius + line_length])
    .clamp(true);

  return (
    <g className="circles">
      {data.circles.map((circle) => (
        <React.Fragment key={circle.id}>
          <circle
            cx={scale(circle.value)}
            cy="0"
            r={
              circle.value === null ? 0 : circle.focus_type === 'focus' ? 9 : 6
            }
            className={`${circle.focus_type}_circle`}
          />
          {circle.focus_type === 'comparison_2' && (
            <circle
              cx={scale(circle.value)}
              cy="0"
              r="2"
              className="comparison_2_center"
            />
          )}
        </React.Fragment>
      ))}
    </g>
  );
}

Circle.propTypes = {
  data: PropTypes.shape({
    indicator: PropTypes.string,
    circles: PropTypes.arrayOf(PropTypes.shape({})),
    indicator_info: PropTypes.shape({ max_label: PropTypes.string }),
  }).isRequired,
  settings: PropTypes.shape({
    inner_radius: PropTypes.number,
    line_length: PropTypes.number,
  }).isRequired,
};

export default Circle;
