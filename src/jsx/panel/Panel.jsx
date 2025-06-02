import React, {
  useContext, useState, useRef, useLayoutEffect
} from 'react';

// context
import Metric_Context from '../context/Metric.js';
import { SwarmDataContextProvider } from '../context/SwarmData.js';
import { PanelContext } from '../context/Panel.js';

// components
import Tab from './Panel.Tab.jsx';
import Swarm from './Panel.Swarm.jsx';
import Line from './Panel.Line.jsx';
import Tooltip from './Tooltip.jsx';
import About from './Panel.About.jsx';
import Button from './Panel.Button.jsx';
import viewPort from '../helpers/viewPort';
import Legend from './Panel.Legend.jsx';

function Panel() {
  const { metricInfo } = useContext(Metric_Context);
  const { showPanel } = useContext(PanelContext);

  const { width, hidePanelWidth, height } = viewPort();

  // manage the tabs
  const [activeTab, setActiveTab] = useState('country');

  // manage panel state on smScreens
  // const [hidePanel, setHidePanel] = useState(true);

  // get height and figureWidth of SVG area
  const ref = useRef(null);
  const [figureWidth, setfigureWidth] = useState(0);
  const [figureHeight, setHeight] = useState(0);
  const [offset, setOffset] = useState({ top: 0, left: 0 });
  const [scroll, setScroll] = useState(0);

  useLayoutEffect(() => {
    const updateDimensions = () => {
      if (ref.current) {
        setfigureWidth(ref.current.offsetWidth);
        setHeight(ref.current.offsetHeight * 0.99);
        setOffset(ref.current.getBoundingClientRect());
        setScroll(window.scrollY);
      }
    };

    const resizeHandler = setTimeout(updateDimensions, 300);

    return () => clearTimeout(resizeHandler);
  }, [width, showPanel, height, hidePanelWidth, figureWidth]);

  const [interactionData, setInteractionData] = useState(null);

  return (showPanel && hidePanelWidth) || !hidePanelWidth ? (
    <div className="panel-wrapper">
      <div className="panel">
        <div className="name">
          {metricInfo && metricInfo.indicator_full}
          {hidePanelWidth ? <Button /> : ''}
        </div>
        <div className="tabs">
          <ul className="nav">
            <Tab
              id="country"
              display="By country"
              activeTab={activeTab}
              setTab={setActiveTab}
            />
            <Tab
              id="trend"
              display="Trend over time"
              activeTab={activeTab}
              setTab={setActiveTab}
            />

            <Tab
              id="about"
              display="About"
              activeTab={activeTab}
              setTab={setActiveTab}
            />
          </ul>
          <div className="legend">
            {activeTab === 'country' && height > 900 && <Legend />}
          </div>
          <div className="content" ref={ref}>
            <div
              className="swarm-wrapper"
              style={{ figureWidth, figureHeight }}
            >
              {(interactionData && offset)
              && (
              <Tooltip
                data={interactionData}
                offset={offset}
                width={figureWidth}
                scroll={scroll}
              />
              )}
            </div>
            <SwarmDataContextProvider>
              {activeTab === 'country' ? (
                <Swarm
                  width={figureWidth}
                  figureHeight={figureHeight}
                  setInteractionData={setInteractionData}
                />
              ) : activeTab === 'trend' ? (
                <Line
                  width={figureWidth}
                  height={figureHeight}
                  setInteractionData={setInteractionData}
                />
              ) : (
                <About />
              )}
            </SwarmDataContextProvider>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ''
  );
}

export default Panel;
