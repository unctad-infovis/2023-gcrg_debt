import { memo } from 'react';
// components
// import Labels from './Radial.Spoke.Label.jsx';
// import Circles from './Radial.Spoke.Circle.jsx';
import Axis from './Radial.Spoke.Axis.jsx';
import Circle from './Radial.Spoke.Circle.jsx';

function Spoke({ i, total, settings, data, setTooltip }) {
  const { section_gap } = settings;
  const total_gaps = total + 6 * section_gap;
  const rotate = (1 / total_gaps) * 360;

  const gaps = index => {
    const section = Math.ceil(index / 3);
    const end = (index % 3 === 0 ? section_gap : 0) + index + section * section_gap;

    return end;
  };

  // right side: -1.5 > 1.5 > 4.5
  // leftside: -3 > 0 > 3
  let center = 0;
  if (i === 0 || i === 3 || i === 6) {
    center = -1.5;
  } else if (i === 9 || i === 12 || i === 15) {
    center = -3;
  } else if (i === 1 || i === 4 || i === 7) {
    center = 1.5;
  } else if (i === 11 || i === 14 || i === 17) {
    center = 3;
  } else if (i === 10 || i === 13 || i === 16) {
    center = 0;
  } else {
    center = 4.5;
  }

  const angle = (gaps(i) / total_gaps) * 360 - 90 + rotate / total + center;

  return (
    data && (
      <g transform={`rotate(${angle})`}>
        <Axis settings={settings} angle={angle} data={data} />
        <Circle settings={settings} data={data} setTooltip={setTooltip} />
      </g>
    )
  );
}

export default memo(Spoke);
