$(document).ready(() => {
  console.log('jQuery is go');

  const $main = $('.product-row');
  const $login = $('.login');
  const $search = $('.search-div')
  const $admins = $(".admins-only")
  const $favorites = $('#add-to-favorites');

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

  //This section populates header with login form or logout button

  const renderLogin = function(loginData) {
    $login.empty();
    console.log(loginData);
    if (loginData.isLoggedIn === false) {
      const $loginForm = `<input type="text" name="email" placeholder="username@example.com">
      <input type="text" name="password" placeholder="password">
      <button type="submit" action="POST">Login</button>`
      $login.append($loginForm);
    } else {
      if (loginData.isAdmin === true) {
        $admins.removeClass('invisible');
        $admins.addClass('visible');

      }
      if (loginData.isAdmin === false) {
        $('.customers-only').removeClass('invisible');
        $('.customers-only').addClass('visible');
      }
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
    <h2 class="featured-title">Featured Creations</h2>
    <div class="row product-row justify-content-left">
    </div>
    </div>`);
  }

  loadFeaturedProducts();

//This section brings up the "home interface" when the home logo is clicked

  $('.home-button').on('click', function(event) {
    event.preventDefault();
    $main.empty();
    $('.search-div').show();
    $('.search-popup').show();
    loadFeaturedProducts();
  });

//This section replaces whatever's in the .main-container with an individual product

  const renderProductPopup = function(name, image, description, seller, time) {
    const $productPopup = $(`<div class="container product-popup">
      <a href="#"><p class="customers-only invisible customer-options" id="add-to-favorites">Add To Favorites</p></a>
      <h1 class="product-name">${name}</h1>
      <div class="product-buttons">
        <button class="delete btn btn-danger">Delete</button>
        <button class="sold btn btn-success">Mark as sold</button>
      </div>
      <h1>${name}</h1>
      <img src="${image}" alt="cute embroidered shirt">
      <h2 class="invisible">SOLD</h2>
      <a href="#"><p class="customers-only invisible">Message seller</a></p>
      <p>${description}</p>
      <p>${seller}</p>
      <p>Listed on: ${time}</p>
      </div>
    `);
    getLoginStatus();
    $main.append($productPopup);
  };

  $.ajax("/api/products/", { method: "GET" })
  .then((data) => {
    for (let i = 0; i < data.products.length; i++) {
      $(document).on('click',`.product-display-${i}`, function(event) {
        event.preventDefault();
        event.stopPropagation();
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

  //This section handles the "add to favorites" link

  $(document).on('click', '#add-to-favorites', function(event) {
    event.preventDefault();
    let name = $(this).parent().parent().find('.product-name').html();
    addToFavorites({name});
  })

  //This section pops up an add listing page
  $(document).on('click','.add-listing', function(event) {
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
          <button class="add-listing-button">Add Listing</button>
          <a id="product-form__cancel" href="/">Cancel</a>
          <p class="listing-message">Added! Please return to the homepage or add more by clicking the button above!</p>
        </div>
      </form>
    </div>`)
    $('.search-popup').hide();
    $('.search-div').hide();
    $main.empty();
    $main.append($addListing);
    $('.listing-message').hide();
  });

  //this section handles submission of new listing form

  $(document).on('submit', '.new-product-form', function(event) {
    event.preventDefault();
    const data = $(this).serialize();
    submitProducts(data)
    .then(() => {
    })
    .catch((error) => {
      console.log('fail');
      console.error(error);
    })
    $('.add-listing-button').hide();
    $('#product-form__cancel').hide();
    $('.listing-message').show();
  });

  //This section takes care of login

  const $loginForm = $('.login');

  $loginForm.on('submit', function(event) {
    event.preventDefault();
    const $inputs = $('form :input')
    const data = $(this).serialize();
    logIn(data)
    .then(json => {
    if (!json.user) {
          $inputs.val('');
        }
        getLoginStatus();
      });
  });

  //This section takes care of search bar
  const $searchForm = $(`<form action="/api/products/search" method="get" class="search-popup"><div class='form-top-row'><h2>Search Creations</h2><a href="#"><p style="color:maroon" class='close-search'>(close)</p></a></div><div class="form-keyword">
    <label for="keywords">Search By Keyword</label>
    <input type="text" placeholder="birdhouse" name="keywords">
  </div>
  <div class="form-creator">
    <label for="seller">Search By Creator</label>
    <input list="sellers" id ="seller-choice" name="seller"/>
    <datalist id="sellers">
      <option value="Victor"></option>
      <option value="Eileen"></option>
    </datalist>
  </div>
  <div>
    <p>Creation type:</p>
    <label for="art">Art</label>
    <input type="checkbox" name="type" value="art">
    <label for="home">Home</label>
    <input type="checkbox" name="type" value="home">
    <label for="apparel">Apparel</label>
    <input type="checkbox" name="type" value="apparel">
  </div>
  <div class="form-min-max-price">
    <label for="minimum-cost">Minimum Cost</label>
    <input type="number" name="minimum_price" placeholder="Minimum Cost" id="search-minimum-price"><br>
    <label for="search-property-form__maximum-price-per-night">Maximum Cost</label>
    <input type="number" name="maximum_price" placeholder="Maximum Cost" id="search-maximum-price">
  </div>
  <div class="form-sold-radio">
    <p>Only show available (unsold) creations?</p>
    <label for="yes">Yes</label>
    <input type="radio" name="sold" value="false" checked>
    <label for="no">No</label>
    <input type="radio" name="sold" value="true">
  </div>
  <div class='search-submit-button-container'><button type="submit" class='search-submit-button'>Search Creations</button></div></form>
  `)
  const $searchButton = `<div class="search">
  <form class="search-form">
    <button type="submit" class='search-button'>Search Creations</button>
  </form>
  </div>`
  $(document).on('click', $search, function(event) {
    const target = $(event.target);
    // console.log(target)
    if (target.is('.search-button')) {
      event.preventDefault();
      $search.empty();
      $search.append($searchForm);
    }
    if (target.is('.close-search')) {
      event.preventDefault();
      $search.empty();
      $search.append($searchButton);
    }

  })

  $(document).on('submit', '.search-div form', function(event) {

      event.preventDefault();
      const data = $(this).serialize();
      console.log(data);
      $.ajax("/api/products/search", { method: "POST", data: data })
      .then((data) => {
        $main.empty();
        renderFeaturedProducts(data);
        $main.prepend(`<div class="container" id="products">
        <h2 class="featured-title">Search Results</h2>
        <div class="row product-row justify-content-left">
        </div>
        </div>`);
        $search.empty();
        $search.append($searchButton);
      })
    })
    $(document).on('click', '.product-buttons .sold', function(event) {
      $('.sold').hide();
      if ($('.product-popup h2').hasClass('invisible')) {
        $('.product-popup h2').removeClass('invisible');
        $('.product-popup h2').addClass('visible');
      }
      if ($('.product-popup h2').hasClass('visible')) {
        $('.sold').hide();
      }
    });
    $(document).on('click', '.product-buttons .delete', function(event) {
      $.ajax("/api/products", { method: "get" })
      .then((data) => {
        console.log(data.products);
        console.log('deleted');
      })
    });
});
