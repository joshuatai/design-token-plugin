var BrowserEvents;
(function (BrowserEvents) {
    BrowserEvents["CLICK"] = "click";
    BrowserEvents["DBCLICK"] = "dblclick";
    BrowserEvents["DRAG"] = "drag";
    BrowserEvents["MOUSE_DOWN"] = "mousedown";
    BrowserEvents["MOUSE_OVER"] = "mouseover";
    BrowserEvents["MOUSE_OUT"] = "mouseout";
    BrowserEvents["FOCUS"] = "focus";
    BrowserEvents["FOCUSIN"] = "focusin";
    BrowserEvents["FOCUSOUT"] = "focusout";
    BrowserEvents["BLUR"] = "focusout";
    BrowserEvents["CHANG"] = "change";
    BrowserEvents["KEY_PRESS"] = "keypress";
    BrowserEvents["KEY_DOWN"] = "keydown";
    BrowserEvents["KEY_UP"] = "keyup";
})(BrowserEvents || (BrowserEvents = {}));
export default BrowserEvents;
