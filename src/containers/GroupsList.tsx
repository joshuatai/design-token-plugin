import React, { useEffect, FC, useRef, useContext, useState } from "react";
import { groupsContext } from  'hooks/GroupProvider';
import useAPI from 'hooks/useAPI';
import useData from 'hooks/useData';
import useGroups from 'hooks/useGroups';
import useTokens from 'hooks/useTokens';
import useTokenSetting from 'hooks/useTokenSetting';
import useProperties from 'hooks/useProperties';
import Group from 'model/Group';
import Token from 'model/Token';
import TokenList from './TokenList';
import { inputCheck, valChange } from 'utils/inputValidator';
import SelectText from 'utils/SelectText';
import BrowserEvents from 'enums/BrowserEvents';
import preventEvent from 'utils/preventEvent';
import InputStatus from 'enums/InputStatus';

declare var $: any;
SelectText(jQuery);

type T_Group = {
  data: Group,
  creatable
}

const GroupItem:FC<T_Group> = ({
  data,
  creatable
}: T_Group) => {
  const { id, name, tokens: _tokens } = data;
  const groupNameRef = useRef(null);
  const { api: { admin } } = useAPI();
  const [ contextmenu, setContextmenu ] = useState(false);
  const { saveGroups, saveTokensProperties } = useData();
  const { groups, getGroup, getGroupName, addGroup, setAllGroups } = useGroups();
  const { tokens, getToken, setAllTokens } = useTokens();
  const { properties, referedTokens, setAllProperties } = useProperties();
  const { setGroup } = useTokenSetting();
  const tokenLinks = _tokens.map(token => referedTokens(token)).flat();
  const focusHandler = (e) => {
    if (!admin) return;
    $(groupNameRef.current).selectText();
    preventEvent(e);
  }
  const inputHandler = (e) => {
    if (!admin) return;
    const $name = groupNameRef.current;
    inputCheck.call($name, e);
  }
  const blurHandler = (e) => {
    if (!admin) return;
    const $name = groupNameRef.current;
    creatable(false);
    valChange
      .call($name, name)
      .then(res => {
        if (res.status === InputStatus.VALID) {
          const group: Group = getGroup(id) as Group;
          group.name = $name.textContent;
          const _groups = addGroup(group);
          saveGroups(_groups)
            .then(res => {
              creatable(true);
            });
        }
      })
      .catch(res => {
        if (res.status === InputStatus.NO_CHANGE) creatable(true);
      });
  }
  const addTokenHandler = (e) => {
    if (!admin) return;
    setGroup(data);
  }
  const removeGroupHandler = (e) => {
    if (!admin) return;
    let _groups = groups.slice().filter(group => group.id !== id);
    let _tokens = tokens.slice();
    let _properties = properties.slice();
    data.tokens.forEach((_tokenId: string) => {
      const token = getToken(_tokenId) as Token;
      token.properties.forEach(_propId => {
        const index = _properties.findIndex(_prop => _prop.id === _propId);
        _properties.splice(index, 1);
      });
      const index = _tokens.findIndex(token => token.id === _tokenId);
      _tokens.splice(index, 1);
    });
    setAllProperties(_properties);
    setAllTokens(_tokens);
    setAllGroups(_groups);
    saveTokensProperties(_groups, _tokens, _properties);
  }
  const contextMenuHandler = (e) => {
    if (!admin) return;
    setContextmenu(true);
  }
  const mouseLeaveHandler = (e) => {
    if (!admin) return;
    setContextmenu(false);
  }
  const deleteGroupProps = {
    className: 'delete-group',
    onClick: removeGroupHandler
  };
  if (tokenLinks.length) {
    delete deleteGroupProps.onClick;
    Object.assign(deleteGroupProps, {
      className: 'delete-group disabled',
      title: `The tokens under the group: "${name}" has been linked by other tokens: ${tokenLinks.map((token: Token) => token.name).join(', ')}`
    });
  }

  useEffect(() => {
    const $name = groupNameRef.current;
    if (admin && $name && !$name.innerHTML) {
      $name.click();
      $name.innerHTML = getGroupName();
    }

    $(document).on(BrowserEvents.CLICK, '.delete-group', (e) => {
      preventEvent(e);
    }) 
  }, []);

  return (
    <div data-id={id} className="panel panel-default panel-collapse-shown">
      <div className={contextmenu ? 'panel-heading group-item open' : 'panel-heading group-item'} data-target={`#group-${id}`} data-toggle="collapse" aria-expanded="false" onContextMenu={contextMenuHandler} onMouseLeave={mouseLeaveHandler}>
        <h6 className="panel-title">
          { _tokens.length > 0 && <span className="tmicon tmicon-caret-right tmicon-hoverable"></span> }
          <span data-id={id} ref={groupNameRef} className="group-name" is-required="true" contentEditable="false" suppressContentEditableWarning={true} onClick={focusHandler} onKeyUp={inputHandler} onBlur={blurHandler}>{name}</span>
        </h6>
        {
          admin &&
          <button onClick={addTokenHandler} type="button" className="add-token" title="Create A Token">
            <svg className="svg" width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.5 5.5v-5h1v5h5v1h-5v5h-1v-5h-5v-1h5z" fillRule="nonzero" fillOpacity="1" fill="#000" stroke="none"></path>
            </svg>
          </button>
        }
        {
          admin && 
          <ul className="contextmenu dropdown-menu pull-right">
            <li {...deleteGroupProps}><a href="#">Delete Group</a></li>
          </ul>
        }
      </div>
      <div id={`group-${id}`} className="panel-collapse collapse" aria-expanded="false">
        <TokenList group={data}></TokenList>
      </div>
    </div>
  );
}

type T_GroupsList = {
  creatable
}

const GroupsList: FC<T_GroupsList> = ({
  creatable
}: T_GroupsList) => {
  const groups = useContext(groupsContext);
  return (
    <>
      {
        groups.map((group: Group) => <GroupItem key={group.id} data={group} creatable={creatable}></GroupItem>)
      }
    </>
  );
};

export default GroupsList;
