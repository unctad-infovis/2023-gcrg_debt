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
// import Center from './radial/Radial.Center.jsx';

// Load components
import Radial from './radial/Radial.jsx';
// import Dotplot from './dotplot/Dotplot.jsx';
import Panel from './panel/Panel.jsx';
import Filter from './filters/Filter.jsx';

function App() {
  const { smScreen } = viewPort();

  return (
    <div className="app">
      {smScreen ? (
        'Please view on a larger screen'
      ) : (
        <StaticDataContextProvider>
          <FocusContextProvider>
            <Filter />
            {/* <Center /> */}
            <div className="visuals">
              {' '}
              <MetricContextProvider>
                <PanelContextProvider>
                  <RadialDataContextProvider>
                    <Radial />
                  </RadialDataContextProvider>
                  <Panel />
                </PanelContextProvider>
              </MetricContextProvider>
            </div>
          </FocusContextProvider>
        </StaticDataContextProvider>
      )}
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default App;
