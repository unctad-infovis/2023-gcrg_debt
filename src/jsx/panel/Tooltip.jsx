import React from 'react';
import PropTypes from 'prop-types';
import formatNum from '../helpers/FormatNum.js';

function Tooltip({ data }) {
  if (!data) {
    return null;
  }

  return (
    <div
      className="tooltip"
      style={{
        left: data.xPos,
        top: data.yPos,
      }}
    >
      <p className="title">{data.info.id_info.id_display}</p>
      <p className="kpi">
        {formatNum(
          data.info.value,
          data.info.indicator_info.format,
          data.info.indicator_info.decimals
        )}
      </p>

      <hr />
      <button type="button" className="switch">
        Click on circle to switch focus to
        {' '}
        {data.info.id_info.id_display}
      </button>
    </div>
  );
}

Tooltip.propTypes = {
  data: PropTypes.shape({
    xPos: PropTypes.number,
    yPos: PropTypes.number,
    info: PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
      indicator_info: PropTypes.shape({
        format: PropTypes.string,
        decimals: PropTypes.string,
      }),
      id_info: PropTypes.shape({
        id_display: PropTypes.string,
      }),
    }),
  }),
};

Tooltip.defaultProps = {
  data: {
    xPos: null,
    yPos: null,
    info: { id: null, value: null },
  },
};
export default Tooltip;
