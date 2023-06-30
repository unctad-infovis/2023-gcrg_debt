import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  extent, scaleLinear, line, groups
} from 'd3';
import { SwarmDataContext } from '../context/SwarmData.js';
import { MetricContext } from '../context/Metric.js';
import YAxis from './Panel.yAxis.jsx';
import XAxis from './Panel.xAxis.jsx';

function Line({ width, height }) {
  const { lineData } = useContext(SwarmDataContext);
  const { metricInfo } = useContext(MetricContext);

  const scale = scaleLinear()
    .domain([+metricInfo.max_label, +metricInfo.min])
    .range([-height / 2.2, height / 2.2])
    .clamp(true);

  const xScale = scaleLinear()
    .domain(extent(lineData, (d) => d.year))
    .range([-width / 2.2, width / 2.5]);

  const yearsWithData = [...new Set(lineData.map((d) => d.year))];
  const yearsLabel = [...new Set(lineData.map((d) => d.xaxis_display))].map(
    (d, i) => ({
      year: yearsWithData[i],
      label: d,
    })
  );

  const lineGenerator = line()
    .x((d) => xScale(d.year))
    .y((d) => scale(d.value));

  const countries = groups(lineData, (d) => d.id).map((d) => ({
    id: d[0],
    d: lineGenerator(d[1]),
    values: d[1],
    class: d[1][0].class,
  }));

  const circleData = useMemo(
    () => lineData.filter((d) => d.class !== 'no_highlight_line'),
    [lineData]
  );

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${width / 2}, ${height / 2})`} id="line">
        <XAxis
          scale={xScale}
          height={height}
          info={metricInfo}
          yearData={yearsWithData}
          yearLabel={yearsLabel}
        />
        <YAxis scale={scale} width={width} info={metricInfo} />
        {countries
          && countries.map((path) => (
            <React.Fragment key={path.id}>
              <path d={path.d} className={path.class} fill="none" />
              {path.class !== 'no_highlight_line' && <circle />}
            </React.Fragment>
          ))}
        {circleData
          && circleData.map((circle) => (
            <>
              <circle
                cx={xScale(circle.year)}
                cy={scale(circle.value)}
                r={5}
                className={
                  circle.class === 'comparison_2_line'
                    ? 'comparison_2_circle_filled'
                    : circle.class.replace('line', 'circle')
                }
              />
              {circle.class === 'comparison_2_line' && (
                <circle
                  cx={xScale(circle.year)}
                  cy={scale(circle.value)}
                  r={2}
                  className="comparison_2_center"
                />
              )}
            </>
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
