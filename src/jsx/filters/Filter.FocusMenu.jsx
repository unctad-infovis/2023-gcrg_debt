import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

// Load helpers.
import { ascending } from 'd3';
import { StaticDataContext } from '../context/StaticData.js';
import { FocusContext } from '../context/Focus.js';
import Search from './Search.jsx';

function FocusMenu({ setMenuOpen }) {
  const { idData, textData } = useContext(StaticDataContext);

  const { setId } = useContext(FocusContext);

  const handleIdChange = (e) => {
    setId({
      id: e.id,
      id_display: e.id_display,
      type: e.type,
    });
    setMenuOpen(false);
  };

  const tabs = textData
    && textData.find((t) => t.id === 'sentence_focus_tabs').text.split('|');

  const [activeTab, setActiveTab] = useState(tabs[0]);

  const [query, setQuery] = useState('');

  const listData = idData
    .filter((d) => (activeTab === 'Country' ? d.type === 'country' : d.type !== 'country'))
    .filter((d) => (activeTab === 'Country'
      ? d.id_display.toLowerCase().includes(query.toLowerCase())
      : true))
    .sort((a, b) => ascending(a.id_display, b.id_display));

  return (
    <div className="focus-menu">
      <div className="tabs">
        <ul className="nav">
          {tabs.map((tab) => (
            <li
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
              onKeyDown={() => setActiveTab(tab)}
              role="presentation"
              key={tab}
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>
      <div className="selections">
        {activeTab === 'Country' && (
          <Search query={query} setQuery={setQuery} />
        )}
        {listData
          && listData.map((item) => (
            <div
              key={item.id}
              className="item"
              onClick={() => handleIdChange(item)}
              onKeyDown={() => handleIdChange(item)}
              role="presentation"
            >
              <input type="radio" id={item.id} name="country-values" />
              <label htmlFor={item.id}>{item.id_display}</label>
            </div>
          ))}
      </div>
    </div>
  );
}

FocusMenu.propTypes = {
  setMenuOpen: PropTypes.func.isRequired,
};

export default FocusMenu;
