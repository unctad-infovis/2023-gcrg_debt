function Search({ query, setQuery }) {
  return <input type="text" className="searchInput" placeholder="Search for a country" autoComplete="off" id="searchInput" value={query} onChange={e => setQuery(e.target.value)} />;
}

export default Search;
