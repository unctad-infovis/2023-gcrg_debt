import React, { useState, useRef, useLayoutEffect } from 'react';
import '../styles/styles.less';

// Load context
import { StaticDataContextProvider } from './context/StaticData.js';
import { FocusContextProvider } from './context/Focus.js';
import { RadialDataContextProvider } from './context/RadialData.js';
import { MetricContextProvider } from './context/Metric';
import { PanelContextProvider } from './context/Panel';
import viewPort from './helpers/viewPort';

// Load components
import Radial from './radial/Radial.jsx';
import Dotplot from './dotplot/Dotplot.jsx';
import Panel from './panel/Panel.jsx';
import Filter from './filters/Filter.jsx';

function App() {
  const { smScreen } = viewPort();

  // get Visual Height
  const visualsRef = useRef(null);
  const [visualsHeight, setVisualsHeight] = useState(0);
  useLayoutEffect(() => {
    setVisualsHeight(visualsRef.current.offsetHeight);
  }, []);

  return (
    <div className="app">
      <StaticDataContextProvider>
        <FocusContextProvider>
          <Filter />
          <div className="visuals" ref={visualsRef}>
            <MetricContextProvider>
              <PanelContextProvider>
                <RadialDataContextProvider>
                  {smScreen ? <Dotplot /> : <Radial />}
                </RadialDataContextProvider>
                <div
                  className="panel-wrapper"
                  style={{ height: visualsHeight }}
                >
                  <Panel />
                </div>
              </PanelContextProvider>
            </MetricContextProvider>
          </div>
        </FocusContextProvider>
      </StaticDataContextProvider>

      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default App;
