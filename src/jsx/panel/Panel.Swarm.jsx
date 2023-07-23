import React, {
  useContext,
  useMemo,
  memo,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';

// context
import {
  scaleLinear, forceSimulation, forceX, forceY, forceCollide
} from 'd3';
import { SwarmDataContext } from '../context/SwarmData.js';
import { MetricContext } from '../context/Metric.js';
import { FocusContext } from '../context/Focus.js';
import viewPort from '../helpers/viewPort';

// components
import YAxis from './Panel.yAxis.jsx';

// helpers

function Swarm({ setInteractionData }) {
  const { swarmData, referenceLines } = useContext(SwarmDataContext);
  const { metricInfo } = useContext(MetricContext);
  const { setId } = useContext(FocusContext);

  const ref = useRef(null);
  const [figureWidth, setWidth] = useState(0);
  const [figureHeight, setHeight] = useState(0);

  const { width, height } = viewPort();

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
  }, [width, height]);

  const extent = metricInfo ? [+metricInfo.max_label, +metricInfo.min] : [0, 0];
  const scale = scaleLinear()
    .domain(extent)
    .range([-figureHeight / 2.5, figureHeight / 2.5])
    .clamp(true);

  useMemo(
    () => swarmData
      && forceSimulation(swarmData)
        .force('forceX', forceX(() => 0).strength(0.1))
        .force('forceY', forceY((d) => scale(d.value)).strength(3))
        .force(
          'collide',
          forceCollide((d) => d.r * 1.4)
        )
        .stop()
        .tick(300),
    [swarmData, scale]
  );

  return (
    <div className="swarm" ref={ref}>
      <svg width={figureWidth} height="100%">
        <g transform={`translate(${figureWidth / 2}, ${figureHeight / 2})`}>
          {referenceLines.map((d) => (
            <g className="referenceLine" key={d.id}>
              <line
                x1={-width / 2}
                y1={scale(d.value)}
                x2={width / 2}
                y2={scale(d.value)}
                className={d.class}
              />
            </g>
          ))}

          <YAxis scale={scale} width={figureWidth} info={metricInfo} />

          {swarmData.map((circle) => (
            <React.Fragment key={circle.id}>
              <circle
                key={circle.id}
                cx={circle.x}
                cy={circle.y}
                r={circle.r}
                fillOpacity={0.65}
                className={circle.class}
                onClick={() => setId({
                  type: circle.id_info.type,
                  id: circle.id,
                  id_display: circle.id_info.id_display,
                })}
                onMouseEnter={() => setInteractionData({
                  xPos: circle.x < 0 ? 0 : circle.x,
                  yPos:
                      circle.y + figureHeight / 1.9 > figureHeight / 2
                        ? circle.y + figureHeight / 4
                        : circle.y + figureHeight / 1.9,
                  info: circle,
                })}
                onMouseLeave={() => setInteractionData(null)}
              />
              {(circle.class === 'both_comparisons_circle'
                || circle.class === 'comparison_2_circle'
                || circle.class === 'focus_comparison_circle') && (
                <circle
                  cx={circle.x}
                  cy={circle.y}
                  r={1.5}
                  className={circle.class.replace('circle', 'center')}
                />
              )}
            </React.Fragment>
          ))}
        </g>
      </svg>
    </div>
  );
}

Swarm.propTypes = {
  setInteractionData: PropTypes.func.isRequired,
};

export default memo(Swarm);
