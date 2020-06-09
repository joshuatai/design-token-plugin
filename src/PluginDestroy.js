export default function ($) {
    function Plugin() {
        return this.each(function () {
            const data = $(this).data();
            for (let item in data) {
                if (data[item].destroy)
                    data[item].destroy();
            }
        });
    }
    var old = $.fn.destroy;
    $.fn.destroy = Plugin;
    $.fn.destroy.noConflict = function () {
        $.fn.destroy = old;
        return this;
    };
}
jQuery;
