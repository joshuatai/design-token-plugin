import React, { FC, useState, useEffect } from "react";
import useAPI from 'hooks/useAPI';
import useGroups from 'hooks/useGroups';
import GroupsList from './GroupsList';
import Group from 'model/Group';
import BrowserEvents from 'enums/BrowserEvents';
import preventEvent from 'utils/preventEvent';

const GroupsContainer: FC = () => {
  const { api: { admin }} = useAPI();
  const { setGroup } = useGroups();
  const [ createEnable, setCreateEnable ] = useState(true);

  const createGroupHandler = (e) => {
    if (!admin) return;
    const newGroup = new Group({
      name: ''
    });
    setCreateEnable(false);
    setGroup(newGroup);
    preventEvent(e);
  };

  useEffect(() => {
    if (admin) {
      // This event listener is to prevent collapse event.
      $(document).on(BrowserEvents.CLICK, '.group-name, .add-token', preventEvent);
    }
    return () =>  {
      $(document).off(BrowserEvents.CLICK, '.group-name, .add-token', preventEvent);
    }
  }, []);

  return <div id="design-tokens-container" className="plugin-panel panel-group panel-group-collapse panel-group-collapse-basic">
    <GroupsList creatable={setCreateEnable}></GroupsList>
    {
      admin && <button id="group-creator" type="button" onClick={createGroupHandler} disabled={!createEnable}>Add a new group</button>
    }
  </div>
};

export default GroupsContainer;