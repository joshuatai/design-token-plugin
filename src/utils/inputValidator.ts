import validator from 'validator';
import SelectText from 'utils/SelectText';
import InputStatus from 'enums/InputStatus';
import ThemeMode from 'model/ThemeMode';
import Version from 'model/Version';
import { getAPI, getVersion, getThemeMode, getGroup, getToken, save, saveThemeMode, saveVersion } from '../model/DataManager';

declare var $: any;
SelectText(jQuery);

const validInt = function (e) {
  if (!validator.isInt(e.key)) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
};
const inputCheck = function (e) {
  const $target = this;
  const newVal = $target.textContent;
  const isRequired = $target.getAttribute('is-required');
  $target.querySelectorAll('*').forEach(node => node.removeAttribute('style'));
  if (e.key === 'Enter') {
    $target.blur();
    return;
  }
  if (isRequired && !newVal) {
    $target.setAttribute('invalid', "true");
    return;
  }
  if (newVal && $target.getAttribute('prop-name') === "password") {
    if (!validator.isLength(newVal, { min: 8, max: 16 })) {
      $target.setAttribute('invalid', "true");
      return;
    }
  }
  $target.removeAttribute('invalid');
};

function valCheck ($editable, orgVal, resolve, reject) {
  const propName = $editable.getAttribute('prop-name');
  const isRequired = $editable.getAttribute('is-required');
  let newVal = $editable.textContent.trim();

  if (orgVal && newVal === orgVal) {
    $editable.setAttribute("contenteditable", "false");
    reject(InputStatus.NO_CHANGE);
    return;
  }
  $editable.removeAttribute('invalid');
  if (!newVal && isRequired) {
    if (orgVal) {
      $editable.innerHTML = orgVal;
      $editable.setAttribute("contenteditable", "false");
      // if (!(data instanceof Version)) return;
      // newVal = orgVal;
      reject(InputStatus.NO_CHANGE);
    } else {
      $editable.setAttribute('invalid', "true");
      $($editable).selectText();
      reject(InputStatus.INVALID);
    }
    return;
  } else if (newVal) {
    if (propName === "password") {
      if (!validator.isLength(newVal, { min: 8, max: 16 })) {
        $editable.setAttribute('invalid', "true")
        $editable.selectText();
        reject(InputStatus.INVALID);
        return;
      }
    }
  }
  $editable.innerHTML = newVal;
  $editable.setAttribute("contenteditable", "false");
  $editable.scrollLeft = 0;
  resolve(InputStatus.VALID);
  // 
  // if (data instanceof ThemeMode) {
  //   // saveThemeMode();
  // } else if (data instanceof Version) {
  //   saveVersion();
  // } else {
    
  //   // save();
  // }
}

let valCheckTimer;
const valChange = function (orgVal) {
  const $editable = this;
  // const id = $target.data('id');
  // const data = getVersion(id) ||  getThemeMode(id) || getGroup(id) || getToken(id) || {};
  return new Promise(function(resolve, reject) {
    valCheckTimer && clearInterval(valCheckTimer);
    valCheckTimer = setTimeout(() => {
      valCheck($editable, orgVal, resolve, reject);
    }, 250, 'finish'); 
  });;
};

export {
  validInt,
  inputCheck,
  valChange
};