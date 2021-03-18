"use strict";

$("#thum").change(function () {
  if (!this.files.length) {
    return;
  }
  var file = $(this).prop("files")[0];
  var fr = new FileReader();
  $(".title-images").css("background-image", "none");
  fr.onload = function () {
    $(".title-images").css("background-image", "url(" + fr.result + ")");
  };
  fr.readAsDataURL(file);
  $(".title-images img").css("opacity", 0);
});
