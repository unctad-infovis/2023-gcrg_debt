import React, {
  createContext, useState, useEffect, useMemo
} from 'react';
import PropTypes from 'prop-types';
import CSVtoJSON from '../helpers/CSVtoJSON.js';

export const StaticDataContext = createContext({});

const fetchData = (name, setValue) => {
  const data_file = window.location.href.includes('unctad.org')
    ? `/sites/default/files/data-file/2023-gcrg_debt/${name}`
    : `./assets/data/${name}`;
  try {
    fetch(data_file)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.text();
      })
      .then((body) => setValue(CSVtoJSON(body)));
  } catch (error) {
    console.error(error);
  }
};

export function StaticDataContextProvider({ children }) {
  const [indicatorData, setIndicatorData] = useState([]);
  const [valuesData, setValuesData] = useState([]);
  const [idData, setIdData] = useState([]);

  useEffect(() => {
    fetchData('indicator_key.csv', setIndicatorData);
    fetchData('values.csv', setValuesData);
    fetchData('id_key.csv', setIdData);
  }, []);

  const context = useMemo(
    () => ({
      indicatorData,
      valuesData,
      latestData: valuesData && valuesData.filter((d) => +d.latest_year === 1),
      idData,
    }),
    [indicatorData, valuesData, idData]
  );

  return (
    <StaticDataContext.Provider value={context}>
      {children}
    </StaticDataContext.Provider>
  );
}

StaticDataContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StaticDataContext;
