import BrowserEvents from '../enums/BrowserEvents';
import { getGroup, getToken, setToken, save } from '../model/DataManager';
import Token from '../model/Token';
import { inputCheck, valChange } from '../utils/inputValidator';
import PropertyTypes from '../enums/PropertyTypes';
import PropertyList from '../PropertyList';
let $host;
const backIcon = `
  <div id="turn-back-btn">
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
PropertyList(jQuery);
export default function ($) {
    const NAME = 'TokenSetting';
    var TokenSetting = function (element, { group, token }) {
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
        const $previewArea = $('<div class="setting-row preview-area"><div class="preview-box"></div></div>');
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
            return `
          <li>
            <a href="#">${PropertyTypes[type]}</a>
          </li>
        `;
        }));
        const $propertySettingSections = $('<div class="setting-row property-setting-section" />');
        const $settingButtonsRow = $('<div class="setting-row" />');
        const $settingCreateBtn = $(`<button id="property-setting-create" type="button" class="btn btn-sm btn-primary">Create</button>`);
        const $settingCancelBtn = $(`<button id="property-setting-cancel" type="button" class="btn btn-sm btn-border">Cancel</button>`);
        $host = this.$element = $(element)
            .append($headerRow)
            .append($tokenNameRow.append($tokenName.append(this.token.name)))
            .append($descriptionRow.append($description.append(this.token.description)))
            .append($previewArea)
            .append($propertyList)
            .append($createPropertyRow.append($createProperty))
            .append($propertySetting
            .append($propertyTypeRow.append($propertyType
            .append($propertyTypeBtn)
            .append($propertyTypeDropdowns)))
            .append($propertySettingSections)
            .append($settingButtonsRow.append($settingCancelBtn.add($settingCreateBtn))))
            .show();
        Object.assign(this, {
            $tokenName,
            $propertyList,
            $createProperty,
            $propertySetting,
            $propertyTypeRow,
            $propertyTypeBtn,
            $propertySettingSections,
            $settingCreateBtn,
            $settingCancelBtn
        });
        if (!this.token.name) {
            $tokenName.selectText();
            $createProperty.attr('disabled', true);
        }
    };
    TokenSetting.prototype.canAddProperty = function () {
        this.$createProperty.add(this.$settingCreateBtn).attr('disabled', !this.$tokenName.text());
    };
    TokenSetting.prototype.propertyEditToggle = function () {
        this.$createProperty.parent().toggle();
        this.$propertySetting.toggle();
        this.$propertyTypeBtn.val(0).children('span').text('Choose a type of property');
        this.$settingCreateBtn.hide();
        this.$propertySettingSections.toggle().destroy();
    };
    TokenSetting.prototype.choosePropertyType = function (type) {
        this.$propertyTypeBtn.val(type).children('span').text(type);
        this.$settingCreateBtn.show();
        this.$propertySettingSections.destroy();
        if (type === PropertyTypes.CORNER_RADIUS) {
            this.$propertySettingSections.radius();
        }
    };
    TokenSetting.prototype.createProperty = function () {
        const { value } = this.$propertySettingSections.data();
        value.parent = this.token.id;
        this.token.properties.push(value);
        this.$propertySettingSections.destroy();
        this.propertyEditToggle();
        this.$propertyList.propertyList(this.token.properties);
        save();
    };
    TokenSetting.prototype.destroy = function () {
        return this.$element.empty().removeData();
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
            $host.data('TokenSetting').canAddProperty();
        };
    }
    // done
    $(document).on(BrowserEvents.CLICK, '#turn-back-btn', $.debounce(260, function () {
        const { token } = $host.data('TokenSetting');
        $host.trigger('destroy:TokenSetting', [token]).destroy();
    }));
    $(document).on(`${BrowserEvents.KEY_UP}`, '.token-name, .token-description', canAddProperty(inputCheck));
    $(document).on(`${BrowserEvents.BLUR}`, '.token-name, .token-description', canAddProperty(valChange));
    $(document).on(BrowserEvents.CLICK, '#add-property, #property-setting-cancel', function () {
        const { TokenSetting } = $host.data();
        TokenSetting.propertyEditToggle();
    });
    $(document).on(BrowserEvents.CLICK, '#property-type a', function (event) {
        const { TokenSetting } = $host.data();
        TokenSetting.choosePropertyType($(this).text());
    });
    $(document).on(BrowserEvents.CLICK, '#property-setting-create', function () {
        const { TokenSetting } = $host.data();
        TokenSetting.createProperty();
    });
}
(jQuery);
