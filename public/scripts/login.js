$(document).ready(() => {
  console.log('jQuery is go');

  const $main = $('.product-row');
  const $login = $('.login');
  const $search = $('.search-div')

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
    console.log(loginData);
    if (loginData.isLoggedIn === false) {
      $('.right-buttons').removeClass('visible');
      $('.right-buttons').addClass('invisible');
      $('.logout').removeClass('visible');
      $('.logout').addClass('invisible');
      $('.see-messages').removeClass('visible');
      $('.see-messages').addClass('invisible');
      $('.admins-only').addClass('invisible');
      $('.customers-only').addClass('invisible');
      const $loginForm = `<input type="text" name="email" placeholder="username@example.com">
      <input type="password" name="password" placeholder="password">
      <button type="submit" action="POST">Login</button>`
      $login.append($loginForm);
    } else {
      $('.right-buttons').removeClass('invisible');
      $('.right-buttons').addClass('visible');
      $('.logout').removeClass('invisible');
      $('.logout').addClass('visible');
      $('.messages-button').removeClass('invisible');
      $('.messages-button').addClass('visible');
      if (loginData.isAdmin === true) {
        $('.admins-only').removeClass('invisible');
        $('.admins-only').addClass('visible');
        $('.customers-only').removeClass('visible');
        $('.customers-only').addClass('invisible');
      }
      if (loginData.isAdmin === false) {
        $('.admins-only').removeClass('visible');
        $('.admins-only').addClass('invisible');
        $('.customers-only').removeClass('invisible');
        $('.customers-only').addClass('visible');
      }
    }
  }
});
