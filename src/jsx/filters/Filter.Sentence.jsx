import React, {
  useContext, useState, useRef, memo
} from 'react';

// Load helpers.
import { StaticDataContext } from '../context/StaticData.js';
import { FocusContext } from '../context/Focus.js';

// components
import Arrow from './Arrow.jsx';
import FocusMenu from './Filter.FocusMenu.jsx';
import ComparisonsMenu from './Filter.ComparisonsMenu.jsx';
import useOutsideClick from './ClickOutside.jsx';

function Sentence() {
  const { textData } = useContext(StaticDataContext);

  const { id, comparisons } = useContext(FocusContext);

  const compRef = useRef();
  const focusRef = useRef();

  const doesList = [
    'Africa',
    'Developing Asia and Oceania',
    'Latin America and the Caribbean',
    'Europe and Central Asia*',
  ];

  const pre_value = id.type === 'country' || doesList.includes(id.id_display)
    ? 'sentence_2_pre'
    : 'sentence_1_pre';

  const pre_find = textData.find((d) => d.id === pre_value);
  const pre_text = pre_find ? pre_find.text : null;

  const middle_find = textData.find((d) => d.id === 'sentence_middle');
  const middle_text = middle_find ? middle_find.text : null;

  const end_find = textData.find((d) => d.id === 'sentence_end');
  const end_text = end_find ? end_find.text : null;

  const comp1 = comparisons[0] && comparisons[0].id;
  const comp2 = comparisons[1] && comparisons[1].id;

  let comps = null;
  if (comparisons.length === 0) {
    comps = 'select up to two comparisons';
  } else if (comparisons.length === 1) {
    comps = comp1;
  } else {
    const and_find = textData.find((d) => d.id === 'sentence_multiple');
    const and_text = and_find ? and_find.text : null;
    comps = `${comp1} ${and_text} ${comp2}`;
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const [compOpen, setCompOpen] = useState(false);

  useOutsideClick(compRef, () => {
    setCompOpen(false);
  });
  useOutsideClick(focusRef, () => {
    setMenuOpen(false);
  });

  return (
    <div className="sentence">
      {pre_text}

      <div className="focus-wrapper" ref={focusRef}>
        <div
          className="focus clickable"
          onClick={() => setMenuOpen(!menuOpen)}
          onKeyDown={() => setMenuOpen(!menuOpen)}
          role="presentation"
        >
          {id.id_display}
          <Arrow />
        </div>

        {menuOpen && <FocusMenu setMenuOpen={setMenuOpen} />}
      </div>
      {middle_text}
      <div className="comparisons-wrapper" ref={compRef}>
        <div
          className="comparisons clickable"
          onClick={() => setCompOpen(!compOpen)}
          onKeyDown={() => setCompOpen(!compOpen)}
          role="presentation"
        >
          {comps}
          <Arrow />
        </div>

        {compOpen && <ComparisonsMenu setCompOpen={setCompOpen} />}
      </div>
      {end_text}
    </div>
  );
}

export default memo(Sentence);
