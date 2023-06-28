import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

// context
import {
  scaleLinear, forceSimulation, forceX, forceY, forceCollide
} from 'd3';
import { SwarmDataContext } from '../context/SwarmData.js';
import { MetricContext } from '../context/Metric.js';

// components
import YAxis from './Panel.yAxis.jsx';

// helpers

function Swarm({ width, height }) {
  const { swarmData } = useContext(SwarmDataContext);
  const { metricInfo } = useContext(MetricContext);

  const extent = metricInfo ? [+metricInfo.max_label, +metricInfo.min] : [0, 0];
  const scale = scaleLinear()
    .domain(extent)
    .range([-height / 2.5, height / 2.5])
    .clamp(true);

  useMemo(
    () => swarmData
      && forceSimulation(swarmData)
        .force('forceX', forceX(() => 0).strength(0.1))
        .force('forceY', forceY((d) => scale(d.value)).strength(3))
        .force(
          'collide',
          forceCollide((d) => d.r + 3)
        )
        .stop()
        .tick(300),
    [swarmData, scale]
  );

  return (
    <svg width={width} height={height} className="swarm">
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        <YAxis scale={scale} width={width} info={metricInfo} />
        {swarmData.map((circle) => (
          <React.Fragment key={circle.id}>
            <circle
              key={circle.id}
              cx={circle.x}
              cy={circle.y}
              r={circle.r}
              className={circle.class}
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
  );
}

Swarm.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default Swarm;
