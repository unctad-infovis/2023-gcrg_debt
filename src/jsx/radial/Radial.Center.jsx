import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FocusContext } from '../context/Focus.js';

function Center({ radius }) {
  const { id, comparisons } = useContext(FocusContext);
  return (
    <div className="center" style={{ width: 1.5 * radius * 2 }}>
      {' '}
      <div className="content">
        <div className="focus">
          <span className="focus_legend dot" />
          {id.id_display}
        </div>
        <div className="comparison1">
          {comparisons[0] && <span className="dot  comparison_1_circle" />}

          {comparisons[0] && comparisons[0].id}
        </div>
        {comparisons[1] && (
          <div className="comparison2">
            {comparisons[1] && <span className="dot comparison_2_circle" />}
            {comparisons[1] && comparisons[1].id}
          </div>
        )}
      </div>
    </div>
  );
}

Center.propTypes = {
  radius: PropTypes.number.isRequired,
};

export default Center;
