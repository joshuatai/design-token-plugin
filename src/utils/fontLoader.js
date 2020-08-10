const $head = $("head");
let $link;
export default function (family) {
    let hasFont = false;
    const _document = document;
    if ($link && $link.length)
        $link.remove();
    try {
        hasFont = _document.fonts.check(`14px ${family}`);
    }
    catch (e) { }
    if (!hasFont) {
        $link = $(`<link id="load-font" rel="stylesheet" href="https://fonts.googleapis.com/css?family=${family.replace(/Medium|SemiBold|ExtraBold/gi, "")}">`);
        $head.append($link);
    }
}
