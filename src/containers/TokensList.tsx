import React, { useEffect, FC, useRef, useContext } from "react";
import useAPI from 'hooks/useAPI';
import { groupsContext } from  'hooks/GroupProvider';
import useGroups from 'hooks/useGroups';
import Group from 'model/Group';
import SelectText from 'utils/SelectText';
import preventEvent from 'utils/preventEvent';
import { inputCheck, valChange } from 'utils/inputValidator';
import InputStatus from 'enums/InputStatus';
import { getGroup } from "model/DataManager";

declare var $: any;
SelectText(jQuery);
type IGroup = {
  data: {
    id: String,
    name: String
  },
  creatable
}

const GroupItem:FC<IGroup> = ({
  data: { id, name },
  creatable
}: IGroup) => {
  const groupName = useRef(null);
  const { api: { admin } } = useAPI();
  const { getGroup, setGroup } = useGroups();
  
  const removeHandler = (e) => {
    // if (!data.isDefault) removeThemeMode(data as ThemeMode);
    // updateCurrentThemeMode();
    // $modeCreator.attr('disabled', false);
  }
  const blurHandler = (e) => {
    const $name = groupName.current;
    creatable(false);
    valChange
      .call($name, name)
      .then(res => {
        if (res === InputStatus.VALID) {
          const group: Group = getGroup(id) as Group;
          group.name = $name.textContent;
          setGroup(group);
          creatable(true);
        }
      })
      .catch(res => {
        if (res === InputStatus.NO_CHANGE) creatable(true);
      });
  }
  const focusHandler = (e) => {
    if (!admin) return;
    $(groupName.current).selectText();
    preventEvent(e);
  }
  const inputHandler = (e) => {
    const $name = groupName.current;
    inputCheck.call($name, e);
  }

  useEffect(() => {
    const $name = groupName.current;
    if (admin && $name && !$name.innerHTML) $name.click();
  }, []);

  return (
    <div data-id={id} className="panel panel-default panel-collapse-shown">
      <div className="panel-heading group-item" data-target={`#group-${id}`} data-toggle="collapse" aria-expanded="false">
        <h6 className="panel-title">
          <span className="tmicon tmicon-caret-right tmicon-hoverable"></span>
          <span data-id={id} className="group-name" prop-name="name" is-required="true">{name}</span>
        </h6>
        <button type="button" className="add-token" title="Create a token">
          <svg className="svg" width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 5.5v-5h1v5h5v1h-5v5h-1v-5h-5v-1h5z" fillRule="nonzero" fillOpacity="1" fill="#000" stroke="none"></path>
          </svg>
        </button>
      </div>
      <div id={`group-${id}`} className="panel-collapse collapse" aria-expanded="false">
        test
      </div>
    </div>
  );
}

type ITokensList = {
  creatable
}

const TokensList: FC<ITokensList> = ({
  creatable
}: ITokensList) => {
  const groups = useContext(groupsContext);
  
  return (<>
    {
      groups.map(group => <GroupItem key={group.id} data={group} creatable={creatable}></GroupItem>)
    }
  </>)
};

export default TokensList;
