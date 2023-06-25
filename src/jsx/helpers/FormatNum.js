import { format } from 'd3';

const formatNum = (value, type, decimals, place) => {
  let formatted = 'NA';
  if (value !== '') {
    const pre = type === 'dollar' ? '$' : '';
    const post = type === 'percent' ? '%' : place === 'axis' ? 'r' : 'f';

    // const s = place === 'axis' ? 's' : '';
    const formatNumber = format(`${pre},.${decimals}${post}`);
    formatted = formatNumber(value);
  }
  return formatted;
};

export default formatNum;
