import validator from 'validator';
import SelectText from 'utils/SelectText';
import InputStatus from 'enums/InputStatus';
SelectText(jQuery);
const Validator = {
    number: (val) => validator.isInt(val)
};
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
function valCheck($editable, orgVal, customValidator, resolve, reject) {
    const dataType = $editable.getAttribute('data-type');
    const isRequired = $editable.getAttribute('is-required');
    let newVal = $editable.textContent.trim();
    $editable.removeAttribute('invalid');
    if (orgVal && newVal === orgVal) {
        $editable.setAttribute("contenteditable", "false");
        reject({
            status: InputStatus.NO_CHANGE
        });
        return;
    }
    if (newVal) {
        if (dataType) {
            if (!Validator[dataType](newVal)) {
                $editable.innerHTML = orgVal || '';
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
                $editable.innerHTML = orgVal || '';
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
        if (orgVal) {
            $editable.innerHTML = orgVal;
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
}
// let valCheckTimer;
const valChange = function (orgVal, customValidator = null) {
    const $editable = this;
    // const id = $target.data('id');
    // const data = getVersion(id) ||  getThemeMode(id) || getGroup(id) || getToken(id) || {};
    return new Promise(function (resolve, reject) {
        // valCheckTimer && clearInterval(valCheckTimer);
        // valCheckTimer = setTimeout(() => {
        valCheck($editable, String(orgVal), customValidator, resolve, reject);
        // }, 50, 'finish'); 
    });
    ;
};
export { validInt, inputCheck, valChange };
