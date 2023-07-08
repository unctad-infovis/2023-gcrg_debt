import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { scaleLinear } from 'd3';
import { FocusContext } from '../context/Focus.js';

function Circle({
  data, settings, setTooltip, setInteraction
}) {
  const { setId } = useContext(FocusContext);
  const { max_label } = data.indicator_info;
  const { inner_radius, line_length } = settings;

  const extent = [0, +max_label];

  const scale = scaleLinear()
    .domain(extent)
    .range([inner_radius, inner_radius + line_length])
    .clamp(true);

  const onHover = (event, id, value, type, id_display) => {
    setTooltip({
      xPos: event.pageX,
      yPos: event.pageY,
      id,
      value,
      type,
      id_display,
      indicator_info: data.indicator_info,
    });
  };

  const handleEnter = (d, id, value, type, display) => {
    onHover(d, id, value, type, display);
    setInteraction('enter');
  };

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
            fillOpacity={0.65}
            className={`radial_circle ${circle.focus_type}_circle`}
            onClick={() => setId({
              type: circle.type,
              id: circle.id,
              id_display: circle.id_display,
            })}
            onMouseEnter={(d) => handleEnter(
              d,
              circle.id,
              circle.value,
              circle.type,
              circle.id_display
            )}
            onMouseLeave={() => setInteraction('leave')}
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
  setTooltip: PropTypes.func.isRequired,
  setInteraction: PropTypes.func.isRequired,
};

export default Circle;
