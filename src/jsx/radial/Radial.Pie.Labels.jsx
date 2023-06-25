import React, { memo } from 'react';
import PropTypes from 'prop-types';

function Labels({ arcs }) {
  return (
    <>
      {arcs.map((a) => (
        <React.Fragment key={a.id}>
          <path d={a.d} className="donut" />
          <path d={a.textpath} fill="none" id={a.id} />
          <text className="donut-label" dy={a.dy}>
            <textPath href={`#${a.id}`} startOffset="50%">
              {a.text}
            </textPath>
          </text>
        </React.Fragment>
      ))}
    </>
  );
}

Labels.propTypes = {
  arcs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default memo(Labels);
