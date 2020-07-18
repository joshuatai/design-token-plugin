import validator from 'validator';
import StrokeWidthAlign from 'model/StrokeWidthAlign';
import BrowserEvents from 'enums/BrowserEvents';
import { getToken, getPureToken } from 'model/DataManager';
import PropertyTypes from 'enums/PropertyTypes';
import StrokeAligns from 'enums/StrokeAligns';
let hostData;
const NAME = 'stroke';
export const icon = '<span class="stroke-width-icon"></span>';
export default function ($) {
    console.log($);
    var Stroke = function (element, options) {
        const tokensMap = getPureToken(PropertyTypes.STROKE_WIDTH_ALIGN);
        const tokenList = Object.keys(tokensMap).map(key => tokensMap[key]);
        const useToken = getToken(options.useToken);
        hostData = this;
        this.options = new StrokeWidthAlign(options);
        this.$element = $(element).attr('property-component', NAME).addClass('show');
        this.$customVal = $('<div class="custom-val"></div>');
        this.$valContainer = $('<div class="val-container"></div>');
        this.$StokeIcon = $(icon);
        this.$stokeValue = $('<span class="stroke-val"></span>').attr('contenteditable', !useToken);
        this.$align = $('<div class="stroke-align btn-group" />');
        this.$alignDropdownBtn = $(`
      <button type="button" class="btn btn-border dropdown-toggle" data-toggle="dropdown">
        <span class="tmicon tmicon-caret-down"></span>

      </button>
    `);
        this.$alignDropdownBtnVal = $(`<span>${this.options.align}</span>`);
        this.$alignDropdowns = $(`<ul class="dropdown-menu pull-right" />`);
        this.$alignOptions = Object.keys(StrokeAligns).reduce((calc, key) => calc.add($(`<li><a href="#">${key}</a></li>`)), $());
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
        this.$element
            .append(this.$customVal
            .append(this.$valContainer
            .append(this.$StokeIcon)
            .append(this.$stokeValue.text(useToken ? useToken.name : this.options.width))
            .append(tokenList.length ?
            this.$detachToken.add(this.$useToken.append(this.$tokenList.append(tokenList.filter(token => token.id !== this.token.id).map(token => $(`<li class="token-item"><a href="#">${token.name}</a></li>`).data('token', token))))) :
            null))
            .append(this.$align
            .append(this.$alignDropdownBtn.append(this.$alignDropdownBtnVal))
            .append(this.$alignDropdowns.append(this.$alignOptions)))
        // .append(
        //   this.$separateSetting
        //     .append(this.$separateIcon)
        //     .append(
        //       this.$separatorGroup.append(
        //         (this.$separateRadius = separators.reduce((calc, separator) => {
        //           return calc.add($(`<div class="btn" data-separate-type="${separator}" contenteditable="true">${this.options[camelize(separator)]}</div>`))
        //         }, $()))
        //       )
        //     )
        // )
        );
        this.options.parent = this.token.id;
        useToken ? this.$detachToken.data('token', useToken).show() : this.$detachToken.hide();
        this.$element.data('value', this.options);
        $(document).trigger('property-preview', [this.options]);
    };
    Stroke.prototype.useToken = function (token) {
        const { width, align } = token.properties[0];
        Object.assign(this.options, {
            useToken: token.id, width, align
        });
        this.$stokeValue.text(token.name).attr('contenteditable', false);
        this.$detachToken.data('token', token).show();
    };
    Stroke.prototype.detachToken = function (token) {
        const usedProperty = token.properties[0];
        this.options.useToken = '';
        this.$stokeValue.text(usedProperty.width).attr('contenteditable', true);
        this.$detachToken.removeData('token').hide();
    };
    Stroke.prototype.destroy = function () {
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
                $this.data(NAME, (data = new Stroke(this, options)));
        });
    }
    var old = $.fn[NAME];
    $.fn[NAME] = Plugin;
    $.fn[NAME].Constructor = Stroke;
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = old;
        return this;
    };
    $(document).on(BrowserEvents.CLICK, `[property-component="${NAME}"] [contenteditable="true"]`, function () {
        $(this).selectText();
    });
    $(document).on(`${BrowserEvents.BLUR} ${BrowserEvents.KEY_UP}`, `[property-component="${NAME}"] .stroke-val[contenteditable="true"]`, function (event) {
        if (event.type === BrowserEvents.KEY_UP && event.key !== 'Enter') {
            return;
        }
        const $this = $(this);
        const options = hostData.options;
        const value = $this.text();
        const oldVal = options.width;
        if (validator.isInt(value)) {
            options.width = Number(value);
            hostData.$stokeValue.text(value);
        }
        else {
            $this.text(oldVal);
        }
        $(document).trigger('property-preview', [options]);
    });
    $(document).on(BrowserEvents.CLICK, '.stroke-align .dropdown-menu li a', function (event) {
        hostData.options.align = this.textContent;
        hostData.$alignDropdownBtnVal.text(this.textContent);
        $(document).trigger('property-preview', [hostData.options]);
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
