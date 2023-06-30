import React, {
  useContext, useState, useRef, useLayoutEffect
} from 'react';

// context
import Metric_Context from '../context/Metric.js';
import { SwarmDataContextProvider } from '../context/SwarmData.js';

// components
import Tab from './Panel.Tab.jsx';
import Swarm from './Panel.Swarm.jsx';
import Line from './Panel.Line.jsx';
import Tooltip from './Tooltip.jsx';

function Panel() {
  const { metricInfo } = useContext(Metric_Context);
  console.log(metricInfo);

  // manage the tabs
  const [activeTab, setActiveTab] = useState('country');
  console.log(setActiveTab);

  // get height and width of SVG area
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    setTimeout(() => {
      setWidth(ref.current.offsetWidth);
      setHeight(ref.current.offsetHeight * 0.99);
    }, 300);
  }, []);

  const [interactionData, setInteractionData] = useState(null);

  return (
    <div className="panel">
      <div className="name">{metricInfo && metricInfo.indicator_full}</div>
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
          <div className="swarm-wrapper" style={{ width, height }}>
            <Tooltip data={interactionData} />
          </div>
          <SwarmDataContextProvider>
            {activeTab === 'country' ? (
              <Swarm
                width={width}
                height={height}
                setInteractionData={setInteractionData}
              />
            ) : (
              <Line width={width} height={height} />
            )}
          </SwarmDataContextProvider>
        </div>
      </div>
    </div>
  );
}

export default Panel;
