import React from 'react';

// Components
// import Focus from './Filter.Focus.jsx';
// import Comparisons from './Filter.Comparisons.jsx';
import Sentence from './Filter.Sentence.jsx';

function Filter() {
  return (
    <div className="filters">
      <Sentence />
      {/* <Focus />
      <Comparisons /> */}
    </div>
  );
}

export default Filter;
