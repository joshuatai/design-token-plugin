export default function ($) {
  $.fn.selectText = function () {
    return this.each(function () {
      $(this).attr("contenteditable", "true").trigger("focus");

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
