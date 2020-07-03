function logIn(data) {
  return $.ajax({
    method: "POST",
    url: "/api/users/login",
    data
  });
}

function logOut() {
  return $.ajax({
    method: "POST",
    url: "/api/users/logout"
  });
}

const submitProducts = function(data) {
  return $.ajax({
    method: "POST",
    url: "/api/products",
    data
  });
}

const submitMessage = function(data) {
  return $.ajax({
    method: "POST",
    url: "/api/users/messages",
    data
  });
}

