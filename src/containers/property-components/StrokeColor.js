let hostData;
const NAME = 'radius';
const separators = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];
export const icon = '<span class="corner-radius-icon"></span>';
export default function ($) {
    var Radius = function (element, options) {
        // const tokensMap = getPureToken(PropertyTypes.CORNER_RADIUS);
        // const tokenList = Object.keys(tokensMap).map(key => tokensMap[key]);
        // const useToken = getToken(options.useToken);
        // hostData = this;
        // this.options   = new CornerRadius(options);
        // this.$element  = $(element).attr('property-component', NAME).addClass('show');
        // this.$customVal = $('<div class="custom-val"></div>');
        // this.$valContainer = $('<div class="val-container"></div>');
        // this.$radiusIcon = $(icon);
        // this.$radiusValue = $('<span class="corner-radius-val"></span>').attr('contenteditable', !useToken);
        // this.$detachToken = $(`
        //   <div class="detach-token">
        //     <svg class="svg" width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M4 0v3h1V0H4zm9.103.896c-1.162-1.161-3.045-1.161-4.207 0l-2.75 2.75.707.708 2.75-2.75c.771-.772 2.022-.772 2.793 0 .771.77.771 2.021 0 2.792l-2.75 2.75.707.708 2.75-2.75c1.162-1.162 1.162-3.046 0-4.208zM.896 13.103c-1.162-1.161-1.162-3.045 0-4.207l2.75-2.75.707.708-2.75 2.75c-.771.77-.771 2.021 0 2.792.771.772 2.022.772 2.793 0l2.75-2.75.707.707-2.75 2.75c-1.162 1.162-3.045 1.162-4.207 0zM14 10h-3V9h3v1zM10 11v3H9v-3h1zM3 4H0v1h3V4z" fill-rule="nonzero" fill-opacity=".9" fill="#000" stroke="none"></path></svg>
        //   </div>`
        // );
        // this.$useToken = $(`
        //   <div class="dropdown">
        //     <div class="use-token" data-toggle="dropdown">
        //       <svg className="svg" width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M.5 2c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5C3.5 1.172 2.828.5 2 .5 1.172.5.5 1.172.5 2zm6 0c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5C9.5 1.172 8.828.5 8 .5c-.828 0-1.5.672-1.5 1.5zM8 9.5c-.828 0-1.5-.672-1.5-1.5 0-.828.672-1.5 1.5-1.5.828 0 1.5.672 1.5 1.5 0 .828-.672 1.5-1.5 1.5zM.5 8c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5 0-.828-.672-1.5-1.5-1.5C1.172 6.5.5 7.172.5 8z" fill-rule="nonzero" fill-opacity="1" fill="#000" stroke="none"></path></svg>
        //     </div>
        //   </div>`
        // );
        // this.$tokenList = $('<ul class="dropdown-menu pull-right"></ul>');
        // this.$separateToggle = $('<button id="separator-toggle" type="button" class="btn separator-icon" data-toggle="button" aria-pressed="false" autoComplete="off"><svg class="svg" width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h3v1H1v2H0V0zm7 0h3v3H9V1H7V0zM1 9V7H0v3h3V9H1zm9-2v3H7V9h2V7h1z" fill-rule="nonzero" fill-opacity="1" fill="#000" stroke="none"></path></svg></button>');
        // this.$separateSetting =  $('<div class="separator-vals"></div>');
        // this.$separateIcon = $('<i class="separator-mode-sign" separate-type="top-left"></i>');
        // this.$separatorGroup = $('<div class="btn-group"></div>');
        // this.$separateRadius;
        // this.$propertyView = this.$element.data('propertyView');
        // this.token = this.$element.data('token');
        // this.$element
        //   .append(
        //     this.$customVal
        //       .append(this.$separateToggle[useToken ? 'hide' : 'show']())
        //       .append(
        //         this.$valContainer
        //           .append(this.$radiusIcon)
        //           .append(
        //             this.$radiusValue.text(
        //               useToken ?
        //               useToken.name :
        //               typeof this.options.radius === 'number' ?
        //               this.options.radius :
        //               'Mixed'
        //             )
        //           )
        //           .append(
        //             tokenList.length ?
        //             this.$detachToken.add(this.$useToken.append(
        //               this.$tokenList.append(
        //                 tokenList.filter(token => token.id !== this.token.id).map(token => $(`<li class="token-item"><a href="#">${token.name}</a></li>`).data('token', token))
        //               )
        //             )) :
        //             null
        //           )
        //       )
        //       .append(
        //         this.$separateSetting
        //           .append(this.$separateIcon)
        //           .append(
        //             this.$separatorGroup.append(
        //               (this.$separateRadius = separators.reduce((calc, separator) => {
        //                 return calc.add($(`<div class="btn" data-separate-type="${separator}" contenteditable="true">${this.options[camelize(separator)]}</div>`))
        //               }, $()))
        //             )
        //           )
        //       )
        //   );
        // this.options.parent = this.token.id;
        // useToken ? this.$detachToken.data('token', useToken).show() : this.$detachToken.hide();
        // this.$element.data('value', this.options);
        // $(document).trigger('property-preview', [this.options]);
    };
    Radius.prototype.useToken = function (token) {
        // const { radius, topLeft, topRight, bottomRight, bottomLeft } = token.properties[0];
        // Object.assign(this.options, {
        //   useToken: token.id,
        //   radius,
        //   topLeft,
        //   topRight,
        //   bottomRight,
        //   bottomLeft
        // });
        // this.$radiusValue.text(token.name).attr('contenteditable', false);
        // this.$detachToken.data('token', token).show();
        // this.$separateToggle.hide();
    };
    Radius.prototype.detachToken = function (token) {
        // const usedProperty = token.properties[0];
        // this.options.useToken = '';
        // this.$radiusValue.text(typeof usedProperty.radius === 'symbol' ? 'Mixed' : usedProperty.radius).attr('contenteditable', true);
        // separators.forEach(type => {
        //   $(`[data-separate-type="${type}"]`).text(this.options[camelize(type)]);
        // })
        // this.$detachToken.removeData('token').hide();
        // this.$separateToggle.show();
    };
    Radius.prototype.destroy = function () {
        // return this.$element.removeAttr('property-component').empty().removeData().hide();
    };
    function Plugin(option) {
        // return this.each(function () {
        //   var $this   = $(this)
        //   var data    = $this.data(NAME);
        //   var options = typeof option == 'object' && option;
        //   if (data) data.destroy(), data = undefined;
        //   if (!data) $this.data(NAME, (data = new Radius(this, options)));
        // })
    }
    var old = $.fn[NAME];
    $.fn[NAME] = Plugin;
    $.fn[NAME].Constructor = Radius;
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = old;
        return this;
    };
    // $(document).on(BrowserEvents.FOCUS, `[property-component="${NAME}"] [contenteditable="true"]`, function () {
    //   $(this).selectText();
    // });
    // $(document).on(BrowserEvents.CLICK, `[property-component="${NAME}"] [data-separate-type]`, function () {
    //   const separateBtn = $(this);
    //   hostData.$separateIcon.attr('separate-type', separateBtn.data('separate-type'));
    // });
    // $(document).on(`${BrowserEvents.BLUR} ${BrowserEvents.KEY_UP}`, `[property-component="${NAME}"] .separator-vals [data-separate-type], [property-component="${NAME}"] .corner-radius-val[contenteditable="true"]`, function (event) {
    //   if (event.type === BrowserEvents.KEY_UP && event.key !== 'Enter') {
    //     return;
    //   }
    //   const $this = $(this);
    //   const { separateType } = $this.data();
    //   const options = hostData.options;
    //   const value =  $this.text();
    //   let oldVal;
    //   if (separateType) {
    //     oldVal = options[camelize(separateType)];
    //     if (validator.isInt(value)) {
    //       options[camelize(separateType)] = Number(value);
    //       const uniqueValues = [...new Set(
    //           separators.map(type => options[camelize(type)])
    //         )
    //       ];
    //       if (uniqueValues.length === 1) {
    //         hostData.$radiusValue.text(value);
    //         options.radius = Number(value);
    //       } else {
    //         hostData.$radiusValue.text('Mixed');
    //         options.radius = Mixed;
    //       }
    //     } else {
    //       $this.text(oldVal);
    //     }
    //   } else {
    //     oldVal = options.radius;
    //     if (validator.isInt(value)) {
    //       options.radius = Number(value);
    //       separators.forEach(type => {
    //         options[camelize(type)] = Number(value);
    //       });
    //       hostData.$separateRadius.text(value);
    //     } else {
    //       if (typeof oldVal === 'symbol') {
    //         $this.text('Mixed');
    //       } else {
    //         $this.text(oldVal);
    //       }
    //     }
    //   }
    //   $(document).trigger('property-preview', [options]);
    // });
    // $(document).on(BrowserEvents.CLICK, `[property-component="${NAME}"] .token-item`, function (event) {
    //   hostData.useToken($(this).data('token'));
    //   $(document).trigger('property-preview', [hostData.options]);
    // });
    // $(document).on(BrowserEvents.CLICK, `[property-component="${NAME}"] .detach-token`, function (event) {
    //   hostData.detachToken($(this).data('token'));
    // });
    return NAME;
}
(jQuery);
