function Tab({ activeTab, id, display, setTab }) {
  return (
    <li className={activeTab === id ? 'active' : ''} role="presentation">
      <button onClick={() => setTab(id)} onKeyDown={() => setTab(id)} type="button">
        {display}
      </button>
    </li>
  );
}

export default Tab;
