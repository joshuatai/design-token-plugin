import { useContext } from 'react';
import { sendMessage } from 'model/DataManager';
import MessageTypes from 'enums/MessageTypes';
import useAPI from 'hooks/useAPI';
import { ThemeModesContext } from '../ThemeModeProvider';
import { groupsContext } from '../GroupProvider';
import { tokensContext } from '../TokenProvider';
import { propertiesContext } from '../PropertyProvider';
export const JSONBIN_URL = `https://api.jsonbin.io`;
const useData = () => {
    const { api } = useAPI();
    const themeModes = useContext(ThemeModesContext);
    const groups = useContext(groupsContext);
    const tokens = useContext(tokensContext);
    const properties = useContext(propertiesContext);
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'secret-key': api.apiKey
        },
        body: null
    };
    // const {
    //   setAPI,
    // } = useContext(APISetterContext);
    // const connectAPI = async (key, binID, password, admin?) => {
    //   const options = {
    //     method: 'GET',
    //     headers: {
    //       'secret-key': null
    //     },
    //     body: null
    //   };
    //   let response;
    //   let api = {
    //     key: null,
    //     bid: null,
    //     cid: null,
    //     vid: null,
    //     admin: false
    //   };
    //   let data;
    //   if (key) {
    //     api.key = key;
    //     options.headers['secret-key'] = key;
    //     if (binID) {
    //       response = fetch(`${JSONBIN_URL}/b/${binID}`, options)
    //         .then(res => res.json())
    //         .then(res => {
    //           if (res.message === undefined) {
    //             api.bid = binID;
    //             api.cid = res['collection-id'];
    //             api.vid = res['versions-bin-id'];
    //             data = res.data;
    //           } else {
    //             return Promise.reject({
    //               message: res.message,
    //             });
    //           }
    //           if (password) {
    //             return fetch(`${JSONBIN_URL}/b/${res['admin-id']}`, options)
    //               .then(res => res.json())
    //               .then(res => {
    //                 if (res.password === password) {
    //                   api.admin = true;
    //                   setLocalAPI(api);
    //                   return Promise.resolve({
    //                     ...api,
    //                     data,
    //                     success: true
    //                   });
    //                 } 
    //                 return Promise.reject({
    //                   message: 'Invalid password'
    //                 });
    //               });
    //           } else {
    //             if (password === '') api.admin = false;
    //             if (admin !== undefined) admin === true ? api.admin = true : api.admin = false;
    //             if (api.admin) {
    //               setLocalAPI(api);
    //               return Promise.resolve({
    //                 ...api,
    //                 data,
    //                 success: true
    //               });
    //             } else {
    //               return fetch(`${JSONBIN_URL}/b/${api.vid}`, options)
    //                 .then(res => res.json())
    //                 .then(res => {
    //                   if (res['last-version'] === 0) {
    //                     setLocalAPI(api);
    //                     return Promise.resolve({
    //                       ...api,
    //                       data,
    //                       success: true
    //                     });
    //                   }
    //                 });
    //             }
    //           }
    //         });
    //     } else {
    //       // Create Collection
    //       options.headers['Content-Type'] = 'application/json';
    //       options.method = 'POST';
    //       options.body = JSON.stringify({ name: 'Tonic Design Tokens (Collection)' })
    //       response = fetch(`${JSONBIN_URL}/c`, options)
    //         .then(res => res.json())
    //         .then(res => {
    //           if (res.success) {
    //             api.cid = res.id;
    //             options.headers['private'] = 'true';
    //             options.headers['name'] = 'Tonic Design Tokens (Versions)';
    //             options.headers['collection-id'] = res.id;
    //             options.body = JSON.stringify({ 'last-version': 0, versions: {} });
    //             const versions = fetch(`${JSONBIN_URL}/b`, options);
    //             options.headers['name'] = 'Tonic Design Tokens (Admin)';
    //             options.body = JSON.stringify({ password });
    //             const admin = fetch(`${JSONBIN_URL}/b`, options);
    //             return Promise.all([versions, admin]);
    //           }
    //           return Promise.reject({ message: res.message });
    //         })
    //         .then(([versions, admin]) => Promise.all([versions.json(), admin.json()]))
    //         .then(([versions, admin]) => {
    //           if (versions.success, admin.success) {
    //             api.vid = versions.id;
    //             options.headers['name'] = 'Tonic Design Tokens';
    //             options.body = JSON.stringify({
    //               'collection-id': api.cid,
    //               'admin-id': admin.id, //remove it once the collection api is back!!
    //               'last-version': 0,
    //               'versions-bin-id': versions.id,
    //               'data': {}
    //             });
    //             return fetch(`${JSONBIN_URL}/b`, options)
    //               .then(res => res.json())
    //               .then(res => {
    //                 if (res.success) {
    //                   api.bid = res.id;
    //                   api.admin = true;
    //                   setLocalAPI(api);
    //                   return Promise.resolve({
    //                     ...api,
    //                     data: res.data.data,
    //                     success: res.success
    //                   });
    //                 }
    //                 return Promise.reject(false);
    //               })
    //           }
    //           return Promise.reject(false);
    //         });
    //     }
    //   }
    //   return response;
    // }
    const saveThemeModes = (_themeModes) => {
        if (!api.admin)
            return;
        options.method = 'PUT';
        options.body = JSON.stringify({
            // "collection-id": api.collectionID,
            "admin-id": api.adminID,
            "versions-id": api.versionsID,
            "last-version": api.lastVersion,
            "data": {
                themeModes: _themeModes,
                groups,
                tokens,
                properties
            }
        });
        return fetch(`${JSONBIN_URL}/b/${api.tokensID}`, options)
            .then(res => {
            sendMessage(MessageTypes.SET_MODES, _themeModes);
            return res.json();
        });
    };
    const saveGroups = (_groups) => {
        if (!api.admin)
            return;
        options.method = 'PUT';
        options.body = JSON.stringify({
            // "collection-id": api.collectionID,
            "admin-id": api.adminID,
            "versions-id": api.versionsID,
            "last-version": api.lastVersion,
            "data": {
                themeModes,
                groups: _groups,
                tokens,
                properties
            }
        });
        return fetch(`${JSONBIN_URL}/b/${api.tokensID}`, options)
            .then(res => res.json());
    };
    const saveTokens = (_tokens) => {
        if (!api.admin)
            return;
        options.method = 'PUT';
        options.body = JSON.stringify({
            // "collection-id": api.collectionID,
            "admin-id": api.adminID,
            "versions-id": api.versionsID,
            "last-version": api.lastVersion,
            "data": {
                themeModes,
                groups,
                tokens: _tokens,
                properties
            }
        });
        return fetch(`${JSONBIN_URL}/b/${api.tokensID}`, options)
            .then(res => res.json());
    };
    const saveProperties = (_properties) => {
        if (!api.admin)
            return;
        options.method = 'PUT';
        options.body = JSON.stringify({
            // "collection-id": api.collectionID,
            "admin-id": api.adminID,
            "versions-id": api.versionsID,
            "last-version": api.lastVersion,
            "data": {
                themeModes,
                groups,
                tokens,
                properties: _properties
            }
        });
        return Promise.resolve({ success: true });
        // return fetch(`${JSONBIN_URL}/b/${api.tokensID}`, options)
        //   .then(res => res.json());
    };
    const saveTokensProperties = (_groups, _tokens, _properties) => {
        if (!api.admin)
            return;
        options.method = 'PUT';
        options.body = JSON.stringify({
            // "collection-id": api.collectionID,
            "admin-id": api.adminID,
            "versions-id": api.versionsID,
            "last-version": api.lastVersion,
            "data": {
                themeModes,
                groups: _groups,
                tokens: _tokens,
                properties: _properties
            }
        });
        return fetch(`${JSONBIN_URL}/b/${api.tokensID}`, options)
            .then(res => res.json());
    };
    return {
        saveThemeModes,
        saveGroups,
        saveTokensProperties,
        saveTokens,
        saveProperties
    };
};
export default useData;
