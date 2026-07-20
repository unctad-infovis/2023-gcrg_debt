import { createContext, useEffect, useMemo, useState } from 'react';
import CSVtoJSON from '@unctad-infovis/general-tools/helpers/CsvToJson.js';
import loadFile from '@unctad-infovis/general-tools/helpers/LoadFile.js';

export const StaticDataContext = createContext({});

export function StaticDataContextProvider({ children }) {
  const [indicatorData, setIndicatorData] = useState([]);
  const [valuesData, setValuesData] = useState([]);
  const [idData, setIdData] = useState([]);
  const [textData, setTextData] = useState([]);
  const [aboutData, setAboutData] = useState([]);

  useEffect(() => {
    const data_version = '2026';
    Promise.all([
      loadFile(`/assets/data/indicator_key.csv?v=${data_version}`).then(r => r?.text()),
      loadFile(`/assets/data/values.csv?v=${data_version}`).then(r => r?.text()),
      loadFile(`/assets/data/id_key.csv?v=${data_version}`).then(r => r?.text()),
      loadFile(`/assets/data/text.csv?v=${data_version}`).then(r => r?.text()),
      loadFile(`/assets/data/about.json?v=${data_version}`).then(r => r?.json())
    ]).then(([indicator_key, values, id_key, text, about]) => {
      if (indicator_key) setIndicatorData(CSVtoJSON(indicator_key));
      if (values) setValuesData(CSVtoJSON(values));
      if (id_key) setIdData(CSVtoJSON(id_key));
      if (text) setTextData(CSVtoJSON(text));
      if (about) setAboutData(about);
    });
  }, []);

  const latestData = useMemo(
    () =>
      valuesData
        ?.filter(d => +d.latest_year === 1)
        .map(d => {
          const idMatch = idData?.find(i => i.id === d.id);
          return { ...d, id_display: idMatch ? idMatch.id_display : d.id };
        }),
    [idData, valuesData]
  );

  const context = useMemo(
    () => ({
      indicatorData,
      valuesData,
      latestData,
      idData,
      textData,
      aboutData
    }),
    [aboutData, indicatorData, valuesData, idData, textData, latestData]
  );

  return <StaticDataContext.Provider value={context}>{children}</StaticDataContext.Provider>;
}

export default StaticDataContext;
