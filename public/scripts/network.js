function logIn(data) {
  return $.ajax({
    method: "POST",
    url: "/users/login",
    data
  });
}
