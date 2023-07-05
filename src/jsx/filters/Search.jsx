import React from 'react';
import PropTypes from 'prop-types';

function Search({ query, setQuery }) {
  return (
    <input
      type="text"
      className="searchInput"
      placeholder="Search for a country"
      autoComplete="off"
      id="searchInput"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

Search.propTypes = {
  setQuery: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
};

export default Search;
