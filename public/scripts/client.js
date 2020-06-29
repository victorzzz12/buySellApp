$(document).ready(() => {
  console.log('jQuery is go');

  //This section renders featured products on pageload

  const renderFeaturedProducts = (e) => {
    const $featuredProducts = $(`
    <div class="container" id="products">
    <div class="row product-row justify-content-left">
      <div class="col-6 col-sm-4 col-md-3">
        <a href><div class="product-display">
          <img src="${e.products[0].photo_url}" alt="item">
          <p>${e.products[0].name}</p>
          <p>${e.products[0].price}</p>
          <p>${e.products[0].admin_id}</p>
        </div></a>
      </div>
    </div>`);
    $('.main-container').append($featuredProducts);
    console.log(e.products[0].photo_url);
  }

  function loadFeaturedProducts() {
    $.ajax("/api/products/", { method: "GET" })
    .then((data) => {
      renderFeaturedProducts(data);
    })
  }
  loadFeaturedProducts();

//This section brings up the "home interface" when the home logo is clicked

  $('.home-button').on('click', function(event) {
    event.preventDefault();
    $('.main-container').empty();
    loadFeaturedProducts();
  });
//This section replaces whatever's in the .main-container with an individual product

  const renderProductPopup = function() {
    const $productPopup = $(`<div class="container product-popup">
      <h1>Embroidered Shirt</h1>
      <img src="https://i.etsystatic.com/20553919/r/il/729255/2292852133/il_1588xN.2292852133_2xr2.jpg" alt="cute embroidered shirt">
      <h2>SOLD</h2>
      <a href="#"><p>Message seller</p></a>
      <p>This is the description</p>
      <p>Listed by: Eileen</p>
      <p>Listed on: date</p>
      </div>
    `);
    $('.main-container').append($productPopup);
  };

  $(document).on('click','.product-display', function(event) {
    event.preventDefault();
    $('.main-container').empty();
    renderProductPopup();
  });
});
