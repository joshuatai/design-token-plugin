import validator from 'validator';
import ThemeMode from 'model/ThemeMode';
import Version from 'model/Version';
import { getVersion, getThemeMode, getGroup, getToken, saveThemeMode, saveVersion } from '../model/DataManager';
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
    $('*', $target).removeAttr('style');
    const isRequired = $target.attr('is-required');
    if (isRequired && !newVal) {
        $target.attr('invalid', "true");
        return;
    }
    if (newVal && $target.attr('prop-name') === "url") {
        // if (!validator.isURL(newVal)) {
        //   $target.attr('invalid', "true");
        //   return;
        // }
    }
    if (newVal && $target.attr('prop-name') === "password") {
        if (!validator.isLength(newVal, { min: 8, max: 16 })) {
            $target.attr('invalid', "true");
            return;
        }
    }
    $target.removeAttr('invalid');
    if (e.key === 'Enter') {
        $target.trigger('blur');
        return;
    }
};
function valCheck(editable, data, propName) {
    const orgVal = data[propName];
    let newVal = editable.text().trim();
    editable.removeAttr('invalid');
    if (!newVal && editable.is('[is-required]')) {
        if (orgVal) {
            editable.text(orgVal).attr("contenteditable", "false");
            if (!(data instanceof Version))
                return;
            newVal = orgVal;
        }
        else {
            editable
                .attr('invalid', "true")
                .selectText();
            return;
        }
    }
    else if (newVal) {
        if (propName === "url") {
            if (!validator.isURL(newVal)) {
                // editable
                //   .attr('invalid', "true")
                //   .selectText();
                // return;
            }
        }
        if (propName === "password") {
            if (!validator.isLength(newVal, { min: 8, max: 16 })) {
                editable
                    .attr('invalid', "true")
                    .selectText();
                return;
            }
        }
    }
    data[propName] = newVal;
    editable.text(newVal).attr("contenteditable", "false");
    editable.scrollLeft(0);
    if (data instanceof ThemeMode) {
        saveThemeMode();
    }
    else if (data instanceof Version) {
        saveVersion();
    }
    else {
        // save();
    }
}
let valCheckTimer;
const valChange = function () {
    const $target = $(this);
    const id = $target.data('id');
    const data = getVersion(id) || getThemeMode(id) || getGroup(id) || getToken(id) || {};
    if (valCheckTimer)
        clearTimeout(valCheckTimer);
    valCheckTimer = setTimeout(function () {
        if (!$target.is(":visible"))
            return;
        valCheck($target, data, $target.attr('prop-name'));
    }, 250);
};
export { validInt, inputCheck, valChange };
