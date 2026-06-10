// Load context
import { FocusContextProvider } from './context/Focus';
import { MetricContextProvider } from './context/Metric';
import { PanelContextProvider } from './context/Panel';
import { RadialDataContextProvider } from './context/RadialData';
import { StaticDataContextProvider } from './context/StaticData';
import Download from './Download.jsx';
import Dotplot from './dotplot/Dotplot.jsx';
import Filter from './filters/Filter.jsx';
import viewPort from './helpers/viewPort';
import Panel from './panel/Panel.jsx';
import Center from './radial/Radial.Center.jsx';
import Radial from './radial/Radial.jsx';

import './DebtWheel.css';

function App() {
  const { smScreen, height } = viewPort();

  return (
    <div className="app">
      {window.innerWidth < 801 && <p className="message">ⓘ This dashboard is optimized for larger screens. For the best experience, please view it on a tablet in landscape mode or on a desktop.</p>}
      <StaticDataContextProvider>
        <FocusContextProvider>
          <div className="dashboard" id="app-root-2023-gcrg_debt-download">
            <Filter />
            {height <= 900 && <Center radius={0} />}
            <div className="visuals">
              {' '}
              <MetricContextProvider>
                <PanelContextProvider>
                  <RadialDataContextProvider>{smScreen ? <Dotplot /> : <Radial />}</RadialDataContextProvider>
                  <Panel />
                </PanelContextProvider>
              </MetricContextProvider>
            </div>
            <div className="source">
              <em>Source:</em> UN Trade and Development (UNCTAD)
            </div>
          </div>
          <Download />
        </FocusContextProvider>
      </StaticDataContextProvider>
    </div>
  );
}

export default App;
