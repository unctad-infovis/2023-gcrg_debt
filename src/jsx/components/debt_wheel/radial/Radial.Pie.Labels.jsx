import React, { memo } from 'react';

function Labels({ arcs }) {
  return (
    <>
      {arcs.map(a => (
        <React.Fragment key={a.d}>
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

export default memo(Labels);
