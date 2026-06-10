import { ascending, groups } from 'd3';
import { memo, useContext, useState } from 'react';

// Load context.
import { FocusContext } from '../context/Focus';
import { StaticDataContext } from '../context/StaticData';
import Exit from './Exit.jsx';
import Search from './Search.jsx';

function FocusMenu({ setMenuOpen }) {
  const { idData, textData } = useContext(StaticDataContext);

  const { setId } = useContext(FocusContext);

  const handleIdChange = e => {
    setId({
      id: e.id,
      id_display: e.id_display,
      type: e.type
    });

    setMenuOpen(false);
  };

  const tabs = textData?.find(t => t.id === 'sentence_focus_tabs').text.split('|');

  const [activeTab, setActiveTab] = useState(tabs[0]);

  const [query, setQuery] = useState('');

  const listData = idData
    .filter(d => (activeTab === 'Country' ? d.type === 'country' : d.type !== 'country'))
    .filter(d => (activeTab === 'Country' ? d.id_display.toLowerCase().includes(query.toLowerCase()) : true))
    .sort((a, b) => (activeTab === 'Country' ? ascending(a.id_display, b.id_display) : true));

  const grouping = groups(listData, d => d.category_display).map(d => ({
    name: d[0],
    items: d[1]
  }));

  return (
    <div className="focus-menu">
      <div className="tabs">
        <Exit handleExit={setMenuOpen} />
        <ul className="nav">
          {tabs.map(tab => (
            <li className={activeTab === tab ? 'active' : ''} role="presentation" key={tab}>
              <button onClick={() => setActiveTab(tab)} onKeyDown={() => setActiveTab(tab)} type="button">
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="selections">
        {activeTab === 'Country' && (
          <>
            <Search query={query} setQuery={setQuery} />
            {listData?.map(item => (
              <div key={item.id} className="item" role="presentation">
                <button onClick={() => handleIdChange(item)} onKeyDown={() => handleIdChange(item)} type="button">
                  <input type="radio" id={item.id} name="country-values" />
                  <label htmlFor={item.id}>{item.id_display}</label>
                </button>
              </div>
            ))}
          </>
        )}
        {activeTab !== 'Country' &&
          listData &&
          grouping.map(group => (
            <div className="group" key={group.name}>
              <span className="name">{group.name}</span>
              {group.items.map(item => (
                <div key={item.id} className="item" role="presentation">
                  <button onClick={() => handleIdChange(item)} onKeyDown={() => handleIdChange(item)} type="button">
                    <input type="radio" id={item.id} name="country-values" />
                    <label htmlFor={item.id}>{item.id_display}</label>
                  </button>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

export default memo(FocusMenu);
