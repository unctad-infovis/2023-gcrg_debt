import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  extent, scaleLinear, line, groups
} from 'd3';
import { SwarmDataContext } from '../context/SwarmData.js';
import { MetricContext } from '../context/Metric.js';
import YAxis from './Panel.yAxis.jsx';

function Line({ width, height }) {
  const { lineData } = useContext(SwarmDataContext);
  const { metricInfo } = useContext(MetricContext);

  const scale = scaleLinear()
    .domain([+metricInfo.max_label, +metricInfo.min])
    .range([-height / 2, height / 2])
    .clamp(true);

  const xScale = scaleLinear()
    .domain(extent(lineData, (d) => d.year))
    .range([-width / 2, width / 2]);

  const lineGenerator = line()
    .x((d) => xScale(d.year))
    .y((d) => scale(d.value));

  const countries = groups(lineData, (d) => d.id).map((d) => ({
    id: d[0],
    d: lineGenerator(d[1]),
    values: d[1],
    class: d[1][0].class,
  }));

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${width / 2}, ${height / 2})`} id="line">
        <YAxis scale={scale} width={width} info={metricInfo} />
        {countries
          && countries.map((path) => (
            <React.Fragment key={path.id}>
              <path d={path.d} className={path.class} fill="none" />
              {path.class !== 'no_highlight_line' && <circle />}
            </React.Fragment>
          ))}
      </g>
    </svg>
  );
}

Line.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default Line;
