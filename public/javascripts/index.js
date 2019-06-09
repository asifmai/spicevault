$(document).ready(function () {
  initializeSearchBox();
  $('.filter__select__blends').dropdown('set selected', query.blends);
  $('.filter__select__flavors').dropdown('set selected', query.flavors);
  $('.filter__select__ingredients').dropdown('set selected', query.ingredients);
  $('.filter__select__regions').dropdown('set selected', query.regions);

  $('.btn-cancel').click(function (e) { 
    e.preventDefault();
    window.location.href = '/'
  });
});


function initializeSearchBox() {
  var content = [];
  for (let i = 0; i < allspices.length; i++) {
    content.push({
      title: allspices[i].name,
    });
  }
  $('.ui.search').search({
    source: content
  });
}