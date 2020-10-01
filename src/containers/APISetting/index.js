var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useRef, useEffect, useState } from "react";
import { inputCheck, valChange } from 'utils/inputValidator';
import preventEvent from 'utils/preventEvent';
import useAPI from 'hooks/useAPI';
import SelectText from 'utils/SelectText';
import BrowserEvents from "enums/BrowserEvents";
import './index.scss';
SelectText(jQuery);
const APISetting = ({ dataRef }) => {
    const { api: { apiKey, tokensID }, connectAPI, setAPI } = useAPI();
    const [processing, setProcessing] = useState(false);
    const [savable, setSavable] = useState(false);
    const apiKeyRef = useRef(null);
    const binIDRef = useRef(null);
    const adminPWDRef = useRef(null);
    let _apiKeyInput;
    let _binIDInput;
    let _adminPWDInput;
    let _inputCheck;
    let _inputBlur;
    let _inputEdit;
    let errorTarget;
    const addInputListener = (inputs) => {
        _inputEdit = function (e) {
            const input = e.target;
            if (inputs.indexOf(input) > -1) {
                $(input).selectText();
                preventEvent(e);
            }
        };
        _inputCheck = function (e) {
            const input = e.target;
            if (inputs.indexOf(input) > -1) {
                input.dataset.id = input.textContent;
                inputCheck.call(input, [e]);
                if (_apiKeyInput.getAttribute('invalid') || _binIDInput.getAttribute('invalid') || _adminPWDInput.getAttribute('invalid')) {
                    setSavable(false);
                }
                else {
                    if (!_binIDInput.textContent && !_adminPWDInput.textContent) {
                        setSavable(false);
                        return;
                    }
                    setSavable(true);
                }
            }
        };
        _inputBlur = (e) => {
            const input = e.target;
            if (inputs.indexOf(input) > -1) {
                valChange.call(input);
                input.scrollLeft = 0;
            }
        };
        document.addEventListener(BrowserEvents.CLICK, _inputEdit);
        document.addEventListener(BrowserEvents.KEY_UP, _inputCheck);
        document.addEventListener(BrowserEvents.BLUR, _inputBlur);
    };
    const removeInputListener = () => {
        document.removeEventListener(BrowserEvents.KEY_UP, _inputCheck);
        document.addEventListener(BrowserEvents.BLUR, _inputBlur);
    };
    useEffect(() => {
        _apiKeyInput = apiKeyRef.current;
        _binIDInput = binIDRef.current;
        _adminPWDInput = adminPWDRef.current;
        errorTarget = {
            'Invalid secret key provided.': _apiKeyInput,
            'Invalid secret-key provided': _apiKeyInput,
            'Invalid Record ID': _binIDInput,
            'Invalid password': _adminPWDInput
        };
        addInputListener([_apiKeyInput, _binIDInput, _adminPWDInput]);
        if (!apiKey)
            _apiKeyInput.focus();
        return () => removeInputListener();
    });
    const settingHandler = () => __awaiter(void 0, void 0, void 0, function* () {
        const _apiKey = _apiKeyInput.textContent;
        const _tokensID = _binIDInput.textContent;
        const _password = _adminPWDInput.textContent;
        setProcessing(true);
        connectAPI(_apiKey, _tokensID, _password)
            .then(res => {
            setProcessing(false);
            if (res.success) {
                dataRef.current = res.data;
                setAPI({
                    apiKey: res.key,
                    tokensID: res.tid,
                    // collectionID: res.cid,
                    versionsID: res.vid,
                    lastVersion: res.lastV,
                    adminID: res.aid,
                    admin: res.admin
                });
            }
        })
            .catch(e => {
            setProcessing(false);
            if (errorTarget[e.message]) {
                errorTarget[e.message].setAttribute('invalid', true);
                errorTarget[e.message].click();
            }
        });
    });
    return (React.createElement("div", { className: "api-setting-panel" },
        React.createElement("label", null, "API Key"),
        React.createElement("div", { ref: apiKeyRef, className: `api-key ${processing ? 'disabled' : ''}`, "prop-name": "key", "is-required": "true", contentEditable: "true", suppressContentEditableWarning: true }, apiKey),
        React.createElement("label", null, "Bin ID"),
        React.createElement("div", { ref: binIDRef, className: `bin-id ${processing ? 'disabled' : ''}`, "prop-name": "bin-id", contentEditable: "false", suppressContentEditableWarning: true }, tokensID),
        React.createElement("span", { className: "text-muted" }, "Enter an existing Bin ID or leave it blank to generate a new Bin."),
        React.createElement("label", null, "Admin Password"),
        React.createElement("div", { ref: adminPWDRef, className: `admin-pwd ${processing ? 'disabled' : ''}`, "prop-name": "password", contentEditable: "false", suppressContentEditableWarning: true }),
        React.createElement("span", { className: "text-muted" }, "Required for the first time setup or the administrator. For password, it is at least 8-16 characters."),
        React.createElement("button", { className: "btn btn-primary", onClick: settingHandler, disabled: processing || !savable },
            processing && React.createElement("span", { className: "loader loader-small" }),
            "Setting")));
};
export default APISetting;
