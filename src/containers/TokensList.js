import React, { useEffect, useRef, useContext } from "react";
import useAPI from 'hooks/useAPI';
import { groupsContext } from 'hooks/GroupProvider';
import useGroups from 'hooks/useGroups';
import SelectText from 'utils/SelectText';
import preventEvent from 'utils/preventEvent';
import { inputCheck, valChange } from 'utils/inputValidator';
import InputStatus from 'enums/InputStatus';
SelectText(jQuery);
const GroupItem = ({ data: { id, name }, creatable }) => {
    const groupName = useRef(null);
    const { api: { admin } } = useAPI();
    const { getGroup, setGroup } = useGroups();
    const removeHandler = (e) => {
        // if (!data.isDefault) removeThemeMode(data as ThemeMode);
        // updateCurrentThemeMode();
        // $modeCreator.attr('disabled', false);
    };
    const blurHandler = (e) => {
        const $name = groupName.current;
        creatable(false);
        valChange
            .call($name, name)
            .then(res => {
            if (res === InputStatus.VALID) {
                const group = getGroup(id);
                group.name = $name.textContent;
                setGroup(group);
                creatable(true);
            }
        })
            .catch(res => {
            if (res === InputStatus.NO_CHANGE)
                creatable(true);
        });
    };
    const focusHandler = (e) => {
        if (!admin)
            return;
        $(groupName.current).selectText();
        preventEvent(e);
    };
    const inputHandler = (e) => {
        const $name = groupName.current;
        inputCheck.call($name, e);
    };
    useEffect(() => {
        const $name = groupName.current;
        if (admin && $name && !$name.innerHTML)
            $name.click();
    }, []);
    return (React.createElement("div", { "data-id": id, className: "panel panel-default panel-collapse-shown" },
        React.createElement("div", { className: "panel-heading group-item", "data-target": `#group-${id}`, "data-toggle": "collapse", "aria-expanded": "false" },
            React.createElement("h6", { className: "panel-title" },
                React.createElement("span", { className: "tmicon tmicon-caret-right tmicon-hoverable" }),
                React.createElement("span", { "data-id": id, className: "group-name", "prop-name": "name", "is-required": "true" }, name)),
            React.createElement("button", { type: "button", className: "add-token", title: "Create a token" },
                React.createElement("svg", { className: "svg", width: "12", height: "12", viewBox: "0 0 12 12", xmlns: "http://www.w3.org/2000/svg" },
                    React.createElement("path", { d: "M5.5 5.5v-5h1v5h5v1h-5v5h-1v-5h-5v-1h5z", fillRule: "nonzero", fillOpacity: "1", fill: "#000", stroke: "none" })))),
        React.createElement("div", { id: `group-${id}`, className: "panel-collapse collapse", "aria-expanded": "false" }, "test")));
};
const TokensList = ({ creatable }) => {
    const groups = useContext(groupsContext);
    return (React.createElement(React.Fragment, null, groups.map(group => React.createElement(GroupItem, { key: group.id, data: group, creatable: creatable }))));
};
export default TokensList;
