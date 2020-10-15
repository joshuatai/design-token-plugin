import { useContext } from 'react';
import { tokensContext, tokensSetterContext, purePropertyTokensContext, purePropertyTokensSetterContext } from '../TokenProvider';
import useAPI from 'hooks/useAPI';
import { Mixed } from 'symbols/index';
const useTokens = () => {
    const { api } = useAPI();
    const tokens = useContext(tokensContext);
    const { setTokens } = useContext(tokensSetterContext);
    const pureTokens = useContext(purePropertyTokensContext);
    const { setPureTokens } = useContext(purePropertyTokensSetterContext);
    const _getPureTokensByType = (types) => {
        const _types = [];
        typeof (types) === 'string' ? _types.push(types) : _types.concat(types);
        const _pureTokens = _types.map(type => pureTokens[type]);
        return _pureTokens;
    };
    const _getToken = (id) => {
        if (id) {
            return tokens.slice().find(_token => _token.id === id);
        }
        return tokens.slice();
    };
    const _removeToken = (token) => {
        const nextTokens = tokens.slice().filter(_token => _token.id != token.id);
        _setAllTokens(nextTokens);
        return nextTokens;
    };
    const _addToken = (token) => {
        const nextTokens = tokens.slice();
        const existIndex = nextTokens.findIndex(_token => _token.id === token.id);
        if (existIndex === -1) {
            nextTokens.push(token);
        }
        else {
            nextTokens.splice(existIndex, 1, token);
        }
        _setAllTokens(nextTokens);
        return nextTokens;
    };
    const _setAllTokens = (_tokens = []) => {
        setTokens(_tokens);
        const _pureTokens = {};
        _tokens.forEach(token => {
            if (token.propertyType !== Mixed) {
                if (!_pureTokens[token.propertyType])
                    _pureTokens[token.propertyType] = [];
                _pureTokens[token.propertyType].push(token);
            }
        });
        setPureTokens(_pureTokens);
    };
    return {
        tokens,
        pureTokens,
        getPureTokensByType: _getPureTokensByType,
        getToken: _getToken,
        removeToken: _removeToken,
        addToken: _addToken,
        setAllTokens: _setAllTokens
    };
};
export default useTokens;
