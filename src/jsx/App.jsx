import { useRef } from 'react';

import Article from '../Article.mdx';

// Storyboard
import DebtWheel from './components/debt_wheel/DebtWheel.jsx';

import './../styles/styles.css';

const components = {
  DebtWheel
};

const App = ({ meta }) => {
  const appRef = useRef();

  return (
    <div
      className="app"
      style={
        {
          // '--main-color': 'var(--un-color-green-dark)',
          // '--secondary-color': 'var(--un-color-green-text)'
        }
      }
      ref={appRef}
    >
      <Article components={components} meta={meta} />
    </div>
  );
};

export default App;
