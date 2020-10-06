import React, { FC, useState } from "react";
import useAPI from 'hooks/useAPI';
import useGroups from 'hooks/useGroups';
import TokensList from './TokensList';
import Group from 'model/Group';
import preventEvent from 'utils/preventEvent';

const TokensContainer: FC = () => {
  const { api: { admin }} = useAPI();
  const { getGroupName, setGroup } = useGroups();
  const [ createEnable, setCreateEnable ] = useState(true);

  const createGroupHandler = (e) => {
    const newGroup = new Group({
      name: getGroupName()
    });
    setCreateEnable(false);
    setGroup(newGroup);
    preventEvent(e);
  };
  return <div id="design-tokens-container" className="plugin-panel panel-group panel-group-collapse panel-group-collapse-basic show">
    <TokensList creatable={setCreateEnable}></TokensList>
    {
      admin && <div id="group-creator" className="group-create" onClick={createGroupHandler} data-disabled={!createEnable}>Add a new group</div>
    }
  </div>
};

export default TokensContainer;
