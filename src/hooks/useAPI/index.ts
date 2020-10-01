import { useContext } from 'react';
import { APIContext, APISetterContext } from '../APIProvider';
import { sendMessage } from 'model/DataManager';
import MessageTypes from 'enums/MessageTypes';

export const JSONBIN_URL = `https://api.jsonbin.io`;

const useAPI = () => {
  const api = useContext(APIContext);
  const {
    setAPI,
  } = useContext(APISetterContext);

  const setLocalAPI = function ({ key, tid, vid, lastV, aid, admin }) {
    sendMessage(
      MessageTypes.SET_API,
      {
        'api-key': key,
        'tokens-id': tid,
        // 'collection-id': cid,
        'versions-id': vid,
        'last-version': lastV,
        'admin-id': aid,
        'admin': admin
      }
    );
  }
  const connectAPI = async (key, tokensID, password, admin?) => {
    const options = {
      method: 'GET',
      headers: {
        'secret-key': null
      },
      body: null
    };
    let response;
    let api = {
      key: null,
      tid: null,
      // cid: null,
      vid: null,
      lastV: null,
      aid: null,
      admin: false
    };
    let data;
  
    if (key) {
      api.key = key;
      options.headers['secret-key'] = key;
      if (tokensID) {
        response = fetch(`${JSONBIN_URL}/b/${tokensID}/latest`, options)
          .then(res => res.json())
          .then(res => {
            if (res.message === undefined) {
              api.tid = tokensID;
              // api.cid = res['collection-id'];
              api.vid = res['versions-id'];
              api.lastV = res['last-version'];
              api.aid = res['admin-id'];
              data = res.data;
            } else {
              return Promise.reject({
                message: res.message,
              });
            }
            if (password) {
              return fetch(`${JSONBIN_URL}/b/${api.aid}`, options)
                .then(res => res.json())
                .then(res => {
                  if (res.password === password) {
                    api.admin = true;
                    setLocalAPI(api);
                    return Promise.resolve({
                      ...api,
                      data,
                      success: true
                    });
                  } 
                  return Promise.reject({
                    message: 'Invalid password'
                  });
                });
            } else {
              if (password === '') api.admin = false;
              if (admin !== undefined) admin === true ? api.admin = true : api.admin = false;
              if (api.admin) {
                setLocalAPI(api);
                return Promise.resolve({
                  ...api,
                  data,
                  success: true
                });
              } else {
                return fetch(`${JSONBIN_URL}/b/${api.vid}`, options)
                  .then(res => res.json())
                  .then(res => {
                    if (res['last-version'] === 0) {
                      setLocalAPI(api);
                      return Promise.resolve({
                        ...api,
                        data,
                        success: true
                      });
                    }
                  });
              }
            }
          });
      } else {
        options.headers['Content-Type'] = 'application/json';
        options.method = 'POST';
        // options.body = JSON.stringify({ name: 'Tonic Design Tokens (Collection)' })
        // response = fetch(`${JSONBIN_URL}/c`, options)
          // .then(res => res.json())
          // .then(res => {
            // if (res.success) {
              // api.cid = res.id;
              options.headers['private'] = 'true';
              options.headers['name'] = 'Tonic Design Tokens (Versions)';
              // options.headers['collection-id'] = res.id;
              options.body = JSON.stringify({ 'last-version': 0, versions: {} });
              const versions = fetch(`${JSONBIN_URL}/b`, options);
              options.headers['name'] = 'Tonic Design Tokens (Admin)';
              options.body = JSON.stringify({ password });
              const admin = fetch(`${JSONBIN_URL}/b`, options);

          response = Promise.all([versions, admin])
            // }
            // return Promise.reject({ message: res.message });
          // })
          .then(([versions, admin]) => Promise.all([versions.json(), admin.json()]))
          .then(([versions, admin]) => {
            if (versions.success, admin.success) {
              api.vid = versions.id;
              api.lastV = 0;
              api.aid = admin.id;
              options.headers['name'] = 'Tonic Design Tokens';
              options.body = JSON.stringify({
                // 'collection-id': api.cid,
                'admin-id': api.aid, //remove it once the collection api is back!!
                'versions-id': api.vid,
                'last-version': api.lastV,
                'data': {}
              });
              return fetch(`${JSONBIN_URL}/b`, options)
                .then(res => res.json())
                .then(res => {
                  if (res.success) {
                    api.tid = res.id;
                    api.admin = true;
                    setLocalAPI(api);
                    return Promise.resolve({
                      ...api,
                      data: res.data.data,
                      success: res.success
                    });
                  }
                  return Promise.reject(false);
                })
            }
            return Promise.reject(false);
          });
      }
    }
    return response;
  }
  const checkAPI = () => {
    sendMessage(MessageTypes.GET_API);
  };

  return {
    api,
    checkAPI,
    connectAPI,
    setAPI
  };
};

export default useAPI;