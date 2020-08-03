import validator from 'validator';
import TextModel from 'model/Text';
import BrowserEvents from 'enums/BrowserEvents';
import { getToken, getPureToken, getFonts } from 'model/DataManager';
import PropertyTypes from 'enums/PropertyTypes';
import PropertyIcon from './PropertyIcon';
import Token from './Token';
import FontStyls from 'enums/FontStyles';

declare function require(path: string): any

let hostData;
const NAME = 'font';

const styleCompare = (a, b) => {
  if (FontStyls[a] > FontStyls[b]) return 1;
  if (FontStyls[a] < FontStyls[b]) return -1;
  return 0;
};

export default function ($) {
  var Text = function (element, options) {
    const useToken = getToken(options.useToken);
    const fontList = getFonts();
    let familyVal;

    hostData = this;
    this.options   = new TextModel(options);
    this.$element  = $(element).attr('property-component', NAME).addClass('show');
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
      const match  = font.match(/^\./gi);
      if (match) dotFonts.push(font);
      return !match;
    });
    fonts = fonts.concat(...dotFonts);
    this.$familyDropdowns = $('<ul class="dropdown-menu dropdown-menu-multi-select" />').append(
      fonts.map((fontName, index) => {
        return (this[`$fontOption_${fontName}`] = $(`<li data-index="${index}"><a href="#">${fontName}</a></li>`));
      })
    );
    
    this.$styleContainer = $('<div class="val-container"></div>');
    this.$styleDropdownBtnGroup = $(`<div class="input-group-btn"></div>`);
    this.$styleDropdownToggleBtn = $(`
      <button
        type="button"
        class="btn btn-border dropdown-toggle"
        data-toggle="dropdown"
      >
        <i class="tmicon tmicon-caret-down"></i>
      </button>
    `);
    this.$styleName = $('<span></span>');
    this.$styleDropdowns = $('<ul class="dropdown-menu dropdown-menu-multi-select style-dropdown" />');
    this.$propertyView = this.$element.data('propertyView');
    this.tokensMap = getPureToken(PropertyTypes.TEXT);
    this.$token = Token(this);

    useToken ? familyVal = useToken.name : familyVal = this.options.fontName.family;

    this.$element
      .append(
        this.$customVal
          .append(
            this.$familyContainer
              .append(
                this.$familyVal
                  .append(
                    this.$familyValInput.text(familyVal).attr('title', familyVal)
                    .add(
                      this.$familyDropdownBtnGroup.append(this.$familyDropdowns)
                    )
                  )
                  .addClass(this.tokenList.length ? 'hasReferenceToken' : '')
              )
              .append(this.$token)
          )
          .append(
            this.$styleContainer.append(
              this.$styleDropdownBtnGroup
                .append(this.$styleDropdownToggleBtn.prepend(this.$styleName))
                .append(this.$styleDropdowns))
          )
      );
    this.fontList = fontList;
    this.fonts = fonts;
    this.setFontStyles(this.options.fontName.family);
    $(document).trigger('property-preview', [this.options]);
  }
  Text.prototype.setFontStyles = function (family) {
    const fontStyles = this.fontList[family].map(font => font.style);
    const italics = [];
    const weights = fontStyles.filter(style => { 
      const matchItalic = style.match(/italic/gi);
      if (matchItalic) italics.push(matchItalic[0]);
      return !matchItalic;
    });
    
    this.$styleDropdowns
      .empty()
      .append(
        weights.length &&
        weights.sort(styleCompare)
          .map((style, index) => {
            return $(`<li data-index="${index}"><a href="#">${style}</a></li>`);
          })
      );
    
    italics.length && this.$styleDropdowns
      .append(
        $(`<li data-index="${weights.length + 1}" class="divider"></li>`)
      )
      .append(
        italics.sort(styleCompare)
          .map((style, index) => {
            return $(`<li data-index="${weights.length + 2 + index}"><a href="#">${style}</a></li>`);
          })
      );

    this.$styleName.text('Regular');
    this.$styleDropdownToggleBtn.attr('disabled', fontStyles.length === 1);
  }
  Text.prototype.useToken = function (token) {
    // const { fontSize } = token.properties[0];
    // this.options.useToken = token.id;
    // this.options.fontSize = fontSize;
    // this.$fontSizeValue.text(token.name).attr('contenteditable', false).attr('title', token.name);
    // this.$detachToken.data('token', token).show();
  }
  Text.prototype.detachToken = function (token) {
    // const usedProperty = token.properties[0];
    // this.options.useToken = '';
    // this.$fontSizeValue.text(usedProperty.fontSize).attr('contenteditable', true).removeAttr('title');
    // this.$detachToken.removeData('token').hide();
  }
  Text.prototype.destroy = function () {
    return this.$element.removeAttr('property-component').empty().removeData().hide();
  }
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data(NAME);
      var options = typeof option == 'object' && option;

      if (data) data.destroy(), data = undefined;
      if (!data) $this.data(NAME, (data = new Text(this, options)));
    })
  }

  var old = $.fn[NAME];

  $.fn[NAME]             = Plugin;
  $.fn[NAME].Constructor = Text;

  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = old;
    return this
  }

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
    const value = this.innerText;
    hostData.$familyValInput.text(value);
    hostData.$familyDropdowns.children().removeClass('selected');
    $(this).parent().addClass('selected');
    hostData.setFontStyles(value);
  });
  $(document).on(BrowserEvents.FOCUS, `[property-component="${NAME}"] [contenteditable="true"]`, function () {
    $(this).selectText();
  });
  $(document).on(`${BrowserEvents.BLUR} ${BrowserEvents.KEY_UP}`, `[property-component="${NAME}"] .font-size-val[contenteditable="true"]`, function (event) {
    if (event.type === BrowserEvents.KEY_UP && event.key !== 'Enter') {
      return;
    }
    const $this = $(this);
    const options = hostData.options;
    let value =  $this.text();
    if (!validator.isInt(value)) value = options.fontSize;
    value = Math.max(1, value);
    options.fontSize = value;
    $this.text(value);
    $(document).trigger('property-preview', [options]);
  });
  return NAME;
}(jQuery);

