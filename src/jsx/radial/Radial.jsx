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
import viewPort from '../helpers/viewPort';

function Radial() {
  // get the radial data
  const { circleData } = useContext(Data);

  const { width, mobile } = viewPort();

  // get the figureHeight and figureWidth of the div to determine the sizing for the radial
  const ref = useRef(null);
  const [figureWidth, setWidth] = useState(0);
  const [figureHeight, setHeight] = useState(0);
  const [offset, setOffset] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
    setOffset(ref.current.getBoundingClientRect());
  }, [width, mobile]);

  const settings = useMemo(
    () => ({
      figureWidth,
      figureHeight,
      line_length: figureHeight * 0.305,
      inner_radius: figureHeight * 0.08,
      section_gap: 0.75,
    }),
    [figureWidth, figureHeight]
  );

  const [hovered, setHovered] = useState(null);

  return (
    <div className="radial" ref={ref}>
      <svg width={figureHeight} height={figureHeight}>
        <g transform={`translate(${figureHeight / 2}, ${figureHeight / 2})`}>
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
      <Center radius={settings.inner_radius} />
      <Tooltip data={hovered} offset={offset} />
    </div>
  );
}

export default Radial;
