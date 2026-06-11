import { scaleLinear } from 'd3';
import { useContext } from 'react';
import { FocusContext } from '../context/Focus';

function Circle({ data, settings, setTooltip }) {
  const { setId } = useContext(FocusContext);
  const { max_label } = data.indicator_info || {};
  const { inner_radius, line_length } = settings;

  const scale = scaleLinear()
    .domain([0, +max_label])
    .range([inner_radius, inner_radius + line_length])
    .clamp(true);

  const handleSelect = (circle) => {
    setId({
      type: circle.type,
      id: circle.id,
      id_display: circle.id_display
    });
  };

  return (
    <g className="circles">
      {data.circles.map(circle => (
        // biome-ignore lint/a11y/useSemanticElements: SVG does not support <button> as a descendant of <g>; role="button" is the correct ARIA pattern here
        <g
          key={circle.id}
          role="button"
          tabIndex={0}
          aria-label={circle.id_display || circle.id}
          onMouseEnter={e => {
            const containerEl = e.currentTarget.closest('.radial');
            const rect = containerEl?.getBoundingClientRect();
            setTooltip({
              xPos: rect ? e.clientX - rect.left : 0,
              yPos: rect ? e.clientY - rect.top : 0,
              id: circle.id,
              value: circle.value,
              type: circle.type,
              id_display: circle.id_display,
              indicator_info: data.indicator_info
            });
          }}
          onMouseLeave={() => setTooltip(null)}
          onClick={() => handleSelect(circle)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') handleSelect(circle);
          }}
        >
          <circle cx={scale(circle.value)} cy="0" r={circle.value === null ? 0 : circle.focus_type === 'focus' ? 7 : 5} fillOpacity={0.65} className={`radial_circle ${circle.focus_type}_circle`} />
          {circle.focus_type === 'comparison_2' && <circle cx={scale(circle.value)} cy="0" r="2" className="comparison_2_center" />}
        </g>
      ))}
    </g>
  );
}

export default Circle;
