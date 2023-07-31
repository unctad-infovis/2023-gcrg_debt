import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import { StaticDataContext } from './StaticData.js';

export const FocusContext = createContext({});

export function FocusContextProvider({ children }) {
  const { idData } = useContext(StaticDataContext);
  // set up the variable for storing the selected focus + comparisons

  const [id, setId] = useState({
    type: 'development',
    id: 'Developing countries',
    id_display: 'Developing countries',
  });

  const [comparisons, setComparisons] = useState([
    { type: 'development', id: 'Developed countries' },
  ]);

  const [readURL, setReadURL] = useState(false);
  useEffect(() => {
    const query = window.location.href.includes('?')
      ? window.location.href.split('?')[1]
      : null;
    if (query) {
      const pairs = query.split('&');
      const id_query = pairs[0].split('=')[0] === 'id' ? pairs[0].split('=')[1] : null;
      if (id_query && idData) {
        const data = idData.find((d) => d.id === decodeURIComponent(id_query));
        if (data) {
          setId(data);
        }
      }
      const c1_query = pairs[1].split('=')[0] === 'comparison1'
        ? pairs[1].split('=')[1]
        : null;
      const c2_query = pairs[2].split('=')[0] === 'comparison2'
        ? pairs[2].split('=')[1]
        : null;

      if ((c1_query || c2_query) && idData) {
        const c1_data = idData.find(
          (d) => d.id === decodeURIComponent(c1_query)
        );
        const c2_data = idData.find(
          (d) => d.id === decodeURIComponent(c2_query)
        );
        console.log(c2_query);

        if (c1_data || c2_data) {
          setComparisons([c1_data, c2_data]);
        }
      }

      setTimeout(() => {
        setReadURL(true);
      }, 1000);
    }
  }, [idData]);

  useMemo(() => {
    if (readURL) {
      console.log('here');
      const defaultComps = idData.find((d) => d.id === id.id);
      let comp1 = null;
      let comp2 = null;

      if (id.type === 'country') {
        comp1 = idData.find((d) => defaultComps.development === d.id);
        comp2 = idData.find((d) => defaultComps.region === d.id);
      } else if (
        id.type === 'development'
        && id.id === 'Developing countries'
      ) {
        comp1 = idData.find((d) => d.id === 'Developed countries');
      } else {
        comp1 = idData.find((d) => d.id === 'Developing countries');
      }
      const newComps = comp2 ? [comp1, comp2] : [comp1];
      setComparisons(newComps);
    }
  }, [id, idData]);

  const comparisonLists = useMemo(
    () => ({
      comparison_1:
        idData && comparisons[0]
          ? idData.filter(
            (d) => d[comparisons[0].type] === comparisons[0].id
                || +d[comparisons[0].type] === 1
          )
          : [],
      comparison_2:
        idData && comparisons[1]
          ? idData.filter(
            (d) => d[comparisons[1].type] === comparisons[1].id
                || +d[comparisons[1].type] === 1
          )
          : [],
    }),
    [idData, comparisons]
  );

  const focusList = useMemo(
    () => (idData && id
      ? idData.filter((d) => d[id.type] === id.id || +d[id.type] === 1)
      : []),
    [idData, id]
  );

  const optionsList = useMemo(
    () => idData
      .filter((d) => d.type !== 'country')
      .map((d, i) => ({
        ...d,
        order: i,
        checked:
            comparisons[0] && comparisons[0].id === d.id
              ? true
              : !!(comparisons[1] && comparisons[1].id === d.id),
      })),
    [idData, comparisons]
  );

  const context = useMemo(
    () => ({
      id,
      setId,
      comparisons,
      setComparisons,
      comparisonLists,
      focusList,
      optionsList,
    }),
    [id, comparisons, comparisonLists, focusList, optionsList]
  );

  return (
    <FocusContext.Provider value={context}>{children}</FocusContext.Provider>
  );
}

FocusContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FocusContext;