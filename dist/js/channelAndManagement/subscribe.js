subscribeBtn.addEventListener('click', subscribeOrUnSubscribe);

function subscribeOrUnSubscribe(e) {
  //   console.log('click');
  if (googleAuth.checkIfSignedIn()) {
    e.preventDefault();
    if (subscribeBtn.classList.contains('subscribed')) {
      youtube
        .unSubscribeFromChannel(e.target.getAttribute('data-subid'))
        .then(data => handleSubscriptionBtnClick(false))
        .catch(err => console.log(err));
    } else {
      youtube
        .subscribeToChannel(e.target.getAttribute('data-channelid'))
        .then(data => handleSubscriptionBtnClick(data, true))
        .catch(err => console.log(err));
    }
  } else {
    alert('You must log in to use this feature.');
  }
}

// start here, make sure it handles checking subscription and changing sub button styles on channel load correctly
// move code?
function handleSubscriptionBtnClick(data, isSubscribed, check) {
  if (check) {
    console.log(data);
    subscribeBtn.classList.add('subscribed');
    subscribeBtn.textContent = 'Subscribed';
    subscribeBtn.setAttribute('data-subid', data.result.items[0].id);
  } else {
    chUI.setSubscriptionButton(data, isSubscribed);
  }
}
