import React from 'react';
import PropTypes from 'prop-types';

function Tooltip({ data, offsetTop }) {
  if (!data) {
    return null;
  }
  return (
    <div
      className="tooltip"
      style={{
        left: data.xPos,
        top: data.yPos - offsetTop,
      }}
    >
      {data.id}
      <br />
      {data.value}
    </div>
  );
}

Tooltip.propTypes = {
  data: PropTypes.shape({
    xPos: PropTypes.number,
    yPos: PropTypes.number,
    id: PropTypes.string,
    value: PropTypes.number,
  }).isRequired,
  offsetTop: PropTypes.number.isRequired,
};

export default Tooltip;
