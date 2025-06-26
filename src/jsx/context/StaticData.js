import React, {
  createContext, useState, useEffect, useMemo
} from 'react';
import PropTypes from 'prop-types';
import CSVtoJSON from '../helpers/CSVtoJSON.js';

export const StaticDataContext = createContext({});

const fetchData = (name, setValue) => {
  const data_file = window.location.href.includes('unctad.org')
    ? `https://storage.unctad.org/2023-gcrg_debt/assets/data/${name}`
    : `./assets/data/${name}`;
  try {
    fetch(data_file)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.text();
      })
      .then((body) => setValue(name.includes('csv') ? CSVtoJSON(body) : JSON.parse(body)));
  } catch (error) {
    console.error(error);
  }
};

export function StaticDataContextProvider({ children }) {
  const [indicatorData, setIndicatorData] = useState([]);
  const [valuesData, setValuesData] = useState([]);
  const [idData, setIdData] = useState([]);
  const [textData, setTextData] = useState([]);
  const [aboutData, setAboutData] = useState([]);

  useEffect(() => {
    fetchData('indicator_key.csv?v=2025', setIndicatorData);
    fetchData('values.csv?v=2025', setValuesData);
    fetchData('id_key.csv?v=2025', setIdData);
    fetchData('text.csv?v=2025', setTextData);
    fetchData('about.json?v=2025', setAboutData);
  }, []);

  const latestData = useMemo(
    () => valuesData
      && valuesData
        .filter((d) => +d.latest_year === 1)
        .map((d) => ({
          ...d,
          id_display: idData
            ? idData.find((i) => i.id === d.id)
              ? idData.find((i) => i.id === d.id).id_display
              : d.id
            : d.id,
        })),
    [valuesData, idData]
  );

  const context = useMemo(
    () => ({
      indicatorData,
      valuesData,
      latestData,
      idData,
      textData,
      aboutData,
    }),
    [indicatorData, valuesData, idData, textData, aboutData, latestData]
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
