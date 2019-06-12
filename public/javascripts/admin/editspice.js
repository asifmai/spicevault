$(document).ready(function () {
  $('#flavors.ui.dropdown').dropdown('set selected', spice.flavors);
  $('#ingredients.ui.dropdown').dropdown('set selected', spice.ingredients);
  $('#regions.ui.dropdown').dropdown('set selected', spice.blends);
  
  $('input#image').change(function () {
    readURL(this);
  });

  $('.btn-cancel').click(function (e) { 
    e.preventDefault();
    window.location.href = '/admin/spices'
  });
});

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $('#imgpreview').attr('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  }
};
