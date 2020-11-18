import React, { useRef, useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import Tokens from './containers/Tokens';
import APISetting from './containers/APISetting';
import Loader from './containers/Loader';
import Logo from './containers/APISetting/Logo';
import useAPI from 'hooks/useAPI';
import useFonts from 'hooks/useFonts';
import DataProvider from 'hooks/DataProvider';
import MessageTypes from 'enums/MessageTypes';
import './vendors/main.css';
import './ui.scss';
import './ui.css';
;
const Root = () => {
    const { api: { checked: apiChecked, apiKey, tokensID }, checkAPI, connectAPI, setAPI } = useAPI();
    const { fetchFonts, setFonts } = useFonts();
    const [isFetched, setIsFetched] = useState(false);
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
            }
            else {
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
        // if (msg.type === MessageTypes.SELECTION_CHANGE) {
        //   Renderer.tokensAssigned(msg.message.filter(selection => selection.useTokens.length));
        //   $('#design-tokens-container').trigger('click');
        // }
    };
    const addPostMessageListener = () => {
        window.addEventListener("message", onMessageReceived, false);
    };
    const removePostMessageListener = () => {
        window.removeEventListener("message", onMessageReceived);
    };
    useEffect(function () {
        addPostMessageListener();
        checkAPI();
        fetchFonts();
        return () => removePostMessageListener();
    }, []);
    useEffect(() => {
        if (apiChecked && tokensID) {
            const data = dataRef.current;
            if (data) {
                setIsFetched(true);
            }
        }
    }, [apiChecked, tokensID]);
    return (!apiChecked ?
        React.createElement(Loader, null) :
        apiKey && tokensID && isFetched ?
            React.createElement(Tokens, { data: dataRef.current }) :
            React.createElement("div", { id: "api-setting" },
                React.createElement(Logo, null),
                React.createElement(APISetting, { dataRef: dataRef })));
};
class App extends React.Component {
    render() {
        return React.createElement(DataProvider, null,
            React.createElement(Root, null));
    }
}
ReactDOM.render(React.createElement(App, null), document.getElementById('react-page'));
