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

function Panel() {
  const { metricInfo } = useContext(Metric_Context);
  const { showPanel } = useContext(PanelContext);

  const { width, hidePanelWidth } = viewPort();

  // manage the tabs
  const [activeTab, setActiveTab] = useState('country');

  // manage panel state on smScreens
  // const [hidePanel, setHidePanel] = useState(true);

  // get height and figureWidth of SVG area
  const ref = useRef(null);
  const [figureWidth, setfigureWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const updateDimensions = () => {
      if (ref.current) {
        setfigureWidth(ref.current.offsetWidth);
        setHeight(ref.current.offsetHeight * 0.99);
      }
    };

    const resizeHandler = setTimeout(updateDimensions, 300);

    return () => clearTimeout(resizeHandler);
  }, [width, showPanel, hidePanelWidth, figureWidth]);

  const [interactionData, setInteractionData] = useState(null);

  return (
    <div className="panel-wrapper">
      {(showPanel && hidePanelWidth) || !hidePanelWidth ? (
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
            <div className="content" ref={ref}>
              <div className="swarm-wrapper" style={{ figureWidth, height }}>
                <Tooltip data={interactionData} />
              </div>
              <SwarmDataContextProvider>
                {activeTab === 'country' ? (
                  <Swarm
                    width={figureWidth}
                    height={height}
                    setInteractionData={setInteractionData}
                  />
                ) : activeTab === 'trend' ? (
                  <Line
                    width={figureWidth}
                    height={height}
                    setInteractionData={setInteractionData}
                  />
                ) : (
                  <About />
                )}
              </SwarmDataContextProvider>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default Panel;
