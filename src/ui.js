var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { fetch, getAllGroup, getGroup, setGroup, getToken, setToken, removeToken, setPureToken, setProperty, save, sendMessage } from './model/DataManager';
import TokenSetting from './containers/TokenSetting';
import PropertyIcon from './containers/property-components/PropertyIcon';
import BrowserEvents from 'enums/BrowserEvents';
import preventEvent from 'utils/preventEvent';
// import properties2css from 'utils/properties2css';
import Group from 'model/Group';
import Token from 'model/Token';
import Properties from 'model/Properties';
import { inputCheck, valChange } from 'utils/inputValidator';
import SelectText from 'utils/selectText';
import PluginDestroy from 'utils/PluginDestroy';
import './ui.css';
import MessageTypes from 'enums/MessageTypes';
import { Mixed } from './symbols';
TokenSetting(jQuery);
SelectText(jQuery);
PluginDestroy(jQuery);
const { useEffect } = React;
let $tokenContainer, $tokenSetting, $groupCreator;
const $tokenEditBtn = $('<button type="button" class="token-edit-btn"><svg class="svg" width="12" height="14" viewBox="0 0 12 14" xmlns="http://www.w3.org/2000/svg"><path d="M2 7.05V0h1v7.05c1.141.232 2 1.24 2 2.45 0 1.21-.859 2.218-2 2.45V14H2v-2.05c-1.141-.232-2-1.24-2-2.45 0-1.21.859-2.218 2-2.45zM4 9.5c0 .828-.672 1.5-1.5 1.5-.828 0-1.5-.672-1.5-1.5C1 8.672 1.672 8 2.5 8 3.328 8 4 8.672 4 9.5zM9 14h1V6.95c1.141-.232 2-1.24 2-2.45 0-1.21-.859-2.218-2-2.45V0H9v2.05c-1.141.232-2 1.24-2 2.45 0 1.21.859 2.218 2 2.45V14zm2-9.5c0-.828-.672-1.5-1.5-1.5C8.672 3 8 3.672 8 4.5 8 5.328 8.672 6 9.5 6c.828 0 1.5-.672 1.5-1.5z" fill-rule="evenodd" fill-opacity="1" fill="#000" stroke="none"></path></svg></button>');
const Utils = {
    newGroupName: () => {
        const lastNumber = getAllGroup()
            .filter((group) => (group.name.match(/^Group \d+$/) ? true : false))
            .map(group => (Number(group.name.replace('Group ', ''))))
            .sort()
            .pop();
        return `Group ${lastNumber ? lastNumber + 1 : 1}`;
    },
    clearSelection: () => {
        document.getSelection().removeAllRanges();
    }
};
const Renderer = {
    group: function (group) {
        const { id, name } = group;
        const $group = $(`<div id="${id}" class="panel panel-default panel-collapse-shown"></div>`);
        const $heading = $('<div class="panel-heading" data-toggle="collapse" aria-expanded="false"></div>').attr('data-target', `#group-${id}`).data('group', id);
        const $title = $('<h6 class="panel-title"></h6>');
        const $expend = $('<span class="tmicon tmicon-caret-right tmicon-hoverable"></span>').hide();
        const $name = $('<span class="group-name" prop-name="name" contenteditable is-required="true"></span>').text(name).data('id', id);
        const $addTokenBtn = $('<button type="button" class="add-token" title="Create a token"><svg class="svg" width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5v-5h1v5h5v1h-5v5h-1v-5h-5v-1h5z" fill-rule="nonzero" fill-opacity="1" fill="#000" stroke="none"></path></svg></button>');
        const $tokenListPanel = $('<div class="panel-collapse collapse" aria-expanded="false"></div>').attr('id', `group-${id}`);
        const $tokenList = $('<ul class="token-list"></ul>');
        $group
            .append($heading.append($title.append($expend).append($name)).append($addTokenBtn))
            .append($tokenListPanel.append($tokenList))
            .data({
            data: group,
            $heading,
            $name: $name,
            $tokenList,
            $expend
        })
            .insertBefore($groupCreator);
        return $group;
    },
    token: function (token) {
        const { $tokenList, $expend } = $(`#${token.parent}`).data();
        const $token = $(`<li id="${token.id}" class="token-item"></li>`)
            .data({
            'group': token.parent,
            'token': token.id
        });
        const $tokenName = $('<span class="token-key"></span>').text(token.name);
        let $icon;
        if (token.propertyType !== Mixed) {
            $icon = PropertyIcon(token.properties[0]);
        }
        $token.data = token;
        $tokenList.append($token);
        $expend.show();
        return $token
            .append($icon)
            .append($tokenName);
    },
    updateToken: function (token) {
        const { $expend, $heading } = $(`#${token.parent}`).data();
        const $token = $(`#${token.id}`);
        $('.token-key', $token).text(token.name);
        if ($token.length === 0) {
            this.token(token);
        }
        if ($heading.is('[aria-expanded="false"]')) {
            $expend.trigger('click');
        }
    },
    removeToken: function (token) {
        const group = getGroup(token.parent);
        const { $expend } = $(`#${token.parent}`).data();
        $(`#${token.id}`).remove();
        if (group.tokens.length === 1)
            $expend.hide();
    }
};
function init(groups) {
    let isTokenOpen = false;
    groups.forEach((group) => {
        const $group = Renderer.group(new Group({
            id: group.id,
            name: group.name
        }));
        const { $expend, data } = $group.data();
        setGroup(data);
        if (group.tokens.length > 0) {
            group.tokens.forEach(token => {
                token.properties = token.properties.map((property) => {
                    const data = new Properties[property._type.replace(/[^A-Za-z]/g, '')](property);
                    setProperty(data);
                    return data;
                });
                if (token.propertyType === String(Mixed))
                    token.propertyType = Mixed;
                const $token = Renderer.token(new Token(token));
                setToken($token.data);
                setPureToken($token.data);
            });
            if (!isTokenOpen) {
                isTokenOpen = true;
                $expend.trigger('click');
            }
        }
    });
}
function createGroup() {
    const $group = Renderer.group(new Group({
        name: Utils.newGroupName()
    }));
    const { data, $name } = $group.data();
    $name.selectText();
    setGroup(data);
    save();
}
// function thumbnailsBuilder (properties) {
//   const backgrounds = [];
//   // properties.forEach(property => {
//   //   const { colorMode, colorCode, opacity } = property.value;
//   //   // if (property.propType === PropertyTypes.FILL_COLOR) {
//   //   //   if (property.type === FillTypes.SOLID) {
//   //   //     if (colorMode === ColorFormat.HEX) {
//   //   //       backgrounds.push(`${colorCode}${percentToHex(opacity * 100)}`);
//   //   //     }
//   //   //   }
//   //   // }
//   // });
// //   return `background-color: ${backgrounds.join(',')}`;
// }
const Root = () => {
    useEffect(function () {
        $tokenContainer = $('#design-tokens-container');
        $tokenSetting = $('#token-setting');
        $groupCreator = $('#group-creator');
        //done
        $(document).on(`${BrowserEvents.CLICK} ${BrowserEvents.MOUSE_OVER} ${BrowserEvents.MOUSE_OUT}`, '#design-tokens-container .token-item', $.debounce(20, function ({ type }) {
            const $tokenItem = $(this);
            if (type === BrowserEvents.CLICK) {
                $('.token-item-selected').removeClass('token-item-selected');
                $tokenItem.addClass('token-item-selected');
                sendMessage(MessageTypes.ASSIGN_TOKEN, getToken($tokenItem.data('token')));
            }
            if (type === BrowserEvents.MOUSE_OVER) {
                $tokenItem.append($tokenEditBtn);
            }
            if (type === BrowserEvents.MOUSE_OUT) {
                $tokenEditBtn.remove();
            }
        }));
        // This event listener is to prevent collapse event.
        $(document).on(BrowserEvents.CLICK, '.group-name:focus, .add-token', preventEvent);
        // token setting
        $(document).on(BrowserEvents.CLICK, '.token-edit-btn, .add-token', function () {
            let { group, token } = $(this).parent().data();
            Utils.clearSelection();
            $tokenContainer.removeClass('show');
            $tokenSetting.TokenSetting({ group, token });
        });
        // done
        $(document).on(BrowserEvents.DBCLICK, '.group-name', function (e) {
            $(this).selectText();
            preventEvent(e);
        });
        // need to update
        $(document).on(BrowserEvents.CLICK, '#design-tokens-container.plugin-panel', function (event) {
            const $tokenItem = $(event.target).closest('.token-item');
            const $groupName = $(event.target).closest('.group-name');
            // const $radiusSeparateBtns = $(event.target).closest('.separator-vals .btn-group');
            if ($tokenItem.length === 0) {
                if (event.type === BrowserEvents.CLICK) {
                    $('.token-item').removeClass('token-item-selected');
                }
            }
            if ($groupName.length === 0 || $groupName.is('[contenteditable=false]')) {
                $('.group-name').attr('contenteditable', "false");
            }
            // if ($radiusSeparateBtns.length === 0) {
            //   $separatorModeSign.attr('separate-type', 'top-left');
            // }
        });
        // done
        $(document).on(BrowserEvents.CLICK, '.group-create', function (e) {
            createGroup();
            preventEvent(e);
        });
        $(document).on(`${BrowserEvents.BLUR}`, '.group-name', valChange);
        $(document).on(`${BrowserEvents.KEY_UP}`, '.group-name', inputCheck);
        $(document).on('destroy:TokenSetting', (e, token) => {
            if (token.name && token.properties.length > 0) {
                Renderer.updateToken(token);
            }
            else {
                //need to chaeck if there is a token or component already refer this token
                Renderer.removeToken(token);
                removeToken(token);
            }
            save();
            $tokenContainer.addClass('show');
        });
        fetch();
    });
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { id: "design-tokens-container", className: "plugin-panel panel-group panel-group-collapse panel-group-collapse-basic show" },
            React.createElement("div", { id: "group-creator", className: "group-create" }, "Add new group")),
        React.createElement("div", { id: "token-setting", className: "plugin-panel" })));
};
class App extends React.Component {
    render() {
        return React.createElement(Root, null);
    }
}
ReactDOM.render(React.createElement(App, null), document.getElementById('react-page'));
window.onmessage = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const msg = event.data.pluginMessage;
    if (msg.type === MessageTypes.GET_TOKENS) {
        init(msg.message);
    }
    if (msg.type === MessageTypes.SELECTION_CHANGE) {
        $('#design-tokens-container').trigger('click');
    }
});
