import { memo, useContext } from 'react';
import Metric_Context from '../context/Metric';
import { PanelContext } from '../context/Panel';

function Slices({ arcs, shaded }) {
  const { metric, setMetric } = useContext(Metric_Context);
  const shade = shaded.find(d => d.indicator_key === metric);
  const { setShowPanelValue } = useContext(PanelContext);

  const handleSliceClick = indicatorKey => {
    setShowPanelValue(true);
    setMetric(indicatorKey);
  };

  return (
    <>
      {arcs.map(arc => (
        // biome-ignore lint/a11y/useSemanticElements: SVG does not support <button> as a descendant of <g>; role="button" is the correct ARIA pattern here
        <g
          key={arc.indicator_key}
          role="button"
          tabIndex={0}
          aria-label={arc.indicator_key}
          onClick={() => handleSliceClick(arc.indicator_key)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') handleSliceClick(arc.indicator_key);
          }}
        >
          <path d={arc.d} className={arc.indicator_key === metric ? 'slice selected' : 'slice'} />
        </g>
      ))}
      {shade && <path d={shade.d} className="focus" />}
    </>
  );
}

export default memo(Slices);
