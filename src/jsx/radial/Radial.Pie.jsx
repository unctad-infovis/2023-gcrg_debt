import React, { useContext, memo } from 'react';
import PropTypes from 'prop-types';
import {
  pie, arc, groups, ascending
} from 'd3';
import Data from '../context/StaticData.js';
import invisibleArc from '../helpers/InvisibleArc.js';

// components
import Labels from './Radial.Pie.Labels.jsx';
import Slices from './Radial.Pie.Slices.jsx';

const pieGenerator = pie().value(1);
const arcPathGenerator = arc();
const sliceGenerator = pie()
  .sort(() => null)
  .value((d) => d.value || 1);

const pieData = (data, settings, innerR, outerR, pad) => {
  const { line_length, inner_radius } = settings;

  return data.map((p) => arcPathGenerator({
    innerRadius: (inner_radius + line_length) * innerR,
    outerRadius: (inner_radius + line_length) * outerR,
    startAngle: p.startAngle,
    endAngle: p.endAngle,
    padAngle: pad,
  }));
};

const filler_value = 0.23;
const filler = [
  { id: 'filler', value: filler_value, i: 2.5 },
  { id: 'filler', value: filler_value, i: 5.5 },
  { id: 'filler', value: filler_value, i: 8.5 },
  { id: 'filler', value: filler_value, i: 11.5 },
  { id: 'filler', value: filler_value, i: 14.5 },
  { id: 'filler', value: filler_value / 2, i: -0.5 },
  { id: 'filler', value: filler_value / 2, i: 17.5 },
];

function Pie({ settings }) {
  // get sections for donut chart
  const { indicatorData } = useContext(Data);
  const entries = groups(indicatorData, (d) => d.group);
  const pie_data = pieGenerator(groups(indicatorData, (d) => d.group));
  const arcs = pieData(pie_data, settings, 1.18, 1.28, 0.05).map((d, i) => {
    const textpath = d ? invisibleArc(d, pie_data[i].endAngle) : null;
    const dy = pie_data[i].endAngle > 3 && pie_data[i].endAngle < 5 ? -10 : 20;
    return {
      d,
      id: entries[i][0].replace(/\s/g, ''),
      text: entries[i][0],
      textpath: textpath !== '' ? textpath : null, // Set textpath to null if it's empty
      dy,
    };
  });

  // get sections for selected metric/hovering
  const slice_entries = indicatorData
    .map((d, i) => ({ ...d, i }))
    .concat(filler)
    .sort((a, b) => ascending(a.i, b.i));

  const slice_data = sliceGenerator(slice_entries).filter(
    (d, i) => slice_entries[i].id !== 'filler'
  );

  const slices = pieData(
    slice_data,
    settings,
    settings.center ? 0.328 : 0.07,
    1.18,
    0
  ).map((d, i) => ({
    d,
    indicator_key: indicatorData[i].indicator_key,
  }));

  const slices2 = pieData(slice_data, settings, 1.28, 1.3, 0).map((d, i) => ({
    d,
    indicator_key: indicatorData[i].indicator_key,
  }));

  return (
    <>
      <Labels arcs={arcs} />
      <Slices arcs={slices} shaded={slices2} />
    </>
  );
}

Pie.propTypes = {
  settings: PropTypes.shape({
    center: PropTypes.bool,
  }).isRequired,
};

export default memo(Pie);
