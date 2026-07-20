import { forceCollide, forceSimulation, forceX, scaleLinear } from 'd3';
import { memo, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';

// context
import { FocusContext } from '../context/Focus';
import { MetricContext } from '../context/Metric';
import { SwarmDataContext } from '../context/SwarmData';
import viewPort from '../helpers/viewPort';

// components
import YAxis from './Panel.yAxis.jsx';

// helpers

function Swarm({ setInteractionData }) {
  let { swarmData } = useContext(SwarmDataContext);
  const { referenceLines } = useContext(SwarmDataContext);
  const { metricInfo } = useContext(MetricContext);
  const { setId } = useContext(FocusContext);

  const ref = useRef(null);
  const [figureWidth, setWidth] = useState(0);
  const [figureHeight, setHeight] = useState(0);

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
  }, []);

  const { width } = viewPort();

  const extent = metricInfo ? [+metricInfo.max_label, +metricInfo.min] : [0, 0];
  const scale = scaleLinear()
    .domain(extent)
    .range([-figureHeight / 2.5, figureHeight / 2.5])
    .clamp(true);

  swarmData = swarmData.filter(d => d.value !== '');

  useMemo(
    () =>
      swarmData &&
      forceSimulation(swarmData)
        .force('forceX', forceX(() => 0).strength(0.1))
        // .force('forceY', forceY((d) => scale(d.value)).strength(3))
        .force(
          'collide',
          forceCollide(d => d.r * 1.4)
        )
        .force('lockY', () => {
          swarmData.forEach(node => {
            node.y = scale(parseFloat(node.value) || 0);
          });
        })
        .stop()
        .tick(300),
    [swarmData, scale]
  );

  return (
    <div className="swarm" ref={ref}>
      <svg width={figureWidth} height="100%" aria-label="Swarm graph">
        <g transform={`translate(${figureWidth / 2}, ${figureHeight / 2})`}>
          {referenceLines.map(d => (
            <g className="referenceLine" key={d.id}>
              <line x1={-width / 2} y1={scale(d.value)} x2={width / 2} y2={scale(d.value)} className={d.class} />
            </g>
          ))}

          <YAxis scale={scale} width={figureWidth} info={metricInfo} />

          {swarmData.map(circle => (
            // biome-ignore lint/a11y/useSemanticElements: SVG does not support <button> as a descendant of <g>; role="button" is the correct ARIA pattern here
            <g
              aria-label={circle.id_info.id_display || circle.id}
              key={circle.id}
              role="button"
              tabIndex={0}
              onClick={() =>
                setId({
                  type: circle.id_info.type,
                  id: circle.id,
                  id_display: circle.id_info.id_display
                })
              }
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setId({
                    type: circle.id_info.type,
                    id: circle.id,
                    id_display: circle.id_info.id_display
                  });
                }
              }}
              onMouseEnter={() =>
                setInteractionData({
                  xPos: circle.x < 0 ? 0 : circle.x,
                  yPos: circle.y + figureHeight / 1.9 > figureHeight / 2 ? circle.y + figureHeight / 4 : circle.y + figureHeight / 1.9,
                  info: circle
                })
              }
              onMouseLeave={() => setInteractionData(null)}
            >
              <circle cx={circle.x} cy={circle.y} r={circle.r} fillOpacity={0.65} className={circle.class} />
              {(circle.class === 'both_comparisons_circle' || circle.class === 'comparison_2_circle' || circle.class === 'focus_comparison_circle') && <circle cx={circle.x} cy={circle.y} r={1.5} className={circle.class.replace('circle', 'center')} />}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default memo(Swarm);
