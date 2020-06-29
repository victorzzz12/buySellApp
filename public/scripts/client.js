$(document).ready(() => {
  console.log('jQuery is go');


  const $main = $('.product-row');

  //This section renders featured products on pageload

  const renderFeaturedProducts = (e) => {
    for (let i = 0; i < e.products.length; i++) {
      const $featuredProducts = $(`
      <div class="col-6 col-sm-4 col-md-3">
        <a href><div class="product-display">
        <img src="${e.products[i].photo_url}" style="width: 100%; height: 100px" alt="item">
        <p>${e.products[i].name}</p>
        <p>${e.products[i].price}</p>
        <p>${e.products[i].admin_id}</p>
        </div></a>
      </div>`);
      $main.append($featuredProducts);
    }
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
    $main.empty();
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
    $main.append($productPopup);
  };
  $(document).on('click','.product-display', function(event) {
    event.preventDefault();
    $main.empty();
    renderProductPopup();
  });
  //This section takes care of login
  const $loginForm = $('.login');
  $loginForm.on('submit', function(event) {
    event.preventDefault();
    const data = $(this).serialize();
    console.log(data);
    logIn(data)
      .then(json => {
        console.log(json);
        if (!json.user) {
          console.log('no such ting');
          // views_manager.show('error', 'Failed to login');
          return;
        }
        console.log(json.user);
        // header.update(json.user);
        // views_manager.show('listings');
      });
  });
});
