import React, {
  createContext, useState, useEffect, useMemo
} from 'react';
import PropTypes from 'prop-types';

export const PanelContext = createContext({});

export function PanelContextProvider({ children }) {
  const [showPanel, setShowPanel] = useState([]);

  useEffect(() => {
    setShowPanel(false);
  }, []);

  const setShowPanelValue = (newValue) => {
    setShowPanel(newValue);
  };

  const context = useMemo(
    () => ({
      showPanel,
      setShowPanelValue,
    }),
    [showPanel]
  );
  return (
    <PanelContext.Provider value={context}>{children}</PanelContext.Provider>
  );
}

PanelContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PanelContext;
