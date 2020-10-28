import { useContext } from 'react';
import { fontsContext, fontsSetterContext } from '../FontProvider';
import { sendMessage } from 'model/DataManager';
import MessageTypes from 'enums/MessageTypes';
const useFonts = () => {
    const fonts = useContext(fontsContext);
    const { setFonts } = useContext(fontsSetterContext);
    const _getFont = (name) => {
        const font = fonts.slice().find(font => font.fontName.family === name);
        return font || fonts;
    };
    const _setFonts = (_fonts = []) => {
        setFonts(_fonts);
    };
    const _fetchFonts = () => {
        sendMessage(MessageTypes.GET_FONTS);
    };
    return {
        fonts,
        getFont: _getFont,
        setFonts: _setFonts,
        fetchFonts: _fetchFonts
    };
};
export default useFonts;
