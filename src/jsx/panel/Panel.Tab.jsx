import React from 'react';
import PropTypes from 'prop-types';

function Tab({
  activeTab, id, display, setTab
}) {
  return (
    <li
      className={activeTab === id ? 'active' : ''}
      onClick={() => setTab(id)}
      onKeyDown={() => setTab(id)}
      role="presentation"
    >
      {display}
    </li>
  );
}

Tab.propTypes = {
  activeTab: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  display: PropTypes.string.isRequired,
  setTab: PropTypes.func.isRequired,
};

export default Tab;
