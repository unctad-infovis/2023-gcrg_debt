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
import Spoke from './Dotplot.Spoke.jsx';
import viewPort from '../helpers/viewPort';

function DotPlot() {
  // get the radial data
  const { circleData } = useContext(Data);

  const { width, mobile } = viewPort();

  // get the figureHeight and figureWidth of the div to determine the sizing for the radial
  const ref = useRef(null);
  const [figureWidth, setWidth] = useState(0);
  const [figureHeight, setHeight] = useState(0);
  // const [offset, setOffset] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
    // setOffset(ref.current.getBoundingClientRect());
  }, [width, mobile]);

  const settings = useMemo(
    () => ({
      figureWidth,
      figureHeight,
      line_length: figureWidth * 0.75,
      inner_radius: 0,
      section_gap: 0.75,
    }),
    [figureWidth, figureHeight]
  );
  return (
    <div className="dotplot" ref={ref}>
      <svg width={figureWidth} height={figureHeight}>
        <g>
          {circleData
            && circleData.map((data, index) => (
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

export default DotPlot;
