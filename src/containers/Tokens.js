import React, { useEffect, useState } from 'react';
import hash from 'hash.js';
import useAPI from 'hooks/useAPI';
import useTabs from 'hooks/useTabs';
import useThemeModes from 'hooks/useThemeModes';
import useGroups from 'hooks/useGroups';
import useTokens from 'hooks/useTokens';
import useProperties from 'hooks/useProperties';
import GroupsListContainer from './GroupsListContainer';
import TokenSetting from './TokenSetting';
import ThemeModesContainer from './ThemeModesContainer';
import ThemeModesSetter from './ThemeModesSetter';
import AssignedTokenNodes from './AssignedTokenNodes';
import SelectText from 'utils/selectText';
import PluginDestroy from 'utils/PluginDestroy';
import { sendMessage, setVersion } from 'model/DataManager';
import ThemeMode from 'model/ThemeMode';
import Version from 'model/Version';
import Group from 'model/Group';
import Token from 'model/Token';
import Properties from 'model/Properties';
import MessageTypes from 'enums/MessageTypes';
import Tabs from 'enums/Tabs';
import useTokenSetting from 'hooks/useTokenSetting';
SelectText(jQuery);
PluginDestroy(jQuery);
const Tokens = ({ data = {
    themeModes: [],
    groups: [],
    tokens: [],
    properties: []
} }) => {
    const { api: { admin } } = useAPI();
    const { tab, setTab } = useTabs();
    const { fetchCurrentMode, setCurrentMode, themeModes, getThemeMode, defaultMode } = useThemeModes();
    const { setAllGroups } = useGroups();
    const { setAllTokens } = useTokens();
    const { setAllProperties } = useProperties();
    const { setAllThemeModes } = useThemeModes();
    const { setting, setTokenSetting, initialSetting } = useTokenSetting();
    let $desiginSystemTabs, $assignedTokensNodeList, $tokenSetting, $themeModeList, $versionCreator, $versionList;
    const [assignTokenNodes, setAssignTokenNodes] = useState([]);
    const Renderer = {
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
        updateThemeMode: function () {
            // $('#design-tokens-container .fill-color-icon').parent().each((index, item) => {
            //   const { token } = $(item).data();
            //   this.token(getToken(token));
            // });
        }
    };
    function initVersion(versions) {
        versions.forEach((version) => {
            const $version = Renderer.version(new Version(version));
            const { data } = $version.data();
            setVersion(data);
        });
    }
    function createVersion() {
        const saveData = 'group data';
        const dataHash = hash.sha256().update(JSON.stringify(saveData)).digest('hex');
        const $version = Renderer.version(new Version({ hash: dataHash, data: saveData }));
        const { data, $name } = $version.data();
        $name.selectText();
        setVersion(data);
    }
    function updateCurrentThemeMode() {
        // Renderer.updateThemeMode();// change token icon
        // $tokenSetting.TokenSetting('changeThemeMode'); //change preview
        sendMessage(MessageTypes.SYNC_CURRENT_THEME_MODE);
    }
    const onMessageReceived = (event) => {
        const msg = event.data.pluginMessage;
        if (msg.type === MessageTypes.GET_VERSIONS) {
            initVersion(msg.message);
        }
        if (msg.type === MessageTypes.FETCH_CURRENT_THEME_MODE) {
            const themeId = msg.message;
            setCurrentMode(themeId ? getThemeMode(themeId) : defaultMode);
            // updateCurrentThemeMode();
        }
        if (msg.type === MessageTypes.GET_CURRENT_THEME_MODE) {
            updateCurrentThemeMode();
        }
        if (msg.type === MessageTypes.SELECTION_CHANGE) {
            const assignTokenNodes = msg.message.filter(selection => selection.useTokens.length);
            setAssignTokenNodes(assignTokenNodes);
            // $('#design-tokens-container').trigger('click');
        }
    };
    const addPostMessageListener = () => {
        window.addEventListener("message", onMessageReceived, false);
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            const tabId = e.target.getAttribute('aria-controls');
            setTab(tabId);
            setTokenSetting(Object.assign({}, initialSetting));
        });
    };
    const removePostMessageListener = () => {
        window.removeEventListener("message", onMessageReceived);
        $('a[data-toggle="tab"]').off('shown.bs.tab');
    };
    useEffect(() => {
        $desiginSystemTabs = $('#desigin-system-tabs');
        $tokenSetting = $('#token-setting');
        $themeModeList = $('#mode-list');
        // $tabTokensAssigned = $('[aria-controls="selections"]').parent();
        $assignedTokensNodeList = $('#assigned-tokens-node-list');
        $versionCreator = $('#version-creator');
        $versionList = $('#version-list');
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
        //done
        // $(document).on(`${BrowserEvents.CLICK} ${BrowserEvents.MOUSE_OVER} ${BrowserEvents.MOUSE_OUT}`, '#design-tokens-container .token-item, #assigned-tokens-node-list .token-item, #design-tokens-container .group-item',
        //   $.debounce(20, function ({ type, target }) {
        //     const $item = $(this);
        //     if ($item.is('.token-item')) {
        //       const editBtn = $(target).closest('.token-edit-btn');
        //       if (!editBtn.length && $item.is('#design-tokens-container .token-item') &&  type === BrowserEvents.CLICK) {
        //         $('.token-item-selected').removeClass('token-item-selected');
        //         $item.addClass('token-item-selected');
        //         // 
        //       }
        //     }
        //   })
        // );
        // done
        // $(document).on(BrowserEvents.DBCLICK, '.version-name', function (e) {
        //   $(this).selectText();
        //   preventEvent(e);
        // });
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
        // $(document).on(`${BrowserEvents.KEY_UP}`, '.version-name', inputCheck);
        // $(document).on(BrowserEvents.CLICK, '#version-creator', function (e) {
        //   const $this = $(this);
        //   if ($this.is('[disabled]')) return;
        //   createVersion();
        //   $versionCreator.attr('disabled', true);
        //   preventEvent(e);
        // });
        // $(document).on(BrowserEvents.CLICK, '.version-restore', function (e) {
        //   restore($(this).closest('li').data('data'));
        // });
        return removePostMessageListener;
    }, []);
    useEffect(() => {
        addPostMessageListener();
        if (themeModes.length > 0) {
            fetchCurrentMode();
        }
    }, [themeModes]);
    return (React.createElement(React.Fragment, null,
        React.createElement("ul", { id: "desigin-system-tabs", className: "nav nav-tabs", role: "tablist" },
            React.createElement("li", { role: "presentation", className: "active" },
                React.createElement("a", { href: `#${Tabs.TOKENS}`, "aria-controls": Tabs.TOKENS, role: "tab", "data-toggle": "tab", "aria-expanded": "true" }, "Tokens")),
            React.createElement("li", { role: "presentation" },
                React.createElement("a", { href: `#${Tabs.TOKENS_ASSIGNED}`, "aria-controls": Tabs.TOKENS_ASSIGNED, role: "tab", "data-toggle": "tab" }, "Assigned")),
            React.createElement("li", { role: "presentation" },
                React.createElement("a", { href: `#${Tabs.THEME_MODES}`, "aria-controls": Tabs.THEME_MODES, role: "tab", "data-toggle": "tab" }, "Modes")),
            admin && React.createElement("li", { role: "presentation" },
                React.createElement("a", { href: `#${Tabs.IO}`, "aria-controls": Tabs.IO, role: "tab", "data-toggle": "tab" }, "I/O")),
            React.createElement("div", { id: "export", title: "Export a JSON file", className: "export" },
                React.createElement("span", { className: "tmicon tmicon-export" })),
            React.createElement(ThemeModesSetter, null)),
        React.createElement("div", { className: "tab-content" },
            React.createElement("div", { role: "tabpanel", className: "tab-pane active", id: Tabs.TOKENS }, tab === 'tokens' ?
                setting.group ?
                    React.createElement(TokenSetting, null) :
                    React.createElement(GroupsListContainer, null) :
                null),
            React.createElement("div", { role: "tabpanel", className: "tab-pane", id: Tabs.TOKENS_ASSIGNED },
                React.createElement("div", { id: "assigned-tokens-node-list", className: "plugin-panel panel-group panel-group-collapse panel-group-collapse-basic" }, tab === 'tokens-assigned' ?
                    setting.group ?
                        React.createElement(TokenSetting, null) :
                        React.createElement(AssignedTokenNodes, { data: assignTokenNodes }) :
                    null)),
            React.createElement("div", { role: "tabpanel", className: "tab-pane", id: Tabs.THEME_MODES },
                React.createElement(ThemeModesContainer, null)),
            admin && (React.createElement("div", { role: "tabpanel", className: "tab-pane", id: Tabs.IO },
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
