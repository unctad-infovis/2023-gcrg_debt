import React, {
  useContext, useState, useEffect, useRef
} from 'react';
import PropTypes from 'prop-types';
import formatNum from '../helpers/FormatNum.js';
import { FocusContext } from '../context/Focus.js';

function Tooltip({ data, offset, interaction }) {
  const { id, setId } = useContext(FocusContext);

  const [onTooltip, setOnTooltip] = useState(false);

  const previous = useRef(null);

  useEffect(() => {
    previous.current = data ? (data.id === previous ? null : data.id) : null;
  }, [data]);

  if (
    !data
    || (onTooltip === false
      && interaction === 'leave'
      && (data ? data.id === previous.current : true))
  ) {
    return null;
  }

  const switchFocus = () => {
    setOnTooltip(false);
    setId({
      type: data.type,
      id: data.id,
      id_display: data.id_display,
    });
  };

  return (
    <div
      className="tooltip"
      style={{
        left: data.xPos - offset.left + 2,
        top: data.yPos - offset.top - 1,
      }}
      onMouseEnter={() => setOnTooltip(true)}
      onMouseLeave={() => setOnTooltip(false)}
    >
      <p className="title">{data.id_display}</p>
      <p className="kpi">
        {formatNum(
          data.value,
          data.indicator_info.format,
          data.indicator_info.decimals
        )}
      </p>

      {data.id !== id.id && (
        <>
          <hr />
          <button
            type="button"
            className="switch"
            onClick={() => switchFocus()}
          >
            Switch focus to
            {' '}
            {data.id_display}
            {' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevrons-right"
            >
              <polyline points="13 17 18 12 13 7" />
              <polyline points="6 17 11 12 6 7" />
            </svg>
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
    }),
  }),
  offset: PropTypes.shape({
    left: PropTypes.number,
    top: PropTypes.number,
  }),
  interaction: PropTypes.string,
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
  interaction: null,
};

export default Tooltip;
