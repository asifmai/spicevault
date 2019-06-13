$(document).ready(function () {
  if (query.spiceblend !== 'blends') {
    $('.filter__select__flavors').dropdown('set selected', query.flavors);
    $('.filter__select__ingredients').dropdown('set selected', query.ingredients);
    $('.filter__select__regions').dropdown('set selected', query.regions);
  }

  console.log(query)
  $('a.dropdown-item').click(function (e) { 
    e.preventDefault();
    $('button.dropdown-toggle').text($(this).text());
    $('a.dropdown-item').removeClass('active');
    $(this).addClass('active');
    if ($(this).hasClass('blends')) {
      $('.filters__wrapper').css('display', 'none');
      $('input.spiceblendinput').val('blends');
      $('.filter__select__flavors').dropdown('clear');
      $('.filter__select__ingredients').dropdown('clear');
      $('.filter__select__regions').dropdown('clear');
      $('input.searchbox').val('')
    } else {
      $('.filters__wrapper').css('display', 'flex')
      $('input.spiceblendinput').val('spices');
      $('input.searchbox').val('')
    }
    $('.btn-apply').click();
  });

  if (query.spiceblend) {
    if (query.spiceblend === 'spices') {
      $('a.dropdown-item').removeClass('active');
      $('a.dropdown-item.spices').addClass('active');
      $('button.dropdown-toggle').text('Spices/Herbs');
      $('input.spiceblendinput').val('spices');
      $('.filters__wrapper').css('display', 'flex');
    } else {
      $('a.dropdown-item').removeClass('active');
      $('a.dropdown-item.blends').addClass('active');
      $('button.dropdown-toggle').text('Blends');
      $('input.spiceblendinput').val('blends');
      $('.filters__wrapper').css('display', 'none')
    }
  }

  $('.btn-cancel').click(function (e) { 
    e.preventDefault();
    window.location.href = '/'
  });
});