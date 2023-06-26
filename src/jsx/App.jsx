import React from 'react';
import '../styles/styles.less';

// Load context
import { StaticDataContextProvider } from './context/StaticData.js';
import { FocusContextProvider } from './context/Focus.js';
import { RadialDataContextProvider } from './context/RadialData.js';
import { MetricContextProvider } from './context/Metric';

// Load components
import Radial from './radial/Radial.jsx';
import Panel from './panel/Panel.jsx';
import Filter from './filters/Filter.jsx';

function App() {
  return (
    <div className="app">
      <StaticDataContextProvider>
        <FocusContextProvider>
          <Filter />
          <div className="visuals">
            <MetricContextProvider>
              <RadialDataContextProvider>
                <Radial />
              </RadialDataContextProvider>
              <Panel />
            </MetricContextProvider>
          </div>
        </FocusContextProvider>
      </StaticDataContextProvider>

      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default App;
