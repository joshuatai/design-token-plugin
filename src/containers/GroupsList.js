import React, { useEffect, useRef, useContext } from "react";
import useAPI from 'hooks/useAPI';
import { groupsContext } from 'hooks/GroupProvider';
import useData from 'hooks/useData';
import useGroups from 'hooks/useGroups';
import useTokenSetting from 'hooks/useTokenSetting';
import TokenList from './TokenList';
import { inputCheck, valChange } from 'utils/inputValidator';
import SelectText from 'utils/SelectText';
import preventEvent from 'utils/preventEvent';
import InputStatus from 'enums/InputStatus';
SelectText(jQuery);
const GroupItem = ({ data, creatable }) => {
    const { id, name, tokens } = data;
    const groupNameRef = useRef(null);
    const { api: { admin } } = useAPI();
    const { saveGroups } = useData();
    const { getGroup, getGroupName, addGroup } = useGroups();
    const { setGroup } = useTokenSetting();
    const removeHandler = (e) => {
        if (!admin)
            return;
        // if (!data.isDefault) removeThemeMode(data as ThemeMode);
        // updateCurrentThemeMode();
        // $modeCreator.attr('disabled', false);
    };
    const focusHandler = (e) => {
        if (!admin)
            return;
        $(groupNameRef.current).selectText();
        preventEvent(e);
    };
    const inputHandler = (e) => {
        if (!admin)
            return;
        const $name = groupNameRef.current;
        inputCheck.call($name, e);
    };
    const blurHandler = (e) => {
        if (!admin)
            return;
        const $name = groupNameRef.current;
        creatable(false);
        valChange
            .call($name, name)
            .then(res => {
            if (res.status === InputStatus.VALID) {
                const group = getGroup(id);
                group.name = $name.textContent;
                const _groups = addGroup(group);
                saveGroups(_groups)
                    .then(res => {
                    creatable(true);
                });
            }
        })
            .catch(res => {
            if (res.status === InputStatus.NO_CHANGE)
                creatable(true);
        });
    };
    const addTokenHandler = (e) => {
        setGroup(data);
    };
    useEffect(() => {
        const $name = groupNameRef.current;
        if (admin && $name && !$name.innerHTML) {
            $name.click();
            $name.innerHTML = getGroupName();
        }
    }, []);
    return (React.createElement("div", { "data-id": id, className: "panel panel-default panel-collapse-shown" },
        React.createElement("div", { className: "panel-heading group-item", "data-target": `#group-${id}`, "data-toggle": "collapse", "aria-expanded": "false" },
            React.createElement("h6", { className: "panel-title" },
                tokens.length > 0 && React.createElement("span", { className: "tmicon tmicon-caret-right tmicon-hoverable" }),
                React.createElement("span", { "data-id": id, ref: groupNameRef, className: "group-name", "is-required": "true", contentEditable: "false", suppressContentEditableWarning: true, onClick: focusHandler, onKeyUp: inputHandler, onBlur: blurHandler }, name)),
            admin &&
                React.createElement("button", { onClick: addTokenHandler, type: "button", className: "add-token", title: "Create a token" },
                    React.createElement("svg", { className: "svg", width: "12", height: "12", viewBox: "0 0 12 12", xmlns: "http://www.w3.org/2000/svg" },
                        React.createElement("path", { d: "M5.5 5.5v-5h1v5h5v1h-5v5h-1v-5h-5v-1h5z", fillRule: "nonzero", fillOpacity: "1", fill: "#000", stroke: "none" })))),
        React.createElement("div", { id: `group-${id}`, className: "panel-collapse collapse", "aria-expanded": "false" },
            React.createElement(TokenList, { group: data }))));
};
const GroupsList = ({ creatable }) => {
    const groups = useContext(groupsContext);
    return (React.createElement(React.Fragment, null, groups.map((group) => React.createElement(GroupItem, { key: group.id, data: group, creatable: creatable }))));
};
export default GroupsList;
