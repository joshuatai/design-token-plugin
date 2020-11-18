import { useContext } from 'react';
import { tokensContext, tokensSetterContext, purePropertyTokensContext, purePropertyTokensSetterContext } from '../TokenProvider';
import useAPI from 'hooks/useAPI';
import { toSaveTokens } from 'hooks/useData';
import Token from 'model/Token';
import { Mixed } from 'symbols/index';
import PropertyTypes from 'enums/PropertyTypes';
import MessageTypes from 'enums/MessageTypes'
;import { sendMessage } from 'model/DataManager';
import Property from 'model/Property';

const useTokens = () => {
  const { api } = useAPI();
  const tokens: Array<Token> = useContext(tokensContext);
  const { setTokens } = useContext(tokensSetterContext);
  const pureTokens = useContext(purePropertyTokensContext);
  const { setPureTokens } = useContext(purePropertyTokensSetterContext);

  const _getPureTokensByProperty = (property: Property) => {
    const types = property.type === PropertyTypes.STROKE_FILL ? [PropertyTypes.FILL_COLOR, PropertyTypes.STROKE_FILL] : [property.type];

    return types
      .map(type => pureTokens[type])
      .filter(tokens => tokens)
      .flat()
      .filter(token => token.id !== property.parent);
  }
  const _getToken = function (id?: string): Token | Array<Token> {
    return arguments.length ? tokens.slice().find(_token => _token.id === id) : tokens.slice();
  };
  const _removeToken = (token: Token) => {
    const nextTokens = tokens.slice().filter(_token => _token.id != token.id);
    _setAllTokens(nextTokens);
    return nextTokens;
  }
  const _addToken = (token: Token) => {
    const _token = new Token(token);
    const nextTokens = tokens.slice();
    const existIndex = nextTokens.findIndex(token => token.id === _token.id);
    if (existIndex === -1) {
      nextTokens.push(_token);
    } else {
      nextTokens.splice(existIndex, 1, _token);
    }
    _setAllTokens(nextTokens);
    return nextTokens;
  }
  const _setAllTokens = (_tokens: Array<Token> = []) => {
    setTokens(_tokens);
    const _pureTokens = {};
    _tokens.forEach(token => {
      if (token.propertyType !== Mixed) {
        if (!_pureTokens[token.propertyType]) _pureTokens[token.propertyType] = [];
        _pureTokens[token.propertyType].push(token);
      }
    });
    setPureTokens(_pureTokens);
    sendMessage(MessageTypes.SET_TOKENS, toSaveTokens(_tokens));
  }
  const _syncToken = (_token: Token) => {
    sendMessage(
      MessageTypes.SYNC_NODES,
      _token
    );
  }

  return {
    tokens,
    pureTokens,
    getPureTokensByProperty: _getPureTokensByProperty,
    getToken: _getToken,
    removeToken: _removeToken,
    addToken: _addToken,
    syncToken: _syncToken,
    setAllTokens: _setAllTokens
  };
};

export default useTokens;