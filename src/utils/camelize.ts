export default (str) => {
  let arr = str.split('-');
  let capital = arr.map((item, index) => index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item);
  // ^-- change here.
  return capital.join("");
}