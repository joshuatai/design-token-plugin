import validator from 'validator';
import TextModel from 'model/Text';
import BrowserEvents from 'enums/BrowserEvents';
import { getToken, getFonts } from 'model/DataManager';
import CommonSettings from './CommonSettings';
import FontStyls from 'enums/FontStyles';
let hostData;
const NAME = 'font';
const fontOrders = Object.keys(FontStyls).filter(style => style.match(/[^0-9]/gi));
const getOrder = (styleName) => {
    let order;
    const key = styleName.toLowerCase().replace(/\s/gi, '');
    const matched = fontOrders.filter(style => key.match(style));
    let style;
    if (matched.length) {
        style = matched[0];
        if (matched.length === 2) {
            matched[0].length > matched[1].length ? style = matched[0] : style = matched[1];
        }
    }
    if (style === undefined) {
        if (styleName === 'Italic' ||
            styleName === 'Condensed' ||
            styleName === 'Oblique') {
            order = 9;
        }
        else {
            order = 0;
        }
    }
    else {
        order = FontStyls[style];
    }
    return order;
};
const styleCompare = (a, b) => {
    const aOrder = getOrder(a);
    const bOrder = getOrder(b);
    if (aOrder > bOrder)
        return 1;
    if (aOrder < bOrder)
        return -1;
    return 0;
};
export default function ($) {
    var Text = function (element, options) {
        const useToken = getToken(options.useToken);
        const fontList = getFonts();
        let familyVal;
        hostData = this;
        this.options = new TextModel(options);
        this.$element = $(element).attr('property-component', NAME);
        this.$customVal = $('<div class="custom-val"></div>');
        this.$familyContainer = $('<div class="val-container"></div>');
        this.$familyVal = $('<div class="input-group" />');
        this.$familyValInput = $('<span class="font-family-val" >').attr('contenteditable', true);
        this.$familyDropdownBtnGroup = $(`
      <div class="input-group-btn">
        <button
          type="button"
          class="btn btn-border dropdown-toggle"
          data-toggle="dropdown"
        >
          <i class="tmicon tmicon-caret-down"></i>
          <span></span>
        </button>
      </div>
    `);
        let fonts = Object.keys(fontList).sort(Intl.Collator().compare);
        const dotFonts = [];
        fonts = fonts.filter(font => {
            const match = font.match(/^\./gi);
            if (match)
                dotFonts.push(font);
            return !match;
        });
        // fonts = fonts.concat(...dotFonts);
        this.$familyDropdowns = $('<ul class="dropdown-menu dropdown-menu-multi-select family-dropdowns" />').append(fonts.map((fontName, index) => {
            return $(`<li data-index="${index}"></li>`).append(this[`$fontOption_${fontName}`] = $(`<a href="#">${fontName}</a>`));
        }));
        this.$styleContainer = $('<div class="val-container"></div>');
        this.$styleDropdownBtnGroup = $(`<div class="input-group-btn"></div>`);
        this.$styleDropdownToggleBtn = $(`
      <button
        type="button"
        class="btn btn-border dropdown-toggle style-dropdown-toggle"
        data-toggle="dropdown"
      >
        <i class="tmicon tmicon-caret-down"></i>
      </button>
    `);
        this.$styleName = $('<span></span>');
        this.$styleDropdowns = $('<ul class="dropdown-menu dropdown-menu-multi-select style-dropdown" />');
        this.$fontSize = $(`<span class="font-size-val" contenteditable="true" />`);
        this.$token = CommonSettings(this).$token;
        const { fontName: { family, style } } = this.options;
        useToken ? familyVal = useToken.name : familyVal = family;
        this.$element
            .append(this.$customVal
            .append(this.$familyContainer
            .append(this.$familyVal
            .append(this.$familyValInput
            .text(familyVal).attr('title', familyVal)
            .addClass(this.tokenList.length ? 'hasReferenceToken' : '')
            .add(this.$familyDropdownBtnGroup.append(this.$familyDropdowns))))
            .append(this.$token))
            .append(this.$styleContainer
            .append(this.$styleDropdownBtnGroup
            .append(this.$styleDropdownToggleBtn.prepend(this.$styleName))
            .append(this.$styleDropdowns))
            .append(this.$icon)
            .append(this.$fontSize.text(this.options.fontSize))));
        this.fontList = fontList;
        this.fonts = fonts;
        this.select(this[`$fontOption_${family}`]);
        this.select(this.styles[style]);
    };
    Text.prototype.setStylesList = function (family) {
        const fontStyles = this.fontList[family].map(font => font.style);
        function genStyleList(current, next) {
            if (current.length) {
                return current.sort(styleCompare).map((style) => {
                    const list = $(`<li data-index="${fontIndex}"></li>`)
                        .append((hostData.styles[style] = $(`<a href="#">${style}</a>`)));
                    ++fontIndex;
                    return list;
                }).concat(next ? genDivider(next) : null);
            }
            return null;
        }
        ;
        function genDivider(fonts) {
            const divider = $(`<li data-index="${fontIndex}" class="divider"></li>`);
            if (fonts.length) {
                ++fontIndex;
                return divider;
            }
            return null;
        }
        const italics = [];
        const condenseds = [];
        const weights = fontStyles.filter(style => {
            const matchItalic = style.match(/italic/gi);
            const matchCondenseds = style.match(/condensed/gi);
            if (matchItalic)
                italics.push(style);
            if (matchCondenseds)
                condenseds.push(style);
            return !matchItalic && !matchCondenseds;
        });
        let fontIndex = 0;
        this.styles = {};
        this.$styleDropdowns.empty();
        this.$styleDropdowns.append(genStyleList(condenseds, weights));
        this.$styleDropdowns.append(genStyleList(weights, italics));
        this.$styleDropdowns.append(genStyleList(italics, null));
        this.select(this.styles['Regular'] || this.styles[fontStyles[0]]);
        this.$styleDropdownToggleBtn.attr('disabled', fontStyles.length === 1);
    };
    Text.prototype.select = function ($option, editable = false) {
        const value = $option.text();
        const $dropdowns = $option.closest('.dropdown-menu');
        $dropdowns.children().removeClass('selected');
        $option.parent().addClass('selected');
        if ($dropdowns.is('.family-dropdowns')) {
            this.$familyValInput.text(value);
            if (editable)
                this.options.fontName.family = value;
            this.setStylesList(value);
        }
        else {
            this.$styleName.text(value);
            if (editable)
                this.options.fontName.style = value;
            $(document).trigger('property-preview', [this.options]);
        }
    };
    Text.prototype.useToken = function (token) {
        // const { fontSize } = token.properties[0];
        // this.options.useToken = token.id;
        // this.options.fontSize = fontSize;
        // this.$fontSizeValue.text(token.name).attr('contenteditable', false).attr('title', token.name);
        // this.$detachToken.data('token', token).show();
    };
    Text.prototype.detachToken = function (token) {
        // const usedProperty = token.properties[0];
        // this.options.useToken = '';
        // this.$fontSizeValue.text(usedProperty.fontSize).attr('contenteditable', true).removeAttr('title');
        // this.$detachToken.removeData('token').hide();
    };
    Text.prototype.destroy = function () {
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
                $this.data(NAME, (data = new Text(this, options)));
        });
    }
    var old = $.fn[NAME];
    $.fn[NAME] = Plugin;
    $.fn[NAME].Constructor = Text;
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = old;
        return this;
    };
    let inputTimer;
    let inputText;
    // $(document).on('input', '.font-family-val', function (event) {
    //   const value = this.innerText;
    //   if (inputTimer) clearTimeout(inputTimer);
    //   inputTimer = setTimeout(() => {
    //   //   let matchFonts;
    //   //   if (value) {
    //   //     const reg = new RegExp(`^${value}`, 'i');
    //   //     matchFonts = hostData.fonts.filter((font) => font.match(reg));
    //   //     if (matchFonts) matchFonts = matchFonts[0];
    //   //   } else {
    //   //   }
    //   //   hostData.$familyValInput.text(matchFonts);
    //   //   hostData.$familyValInput.highlight(matchFonts.replace(value, ''));
    //   }, 200);
    // });
    $(document).on(BrowserEvents.CLICK, `[property-component="${NAME}"] .input-group-btn .dropdown-menu a`, function (event) {
        console.log('select');
        hostData.select($(this), true);
    });
    $(document).on(BrowserEvents.FOCUS, `[property-component="${NAME}"] [contenteditable="true"]`, function () {
        $(this).selectText();
    });
    $(document).on(`${BrowserEvents.BLUR} ${BrowserEvents.KEY_UP}`, `[property-component="${NAME}"] .font-size-val[contenteditable="true"]`, function (event) {
        const $this = $(this);
        const options = hostData.options;
        let value = $this.text();
        let oldVal = options.fontSize;
        if (event.type === BrowserEvents.KEY_UP) {
            if (event.key === 'Enter')
                $this.trigger('blur');
            return;
        }
        if (validator.isInt(value)) {
            value = Math.max(1, Number(value));
            options.fontSize = value;
        }
        else {
            $this.text(oldVal);
        }
        $(document).trigger('property-preview', [options]);
    });
    return NAME;
}
(jQuery);
