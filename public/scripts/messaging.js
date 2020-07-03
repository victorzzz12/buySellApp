$(document).ready(() => {

  const $main = $('.product-row');

  const adminOrCustomerMessagePreCheck = function() {
    $.ajax({
       url: '/api/users/userStatus',
       method: 'get',
       dataType: 'json',
       success: (data) => {
        console.log('login status checked');
        adminOrCustomerMessages(data);
      },
     })
   }

   const adminOrCustomerMessageSendPreCheck = function(messageBody) {
    $.ajax({
       url: '/api/users/userStatus',
       method: 'get',
       dataType: 'json',
       success: (data) => {
        console.log('login status checked');
        adminOrCustomerMessageSend(data, messageBody);
      },
     })
   }

   const adminOrCustomerMessageSend = function(loginStatus, messageBody) {
    if (loginStatus.isAdmin === true) {
      $.ajax({
        method: "POST",
        url: "/api/users/messages/admin",
        data: { messageBody, fromUser: 'false'}
      }).then((messages)=>console.log('admin message sent'));
    } else {
      $.ajax({
        method: "POST",
        url: "/api/users/messages/customer",
        data: { messageBody, fromUser: 'true'}
      }).then((messages)=>console.log('user message sent'));
    }
   }

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
    $('.add-listing-button').hide();
    $('#product-form__cancel').hide();
    $('.listing-message').show();
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
        <div class="box">
          <p class = 'product-name' >Product: ${messages[i].name}</p>
          <p class = 'message-content'>Message: ${messages[i].content}</p>
          <p class = 'interested-buyer'>Interested Buyer: ${messages[i].sender}</p>
          <p class = 'seller'>Seller: ${messages[i].seller}</p>
          <button type="button" class="reply btn btn-primary">Reply</button>
          </div></div>`;
    $('.message-container').append($messagesBox);
    }
  }

  const loadMessages = function(messages) {
    console.log(messages);
    console.log(messages.length);
    $main.empty();
    renderMessages(messages);

  }

  const adminOrCustomerMessages = function(loginStatus) {
    if (loginStatus.isAdmin === true) {
      $.ajax({
        method: "GET",
        url: "/api/users/messages/admin"
      }).then((messages)=>loadMessages(messages));
    } else {
      $.ajax({
        method: "GET",
        url: "/api/users/messages/customer"
      }).then((messages)=>loadMessages(messages));
    }
    console.log('loginStatus,', loginStatus);
  }

  $(document).on('click', '.messages-button', function(event) {
    event.preventDefault();
    adminOrCustomerMessagePreCheck();
  })

  $(document).on('click', '.reply', function(event) {

    event.preventDefault();

    const $replyForm = `
      <form action = "" method="" class="message-form">
        <div class="new-product-form__field-wrapper">
         <div class="your-message">
           <label for="message">Your reply:</label>
           <textarea placeholder="Message" name="message" cols="50" rows="5"></textarea>
         </div>
       </div>
       <div class="new-product-form__field-wrapper">
       <button class="reply-button btn btn-primary">Send Reply</button>
         <p class="replied-message">Reply sent!</p>
         </form>
     `;
     $('.reply').addClass('invisible');
     $('.message-box').append($replyForm);
     $('.replied-message').hide();

  })
      // <div class="message-box">
    //   <h2>Message ${i+1}</h2>
    //     <div class="box">
    //       <p class = 'product-name' >Product: ${messages[i].name}</p>
    //       <p class = 'message-content'>Message: ${messages[i].content}</p>
    //       <p class = 'interested-buyer'>Interested Buyer: ${messages[i].sender}</p>
    //       <p class = 'seller'>Seller: ${messages[i].seller}</p>
    //       <button type="button" class="reply btn btn-primary">Reply</button>
    //       </div></div>`;

  $('.main-container').on('submit', '.message-form', function(event) {
    event.preventDefault();
    const message = $(this).serialize().slice(8);
    const productName =  $(this).parent().find('.product-name').html().slice(9);
    const userName =  $(this).parent().find('.interested-buyer').html().slice(18);
    const adminName =  $(this).parent().find('.seller').html().slice(8);
    const allData = { message, productName, userName, adminName}
    adminOrCustomerMessageSendPreCheck(allData);
    console.log('reply-button hit, message content: ', allData )
    $('.reply-button').addClass('invisible');
    $('.replied-message').show();
 })

});
