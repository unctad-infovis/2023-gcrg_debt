import { useContext } from 'react';
import { FocusContext } from '../context/Focus';
import formatNum from '../helpers/FormatNum.js';

function Tooltip({
  data = {
    xPos: 0,
    yPos: 0,
    id: null,
    value: null,
    indicator_info: null
  }
}) {
  const { id, setId } = useContext(FocusContext);

  if (!data) {
    return null;
  }

  const switchFocus = () => {
    setId({
      type: data.type,
      id: data.id,
      id_display: data.id_display
    });
  };

  return (
    <div
      className="tooltip-viz"
      style={{
        left: data.xPos + 12,
        top: data.yPos - 12
      }}
    >
      <p className="title">{data.id_display || data.id}</p>
      <p>
        {`${data.indicator_info.indicator_full}: `}
        <span className="kpi">{formatNum(data.value, data.indicator_info.format, data.indicator_info.decimals)}</span>
      </p>
      {data.id !== id.id && (
        <>
          <hr />
          <button className="switch" onClick={() => switchFocus()} type="button">
            Click on circle to switch focus to {data.id_display}{' '}
          </button>
        </>
      )}
    </div>
  );
}

export default Tooltip;
