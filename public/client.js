let formElm = document.getElementById('subscriptionForm');
let formStatus = document.getElementById('formStatus');
let offlinePrompt = document.getElementById('offlinePrompt');
let offlinePromptBtnYes = document.getElementById('offlinePromptBtn-yes');
let offlinePromptBtnNo = document.getElementById('offlinePromptBtn-no');

const formSuccess = statusText => {
  formStatus.style.setProperty('color', 'green');
  formStatus.innerText = statusText;
};

const formFail = statusText => {
  formStatus.style.setProperty('color', 'red');
  formStatus.innerText = statusText;
  formElm.style.setProperty('display', 'block');
};

const formOffline = () => {
  formElm.style.setProperty('display', 'none');
  formStatus.style.setProperty('display', 'none');
  offlinePrompt.style.setProperty('display', 'block');

}

const retryWhenOnline = choice => {
  offlinePrompt.style.setProperty('display', 'none');
  if (choice) {
    Notification.requestPermission().then(result => {
      console.log(result);
      if (result === 'granted') {
        formStatus.innerText = 'We will attempt to submit your form again when you return online and notify you of the result.';
        formStatus.style.setProperty('display', 'block');
        formStatus.style.setProperty('color', '#673AB7');
      }
    });
  } else {

  }
}

const requestNotificationPermission = () => {
  return Notification.requestPermission();
}

const submitForm = e => {
  e.preventDefault();
  formStatus.style.setProperty('color', '#673AB7');
  // console.log(`Form submitted!`);
  formElm.style.setProperty('display', 'none');
  formStatus.style.setProperty('display', 'block');

  const data = new URLSearchParams();
  for (const pair of new FormData(formElm)) {
    data.append(pair[0], pair[1]);
  }

  formStatus.innerText = 'Submitting form...';

  fetch(`/submit_form?${data.toString()}`)
    .then(async(res) => {
      if (res.status === 200)
        formSuccess(await res.text());
      else
        formFail(await res.text());
    }).catch(e => formOffline());
  // .then(text => {
  //   formStatus.innerText = text;
  // });

}

formElm.addEventListener("submit", submitForm);
offlinePromptBtnYes.addEventListener("click", () => { retryWhenOnline(true); });
offlinePromptBtnNo.addEventListener("click", () => { retryWhenOnline(false); });

// logic to display content depending on the URL
function initialLoad() {
  const queryString = window.location.search;

  if (/notification/.test(queryString)) {
    formElm.style.setProperty('display', 'none');
    formStatus.style.setProperty('display', 'block');

    let statusText = decodeURI(/statusText=([^&]*)/.exec(queryString)[1]);
    let statusCode = /statusCode=([^&]*)/.exec(queryString)[1];

    if (statusCode == 200)
      formSuccess(statusText);
    else
      formFail(statusText);
  }
}
initialLoad();

/*
const submitForm = e => {
e.preventDefault();
formStatus.style.setProperty('color', '#673AB7');
// console.log(`Form submitted!`);
formElm.style.setProperty('display', 'none');
formStatus.style.setProperty('display', 'block');

const data = new URLSearchParams();
for (const pair of new FormData(formElm)) {
data.append(pair[0], pair[1]);
}

formStatus.innerText = 'Submitting form...';

fetch(`/submit_form?${data.toString()}`)
.then(async(res) => {
  if (res.status === 200)
    formSuccess(await res.text());
  else
    formFail(await res.text());
}).catch(e => formOffline());
// .then(text => {
//   formStatus.innerText = text;
// });

} const submitForm = e => {
e.preventDefault();
formStatus.style.setProperty('color', '#673AB7');
// console.log(`Form submitted!`);
formElm.style.setProperty('display', 'none');
formStatus.style.setProperty('display', 'block');

const data = new URLSearchParams();
for (const pair of new FormData(formElm)) {
data.append(pair[0], pair[1]);
}

formStatus.innerText = 'Submitting form...';

fetch(`/submit_form?${data.toString()}`)
.then(async(res) => {
  if (res.status === 200)
    formSuccess(await res.text());
  else
    formFail(await res.text());
}).catch(e => formOffline());
// .then(text => {
//   formStatus.innerText = text;
// });

} const submitForm = e => {
e.preventDefault();
formStatus.style.setProperty('color', '#673AB7');
// console.log(`Form submitted!`);
formElm.style.setProperty('display', 'none');
formStatus.style.setProperty('display', 'block');

const data = new URLSearchParams();
for (const pair of new FormData(formElm)) {
data.append(pair[0], pair[1]);
}

formStatus.innerText = 'Submitting form...';

fetch(`/submit_form?${data.toString()}`)
.then(async(res) => {
  if (res.status === 200)
    formSuccess(await res.text());
  else
    formFail(await res.text());
}).catch(e => formOffline());
// .then(text => {
//   formStatus.innerText = text;
// });

} const submitForm = e => {
e.preventDefault();
formStatus.style.setProperty('color', '#673AB7');
// console.log(`Form submitted!`);
formElm.style.setProperty('display', 'none');
formStatus.style.setProperty('display', 'block');

const data = new URLSearchParams();
for (const pair of new FormData(formElm)) {
data.append(pair[0], pair[1]);
}

formStatus.innerText = 'Submitting form...';

fetch(`/submit_form?${data.toString()}`)
.then(async(res) => {
  if (res.status === 200)
    formSuccess(await res.text());
  else
    formFail(await res.text());
}).catch(e => formOffline());
// .then(text => {
//   formStatus.innerText = text;
// });

} const submitForm = e => {
e.preventDefault();
formStatus.style.setProperty('color', '#673AB7');
// console.log(`Form submitted!`);
formElm.style.setProperty('display', 'none');
formStatus.style.setProperty('display', 'block');

const data = new URLSearchParams();
for (const pair of new FormData(formElm)) {
data.append(pair[0], pair[1]);
}

formStatus.innerText = 'Submitting form...';

fetch(`/submit_form?${data.toString()}`)
.then(async(res) => {
  if (res.status === 200)
    formSuccess(await res.text());
  else
    formFail(await res.text());
}).catch(e => formOffline());
// .then(text => {
//   formStatus.innerText = text;
// });

}*/