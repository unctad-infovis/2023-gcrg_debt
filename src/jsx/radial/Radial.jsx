import React, {
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
  useContext,
} from 'react';

// context
import Data from '../context/RadialData.js';

// components
import Spoke from './Radial.Spoke.jsx';
import Pie from './Radial.Pie.jsx';

function Radial() {
  // get the radial data
  const { circleData } = useContext(Data);
  // get the height and width of the div to determine the sizing for the radial
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
  }, []);

  const settings = useMemo(
    () => ({
      width,
      height,
      line_length: (width > height ? height : width) * 0.23,
      inner_radius: (width > height ? height : width) * 0.15,
      section_gap: 0.75,
    }),
    [width, height]
  );

  return (
    <div className="radial" ref={ref}>
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          <Pie settings={settings} />
          {circleData.map((data, index) => (
            <Spoke
              key={data.indicator_key}
              data={data}
              i={index}
              total={circleData.length}
              settings={settings}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default Radial;
