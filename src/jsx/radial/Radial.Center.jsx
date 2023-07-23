import React, { useContext, memo } from 'react';
import PropTypes from 'prop-types';
import { FocusContext } from '../context/Focus.js';
import viewPort from '../helpers/viewPort';

function Center({ radius }) {
  const { id, comparisons } = useContext(FocusContext);
  const { height } = viewPort();

  // return (
  //   <div className="center">
  //     <div className="focus group">
  //       <span className="focus_legend dot" />
  //       {id.id_display}
  //     </div>

  //     <div className="comparison1 group">
  //       {comparisons[0] && <span className="line comparison_1_legend" />}

  //       {comparisons[0] && <span className="dot  comparison_1_circle" />}

  //       {comparisons[0] && comparisons[0].id}
  //     </div>
  //     {comparisons[1] && (
  //       <div className="comparison2 group">
  //         {comparisons[1] && <span className="line comparison_2_legend" />}

  //         {comparisons[1] && id.type === 'country' && (
  //           <span className="dot comparison_2_circle" />
  //         )}

  //         {comparisons[1] && comparisons[1].id}
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <>
      {height > 900 && (
        <div
          className="center"
          style={{ width: 0.9 * radius * 2, height: 0.9 * radius * 2 }}
        >
          {' '}
          <div className="content" style={{ padding: radius * 0.15 }}>
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
                {comparisons[1] && (
                  <span className="dot comparison_2_circle">
                    <span className="dot_center" />
                    {' '}
                  </span>
                )}
                {comparisons[1] && comparisons[1].id}
              </div>
            )}
          </div>
        </div>
      )}
      {height <= 900 && (
        <div className="center">
          <div className="content">
            <div className="focus group">
              <span className="focus_legend dot" />
              {id.id_display}
            </div>

            <div className="comparison1 group">
              {comparisons[0] && <span className="line comparison_1_legend" />}

              {comparisons[0] && <span className="dot  comparison_1_circle" />}

              {comparisons[0] && comparisons[0].id}
            </div>
            {comparisons[1] && (
              <div className="comparison2 group">
                {comparisons[1] && (
                  <span className="line comparison_2_legend" />
                )}

                {comparisons[1] && (
                  <span className="dot comparison_2_circle">
                    <span className="dot_center" />
                    {' '}
                  </span>
                )}

                {comparisons[1] && comparisons[1].id}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

Center.propTypes = {
  radius: PropTypes.number.isRequired,
};

export default memo(Center);
