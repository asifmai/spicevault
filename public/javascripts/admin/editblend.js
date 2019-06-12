$(document).ready(function () {
  $('#spices.ui.dropdown').dropdown('set selected', blend.spices);

  $('.btn-cancel').click(function (e) { 
    e.preventDefault();
    window.location.href = '/admin/blends'
  });
});