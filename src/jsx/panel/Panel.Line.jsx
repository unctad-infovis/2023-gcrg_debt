import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  extent, scaleLinear, line, groups
} from 'd3';
import { SwarmDataContext } from '../context/SwarmData.js';
import { MetricContext } from '../context/Metric.js';
import { FocusContext } from '../context/Focus.js';
import YAxis from './Panel.yAxis.jsx';
import XAxis from './Panel.xAxis.jsx';

function Line({ width, height, setInteractionData }) {
  const { lineData } = useContext(SwarmDataContext);
  const { metricInfo } = useContext(MetricContext);
  const { setId } = useContext(FocusContext);

  const labels = [...new Set(lineData.map((d) => d.xaxis_display))];

  const scale = scaleLinear()
    .domain([+metricInfo.max_label, +metricInfo.min])
    .range([-height / 2.2, height / 2.25])
    .clamp(true);

  const xScale = scaleLinear()
    .domain(extent(lineData, (d) => d.year))
    .range([-width / 2.2, width / 2.5]);

  const yearsWithData = [...new Set(lineData.map((d) => d.year))];

  const yearsLabel = yearsWithData.map((d, i) => ({
    year: d,
    label: yearsWithData.length === labels.length ? labels[i] : d,
  }));

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

  const pathMouseEnter = (event, data) => {
    setInteractionData({
      xPos: event.clientX,
      yPos: event.clientY,
      info: data.values[0],
      type: 'line',
    });
  };

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
              <path
                d={path.d}
                className={`${path.class} line`}
                fill="none"
                onMouseEnter={(event) => pathMouseEnter(event, path)}
                onMouseLeave={() => setInteractionData(null)}
                onClick={() => setId({
                  type: path.values[0].id_info.type,
                  id: path.id,
                  id_display: path.values[0].id_info.id_display,
                })}
              />
            </React.Fragment>
          ))}
        {circleData
          && circleData.map((circle) => (
            <React.Fragment key={circle.year + circle.id}>
              <circle
                cx={xScale(circle.year)}
                cy={scale(circle.value)}
                r={5}
                onMouseEnter={() => setInteractionData({
                  xPos: xScale(circle.year) < 0 ? 0 : xScale(circle.year),
                  yPos:
                      scale(circle.value) + height / 1.9 > height / 2
                        ? scale(circle.value) + height / 4
                        : scale(circle.value) + height / 1.9,
                  info: circle,
                })}
                onMouseLeave={() => setInteractionData(null)}
                onClick={() => setId({
                  type: circle.id_info.type,
                  id: circle.id,
                  id_display: circle.id_info.id_display,
                })}
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
            </React.Fragment>
          ))}
      </g>
    </svg>
  );
}

Line.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  setInteractionData: PropTypes.func.isRequired,
};

export default Line;
