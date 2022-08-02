function status() {
  var user = webix.storage.local.get('user');
  if (user) {
    return Promise.resolve(user);
  }
  return Promise.reject(null);
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