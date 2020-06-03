import validator from 'validator';

const validInt = function (event) {
  if (!validator.isInt(event.key)) {
    event.stopPropagation();
    event.preventDefault();
    return false;
  }
};
export {
  validInt
};
