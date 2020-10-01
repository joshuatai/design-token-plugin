export default function ($) {
  if ($.fn.selectText) return;
  $.fn.selectText = function () {
    return this.each(function () {
      const $this = $(this);
      if (this === document.activeElement) return;
      if (!$this.is(':focus')) $this.trigger("focus");

      $this.attr("contenteditable", "true");
      let range, selection;
      if (window.getSelection) {
        window.setTimeout(function() {
          selection = window.getSelection();
          range = document.createRange();
          range.selectNodeContents($this[0]);
          selection.removeAllRanges();
          selection.addRange(range);
        }, 1)
      }
    });
  };
}(jQuery);
