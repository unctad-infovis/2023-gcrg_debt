import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import Metric_Context from '../context/Metric.js';

function Slices({ arcs, shaded }) {
  const { metric, setMetric } = useContext(Metric_Context);
  const shade = shaded.find((d) => d.indicator_key === metric);

  return (
    <>
      {arcs.map((arc) => (
        <React.Fragment key={arc.indicator_key}>
          <path
            d={arc.d}
            className={
              arc.indicator_key === metric ? 'slice selected' : 'slice'
            }
            onClick={() => setMetric(arc.indicator_key)}
          />
        </React.Fragment>
      ))}
      {shade && <path d={shade.d} className="focus" />}
    </>
  );
}

Slices.propTypes = {
  arcs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  shaded: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default memo(Slices);
