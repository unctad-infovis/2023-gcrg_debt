import React from 'react';
import '../styles/styles.less';

// Load context
import { StaticDataContextProvider } from './context/StaticData.js';
import { FocusContextProvider } from './context/Focus.js';
import { RadialDataContextProvider } from './context/RadialData.js';
import { MetricContextProvider } from './context/Metric';

// Load components
import Radial from './radial/Radial.jsx';

function App() {
  return (
    <div className="app">
      <StaticDataContextProvider>
        <FocusContextProvider>
          <div className="filters">Filters</div>
          <div className="visuals">
            <RadialDataContextProvider>
              <MetricContextProvider>
                <Radial />
              </MetricContextProvider>
            </RadialDataContextProvider>
            <div className="panel">
              <MetricContextProvider>Panel</MetricContextProvider>
            </div>
          </div>
        </FocusContextProvider>
      </StaticDataContextProvider>

      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default App;
