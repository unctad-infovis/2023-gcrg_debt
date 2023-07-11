import { format } from 'd3';

const formatNum = (value, type, decimals, place) => {
  let formatted = 'NA';
  if (value !== '') {
    const pre = type === 'dollar' ? '$' : '';
    const post = type === 'percent' ? '%' : place === 'axis' ? 'r' : 'f';
    const divider = value >= 1000 ? 1000 : 1;
    const formatNumber = format(`${pre},.${decimals}${post}`);
    formatted = formatNumber(value / divider);
    if (divider === 1000) {
      formatted += 'K';
    }
  }
  return formatted;
};

export default formatNum;
