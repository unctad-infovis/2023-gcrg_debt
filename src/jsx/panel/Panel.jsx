import React, {
  useContext, useState, useRef, useLayoutEffect
} from 'react';
// import React, { useContext, useState, useRef, useLayoutEffect } from "react";
// import Swarm from "./Panel.Swarm.jsx";
// import Line from "./Panel.Line.jsx";
// context
import Metric_Context from '../context/Metric.js';
import { SwarmDataContextProvider } from '../context/SwarmData.js';

// components
import Tab from './Panel.Tab.jsx';
import Swarm from './Panel.Swarm.jsx';
import Line from './Panel.Line.jsx';

function Panel() {
  const { metricInfo } = useContext(Metric_Context);

  // manage the tabs
  const [activeTab, setActiveTab] = useState('country');

  // get height and width of SVG area
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
  }, []);

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
          <SwarmDataContextProvider>
            {activeTab === 'country' ? (
              <Swarm width={width} height={height} />
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
