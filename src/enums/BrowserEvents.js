var BrowserEvents;
(function (BrowserEvents) {
    BrowserEvents["CLICK"] = "click";
    BrowserEvents["DBCLICK"] = "dblclick";
    BrowserEvents["MOUSE_OVER"] = "mouseover";
    BrowserEvents["MOUSE_OUT"] = "mouseout";
    BrowserEvents["BLUR"] = "focusout";
    BrowserEvents["CHANG"] = "change";
    BrowserEvents["KEY_PRESS"] = "keypress";
    BrowserEvents["KEY_DOWN"] = "keydown";
    BrowserEvents["KEY_UP"] = "keyup";
})(BrowserEvents || (BrowserEvents = {}));
export default BrowserEvents;
