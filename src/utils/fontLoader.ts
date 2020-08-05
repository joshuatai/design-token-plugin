const $head = $("head");
let $link;

export default function (family) {
  let hasFont = false;

  if ($link && $link.length) $link.remove();
  try {
    hasFont = (document as any).fonts.check(`14px ${family}`);
  } catch (e) {}

  if (!hasFont) {
    $head.append(
      $(
        `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=${family.replace(
          /Medium|SemiBold|ExtraBold/gi,
          ""
        )}">`
      )
    );
  }
}
