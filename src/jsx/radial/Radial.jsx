import React, {
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
  useContext,
  memo,
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

  const {
    width, mobile, height, hidePanelWidth
  } = viewPort();

  // get the figureHeight and figureWidth of the div to determine the sizing for the radial
  const ref = useRef(null);
  const [figureWidth, setWidth] = useState(0);
  const [figureHeight, setHeight] = useState(0);
  const [offset, setOffset] = useState({ top: 0, left: 0 });
  const [scroll, setScroll] = useState(0);

  useLayoutEffect(() => {
    setOffset(ref.current.getBoundingClientRect());
    setScroll(window.scrollY);
  }, [figureHeight, figureWidth]);

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
    setOffset(ref.current.getBoundingClientRect());
  }, [width, mobile, height]);

  const panel = (width > 1280 ? 450 : width > 1150 ? 400 : 300) * 1.15;
  const size = hidePanelWidth
    ? figureHeight
    : width < hidePanelWidth || width - panel > figureHeight
      ? figureHeight
      : width - panel;

  const settings = useMemo(
    () => ({
      figureWidth,
      figureHeight,
      line_length: size * 0.245,
      inner_radius: size * 0.14,
      section_gap: 0.75,
    }),
    [figureWidth, figureHeight, size]
  );

  const [hovered, setHovered] = useState(null);

  return (
    <div className="radial" ref={ref}>
      <svg width={size} height="100%">
        <g transform={`translate(${size / 2}, ${figureHeight / 2})`}>
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
      <Tooltip data={hovered} offset={offset} scroll={scroll} />
    </div>
  );
}

export default memo(Radial);
