export default (str = '', start:string, end = '') => {
  let regexp: RegExp;
  if (end.length) {
    regexp = new RegExp(`\\[${start}\\]\\s+([\\s\\S]+)\\s+\\[${end}`);
  }
  else {
    regexp = new RegExp(`\\[${start}\\]\\s+([\\s\\S]+)$`);
  }
  const match = str.match(regexp)
  return match === null ? '' : match[1].trim();

}