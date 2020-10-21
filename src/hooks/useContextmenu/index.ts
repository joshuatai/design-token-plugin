import { useContext } from 'react';
import { contextmenuContext, contextmenuSetterContext } from '../ContextmenuProvider';
import useAPI from 'hooks/useAPI';

const useContextmenu = () => {
  const { api } = useAPI();
  const contextmenu: HTMLElement = useContext(contextmenuContext);
  const { setContextmenu } = useContext(contextmenuSetterContext);
  
  const _setContextmenu = (contextmenu: HTMLElement) => {
    setContextmenu(contextmenu);
  }
  
  return {
    contextmenu,
    setContextmenu: _setContextmenu
  };
};

export default useContextmenu;