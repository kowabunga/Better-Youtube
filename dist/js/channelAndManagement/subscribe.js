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

function handleSubscriptionBtnClick(data, check) {
  if (check) {
    subscribeBtn.classList.add('subscribed');
    subscribeBtn.textContent = 'Subscribed';

    // Depending on which api request is made, it either returns a data.result.id value OR a data.result.id[array].id value
    subscribeBtn.setAttribute(
      'data-subid',
      data.result.id || data.result.items[0].id
    );
  } else {
    chUI.setSubscriptionButton(data, check);
  }
}
