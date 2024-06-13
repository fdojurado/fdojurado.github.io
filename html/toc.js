$(document).ready(function () {
  var defaultItem = $(".toc a").first();
  //   disable all active classes
  $(".toc a").each(function () {
    $(this).removeClass("active");
  });
  defaultItem.addClass("active");
  var lastActive = null;
  $(window).scroll(function () {
    var scrollPos = $(document).scrollTop() + $(window).height() / 2;
    $(".toc a").each(function () {
      var currLink = $(this);
      var refId = currLink.attr("href").split("#")[1];
      var refElement = $("#" + refId);
      if (
        refElement.position().top <= scrollPos &&
        refElement.position().top + refElement.height() > scrollPos
      ) {
        if (lastActive) {
          lastActive.removeClass("active");
        }
        currLink.addClass("active");
        lastActive = currLink;
        if (!currLink.is(defaultItem)) {
          defaultItem.removeClass("active");
        }
      }
    });
  });
});
