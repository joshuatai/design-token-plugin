import React, { FC, useRef, useState } from 'react';
import * as ReactDOM from 'react-dom';
import useAPI from 'hooks/useAPI';
import useFonts from 'hooks/useFonts';
import Global from 'model/Global';
import Tokens from './containers/Tokens';
import APISetting from './containers/APISetting';
import Loader from './containers/Loader';
import Logo from './containers/APISetting/Logo';
import DataProvider from 'hooks/DataProvider';

import './vendors/main.css';
import './ui.scss';
import './ui.css';
import MessageTypes from 'enums/MessageTypes';

const { useEffect } = React;

const Root:FC = () => {
  const { api: { checked: apiChecked, apiKey, tokensID }, checkAPI, connectAPI, setAPI } = useAPI(); 
  const { connectFonts, setFonts } = useFonts();
  const [ isFetched, setIsFetched ] = useState(false);
  const dataRef = useRef();
  const onMessageReceived = (event) => {
    const msg = event.data.pluginMessage;
    if (msg.type === MessageTypes.GET_API) {
      const { 'api-key': apiKey, 'tokens-id': tokensID, admin } = msg.message;
      if (apiKey && tokensID) {
        connectAPI(apiKey, tokensID, undefined, admin)
          .then(res => {
            if (res.success) {
              if (res.success) {
                dataRef.current = res.data;
                setAPI({
                  checked: true,
                  apiKey: res.key,
                  tokensID: res.tid,
                  // collectionID: res.cid,
                  versionsID: res.vid,
                  lastVersion: res.lastV,
                  adminID: res.aid,
                  admin: res.admin 
                });
              }
            } 
          });
      } else {
        setAPI({
          checked: true
        });
      }
    }
    if (msg.type === MessageTypes.GET_FONTS) {
      setFonts(msg.message);
    }
    // if (msg.type === MessageTypes.GET_VERSIONS) {
    //   initVersion(msg.message);
    // }
    // if (msg.type === MessageTypes.GET_MODES) {
    //   initThemeMode(msg.message);
    // }
    // if (msg.type === MessageTypes.GET_INIT_THEME_MODE) {
    //   msg.message ? setCurrentThemeMode(msg.message) : setCurrentThemeMode(getThemeMode()[0].id);
    //   updateCurrentThemeMode();
    // }
    // if (msg.type === MessageTypes.GET_CURRENT_THEME_MODE) {
    //   updateCurrentThemeMode();
    // }
    // if (msg.type === MessageTypes.GET_TOKENS) {
    //   // console.log(JSON.stringify(msg.message));
    //   init(msg.message);
    // }
    // if (msg.type === MessageTypes.SELECTION_CHANGE) {
    //   Renderer.tokensAssigned(msg.message.filter(selection => selection.useTokens.length));
    //   $('#design-tokens-container').trigger('click');
    // }
  }
  const addPostMessageListener = () => {
    window.addEventListener("message", onMessageReceived, false);
  }
    
  const removePostMessageListener = () => {
    window.removeEventListener("message", onMessageReceived);
  }

  useEffect(function () {
    addPostMessageListener();
    checkAPI();
    connectFonts();
    return () => removePostMessageListener();
  }, []);
  
  useEffect(() => {
    if (apiChecked && tokensID) {
      const data: Global = dataRef.current;
      if (data) {
        setIsFetched(true);
      }
    }
  }, [apiChecked, tokensID]);

  return (
    !apiChecked ?
      <Loader></Loader> :
      apiKey && tokensID && isFetched?
        <Tokens data={dataRef.current}></Tokens> :
        <div id="api-setting">
          <Logo></Logo>
          <APISetting dataRef={dataRef}></APISetting>
        </div>
  );
}
class App extends React.Component {
  render() {
    return <DataProvider><Root></Root></DataProvider>;
  }
}

ReactDOM.render(<App />, document.getElementById('react-page'));