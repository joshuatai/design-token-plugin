import validator from 'validator';
import ThemeMode from 'model/ThemeMode';
import { getThemeMode, getGroup, getToken, save, saveThemeMode } from '../model/DataManager';

const validInt = function (event) {
  if (!validator.isInt(event.key)) {
    event.stopPropagation();
    event.preventDefault();
    return false;
  }
};
const inputCheck = function (e) {
  const $target = $(this);
  const newVal = $target.text();
  const isRequired = $target.attr('is-required');
  if (isRequired) {
    !newVal ? $target.attr('invalid', "true") : $target.attr('invalid', "false")
  }
  if (e.key === 'Enter') {
    $target.trigger('blur');
    return;
  }
};

function valCheck (editable, data, propName) {
  const orgVal = data[propName];
  const newVal = editable.text();
  editable.removeAttr('invalid');
  if (!newVal && editable.is('[is-required]')) {
    if (orgVal) {
      editable.text(orgVal);
    } else {
      editable
        .attr('invalid', "true")
        .selectText();
    }
    return;
  }
  data[propName] = newVal;
  editable.text(newVal).attr("contenteditable", "false");
  if (data instanceof ThemeMode) {
    saveThemeMode();
  } else {
    save();
  }
}

let valCheckTimer;
const valChange = function () {
  const $target = $(this);
  const id = $target.data('id');
  const data = getThemeMode(id) || getGroup(id) || getToken(id);
  if (valCheckTimer) clearTimeout(valCheckTimer);
  valCheckTimer = setTimeout(function () {
    if (!$target.is(":visible")) return;
    valCheck($target, data, $target.attr('prop-name'));
  }, 250);
};

export {
  validInt,
  inputCheck,
  valChange
};
