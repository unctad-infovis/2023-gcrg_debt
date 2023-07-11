import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import formatNum from '../helpers/FormatNum.js';
import { FocusContext } from '../context/Focus.js';

function Tooltip({ data, offset, scroll }) {
  const { id, setId } = useContext(FocusContext);

  if (!data) {
    return null;
  }

  const switchFocus = () => {
    setId({
      type: data.type,
      id: data.id,
      id_display: data.id_display,
    });
  };

  return (
    <div
      className="tooltip-viz"
      style={{
        left: data.xPos - offset.left,
        top: data.yPos - offset.top + 4 + window.scrollY - scroll,
      }}
    >
      <p className="title">{data.id_display || data.id}</p>
      <p>
        {`${data.indicator_info.indicator_full}: `}
        <span className="kpi">
          {formatNum(
            data.value,
            data.indicator_info.format,
            data.indicator_info.decimals
          )}
        </span>
      </p>
      {data.id !== id.id && (
        <>
          <hr />
          <button
            type="button"
            className="switch"
            onClick={() => switchFocus()}
          >
            Click on circle to switch focus to
            {' '}
            {data.id_display}
            {' '}
          </button>
        </>
      )}
    </div>
  );
}

Tooltip.propTypes = {
  data: PropTypes.shape({
    xPos: PropTypes.number,
    yPos: PropTypes.number,
    id: PropTypes.string,
    value: PropTypes.number,
    type: PropTypes.string,
    id_display: PropTypes.string,
    indicator_info: PropTypes.shape({
      format: PropTypes.string,
      decimals: PropTypes.string,
      indicator_full: PropTypes.string,
    }),
  }),
  offset: PropTypes.shape({
    left: PropTypes.number,
    top: PropTypes.number,
  }),
  scroll: PropTypes.number,
};

Tooltip.defaultProps = {
  data: {
    xPos: 0,
    yPos: 0,
    id: null,
    value: null,
    indicator_info: null,
  },
  offset: {
    left: 0,
    top: 0,
  },
  scroll: 0,
};

export default Tooltip;
