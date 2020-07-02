$(document).ready(() => {
  const $main = $('.product-row');
  //This section handles the "message seller" link
  const renderMessageForm = function(object) {
    const productName = object.name;
    const sellerName = object.seller;
    console.log(object);
    const fromCustomer = object.fromCustomer;
    const $messageForm = `<div class="listing-container">
    <h2>Conduct A Message</h2>
    <form action = "" method="" class="message-form">
      <div class="new-product-form__field-wrapper">
        <label for="product-name">Product: ${productName}</label><br>
        <input class="invisible" type="text" name="product-name" value="${productName}">
      </div>
      <div class="new-product-form__field-wrapper">
        <label for="product-seller">Seller: ${sellerName}</label><br>
        <input class="invisible" value="${sellerName}" type="text" name="product-seller">
      </div>
       <div class="new-product-form__field-wrapper">
         <div class="your-message">
           <label for="message">Your message:</label>
           <textarea placeholder="Message" name="message" cols="50" rows="5"></textarea>
         </div>
       </div>
       <input class='invisible' name = "fromCustomer" type="text" value="${fromCustomer}">
       <div class="new-product-form__field-wrapper">
       <button class="add-listing-button btn btn-primary">Send Message</button>
         <p class="listing-message">Sent! Await a response from the seller. </p>
       </div>
     </form>`;
     $('.search-popup').hide();
     $('.search-div').hide();
     $main.empty();
     $main.append($messageForm);
     $('.listing-message').hide();
  }

  $(document).on('click','.message-seller', function(event) {
     event.preventDefault();
     console.log('issahit');
     let name = $(this).parent().parent().find('.product-name').html();
     let seller =$(this).parent().parent().find('.seller-name').html();
     seller = seller.slice(9);
     let fromCustomer = true;
     renderMessageForm({name, seller, fromCustomer});
   })

   $(document).on('submit', '.message-form', function(event) {
      event.preventDefault();
      const data = $(this).serialize();
      console.log(data);
      submitMessage(data);
    // .then(() => {
    // })
    // .catch((error) => {
    //   console.log('fail');
    //   console.error(error);
    // })
    $('.add-listing-button').hide();
    $('#product-form__cancel').hide();
    $('.listing-message').show();;
  })

//this section takes care of messages-button click
  const renderMessages = function(messages) {
    const $messageContainer = `
    <div class="message-container"></div>`
    $main.append($messageContainer);
    for (let i = 0; i < messages.length; i++) {
      const $messagesBox = `
    <div class="message-box">
      <h2>Message ${i+1}</h2>
        <div>
          <p>Product: ${messages[i].name}</p>
          <p>Message: ${messages[i].content}</p>
          <p>Sender: ${messages[i].sender}</p>
          <button class="reply btn btn-primary">Reply</button>
          </div>`;
    $('.message-container').append($messagesBox);
    }
  }

  const loadMessages = function(messages) {
    console.log(messages);
    console.log(messages.length);
    $main.empty();
    renderMessages(messages);

  }

  $(document).on('click', '.messages-button', function(event) {
    event.preventDefault();
    // .then(data=> {
    //   if (data.isAdmin === 'true') {
        $.ajax({
          method: "GET",
          url: "/api/users/messages/admin"
        })
        .then((messages)=>loadMessages(messages));
    //   }
    // });
  })

});
