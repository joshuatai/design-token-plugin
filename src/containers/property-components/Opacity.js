import validator from 'validator';
import OpacityModel from 'model/Opacity';
import BrowserEvents from 'enums/BrowserEvents';
import { getToken, getPureToken } from 'model/DataManager';
import PropertyTypes from 'enums/PropertyTypes';
import PropertyIcon from './PropertyIcon';
let hostData;
const NAME = 'opacity';
export default function ($) {
    var Opacity = function (element, options) {
        const tokensMap = getPureToken(PropertyTypes.OPACITY);
        let tokenList = Object.keys(tokensMap).map(key => tokensMap[key]);
        const useToken = getToken(options.useToken);
        hostData = this;
        this.options = new OpacityModel(options);
        this.$element = $(element).attr('property-component', NAME).addClass('show');
        this.$customVal = $('<div class="custom-val"></div>');
        this.$valContainer = $('<div class="val-container"></div>');
        this.$opacityIcon = PropertyIcon(this.options).$icon;
        this.$opacityValue = $('<span class="opacity-val"></span>').attr('contenteditable', !useToken);
        this.$detachToken = $(`
      <div class="detach-token">
        <svg class="svg" width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M4 0v3h1V0H4zm9.103.896c-1.162-1.161-3.045-1.161-4.207 0l-2.75 2.75.707.708 2.75-2.75c.771-.772 2.022-.772 2.793 0 .771.77.771 2.021 0 2.792l-2.75 2.75.707.708 2.75-2.75c1.162-1.162 1.162-3.046 0-4.208zM.896 13.103c-1.162-1.161-1.162-3.045 0-4.207l2.75-2.75.707.708-2.75 2.75c-.771.77-.771 2.021 0 2.792.771.772 2.022.772 2.793 0l2.75-2.75.707.707-2.75 2.75c-1.162 1.162-3.045 1.162-4.207 0zM14 10h-3V9h3v1zM10 11v3H9v-3h1zM3 4H0v1h3V4z" fill-rule="nonzero" fill-opacity=".9" fill="#000" stroke="none"></path></svg>
      </div>`);
        this.$useToken = $(`
      <div class="dropdown">
        <div class="use-token" data-toggle="dropdown">
          <svg className="svg" width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M.5 2c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5C3.5 1.172 2.828.5 2 .5 1.172.5.5 1.172.5 2zm6 0c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5C9.5 1.172 8.828.5 8 .5c-.828 0-1.5.672-1.5 1.5zM8 9.5c-.828 0-1.5-.672-1.5-1.5 0-.828.672-1.5 1.5-1.5.828 0 1.5.672 1.5 1.5 0 .828-.672 1.5-1.5 1.5zM.5 8c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5 0-.828-.672-1.5-1.5-1.5C1.172 6.5.5 7.172.5 8z" fill-rule="nonzero" fill-opacity="1" fill="#000" stroke="none"></path></svg>
        </div>
      </div>`);
        this.$tokenList = $('<ul class="dropdown-menu pull-right"></ul>');
        this.$propertyView = this.$element.data('propertyView');
        this.token = this.$element.data('token');
        tokenList = tokenList.filter(token => token.id !== this.token.id);
        this.$element
            .append(this.$customVal
            .append(this.$valContainer
            .append(this.$opacityIcon)
            .append(this.$opacityValue.text(useToken ? useToken.name : `${this.options.opacity}%`))
            .append(tokenList.length ?
            this.$detachToken.add(this.$useToken.append(this.$tokenList.append(tokenList.map(token => $(`<li class="token-item"><a href="#">${token.name}</a></li>`).data('token', token))))) :
            null)));
        this.options.parent = this.token.id;
        useToken ? this.$detachToken.data('token', useToken).show() : this.$detachToken.hide();
        this.$element.data('value', this.options);
        $(document).trigger('property-preview', [this.options]);
    };
    Opacity.prototype.useToken = function (token) {
        const { opacity } = token.properties[0];
        this.options.useToken = token.id;
        this.options.opacity = opacity;
        this.$opacityValue.text(token.name).attr('contenteditable', false);
        this.$detachToken.data('token', token).show();
    };
    Opacity.prototype.detachToken = function (token) {
        const usedProperty = token.properties[0];
        this.options.useToken = '';
        this.$opacityValue.text(usedProperty.opacity).attr('contenteditable', true);
        this.$detachToken.removeData('token').hide();
    };
    Opacity.prototype.destroy = function () {
        return this.$element.removeAttr('property-component').empty().removeData().hide();
    };
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data(NAME);
            var options = typeof option == 'object' && option;
            if (data)
                data.destroy(), data = undefined;
            if (!data)
                $this.data(NAME, (data = new Opacity(this, options)));
        });
    }
    var old = $.fn[NAME];
    $.fn[NAME] = Plugin;
    $.fn[NAME].Constructor = Opacity;
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = old;
        return this;
    };
    $(document).on(BrowserEvents.FOCUS, `[property-component="${NAME}"] [contenteditable="true"]`, function () {
        $(this).selectText();
    });
    $(document).on(`${BrowserEvents.BLUR} ${BrowserEvents.KEY_UP}`, `[property-component="${NAME}"] .opacity-val[contenteditable="true"]`, function (event) {
        if (event.type === BrowserEvents.KEY_UP && event.key !== 'Enter') {
            return;
        }
        const $this = $(this);
        const options = hostData.options;
        let value = $this.text();
        value = value.replace('%', '');
        if (!validator.isInt(value))
            value = options.opacity;
        value = Math.min(Math.max(0, value), 100);
        options.opacity = value;
        $this.text(`${value}%`);
        $(document).trigger('property-preview', [options]);
    });
    $(document).on(BrowserEvents.CLICK, `[property-component="${NAME}"] .token-item`, function (event) {
        hostData.useToken($(this).data('token'));
        $(document).trigger('property-preview', [hostData.options]);
    });
    $(document).on(BrowserEvents.CLICK, `[property-component="${NAME}"] .detach-token`, function (event) {
        hostData.detachToken($(this).data('token'));
    });
    return NAME;
}
(jQuery);
