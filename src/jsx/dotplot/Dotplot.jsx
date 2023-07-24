import React, {
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
  useContext,
} from 'react';

import { groups } from 'd3';

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
      line_length: width * 0.75,
      xPos: width * 0.1,
      inner_radius: 0,
      section_gap: 0.75,
    }),
    [width, figureWidth, figureHeight]
  );

  const grouped = groups(circleData, (d) => d.indicator_info.group);

  return (
    <div className="dotplot" ref={ref}>
      {grouped.map(
        (d) => d[0] && (
        <div className="dotplot-group" key={d[0]}>
          <span style={{ paddingLeft: settings.xPos / 2 }}>{d[0]}</span>
          <svg width={figureWidth} height="100%">
            {d[1]
                  && d[1].map((data, index) => (
                    <Spoke
                      key={data.indicator_key}
                      data={data}
                      i={index}
                      total={circleData.length}
                      settings={settings}
                      setTooltip={() => false}
                      xPos={settings.xPos}
                    />
                  ))}
          </svg>
        </div>
        )
      )}
      {/* <svg width={figureWidth} height="100%">
        <g>
          {circleData
            && circleData.map((data, index) => (
              <Spoke
                key={data.indicator_key}
                data={data}
                i={index}
                total={circleData.length}
                settings={settings}
                setTooltip={() => false}
                xPos={settings.xPos}
              />
            ))}
        </g>
      </svg> */}
    </div>
  );
}

export default DotPlot;
