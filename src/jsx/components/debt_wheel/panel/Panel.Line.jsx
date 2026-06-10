import { extent, groups, line, scaleLinear } from 'd3';
import { useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FocusContext } from '../context/Focus';
import { MetricContext } from '../context/Metric';
import { SwarmDataContext } from '../context/SwarmData';
import XAxis from './Panel.xAxis.jsx';
import YAxis from './Panel.yAxis.jsx';

function Line({ setInteractionData }) {
  const { lineData } = useContext(SwarmDataContext);
  const { metricInfo } = useContext(MetricContext);
  const { setId } = useContext(FocusContext);

  const ref = useRef(null);
  const [figureWidth, setWidth] = useState(0);
  const [figureHeight, setHeight] = useState(0);

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
  }, []);

  const labels = [...new Set(lineData.map(d => d.xaxis_display))];

  const scale = scaleLinear()
    .domain([+metricInfo.max_overall_label, +metricInfo.min_overall])
    .range([-figureHeight / 2.2, figureHeight / 2.25])
    .clamp(true);

  const xScale = scaleLinear()
    .domain(extent(lineData, d => d.year))
    .range([-figureWidth / 2.2, figureWidth / 2.5]);

  const yearsWithData = [...new Set(lineData.map(d => d.year))];

  const yearsLabel = yearsWithData.map((d, i) => ({
    year: d,
    label: yearsWithData.length === labels.length ? labels[i] : d
  }));

  const lineGenerator = line()
    .x(d => xScale(d.year))
    .y(d => scale(d.value));

  const countries = groups(lineData, d => d.id).map(d => ({
    id: d[0],
    d: lineGenerator(d[1]),
    values: d[1],
    class: d[1][0].class
  }));

  const circleData = useMemo(() => lineData.filter(d => d.class !== 'no_highlight_line'), [lineData]);

  const pathMouseEnter = (event, data) => {
    setInteractionData({
      xPos: event.clientX,
      yPos: event.clientY - 120 > figureHeight / 1.5 ? event.clientY - 120 : event.clientY,
      info: data.values[0],
      type: 'line'
    });
  };

  return (
    <div className="line" ref={ref}>
      <svg width={figureWidth} height="100%" role="img" aria-label="Line graph">
        <g transform={`translate(${figureWidth / 2}, ${figureHeight / 2})`}>
          <XAxis scale={xScale} height={figureHeight} info={metricInfo} yearData={yearsWithData} yearLabel={yearsLabel} width={figureWidth} />
          <YAxis scale={scale} width={figureWidth} info={metricInfo} />
          {countries?.map(path => (
            // biome-ignore lint/a11y/useSemanticElements: SVG does not support <button> as a descendant of <g>; role="button" is the correct ARIA pattern here
            <g
              key={path.id}
              role="button"
              tabIndex={0}
              aria-label={path.values[0].id_info.id_display || path.id}
              onMouseEnter={event => pathMouseEnter(event, path)}
              onMouseLeave={() => setInteractionData(null)}
              onClick={() =>
                setId({
                  type: path.values[0].id_info.type,
                  id: path.id,
                  id_display: path.values[0].id_info.id_display
                })
              }
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setId({
                    type: path.values[0].id_info.type,
                    id: path.id,
                    id_display: path.values[0].id_info.id_display
                  });
                }
              }}
            >
              <path d={path.d} className={`${path.class} line`} fill="none" />
            </g>
          ))}
          {circleData?.map(circle => (
            // biome-ignore lint/a11y/useSemanticElements: SVG does not support <button> as a descendant of <g>; role="button" is the correct ARIA pattern here
            <g
              key={circle.year + circle.id}
              role="button"
              tabIndex={0}
              aria-label={circle.id_info.id_display || circle.id}
              onMouseEnter={() =>
                setInteractionData({
                  xPos: xScale(circle.year) < 0 ? 0 : xScale(circle.year),
                  yPos: scale(circle.value) + figureHeight / 1.9 > figureHeight / 2 ? scale(circle.value) + figureHeight / 4 : scale(circle.value) + figureHeight / 1.9,
                  info: circle
                })
              }
              onMouseLeave={() => setInteractionData(null)}
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
            >
              <circle cx={xScale(circle.year)} cy={scale(circle.value)} r={5} className={circle.class === 'comparison_2_line' ? 'comparison_2_circle_filled' : circle.class.replace('line', 'circle')} />
              {circle.class === 'comparison_2_line' && <circle cx={xScale(circle.year)} cy={scale(circle.value)} r={2} className="comparison_2_center" />}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default Line;
