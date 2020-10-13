import { useContext } from 'react';
import { tokensContext, tokensSetterContext } from '../TokenProvider';
import useAPI from 'hooks/useAPI';
import useData from 'hooks/useData';
import Token from 'model/Token';

const useTokens = () => {
  const { api } = useAPI();
  const { saveTokens } = useData();
  const tokens: Array<Token> = useContext(tokensContext);
  const { setTokens } = useContext(tokensSetterContext);
  
  const _getToken = (id?: string): Token | Array<Token> => {
    if (id) {
      return tokens.slice().find(_token => _token.id === id);
    }
    return tokens.slice();
  };
  const _removeToken = (token: Token) => {
    const nextTokens = tokens.slice().filter(_token => _token.id != token.id);
    _setAllTokens(nextTokens);
    return nextTokens;
  }
  const _addToken = (token: Token) => {
    const nextTokens = tokens.slice();
    const existIndex = nextTokens.findIndex(_token => _token.id === token.id);
    if (existIndex === -1) {
      nextTokens.push(token);
    } else {
      nextTokens.splice(existIndex, 1, token);
    }
    _setAllTokens(nextTokens);
    return nextTokens;
  }
  const _setAllTokens = (_tokens: Array<Token> = []) => {
    setTokens(_tokens);
  }
  return {
    tokens,
    getToken: _getToken,
    removeToken: _removeToken,
    addToken: _addToken,
    setAllTokens: _setAllTokens
  };
};

export default useTokens;