import { useState, useCallback } from 'react';

const useTokens = () => {
  const [groups, setGroups] = useState([]);
  
  const setGroup = useCallback((group) => {
    
  }, []);

  return {
    groups,
    setGroup
  };
}

export default useTokens;
