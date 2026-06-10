import { useContext } from 'react';
// components
import Metric_Context from '../context/Metric';
import { PanelContext } from '../context/Panel';
import Axis from '../radial/Radial.Spoke.Axis.jsx';
import Circle from '../radial/Radial.Spoke.Circle.jsx';

function Spoke({ i, settings, data, setTooltip, xPos }) {
  const angle = 0;

  const { setShowPanelValue } = useContext(PanelContext);
  const { setMetric } = useContext(Metric_Context);

  const handleTogglePanel = () => {
    // Toggle the showPanel value (true to false, false to true)
    setShowPanelValue(true);
  };

  const handleSliceClick = keys => {
    handleTogglePanel(); // Show the panel
    setMetric(keys); // Update the metric state
  };

  return (
    <g transform={`translate(${xPos / 2},${50 * (i + 1) - 25})`} className="g-hover">
      <button onClick={() => handleSliceClick(data.indicator_key)} type="button">
        <rect width={settings.line_length} y="-15px" height="30px" fill="hsl(0, 0%, 100%, 0)" />
        <Axis settings={settings} angle={angle} data={data} />
        <Circle settings={settings} data={data} setTooltip={setTooltip} />
      </button>
    </g>
  );
}

export default Spoke;
