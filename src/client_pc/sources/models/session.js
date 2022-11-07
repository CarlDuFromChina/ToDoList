function status() {
  var user = webix.storage.local.get('user');
  return Promise.resolve(user);
}

function login(form) {
  return webix.ajax().post('/api/auth/login', form).then(resp => {
    var data = {
      code: form.code,
      token: resp.text()
    };
    webix.storage.local.put('user', data);
    return data;
  });
}

function logout() {
  webix.storage.local.remove('user');
  return Promise.resolve(true);
}

export default {
  status,
  login,
  logout
}