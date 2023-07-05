import React from 'react';
import PropTypes from 'prop-types';

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
      {data.info.id}
      <br />
      {data.info.value}
    </div>
  );
}

Tooltip.propTypes = {
  data: PropTypes.shape({
    xPos: PropTypes.number,
    yPos: PropTypes.number,
    info: PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.number,
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
