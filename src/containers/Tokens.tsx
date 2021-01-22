import React, { useEffect, FC, useState, useRef } from 'react';
import hash from 'hash.js';
import useAPI from 'hooks/useAPI';
import useData from 'hooks/useData';
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
import { setVersion } from 'model/DataManager';
import ThemeMode from 'model/ThemeMode';
import Version from 'model/Version';
import Group from 'model/Group';
import Token from 'model/Token';
import Properties from 'model/Properties';
import MessageTypes from 'enums/MessageTypes';
import Tabs from 'enums/Tabs';
import Property from 'model/Property';
import useTokenSetting from 'hooks/useTokenSetting';

declare var $: any;
SelectText(jQuery);

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
  const { exportData } = useData();
  const { tab, setTab } = useTabs();
  const { fetchCurrentMode, setCurrentMode, themeModes, getThemeMode, defaultMode } = useThemeModes();
  const { setAllGroups } = useGroups();
  const { setAllTokens, getToken } = useTokens();
  const { setAllProperties } = useProperties();
  const { setAllThemeModes } = useThemeModes();
  const { setting, setTokenSetting, initialSetting} = useTokenSetting();
  const $exportRef = useRef();
  let $versionCreator, $versionList;

  const [ assignTokenNodes, setAssignTokenNodes ] = useState([]);

  const Renderer = {
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
    }
  };
  function initVersion (versions: Array<Version>) {
    versions.forEach((version: Version) => {
      const $version = Renderer.version(new Version(version));
      const { data } = $version.data();
      setVersion(data);
    });
  }
  function createVersion () {
    const saveData = 'group data';
    const dataHash = hash.sha256().update(JSON.stringify(saveData)).digest('hex');
    const $version = Renderer.version(new Version({ hash: dataHash, data: saveData }));
    const { data, $name } = $version.data();
    $name.selectText();
    setVersion(data);
  }
  const onMessageReceived = (event) => {
    const msg = event.data.pluginMessage;
    
    if (msg.type === MessageTypes.GET_VERSIONS) {
      initVersion(msg.message);
    }
    if (msg.type === MessageTypes.FETCH_CURRENT_THEME_MODE) {
      const themeId = msg.message;
      setCurrentMode(themeId ? getThemeMode(themeId) as ThemeMode : defaultMode);
    }
    if (msg.type === MessageTypes.SELECTION_CHANGE) {
      const assignTokenNodes = msg.message.filter(selection => {
        return selection.useTokens.some(tokenId => getToken(tokenId));
      });
      setAssignTokenNodes(assignTokenNodes);
    }
  }
  const addPostMessageListener = () => {
    window.addEventListener("message", onMessageReceived, false);
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      const tabId = (e.target as HTMLElement).getAttribute('aria-controls');
      setTab(tabId);
      setTokenSetting(Object.assign({}, initialSetting));
    });
  }
  const removePostMessageListener = () => {
    window.removeEventListener("message", onMessageReceived);
    $('a[data-toggle="tab"]').off('shown.bs.tab');
  }

  useEffect(() => {
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
        return new Properties[property._type](property)
      });
      setAllProperties(_properties);
    }
    
    // done
    // $(document).on(BrowserEvents.DBCLICK, '.version-name', function (e) {
    //   $(this).selectText();
    //   preventEvent(e);
    // });

    // done
    // $(document).on(`${BrowserEvents.BLUR}`, '.version-name', function () {
    //   valChange.call(this);
    //   const $this = $(this);
    //   setTimeout(() => {
    //     if ($this.is('.version-name') && $this.text()) {
    //       $versionCreator.removeAttr('disabled');
    //     }
    //   }, 400);
    // });
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
  }, [themeModes.length]);
  return (
    <div className={admin ? 'admin' : ''}>
      <ul id="desigin-system-tabs" className="nav nav-tabs" role="tablist">
        <li role="presentation" className="active"><a href={`#${Tabs.TOKENS}`} aria-controls={Tabs.TOKENS} role="tab" data-toggle="tab" aria-expanded="true">Tokens</a></li>
        <li role="presentation"><a href={`#${Tabs.TOKENS_ASSIGNED}`} aria-controls={Tabs.TOKENS_ASSIGNED} role="tab" data-toggle="tab">Assigned</a></li>
        <li role="presentation"><a href={`#${Tabs.THEME_MODES}`} aria-controls={Tabs.THEME_MODES} role="tab" data-toggle="tab">Modes</a></li>
        {
          admin && <li role="presentation"><a href={`#${Tabs.IO}`} aria-controls={Tabs.IO} role="tab" data-toggle="tab">I/O</a></li>
        }
        <div id="export" title="Export JSON File" className="export" onClick={exportData($exportRef.current)}>
          <span className="tmicon tmicon-export"></span>
          <a ref={$exportRef} style={{'display': 'none'}}></a>
        </div>
        <ThemeModesSetter></ThemeModesSetter>
      </ul>
      <div className="tab-content">
        <div role="tabpanel" className="tab-pane active" id={Tabs.TOKENS}>
          {
            tab === 'tokens' ? 
            setting.group ?
            <TokenSetting></TokenSetting> :
            <GroupsListContainer></GroupsListContainer> :
            null
          }
        </div>
        <div role="tabpanel" className="tab-pane" id={Tabs.TOKENS_ASSIGNED}>
          {
            tab === 'tokens-assigned' ?
            setting.group ?
            <TokenSetting></TokenSetting>:
            <AssignedTokenNodes data={assignTokenNodes}></AssignedTokenNodes>:
            null
          }
        </div>
        <div role="tabpanel" className="tab-pane" id={Tabs.THEME_MODES}>
          <ThemeModesContainer></ThemeModesContainer>
        </div>
        {
          admin && (
            <div role="tabpanel" className="tab-pane" id={Tabs.IO}>
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
    </div>
  );
};

export default Tokens;
