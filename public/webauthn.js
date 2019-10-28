const challenge = new Uint8Array([72, 85, 7, 249, 157, 28, 139, 20, 174, 46, 37, 30, 131, 169, 222, 220, 15, 156, 219, 18, 40, 179, 17, 105, 178, 182, 248, 136, 248, 115, 95, 187]);

const getPublicKey = async(username) => {
  let res = await fetch(`/getUserId?username=${username}`);
  let userKey = await res.text();
  console.log(`userKey = ${userKey}`);

  let id = Uint8Array.from(window.atob(userKey), c => c.charCodeAt(0));

  let publicKey = {
    'challenge': challenge,

    'rp': {
      'name': 'Example Inc.'
    },

    'user': {
      'id': id,
      'name': username,
      'displayName': username
    },

    'pubKeyCredParams': [
      { 'type': 'public-key', 'alg': -7 },
      { 'type': 'public-key', 'alg': -257 }
    ],

    // userVerification: 'required'
  };
  return publicKey;
}

const storeWebAuthnCredential = async(username) => {
  console.log('storeWebAuthnCredential', username);
  let publicKey = await getPublicKey(username);

  navigator.credentials.create({ 'publicKey': publicKey })
    .then((newCredentialInfo) => {
      console.log('SUCCESS', newCredentialInfo)
      fetch(`/setUserKey?username=${username}&key=${new Uint8Array(newCredentialInfo.rawId).toString()}`);
      document.cookie = `username=${username};`;
      document.cookie = `signedin=true;`;
      window.location.href = "/index.html";
    })
    .catch((error) => {
      console.log('FAIL', error)
    })
}

const getWebAuthnCredential = async(username) => {
  let userKey = await fetch(`/getUserKey?username=${username}`).then(res => res.text());
  let userKeyArr = userKey.split(",").map(x => parseInt(x));

  let publicKey = await getPublicKey(username);
  let idList = [{
    id: new Uint8Array(userKeyArr),
    // transports: ["usb", "nfc", "ble"],
    type: "public-key"
  }];

  publicKey.allowCredentials = idList;

  navigator.credentials.get({ 'publicKey': publicKey })
    .then((newCredentialInfo) => {
      console.log('SUCCESS', newCredentialInfo);
      document.cookie = `signedin=true;`;
      showSigninOptions();
    })
    .catch((error) => {
      console.log('FAIL', error)
    });
}

let signinForm = document.getElementById('signinForm');

if (signinForm) {
  signinForm.addEventListener('submit', e => {

    // Stop submitting form by itself
    e.preventDefault();

    // Try sign-in with AJAX
    fetch('/sign_in', {
      method: 'POST',
      body: new FormData(e.target),
      credentials: 'include'
    }).then(res => {
      if (res.status == 200) {
        console.log(`Success`);
        return Promise.resolve();
      } else {
        return Promise.reject('Sign-in failed');
      }
    }).then(profile => {
      console.log(profile);
      console.log('1. storeWebAuthnCredential');
      let c = new PasswordCredential(e.target);
      storeWebAuthnCredential(c.id);
      // Instantiate PasswordCredential with the form
      // if (window.PasswordCredential) {
      //   console.log(`Storing PasswordCredential`);
      //   var c = new PasswordCredential(e.target);
      //   document.cookie = `username=${c.id}`;

      //   // return navigator.credentials.store(c);
      // } else {
      //   return Promise.resolve(profile);
      // }
    }).then(profile => {
      console.log(`Successful login`);
      // window.location.href = "/index.html";
    }).catch(error => {
      console.log('Sign-in Failed');
    });
  });
}