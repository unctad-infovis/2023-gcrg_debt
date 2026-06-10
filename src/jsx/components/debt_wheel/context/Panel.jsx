import { createContext, useMemo, useState } from 'react';

export const PanelContext = createContext({});

export function PanelContextProvider({ children }) {
  const [showPanel, setShowPanelValue] = useState(false);

  const context = useMemo(
    () => ({
      showPanel,
      setShowPanelValue
    }),
    [showPanel]
  );
  return <PanelContext.Provider value={context}>{children}</PanelContext.Provider>;
}

export default PanelContext;
