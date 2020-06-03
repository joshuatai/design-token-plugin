import validator from 'validator';
import CornerRadius from './CornerRadius';
import camelize from './utils/camelize';
import BrowserEvents from './BrowserEvents';
import { Mixed } from './symbols';
//<div>
//       <div className="custom-val">
//         <button id="separator-toggle" type="button" className="btn separator-icon" data-toggle="button" aria-pressed="false" autoComplete="off"></button>
//         <div className="val-container">
//           <div className="corner-radius-icon"></div>
//           <span className="corner-radius-val">0</span>
//           <div className="use-token"></div>
//         </div>
//         <div className="separator-vals">
//           
//           <div className="btn-group">
//             <div className="btn" data-separate-type="top-left">0</div>
//             <div className="btn" data-separate-type="top-right">0</div>
//             <div className="btn" data-separate-type="bottom-right">0</div>
//             <div className="btn" data-separate-type="bottom-left">0</div>
//           </div>
//         </div>
//       </div>
//       <div className="token-val">
//         <div className="corner-radius-icon"></div>
//         <div className="use-token"></div>
//       </div>
//     </div>
const separators = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];
export default function ($) {
    const NAME = 'radius';
    const DEFAULTS = new CornerRadius();
    var Radius = function (element, options) {
        this.$element = $(element).attr('property-component', NAME).addClass('show');
        this.$customVal = $('<div class="custom-val"></div>');
        this.$valContainer = $('<div class="val-container"></div>');
        this.$radiusIcon = $('<div class="corner-radius-icon"></div>');
        this.$radiusValue = $('<span class="corner-radius-val" contenteditable="true"></span>');
        this.$useToken = $('<div class="use-token"><svg className="svg" width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M.5 2c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5C3.5 1.172 2.828.5 2 .5 1.172.5.5 1.172.5 2zm6 0c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5C9.5 1.172 8.828.5 8 .5c-.828 0-1.5.672-1.5 1.5zM8 9.5c-.828 0-1.5-.672-1.5-1.5 0-.828.672-1.5 1.5-1.5.828 0 1.5.672 1.5 1.5 0 .828-.672 1.5-1.5 1.5zM.5 8c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5 0-.828-.672-1.5-1.5-1.5C1.172 6.5.5 7.172.5 8z" fill-rule="nonzero" fill-opacity="1" fill="#000" stroke="none"></path></svg></div>');
        this.$separateToggle = $('<button id="separator-toggle" type="button" class="btn separator-icon" data-toggle="button" aria-pressed="false" autoComplete="off"><svg class="svg" width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h3v1H1v2H0V0zm7 0h3v3H9V1H7V0zM1 9V7H0v3h3V9H1zm9-2v3H7V9h2V7h1z" fill-rule="nonzero" fill-opacity="1" fill="#000" stroke="none"></path></svg></button>');
        this.$separateSetting = $('<div class="separator-vals"></div>');
        this.$separateIcon = $('<i class="separator-mode-sign" separate-type="top-left"></i>');
        this.$separatorGroup = $('<div class="btn-group"></div>');
        this.$separateRadius;
        this.options = $.extend({}, DEFAULTS, options);
        this.$element.append(this.$customVal
            .append(this.$separateToggle)
            .append(this.$valContainer
            .append(this.$radiusIcon)
            .append(this.$radiusValue.text(options.radius).data('target', this))
            .append(this.$useToken))
            .append(this.$separateSetting
            .append(this.$separateIcon)
            .append(this.$separatorGroup.append((this.$separateRadius = separators.reduce((calc, separator) => {
            return calc.add($(`<div class="btn" data-separate-type="${separator}" contenteditable="true">${this.options[camelize(separator)]}</div>`).data('target', this));
        }, $()))))));
    };
    Radius.prototype.destroy = function () {
        return this.$element.removeAttr('property-component').empty();
    };
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('radius');
            var options = typeof option == 'object' && option;
            if (data)
                data.destroy(), data = undefined;
            if (!data)
                $this.data('radius', (data = new Radius(this, options)));
            // if (option == 'toggle') data.toggle()
            // else if (option) data.setState(option)
        });
    }
    var old = $.fn.radius;
    $.fn.radius = Plugin;
    $.fn.radius.Constructor = Radius;
    $.fn.radius.noConflict = function () {
        $.fn.radius = old;
        return this;
    };
    $(document).on(BrowserEvents.CLICK, `[property-component="${NAME}"] [contenteditable]`, function () {
        $(this).selectText();
    });
    $(document).on(BrowserEvents.CLICK, `[property-component="${NAME}"] [data-separate-type]`, function () {
        const separateBtn = $(this);
        const { target } = separateBtn.data();
        target.$separateIcon.attr('separate-type', separateBtn.data('separate-type'));
    });
    $(document).on(BrowserEvents.BLUR, `[property-component="${NAME}"] .corner-radius-val`, function () {
    });
    $(document).on(BrowserEvents.BLUR, `[property-component="${NAME}"] .separator-vals [data-separate-type], [property-component="${NAME}"] .corner-radius-val`, function () {
        const $this = $(this);
        const { target, separateType } = $this.data();
        const options = target.options;
        const value = Number($this.text());
        let oldVal;
        if (separateType) {
            oldVal = options[camelize(separateType)];
            if (validator.isInt(String(value))) {
                options[camelize(separateType)] = value;
                const uniqueValues = [...new Set(separators.map(type => options[camelize(type)]))
                ];
                if (uniqueValues.length === 1) {
                    target.$radiusValue.text(value);
                    options.radius = value;
                }
                else {
                    target.$radiusValue.text('Mixed');
                    options.radius = Mixed;
                }
            }
            else {
                $this.text(oldVal);
            }
        }
        else {
            oldVal = options.radius;
            if (validator.isInt(String(value))) {
                options.radius = value;
                separators.forEach(type => {
                    options[camelize(type)] = value;
                });
                target.$separateRadius.text(value);
            }
            else {
                if (typeof oldVal === 'symbol') {
                    $this.text('Mixed');
                }
                else {
                    $this.text(oldVal);
                }
            }
        }
    });
    // $(document)
    //   .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    //     var $btn = $(e.target).closest('.btn')
    //     Plugin.call($btn, 'toggle')
    //     if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
    //       // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
    //       e.preventDefault()
    //       // The target component still receive the focus
    //       if ($btn.is('input,button')) $btn.trigger('focus')
    //       else $btn.find('input:visible,button:visible').first().trigger('focus')
    //     }
    //   })
    //   .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    //     $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    //   })
}
(jQuery);
