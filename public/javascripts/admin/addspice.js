$(document).ready(function () {
  $('.ui.dropdown').dropdown();

  
  $('.btn-cancel').click(function (e) { 
    e.preventDefault();
    window.location.href = '/admin/spices'
  });
});