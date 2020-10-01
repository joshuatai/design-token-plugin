import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
const initialAPI = {
    checked: false,
    apiKey: null,
    tokensID: null,
    // collectionID: null,
    versionsID: null,
    lastVersion: 0,
    adminID: null,
    admin: false
};
const APIContext = React.createContext(initialAPI);
const APISetterContext = React.createContext({ setAPI: null });
const APIProvider = ({ value = initialAPI, children }) => {
    const [api, setAPI] = useState(value);
    const _setAPI = _api => {
        setAPI(preApi => {
            return Object.assign(Object.assign({}, preApi), _api);
        });
    };
    const APISetterRef = useRef({ setAPI: _setAPI });
    return (React.createElement(APIContext.Provider, { value: api },
        React.createElement(APISetterContext.Provider, { value: APISetterRef.current }, children)));
};
APIProvider.propTypes = {
    value: PropTypes.object,
};
APIProvider.displayName = "APIProvider";
export default APIProvider;
export { APIContext, APISetterContext };
