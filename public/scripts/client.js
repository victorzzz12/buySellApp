$(document).ready(() => {
  console.log('jQuery is go');

  const $main = $('.product-row');
  const $login = $('.login');

  //This Ajax request returns object containing user status details

  const getLoginStatus = function() {
   $.ajax({
      url: '/api/users/userStatus',
      method: 'get',
      dataType: 'json',
      success: (data) => {
        renderLogin(data);
      },
      error: (jqxr, textStatus, error) => {
        console.log(error);
      }
    })
  }

  getLoginStatus();

  //This section populates header with login form or logout button

  const renderLogin = function(loginData) {
    $login.empty();
    if (loginData.isLoggedIn === false) {
      const $loginForm = `<input type="text" name="email" placeholder="username@example.com">
      <input type="text" name="password" placeholder="password">
      <button type="submit" action="POST">Login</button>`
      $login.append($loginForm);

    } else {
      //logout form later
    }

  }

  //This section renders featured products on pageload

  const renderFeaturedProducts = (e) => {
    for (let i = 0; i < e.products.length; i++) {
      const $featuredProducts = $(`
      <div class="col-6 col-sm-4 col-md-3">
        <a href><div class="product-display-${i} product-box">
        <img src="${e.products[i].photo_url}" style="width: 100%; height: 100px" alt="item">
        <p class="image">${e.products[i].photo_url}</p>
        <p class="name">${e.products[i].product}</p>
        <p class="price">$${e.products[i].price}</p>
        <p class="description">${e.products[i].description}</p>
        <p class="date-added">${e.products[i].date_added}</p>
        <p class="admin">Made by: ${e.products[i].seller}</p>
        </div></a>
      </div>`);
      $main.append($featuredProducts);
      $('.image').hide();
      $('.description').hide();
      $('.date-added').hide();
    }
  }

  function loadFeaturedProducts() {
    $.ajax("/api/products/", { method: "GET" })
    .then((data) => {
      renderFeaturedProducts(data);
    })
    $main.append(`<div class="container" id="products">
    <h2 class="featured-title">Featured Stuffs</h2>
    <div class="row product-row justify-content-left">
    </div>
    </div>`);
  }

  loadFeaturedProducts();

//This section brings up the "home interface" when the home logo is clicked

  $('.home-button').on('click', function(event) {
    event.preventDefault();
    $main.empty();
    loadFeaturedProducts();
  });

//This section replaces whatever's in the .main-container with an individual product

  const renderProductPopup = function(name, image, description, seller, time) {
    const $productPopup = $(`<div class="container product-popup">
      <h1>${name}</h1>
      <img src="${image}" alt="cute embroidered shirt">
      <h2>SOLD</h2>
      <a href="#"><p>Message seller</p></a>
      <p>${description}</p>
      <p>${seller}</p>
      <p>Listed on: ${time}</p>
      </div>
    `);
    $main.append($productPopup);
  };

  $.ajax("/api/products/", { method: "GET" })
  .then((data) => {
    for (let i = 0; i < data.products.length; i++) {
      $(document).on('click',`.product-display-${i}`, function(event) {
        event.preventDefault();
        let $name = $(`.product-display-${i} .name`).text();
        let $img = $(`.product-display-${i} .image`).text();
        let $description = $(`.product-display-${i} .description`).text();
        let $time = $(`.product-display-${i} .date-added`).text();
        let $seller = $(`.product-display-${i} .admin`).text();
        $main.empty();
        renderProductPopup($name, $img, $description, $seller, $time);
      });
    }
  })

  //This section pops up an add listing page
  $(document).on('click','nav p', function(event) {
    const $addListing = $(`
    <div class="listing-container">
      <h2>Add New Listing</h2>
      <form action="/api/products" method="post" class="new-product-form">
        <div class="new-product-form__field-wrapper">
          <label for="new-product-form__title"></label>
          <input type="text" name="product-name" placeholder="Product Name" id="new-product-form__product-name">
        </div>
        <div class="new-product-form__field-wrapper">
          <label for="new-product-form__cost"></label>
          <input placeholder="Price" type="number" name="price" id="new-product-form__price">
        </div>
        <div class="new-product-form__field-wrapper">
          <label for="new-product-form__type"></label>
          <input type="text" name="product-type" placeholder="Type" id="new-product-form__type">
        </div>
        <div class="new-product-form__field-wrapper">
          <label for="new-product-form__image"></label>
          <input type="text" name="product-image" placeholder="Image url" size="40" id="new-product-form__image">
        </div>
        <div class="new-product-form__field-wrapper">
          <label for="new-product-form__description"></label>
          <textarea placeholder="Description" name="description" id="product-form__description" cols="50" rows="5"></textarea>
        </div>
        <div class="new-product-form__field-wrapper">
          <button class="btn btn-primary">Add Listing</button>
          <a id="product-form__cancel" href="/">Cancel</a>
        </div>
      </form>
    </div>`)
  $main.empty();
  $main.append($addListing);
  });
  //This section takes care of login

  const $loginForm = $('.login');

  $loginForm.on('submit', function(event) {
    const $inputs = $('form :input')
    event.preventDefault();
    const data = $(this).serialize();
    logIn(data)
      .then(json => {
        if (!json.user) {
          $inputs.val('');
        }
        getLoginStatus();
      });
  });
});
