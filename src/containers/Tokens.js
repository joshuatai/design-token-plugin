import React, { useEffect, useContext } from 'react';
import { v4 } from 'uuid';
import hash from 'hash.js';
import _cloneDeep from 'lodash/cloneDeep';
import useAPI from 'hooks/useAPI';
import useThemeModes from 'hooks/useThemeModes';
import useGroups from 'hooks/useGroups';
import useTokens from 'hooks/useTokens';
import useProperties from 'hooks/useProperties';
import { tokenSettingContext } from 'hooks/TokenSettingProvider';
import GroupsListContainer from './GroupsListContainer';
import TokenSetting from './TokenSetting';
import ThemeModesContainer from './ThemeModesContainer';
import SelectText from 'utils/selectText';
import PluginDestroy from 'utils/PluginDestroy';
import { getSaveData, getCurrentThemeMode, setCurrentThemeMode, removeToken, save, sendMessage, setFonts, syncPageThemeMode, setVersion, restore } from 'model/DataManager';
// import { themeModeIcon } from './property-components/CommonSettings.tss';
import ThemeMode from 'model/ThemeMode';
import Version from 'model/Version';
import Group from 'model/Group';
import Token from 'model/Token';
import Properties from 'model/Properties';
import MessageTypes from 'enums/MessageTypes';
import BrowserEvents from 'enums/BrowserEvents';
import preventEvent from 'utils/preventEvent';
import { inputCheck } from 'utils/inputValidator';
SelectText(jQuery);
PluginDestroy(jQuery);
const Tokens = ({ data = {
    themeModes: [],
    groups: [],
    tokens: [],
    properties: []
} }) => {
    const { api: { admin } } = useAPI();
    const { setAllGroups } = useGroups();
    const { setAllTokens } = useTokens();
    const { setAllProperties } = useProperties();
    const { setAllThemeModes } = useThemeModes();
    const tokenSetting = useContext(tokenSettingContext);
    let $tokenContainer, $desiginSystemTabs, $assignedTokensNodeList, $tokenSetting, $themeModeList, $versionCreator, $versionList;
    const Renderer = {
        themeModes: function () {
            const modes = []; //getThemeMode();
            const $themeModes = $(`<div class="dropdown theme-modes"></div>`);
            // const $themeModeIcon = $(themeModeIcon);
            const $themeModeList = $(`<ul class="dropdown-menu dropdown-menu-multi-select pull-right"></ul>`);
            $desiginSystemTabs.find('.theme-modes').remove();
            if (modes.length > 1) {
                $desiginSystemTabs.append($themeModes
                    // .append($themeModeIcon)
                    .append($themeModeList.append(modes.map((mode, index) => {
                    return `
                    <li class="theme-mode" data-index="${index}" data-id="${mode.id}">
                      <a href="#">${mode.name}${mode.isDefault ? ' (Default)' : ''}</a>
                    </li>
                  `;
                }))));
            }
        },
        version: function (version) {
            let $version, $name, $remove, $load;
            $versionList
                .append(($version = $(`<li id="version-${version.id}"></li>`)
                .append($name = $(`<span class="version-name" prop-name="name" is-required="true" contenteditable="false">${version.name}</span>`).data('id', version.id))
                .append($load = $(`<span class="version-restore tmicon tmicon-backup"></span>`))
                .append($remove = $(`
                  <span class="remove-version">
                    <svg class="svg" width="12" height="6" viewBox="0 0 12 6" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.5 3.5H.5v-1h11v1z" fill-rule="nonzero" fill-opacity="1" fill="#000" stroke="none"></path>
                    </svg>
                  </span>
                `))
                .data({
                data: version,
                $name,
                $remove
            })));
            return $version;
        },
        tokensAssigned: function (nodes) {
            $assignedTokensNodeList.empty();
            if (nodes.length) {
                nodes.forEach(node => {
                    let { id, name, useTokens } = node;
                    const _id = id.replace(':', '-');
                    const $node = $(`<div id="${_id}" class="selected-node panel panel-default panel-collapse-shown"></div>`).data('id', id);
                    const $heading = $('<div class="panel-heading node-item" data-toggle="collapse" aria-expanded="true"></div>').attr('data-target', `#node-${_id}`);
                    const $title = $('<h6 class="panel-title"></h6>');
                    const $expend = $('<span class="tmicon tmicon-caret-right tmicon-hoverable"></span>');
                    const $name = $('<span class="node-name"></span>').text(name);
                    const $tokenListPanel = $('<div class="panel-collapse collapse in" aria-expanded="true"></div>').attr('id', `node-${_id}`);
                    const $tokenList = $('<ul class="token-list"></ul>');
                    $assignedTokensNodeList.append($node
                        .append($heading.append($title.append($expend).append($name)))
                        .append($tokenListPanel.append($tokenList
                        .addClass('sortable')
                        .sortable({
                        // containment: "parent",
                        placeholder: 'ui-sortable-placeholder',
                        handle: '.ui-sortable-handle',
                        axis: "y"
                    })
                        .append(useTokens.map(_token => {
                        const token = []; //getToken(_token);
                        let $icon;
                        // if (token.propertyType !== Mixed) {
                        // $icon = PropertyIcon(token.properties, true).$icon;
                        // }
                        return $(`<li class="token-item"></li>`)
                            // .data({
                            //   'group': token.parent,
                            //   'token': token.id
                            // })
                            .append($(`<span class="ui-sortable-handle"></span>`))
                            .append($icon ? $icon : null);
                        // .append($('<span class="token-key"></span>').text(token.name));
                    })))));
                });
            }
            else {
                $assignedTokensNodeList.append(`<div class="no-node-selected">Please select a node that has assigned at least one token.</div>`);
            }
        },
        updateToken: function (token) {
            // if ($heading.is('[aria-expanded="false"]')) {
            //   $expend.trigger('click');
            // }
        },
        updateThemeMode: function () {
            // $('#design-tokens-container .fill-color-icon').parent().each((index, item) => {
            //   const { token } = $(item).data();
            //   this.token(getToken(token));
            // });
        },
        removeToken: function (token) {
            // const group = getGroup(token.parent);
            // const { $expend } = $(`#${token.parent}`).data();
            // $(`#${token.id}`).remove();
            // if (group.tokens.length === 1) $expend.hide();
        }
    };
    function initVersion(versions) {
        versions.forEach((version) => {
            const $version = Renderer.version(new Version(version));
            const { data } = $version.data();
            setVersion(data);
        });
    }
    function init() {
        if (data.themeModes) {
            const _themeModes = data.themeModes.map(({ id, name, isDefault }) => new ThemeMode({ id, name, isDefault }));
            setAllThemeModes(_themeModes);
        }
        if (data.groups) {
            const _groups = data.groups.map(group => new Group(group));
            setAllGroups(_groups);
        }
        if (data.tokens) {
            const _tokens = data.tokens.map(token => new Token(token));
            setAllTokens(_tokens);
        }
        if (data.properties) {
            const _properties = data.properties.map(property => {
                return new Properties[property._type](property);
            });
            setAllProperties(_properties);
        }
        //groups: Array<Object>
        // let isTokenOpen = false;
        // groups.forEach((group: Group) => {
        //   const { $expend, data } = $group.data();
        //   if (group.tokens.length > 0) {
        //     group.tokens.forEach(token => {
        //     });
        //     if (!isTokenOpen) {
        //       isTokenOpen = true;
        //       $expend.trigger('click');
        //     }
        //   }
        // });
    }
    function createVersion() {
        const saveData = getSaveData();
        const dataHash = hash.sha256().update(JSON.stringify(saveData)).digest('hex');
        const $version = Renderer.version(new Version({ hash: dataHash, data: saveData }));
        const { data, $name } = $version.data();
        $name.selectText();
        setVersion(data);
    }
    function updateCurrentThemeMode() {
        const themeMode = getCurrentThemeMode();
        $desiginSystemTabs.find('.theme-modes ul')
            .children()
            .removeClass('selected')
            .filter((index, item) => $(item).data('id') === themeMode)
            .addClass('selected');
        Renderer.updateThemeMode();
        $tokenSetting.TokenSetting('changeThemeMode');
        syncPageThemeMode();
    }
    const onMessageReceived = (event) => {
        const msg = event.data.pluginMessage;
        // console.log(event);
        if (msg.type === MessageTypes.GET_FONTS) {
            setFonts(msg.message);
        }
        if (msg.type === MessageTypes.GET_VERSIONS) {
            initVersion(msg.message);
        }
        // if (msg.type === MessageTypes.GET_MODES) {
        //   initThemeMode(msg.message);
        // }
        if (msg.type === MessageTypes.GET_INIT_THEME_MODE) {
            // msg.message ? setCurrentThemeMode(msg.message) : setCurrentThemeMode(getThemeMode()[0].id);
            // updateCurrentThemeMode();
        }
        if (msg.type === MessageTypes.GET_CURRENT_THEME_MODE) {
            updateCurrentThemeMode();
        }
        if (msg.type === MessageTypes.GET_TOKENS) {
            // console.log(JSON.stringify(msg.message));
            // init(msg.message);
        }
        if (msg.type === MessageTypes.SELECTION_CHANGE) {
            Renderer.tokensAssigned(msg.message.filter(selection => selection.useTokens.length));
            $('#design-tokens-container').trigger('click');
        }
    };
    const addPostMessageListener = () => {
        window.addEventListener("message", onMessageReceived, false);
    };
    const removePostMessageListener = () => {
        window.removeEventListener("message", onMessageReceived);
    };
    useEffect(() => {
        // if (themeModes.length === 0) return;
        $tokenContainer = $('#design-tokens-container');
        $desiginSystemTabs = $('#desigin-system-tabs');
        $tokenSetting = $('#token-setting');
        $themeModeList = $('#mode-list');
        // $tabTokensAssigned = $('[aria-controls="selections"]').parent();
        $assignedTokensNodeList = $('#assigned-tokens-node-list');
        $versionCreator = $('#version-creator');
        $versionList = $('#version-list');
        //   addPostMessageListener();
        init();
        $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
            $($(this).attr('href')).append($tokenSetting);
            if ($tokenSetting.prev().is(':visible'))
                $tokenSetting.hide();
            else
                $tokenSetting.show();
        });
        $(document).on(`${BrowserEvents.CLICK}`, '.theme-mode', function () {
            const themeModeId = $(this).data('id');
            setCurrentThemeMode(themeModeId);
            updateCurrentThemeMode();
        });
        //done
        // $(document).on(`${BrowserEvents.CLICK} ${BrowserEvents.MOUSE_OVER} ${BrowserEvents.MOUSE_OUT}`, '#design-tokens-container .token-item, #assigned-tokens-node-list .token-item, #design-tokens-container .group-item',
        //   $.debounce(20, function ({ type, target }) {
        //     const $item = $(this);
        //     if ($item.is('.token-item')) {
        //       const editBtn = $(target).closest('.token-edit-btn');
        //       if (!editBtn.length && $item.is('#design-tokens-container .token-item') &&  type === BrowserEvents.CLICK) {
        //         $('.token-item-selected').removeClass('token-item-selected');
        //         $item.addClass('token-item-selected');
        //         // sendMessage(MessageTypes.ASSIGN_TOKEN ,getToken($item.data('token')));
        //       }
        //       if (type === BrowserEvents.MOUSE_OVER) {
        //         // if (!$item.is($tokenActionWrapper.data('hoveredItem'))) {
        //         //   $('.open').removeClass('open');
        //         // }
        //       }
        //     }
        //   })
        // );
        // token setting
        // $(document).on(BrowserEvents.CONTEXTMENU, '.token-edit-btn, #design-tokens-container .panel-heading .panel-title', function (e) {
        // const $this = $(this);
        // let { group, token } = $this.closest('.token-item, .panel-heading').data();
        // const $dropdownContainer = $this.parent();
        // 
        // $dropdownContainer.addClass('open');
        // $tokenActionDelete
        //   .removeClass('disabled')
        //   .removeAttr('title');
        // Utils.clearSelection();
        // if (token) {
        // if ($this.is('#design-tokens-container .token-edit-btn')) {
        //   const refers = referByToken(getToken(token));
        //   if (refers.length > 0) {
        //     $tokenActionDelete
        //       .addClass('disabled')
        //       .attr('title', `This token has been linked by token: ${refers.map(refer => refer.name)}`);
        //   }
        //   $tokenActionClone.add($tokenActionDelete).show();
        //   $tokenActionUnassign.hide();
        // } else {
        //   $tokenActionClone.add($tokenActionDelete).hide();
        //   $tokenActionUnassign.show();
        // }
        // });
        $(document).on(BrowserEvents.CLICK, '.delete-token:not(".disabled"), .clone-token, .unassign-token', function (e) {
            const $this = $(this);
            const { group, token } = $this.closest('.token-item, .panel-heading, .group-item').data();
            const _token = null; //getToken(token);
            if ($this.is('.delete-token')) {
                removeToken(_token);
                save();
            }
            else if ($this.is('.clone-token')) {
                const _cloneToken = _cloneDeep(_token);
                _cloneToken.id = v4();
                _cloneToken.name = `${_cloneToken.name}-copy`;
                // setToken(_cloneToken);
                $tokenContainer.removeClass('show');
                $tokenSetting.TokenSetting({ group, token: _cloneToken.id });
            }
            else if ($this.is('.unassign-token')) {
                sendMessage(MessageTypes.UNASSIGN_TOKEN, {
                    nodeId: $this.closest('.selected-node').data('id'),
                    tokenId: token
                });
            }
            preventEvent(e);
        });
        // done
        $(document).on(BrowserEvents.DBCLICK, '.version-name', function (e) {
            $(this).selectText();
            preventEvent(e);
        });
        // need to update
        $(document).on(`${BrowserEvents.CLICK} ${BrowserEvents.MOUSE_OVER}`, '#design-tokens-container.plugin-panel', function (e) {
            const $target = $(e.target);
            const type = e.type;
            const $tokenItem = $target.closest('.token-item');
            const $groupItem = $target.closest('.group-item');
            // const $radiusSeparateBtns = $(event.target).closest('.separator-vals .btn-group');
            if (type === BrowserEvents.CLICK) {
                if ($tokenItem.length === 0) {
                    $('.token-item').removeClass('token-item-selected');
                }
                // $('.open').removeClass('open');
            }
            else if (type === BrowserEvents.MOUSE_OVER && $tokenItem.length === 0 && $groupItem.length === 0) {
                // $('.open').removeClass('open');
            }
            // if ($radiusSeparateBtns.length === 0) {
            //   $separatorModeSign.attr('separate-type', 'topLeft');
            // }
        });
        // done
        // $(document).on(`${BrowserEvents.BLUR}`, '.theme-mode-name, .version-name', function () {
        //   valChange.call(this);
        //   const $this = $(this);
        //   setTimeout(() => {
        //     if ($this.is('.theme-mode-name') && $this.text()) {
        //       
        //       // setTimeout(function() {
        //         Renderer.themeModes();
        //         updateCurrentThemeMode();
        //       // }, 400);
        //     }
        //     if ($this.is('.version-name') && $this.text()) {
        //       $versionCreator.removeAttr('disabled');
        //     }
        //   }, 400);
        // });
        $(document).on(`${BrowserEvents.KEY_UP}`, '.version-name', inputCheck);
        $(document).on(BrowserEvents.CLICK, '#version-creator', function (e) {
            const $this = $(this);
            if ($this.is('[disabled]'))
                return;
            createVersion();
            $versionCreator.attr('disabled', true);
            preventEvent(e);
        });
        $(document).on(BrowserEvents.CLICK, '.version-restore', function (e) {
            restore($(this).closest('li').data('data'));
        });
        $(document).on("sortupdate", '.token-list', function (event, ui) {
            const $sortedItem = $(ui.item[0]);
            const $sortableContainer = $sortedItem.parent();
            const tokens = $.makeArray($sortableContainer.children()).map($token => {
                const tokenId = $($token).data('token');
                // return getToken(tokenId);;
            });
            if ($sortedItem.is('#assigned-tokens-node-list .token-item')) {
                sendMessage(MessageTypes.REORDER_ASSIGN_TOKEN, {
                    nodeId: $sortedItem.closest('.selected-node').data('id'),
                    tokens: tokens.map(token => token.id)
                });
            }
        });
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement("ul", { id: "desigin-system-tabs", className: "nav nav-tabs", role: "tablist" },
            React.createElement("li", { role: "presentation", className: "active" },
                React.createElement("a", { href: "#tokens", "aria-controls": "tokens", role: "tab", "data-toggle": "tab", "aria-expanded": "true" }, "Tokens")),
            React.createElement("li", { role: "presentation" },
                React.createElement("a", { href: "#tokens-assigned", "aria-controls": "selections", role: "tab", "data-toggle": "tab" }, "Assigned")),
            React.createElement("li", { role: "presentation" },
                React.createElement("a", { href: "#modes", "aria-controls": "modes", role: "tab", "data-toggle": "tab" }, "Modes")),
            admin && React.createElement("li", { role: "presentation" },
                React.createElement("a", { href: "#io", "aria-controls": "io", role: "tab", "data-toggle": "tab" }, "I/O")),
            React.createElement("div", { id: "export", title: "Export a JSON file", className: "export" },
                React.createElement("span", { className: "tmicon tmicon-export" }))),
        React.createElement("div", { className: "tab-content" },
            React.createElement("div", { role: "tabpanel", className: "tab-pane active", id: "tokens" }, tokenSetting.group ?
                React.createElement(TokenSetting, null) :
                React.createElement(GroupsListContainer, null)),
            React.createElement("div", { role: "tabpanel", className: "tab-pane", id: "tokens-assigned" },
                React.createElement("div", { id: "assigned-tokens-node-list", className: "plugin-panel panel-group panel-group-collapse panel-group-collapse-basic" })),
            React.createElement("div", { role: "tabpanel", className: "tab-pane", id: "modes" },
                React.createElement(ThemeModesContainer, null)),
            admin && (React.createElement("div", { role: "tabpanel", className: "tab-pane", id: "io" },
                React.createElement("div", { className: "plugin-panel panel-group panel-group-collapse panel-group-collapse-basic" },
                    React.createElement("div", { className: "setting-row" },
                        React.createElement("label", null, "Versions:"),
                        React.createElement("ul", { id: "version-list" }),
                        React.createElement("div", { id: "version-creator", className: "version-create" }, "Save as a new version")),
                    React.createElement("div", { className: "setting-row" },
                        React.createElement("label", { htmlFor: "import-setting" }, "Import:"),
                        React.createElement("textarea", { id: "import-setting" }),
                        React.createElement("button", { id: "import-btn", className: "btn btn-primary btn-sm" }, "Import"))))))));
};
export default Tokens;
