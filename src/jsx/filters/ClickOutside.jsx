import { useEffect } from 'react';
import PropTypes from 'prop-types';

function useOutsideClick(ref, callback) {
  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
}

useOutsideClick.propTypes = {
  ref: PropTypes.node.isRequired,
  callback: PropTypes.func.isRequired,
};

export default useOutsideClick;
