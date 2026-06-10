import formatNum from '../helpers/FormatNum.js';

function Tooltip({ data = false, offset = false, width = false, scroll = false }) {
  if (!data) {
    return null;
  }

  const x = data.xPos - offset.left;
  const y = data.yPos - offset.top + 4 + window.scrollY - scroll;
  const newY = y + 30;
  const newX = x > width / 2.4 ? width / 3.3 : x;

  return (
    <div
      className="tooltip-viz"
      style={{
        left: data.type === 'line' ? newX : data.xPos,
        top: data.type === 'line' ? newY : data.yPos
      }}
    >
      <p className="title">{data.info.id_info.id_display || data.id}</p>

      {data.type !== 'line' && (
        <p>
          {`${data.info.indicator_info.indicator_full} in ${data.info.xaxis_display || data.info.year}: `}
          <span className="kpi">{formatNum(data.info.value, data.info.indicator_info.format, data.info.indicator_info.decimals)}</span>
        </p>
      )}
      <hr />
      <button type="button" className="switch">
        Click on {data.type || 'circle'} to switch focus to {data.info.id_info.id_display}
      </button>
    </div>
  );
}

export default Tooltip;
