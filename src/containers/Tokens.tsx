import React, { useEffect, FC, useContext } from 'react';
import hash from 'hash.js';
import _cloneDeep from 'lodash/cloneDeep';


import useAPI from 'hooks/useAPI';
import useThemeModes from 'hooks/useThemeModes';
import useGroups from 'hooks/useGroups';
import useTokens from 'hooks/useTokens';
import useProperties from 'hooks/useProperties';
import { tokenSettingContext, T_TokenSetting } from 'hooks/TokenSettingProvider';

import GroupsListContainer from './GroupsListContainer';
import TokenSetting from './TokenSetting';
import ThemeModesContainer from './ThemeModesContainer';
import ThemeModesSetter from './ThemeModesSetter';

import SelectText from 'utils/selectText';
import PluginDestroy from 'utils/PluginDestroy';
import {getVersion, fetchInitial, referByToken, getCurrentThemeMode, setCurrentThemeMode, removeThemeMode, setProperty, save, sendMessage, saveThemeMode, syncPageThemeMode, setVersion, restore } from 'model/DataManager';
// import { themeModeIcon } from './property-components/CommonSettings.tss';
import ThemeMode from 'model/ThemeMode';
import Version from 'model/Version';
import Group from 'model/Group';
import Token from 'model/Token';
import Properties from 'model/Properties';
import MessageTypes from 'enums/MessageTypes';
import BrowserEvents from 'enums/BrowserEvents';
import preventEvent from  'utils/preventEvent';
import { inputCheck, valChange } from 'utils/inputValidator';
import Property from 'model/Property';

declare var $: any;
SelectText(jQuery);
PluginDestroy(jQuery);

type Props = {
  data: {
    themeModes: Array<ThemeMode>,
    groups: Array<Group>,
    tokens: Array<Token>,
    properties: Array<Property>
  }
};
const Tokens:FC<Props> = ({
  data = {
    themeModes: [],
    groups: [],
    tokens: [],
    properties: []
  }
}: Props) => {
  const { api: { admin }} = useAPI();
  const { setAllGroups } = useGroups();
  const { setAllTokens } = useTokens();
  const { setAllProperties } = useProperties();
  const { setAllThemeModes } = useThemeModes();
  const tokenSetting: T_TokenSetting = useContext(tokenSettingContext);
  let $desiginSystemTabs, $assignedTokensNodeList, $tokenSetting, $themeModeList, $versionCreator, $versionList;

  const Renderer = {
    themeModes: function () {
      const modes = []//getThemeMode();
      const $themeModes = $(`<div class="dropdown theme-modes"></div>`);
      // const $themeModeIcon = $(themeModeIcon);
      const $themeModeList = $(`<ul class="dropdown-menu dropdown-menu-multi-select pull-right"></ul>`);
  
      $desiginSystemTabs.find('.theme-modes').remove();
      if (modes.length > 1) {
        $desiginSystemTabs.append(
          $themeModes
            // .append($themeModeIcon)
            .append(
              $themeModeList.append(
                modes.map((mode, index) => {
                  return `
                    <li class="theme-mode" data-index="${index}" data-id="${mode.id}">
                      <a href="#">${mode.name}${mode.isDefault ? ' (Default)' : ''}</a>
                    </li>
                  `;
                })
              )
            )
        );
      }
    },
    version: function (version) {
      let $version, $name, $remove, $load;
  
      $versionList
        .append(
          (
            $version = $(`<li id="version-${version.id}"></li>`)
              .append($name = $(`<span class="version-name" prop-name="name" is-required="true" contenteditable="false">${version.name}</span>`).data('id', version.id))
              .append(
                $load = $(`<span class="version-restore tmicon tmicon-backup"></span>`)
              )
              .append(
                $remove = $(`
                  <span class="remove-version">
                    <svg class="svg" width="12" height="6" viewBox="0 0 12 6" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.5 3.5H.5v-1h11v1z" fill-rule="nonzero" fill-opacity="1" fill="#000" stroke="none"></path>
                    </svg>
                  </span>
                `)
              )
              .data({
                data: version,
                $name,
                $remove
              })
          )
        );
  
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
          $assignedTokensNodeList.append(
            $node
              .append($heading.append($title.append($expend).append($name)))
              .append(
                $tokenListPanel.append(
                  $tokenList
                    .addClass('sortable')
                    .sortable({
                      // containment: "parent",
                      placeholder: 'ui-sortable-placeholder',
                      handle: '.ui-sortable-handle',
                      axis: "y"
                    })
                    .append(
                      useTokens.map(_token => {
                        const token = []//getToken(_token);
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
                          .append($icon ? $icon : null)
                          // .append($('<span class="token-key"></span>').text(token.name));
                      })
                    )
                )
              )
          )
        });
      } else {
        $assignedTokensNodeList.append(`<div class="no-node-selected">Please select a node that has assigned at least one token.</div>`)
      }
    },
    updateThemeMode: function () {
      // $('#design-tokens-container .fill-color-icon').parent().each((index, item) => {
      //   const { token } = $(item).data();
      //   this.token(getToken(token));
      // });
    }
  };
  function initVersion (versions: Array<Version>) {
    versions.forEach((version: Version) => {
      const $version = Renderer.version(new Version(version));
      const { data } = $version.data();
      setVersion(data);
    });
  }
  
  function init () {
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
        return new Properties[property._type](property)
      });
      setAllProperties(_properties);
    }
  }

  function createVersion () {
    const saveData = 'group data';
    const dataHash = hash.sha256().update(JSON.stringify(saveData)).digest('hex');
    const $version = Renderer.version(new Version({ hash: dataHash, data: saveData }));
    const { data, $name } = $version.data();
    $name.selectText();
    setVersion(data);
  }
  function updateCurrentThemeMode () {
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
  }
  const addPostMessageListener = () => {
    window.addEventListener("message", onMessageReceived, false);
  }
    
  const removePostMessageListener = () => {
    window.removeEventListener("message", onMessageReceived);
  }

  useEffect(() => {
    $desiginSystemTabs = $('#desigin-system-tabs');
    $tokenSetting = $('#token-setting');
    $themeModeList = $('#mode-list');
    // $tabTokensAssigned = $('[aria-controls="selections"]').parent();
    $assignedTokensNodeList = $('#assigned-tokens-node-list');
    $versionCreator = $('#version-creator');
    $versionList = $('#version-list');
  //   addPostMessageListener();
    init();
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
    //     }
    //   })
    // );

    $(document).on(BrowserEvents.CLICK, '.delete-token:not(".disabled"), .clone-token, .unassign-token', function (e) {
      const $this = $(this);
      const { group, token } = $this.closest('.token-item, .panel-heading, .group-item').data();
      
      const _token = null//getToken(token);
      if ($this.is('.unassign-token')) {
        sendMessage(MessageTypes.UNASSIGN_TOKEN , {
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
      if ( type === BrowserEvents.CLICK) {
        if ($tokenItem.length === 0) {
          $('.token-item').removeClass('token-item-selected');
        }
        // $('.open').removeClass('open');
      } else if (type === BrowserEvents.MOUSE_OVER && $tokenItem.length === 0 && $groupItem.length === 0) {
        // $('.open').removeClass('open');
      }
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
      if ($this.is('[disabled]')) return;
      
      createVersion();
      $versionCreator.attr('disabled', true);
    
      preventEvent(e);
    });
    
    $(document).on(BrowserEvents.CLICK, '.version-restore', function (e) {
      restore($(this).closest('li').data('data'));
    });  
    $(document).on( "sortupdate", '.token-list', function(event, ui) {
      // const $sortedItem = $(ui.item[0]);
      // const $sortableContainer = $sortedItem.parent();
      // const tokens = $.makeArray($sortableContainer.children()).map($token => {
      //   const tokenId = $($token).data('token');
      //   // return getToken(tokenId);;
      // });
      // if ($sortedItem.is('#assigned-tokens-node-list .token-item')) {
      //   sendMessage(MessageTypes.REORDER_ASSIGN_TOKEN , {
      //     nodeId: $sortedItem.closest('.selected-node').data('id'),
      //     tokens: tokens.map(token => token.id)
      //   });
      // }
    });
  }, []);

  return (
    <>
      <ul id="desigin-system-tabs" className="nav nav-tabs" role="tablist">
        <li role="presentation" className="active"><a href="#tokens" aria-controls="tokens" role="tab" data-toggle="tab" aria-expanded="true">Tokens</a></li>
        <li role="presentation"><a href="#tokens-assigned" aria-controls="selections" role="tab" data-toggle="tab">Assigned</a></li>
        <li role="presentation"><a href="#modes" aria-controls="modes" role="tab" data-toggle="tab">Modes</a></li>
        {
          admin && <li role="presentation"><a href="#io" aria-controls="io" role="tab" data-toggle="tab">I/O</a></li>
        }

        <div id="export" title="Export a JSON file" className="export"><span className="tmicon tmicon-export"></span></div>
        <ThemeModesSetter></ThemeModesSetter>
      </ul>
      <div className="tab-content">
        <div role="tabpanel" className="tab-pane active" id="tokens">
          {
            tokenSetting.group ?
            <TokenSetting></TokenSetting> :
            <GroupsListContainer></GroupsListContainer>
          }
        </div>
        <div role="tabpanel" className="tab-pane" id="tokens-assigned">
          <div id="assigned-tokens-node-list" className="plugin-panel panel-group panel-group-collapse panel-group-collapse-basic"></div>     
        </div>
        <div role="tabpanel" className="tab-pane" id="modes">
          <ThemeModesContainer></ThemeModesContainer>
        </div>
        {
          admin && (
            <div role="tabpanel" className="tab-pane" id="io">
              <div className="plugin-panel panel-group panel-group-collapse panel-group-collapse-basic">
                <div className="setting-row">
                  <label>Versions:</label>
                  <ul id="version-list"></ul>
                  <div id="version-creator" className="version-create">Save as a new version</div>
                </div>
                <div className="setting-row">
                  <label htmlFor="import-setting">Import:</label>
                  <textarea id="import-setting"></textarea>
                  <button id="import-btn" className="btn btn-primary btn-sm">Import</button>
                </div>
              </div>    
            </div>
          )
        }
      </div>
    </>
  );
};

export default Tokens;
