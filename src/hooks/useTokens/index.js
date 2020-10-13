import { useContext } from 'react';
import { tokensContext, tokensSetterContext } from '../TokenProvider';
import useAPI from 'hooks/useAPI';
import useData from 'hooks/useData';
const useTokens = () => {
    const { api } = useAPI();
    const { saveTokens } = useData();
    const tokens = useContext(tokensContext);
    const { setTokens } = useContext(tokensSetterContext);
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
    };
    return {
        tokens,
        getToken: _getToken,
        removeToken: _removeToken,
        addToken: _addToken,
        setAllTokens: _setAllTokens
    };
};
export default useTokens;
