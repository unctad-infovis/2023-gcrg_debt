import React from 'react';
// { useState, useRef, useLayoutEffect }
import '../styles/styles.less';

// Load context
import { StaticDataContextProvider } from './context/StaticData.js';
import { FocusContextProvider } from './context/Focus.js';
import { RadialDataContextProvider } from './context/RadialData.js';
import { MetricContextProvider } from './context/Metric';
import { PanelContextProvider } from './context/Panel';
import viewPort from './helpers/viewPort';
import Center from './radial/Radial.Center.jsx';
import Download from './Download.jsx';

// Load components
import Radial from './radial/Radial.jsx';
import Dotplot from './dotplot/Dotplot.jsx';
import Panel from './panel/Panel.jsx';
import Filter from './filters/Filter.jsx';

function App() {
  const { smScreen, height } = viewPort();

  return (
    <div className="app">
      <div className="dashboard" id="app-root-2023-gcrg_debt-download">
        <StaticDataContextProvider>
          <FocusContextProvider>
            <Filter />
            {height <= 900 && <Center />}
            <div className="visuals">
              {' '}
              <MetricContextProvider>
                <PanelContextProvider>
                  <RadialDataContextProvider>
                    {smScreen ? <Dotplot /> : <Radial />}
                  </RadialDataContextProvider>
                  <Panel />
                </PanelContextProvider>
              </MetricContextProvider>
            </div>
          </FocusContextProvider>
        </StaticDataContextProvider>
      </div>
      <Download />
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default App;
