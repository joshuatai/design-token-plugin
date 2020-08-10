export default function ($) {
  $.fn.selectText = function () {
    return this.each(function () {
      const $this = $(this);
      if (!$this.is(':focus')) $this.trigger("focus");

      $this.attr("contenteditable", "true");
      
      let range, selection;
      if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(this);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
  };
}(jQuery);
