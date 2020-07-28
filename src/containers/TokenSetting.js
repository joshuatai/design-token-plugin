import _cloneDeep from 'lodash/cloneDeep';
import _findIndex from 'lodash/findIndex';
import BrowserEvents from '../enums/BrowserEvents';
import { getGroup, getToken, setToken, syncToken, save, syncNode } from '../model/DataManager';
import Token from '../model/Token';
import { inputCheck, valChange } from '../utils/inputValidator';
import propertyConponents from './property-components';
import PropertyTypes from '../enums/PropertyTypes';
import PropertyView from './PropertyView';
import PropertyList from './PropertyList';
import { Mixed } from 'symbols/index';
let hostData;
const backIcon = `
  <div id="turn-back-btn" class="turn-back-btn">
    <svg
      class="svg"
      width="8"
      height="13"
      viewBox="0 0 8 13"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 6.5l-.353-.354-.354.354.354.354L1 6.5zM6.647.146l-6 6 .707.708 6-6-.707-.708zm-6 6.708l6 6 .707-.708-6-6-.707.708z"
        fill-rule="nonzero"
        fill-opacity="1"
        fill="inherit"
        stroke="none"
      ></path>
    </svg>
  </div>
`;
const PropertyConponents = propertyConponents(jQuery);
PropertyView(jQuery);
PropertyList(jQuery);
export default function ($) {
    const NAME = 'TokenSetting';
    var TokenSetting = function (element, { group, token }) {
        hostData = this;
        this.group = getGroup(group);
        this.token = getToken(token) || setToken(new Token({ parent: group }));
        const $headerRow = $(`
      <div class="setting-row">${backIcon}
        <h6 id="panel-group-name">${this.group.name}</h6>
      </div>
    `);
        const $tokenNameRow = $('<div class="setting-row" />');
        const $tokenName = $(`
      <span
        class="token-name"
        prop-name="name"
        placeholder="Token Name"
        is-required="true"
        contenteditable="true"
      />
    `).data('id', this.token.id);
        const $descriptionRow = $('<div class="setting-row" />');
        const $description = $(`
      <span
        class="token-description"
        prop-name="description"
        placeholder="Add Description"
        contenteditable="true"
      />
    `).data('id', this.token.id);
        const $propertyView = $('<div id="property-view" class="setting-row" />');
        const $propertyList = $('<div id="property-list" class="setting-row"></div>');
        const $createPropertyRow = $('<div class="setting-row" />');
        const $createProperty = $('<button id="add-property" type="button">Create New Property</button>');
        const $propertySetting = $('<div id="property-setting" />');
        const $propertyTypeRow = $('<div id="property-type-row" class="setting-row">');
        const $propertyType = $('<div id="property-type" class="btn-group" />');
        const $propertyTypeBtn = $(`
      <button
        type="button"
        class="btn btn-border dropdown-toggle"
        data-toggle="dropdown"
        aria-expanded="false"
        value="0"
      >
        <i class="tmicon tmicon-caret-down"></i>
        <span>Choose a type of property</span>
      </button>
    `);
        const $propertyTypeDropdowns = $('<ul class="dropdown-menu" />').append(Object.keys(PropertyTypes).map(type => {
            return (this[`$propertyOption_${type}`] = $(`<li class="property-type-${type}"><a href="#">${PropertyTypes[type]}</a></li>`));
        }));
        const $propertySettingSections = $('<div class="setting-row property-setting-section" />');
        const $settingButtonsRow = $('<div class="setting-row" />');
        const $settingCreateBtn = $(`<button id="property-setting-create" type="button" class="btn btn-sm btn-primary">Create</button>`);
        const $settingUpdateBtn = $(`<button id="property-setting-update" type="button" class="btn btn-sm btn-primary">Update</button>`);
        const $settingCancelBtn = $(`<button id="property-setting-cancel" type="button" class="btn btn-sm btn-border">Cancel</button>`);
        this.$element = $(element)
            .append($headerRow)
            .append($tokenNameRow.append($tokenName.append(this.token.name)))
            .append($descriptionRow.append($description.append(this.token.description)))
            .append($propertyView)
            .append($propertyList)
            .append($createPropertyRow.append($createProperty))
            .append($propertySetting
            .append($propertyTypeRow.append($propertyType
            .append($propertyTypeBtn)
            .append($propertyTypeDropdowns)))
            .append($propertySettingSections)
            .append($settingButtonsRow.append($settingCancelBtn.add($settingCreateBtn).add($settingUpdateBtn))))
            .show();
        Object.assign(this, {
            $tokenName,
            $propertyView,
            $propertyList,
            $createProperty,
            $propertySetting,
            $propertyTypeRow,
            $propertyTypeBtn,
            $propertyTypeDropdowns,
            $propertySettingSections,
            $settingCreateBtn,
            $settingUpdateBtn,
            $settingCancelBtn
        });
        if (!this.token.name) {
            $tokenName.selectText();
            $createProperty.attr('disabled', true);
        }
        if (this.token.properties.length > 0) {
            this.$propertyList.propertyList(this.token.properties);
            this.$propertyView.propertyView(this.token.properties);
        }
    };
    TokenSetting.prototype.canAddProperty = function () {
        this.$createProperty.add(this.$settingCreateBtn).add(this.$settingUpdateBtn).attr('disabled', !this.$tokenName.text());
    };
    TokenSetting.prototype.propertyEdit = function (editable, property) {
        this.$createProperty.parent()[editable ? 'hide' : 'show']();
        this.$element.append(this.$propertySetting[editable ? 'show' : 'hide']());
        this.$propertyTypeRow[property ? 'hide' : 'show']();
        this.$propertyTypeBtn.val(0).children('span').text('Choose a type of property');
        this.$settingCreateBtn
            .add(this.$settingUpdateBtn)
            .hide();
        this.$propertySettingSections.hide().destroy();
        this.$propertyTypeDropdowns.children().show();
        this.token.properties.forEach(property => {
            if (property.type === PropertyTypes.CORNER_RADIUS)
                this.$propertyOption_CORNER_RADIUS.hide();
            if (property.type === PropertyTypes.STROKE_WIDTH_ALIGN)
                this.$propertyOption_STROKE_WIDTH_ALIGN.hide();
        });
        if (property) {
            this.choosePropertyType(property);
        }
    };
    TokenSetting.prototype.choosePropertyType = function (param) {
        let type = param;
        if (typeof param === 'object') {
            type = param.type;
            this.$settingUpdateBtn.show();
            $('.property-item:hover').after(this.$propertySetting);
        }
        else {
            this.$settingCreateBtn.show();
        }
        this.$propertyTypeBtn.val(type).children('span').text(type);
        this.$propertySettingSections
            .destroy()
            .data({
            token: this.token,
            propertyView: this.$propertyView
        });
        this.$propertySettingSections[PropertyConponents[type]](param);
    };
    TokenSetting.prototype.createProperty = function () {
        const { value } = this.$propertySettingSections.data();
        const existIndex = _findIndex(this.token.properties, prop => prop.id === value.id);
        existIndex > -1 ? this.token.properties[existIndex] = value : this.token.properties.push(value);
        this.updateProperty();
    };
    TokenSetting.prototype.removeProperty = function (property) {
        $.each(this.token.properties, (i, prop) => {
            if (prop && prop.id === property.id) {
                this.token.properties.splice(i, 1);
            }
        });
        this.updateProperty();
    };
    TokenSetting.prototype.updateProperty = function () {
        this.$element.append(this.$propertySetting); // prevent remove data once propetyList destroy
        if (this.token.properties.length > 0) {
            this.$propertyList.propertyList(this.token.properties);
            const propertyTypes = Object.keys(this.token.properties.reduce((calc, property) => {
                calc[property.type] = property.type;
                return calc;
            }, {}));
            this.token.propertyType = propertyTypes.length === 1 ? propertyTypes[0] : Mixed;
        }
        else {
            this.$propertyList.destroy();
        }
        this.propertyEdit(false);
        this.$propertyView.propertyView(this.token.properties);
        syncToken(this.token);
        save();
        syncNode(this.token);
    };
    TokenSetting.prototype.propertyView = function (property) {
        const tmpProperties = _cloneDeep(this.token.properties);
        if (property) {
            const existIndex = _findIndex(tmpProperties, prop => prop.id === property.id);
            existIndex > -1 ? tmpProperties[existIndex] = property : tmpProperties.push(property);
        }
        this.$propertyView.propertyView(tmpProperties);
    };
    TokenSetting.prototype.destroy = function () {
        return this.$element.empty().removeData().hide();
    };
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('TokenSetting');
            var options = typeof option == 'object' && option;
            if (data)
                data.destroy();
            else
                $this.data('TokenSetting', (data = new TokenSetting(this, options)));
        });
    }
    var old = $.fn.TokenSetting;
    $.fn.TokenSetting = Plugin;
    $.fn.TokenSetting.Constructor = TokenSetting;
    $.fn.TokenSetting.noConflict = function () {
        $.fn.TokenSetting = old;
        return this;
    };
    function canAddProperty(callback) {
        return function (e) {
            callback.call(this, e);
            hostData.canAddProperty();
        };
    }
    // done
    $(document).on(BrowserEvents.CLICK, '#token-setting #turn-back-btn', $.debounce(260, function () {
        const { token } = hostData;
        hostData.$element.trigger('destroy:TokenSetting', [token]).destroy();
    }));
    $(document).on(`${BrowserEvents.KEY_UP}`, '.token-name, .token-description', canAddProperty(inputCheck));
    $(document).on(`${BrowserEvents.BLUR}`, '.token-name, .token-description', canAddProperty(valChange));
    $(document).on(BrowserEvents.CLICK, '#add-property, #property-setting-cancel', function () {
        if ($(this).is('#add-property'))
            hostData.propertyEdit(true);
        else
            hostData.propertyEdit(false);
        hostData.$propertyView.propertyView(hostData.token.properties);
    });
    $(document).on(BrowserEvents.CLICK, '#property-type a', function (event) {
        hostData.choosePropertyType($(this).text());
    });
    $(document).on(BrowserEvents.CLICK, '#property-setting-create, #property-setting-update', function () {
        hostData.createProperty();
    });
    $(document).on('property-remove', '#property-list', function (event, property) {
        hostData.removeProperty(property);
    });
    $(document).on('property-sort', '#property-list', function (event, properties) {
        hostData.token.properties = properties;
        hostData.updateProperty();
    });
    $(document).on('property-edit', '#property-list', function (event, property) {
        hostData.propertyEdit(true, property);
    });
    $(document).on('property-preview', function (event, property) {
        hostData.propertyView(property);
    });
}
(jQuery);
