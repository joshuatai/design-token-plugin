import validator from 'validator';
import SelectText from 'utils/SelectText';
import InputStatus from 'enums/InputStatus';
import { Mixed } from 'symbols/index';
import { trim } from 'jquery';
SelectText(jQuery);
const Validator = {
    int: (val) => validator.isInt(val.toString()),
    mixed: (val, org) => val === 'Mixed' && val === org
};
const inputCheck = function (e) {
    const $target = this;
    const newVal = $target.textContent;
    const isRequired = $target.getAttribute('is-required');
    const chlidren = Array.from($target.querySelectorAll('*')).reverse();
    chlidren.forEach((node) => {
        node.removeAttribute('style');
        if (node.innerText === '')
            node.remove();
    });
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
function valCheck($editable, orgVal, customValidator, resolve, reject) {
    const dataType = $editable.getAttribute('data-type');
    const isRequired = $editable.getAttribute('is-required');
    const _orgVal = orgVal !== undefined ? orgVal === Mixed ? 'Mixed' : String(orgVal) : undefined;
    let newVal = $editable.textContent.trim();
    $editable.removeAttribute('invalid');
    if (_orgVal && newVal === _orgVal) {
        $editable.setAttribute("contenteditable", "false");
        reject({
            status: InputStatus.NO_CHANGE
        });
        return;
    }
    if (newVal) {
        if (dataType) {
            const _dataTypes = dataType.split(',');
            const validType = _dataTypes.find(type => Validator[trim(type)](newVal, _orgVal));
            if (!validType) {
                $editable.innerHTML = _orgVal || '';
                $editable.setAttribute("contenteditable", "false");
                reject({
                    status: InputStatus.NO_CHANGE
                });
                return;
            }
        }
        if (customValidator) {
            const { status, value } = customValidator(newVal);
            if (status === InputStatus.NO_CHANGE) {
                $editable.innerHTML = _orgVal || '';
                $editable.setAttribute("contenteditable", "false");
                reject({
                    status: InputStatus.NO_CHANGE
                });
                return;
            }
            if (status === InputStatus.INVALID) {
                $($editable).selectText();
                $editable.setAttribute('invalid', "true");
                reject({
                    status: InputStatus.INVALID
                });
                return;
            }
            if (status === InputStatus.VALID && value !== undefined) {
                newVal = value;
            }
        }
        // if (propName === "password") {
        //   if (!validator.isLength(newVal, { min: 8, max: 16 })) {
        //     $editable.setAttribute('invalid', "true")
        //     $editable.selectText();
        //   }
        // }
    }
    else if (!newVal && isRequired) {
        if (_orgVal) {
            $editable.innerHTML = _orgVal;
            $editable.setAttribute("contenteditable", "false");
            // if (!(data instanceof Version)) return;
            // newVal = orgVal;
            reject({
                status: InputStatus.NO_CHANGE
            });
        }
        else {
            $editable.setAttribute('invalid', "true");
            $($editable).selectText();
            reject({
                status: InputStatus.INVALID
            });
        }
        return;
    }
    $editable.innerHTML = newVal;
    $editable.setAttribute("contenteditable", "false");
    $editable.scrollLeft = 0;
    resolve({
        value: newVal,
        status: InputStatus.VALID
    });
    // if (data instanceof ThemeMode) {
    //   // saveThemeMode();
    // } else if (data instanceof Version) {
    //   saveVersion();
    // } else {
    //   // save();
    // }
    return;
}
// let valCheckTimer;
const valChange = function (orgVal, customValidator = null) {
    const $editable = this;
    // const id = $target.data('id');
    // const data = getVersion(id) ||  getThemeMode(id) || getGroup(id) || getToken(id) || {};
    return new Promise(function (resolve, reject) {
        // valCheckTimer && clearInterval(valCheckTimer);
        // valCheckTimer = setTimeout(() => {
        valCheck($editable, orgVal, customValidator, resolve, reject);
        // }, 50, 'finish'); 
    });
    ;
};
export { Validator, inputCheck, valChange };
