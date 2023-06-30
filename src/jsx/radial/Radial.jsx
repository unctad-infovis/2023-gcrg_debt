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
import Center from './Radial.Center.jsx';
import Tooltip from './Tooltip.jsx';

function Radial() {
  // get the radial data
  const { circleData } = useContext(Data);

  // get the height and width of the div to determine the sizing for the radial
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [offsetTop, setOffsetTop] = useState(0);

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
    setOffsetTop(ref.current.offsetTop);
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

  const [hovered, setHovered] = useState(null);

  return (
    <div className="radial" ref={ref}>
      <Center />
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          <Pie settings={settings} />
          {circleData
            && circleData.map((data, index) => (
              <Spoke
                key={data.indicator_key}
                data={data}
                i={index}
                total={circleData.length}
                settings={settings}
                setTooltip={setHovered}
              />
            ))}
        </g>
      </svg>

      <Tooltip data={hovered} offsetTop={offsetTop} />
    </div>
  );
}

export default Radial;
