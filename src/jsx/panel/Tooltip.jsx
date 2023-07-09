import React from 'react';
import PropTypes from 'prop-types';
import formatNum from '../helpers/FormatNum.js';

function Tooltip({ data, offset, width }) {
  if (!data) {
    return null;
  }

  const x = data.xPos - offset.left;
  const y = data.yPos - offset.top;
  const newY = y + 30;
  const newX = x > width / 2.4 ? width / 3.3 : x;

  return (
    <div
      className="tooltip-viz"
      style={{
        left: data.type === 'line' ? newX : data.xPos,
        top: data.type === 'line' ? newY : data.yPos,
      }}
    >
      <p className="title">{data.info.id_info.id_display || data.id}</p>

      {data.type !== 'line' && (
        <p>
          {`${data.info.indicator_info.indicator_full} in ${
            data.info.xaxis_display || data.info.year
          }: `}
          <span className="kpi">
            {formatNum(
              data.info.value,
              data.info.indicator_info.format,
              data.info.indicator_info.decimals
            )}
          </span>
        </p>
      )}
      <hr />
      <button type="button" className="switch">
        Click on
        {' '}
        {data.type || 'circle'}
        {' '}
        to switch focus to
        {' '}
        {data.info.id_info.id_display}
      </button>
    </div>
  );
}

Tooltip.propTypes = {
  data: PropTypes.shape({
    xPos: PropTypes.number,
    type: PropTypes.string,
    yPos: PropTypes.number,
    id: PropTypes.string,
    info: PropTypes.shape({
      id: PropTypes.string,
      year: PropTypes.string,
      xaxis_display: PropTypes.string,
      value: PropTypes.string,
      indicator_info: PropTypes.shape({
        format: PropTypes.string,
        decimals: PropTypes.string,
        indicator_full: PropTypes.string,
      }),
      id_info: PropTypes.shape({
        id_display: PropTypes.string,
      }),
    }),
  }),
  offset: PropTypes.shape({
    left: PropTypes.number,
    top: PropTypes.number,
  }),
  width: PropTypes.number.isRequired,
};

Tooltip.defaultProps = {
  data: {
    xPos: null,
    yPos: null,
    info: { id: null, value: null },
    type: null,
    id: null,
  },
  offset: {
    top: 0,
    left: 0,
  },
};
export default Tooltip;
