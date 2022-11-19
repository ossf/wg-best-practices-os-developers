$(document).ready(function () {
  // ===== Toggle Class Function =====

  $(document).on("click", '[data-toggle="class"]', function () {
    var $target = $($(this).data("target"));
    var classes = $(this).data("classes");
    $target.toggleClass(classes);
    return false;
  });

  // ===== ScrollTo =====

  $(document).on("click", ".scroll a[href^=\\#]", function (e) {
    e.preventDefault();
    var dest = $(this).attr("href");
    $.scrollTo($(dest), 800);
  });

  // ===== Infinity Animation =====

  infinity = setInterval(updateInfinity, 1600);

  function updateInfinity() {
    $(".infinity").addClass("pulse");
    setTimeout(function () {
      $(".infinity").removeClass("pulse");
    }, 800);
  }

  // ===== Infinity Popup =====

  $(document).on("click", ".infinity a, .legend a", function (e) {
    $(".pop").removeClass("act").removeClass("ani");
    var uid = $(this).data("target");
    $("#" + uid).addClass("act");
    setTimeout(function () {
      $("#" + uid).addClass("ani");
    }, 100);
  });

  $(document).on("click", ".pop .close, .pop .outer", function (e) {
    $(".pop").removeClass("ani");
    setTimeout(function () {
      $(".pop").removeClass("act");
    }, 100);
  });

  // ===== Tooltip =====

  tippy("[data-tippy-content]", {
    followCursor: true,
  });
});
