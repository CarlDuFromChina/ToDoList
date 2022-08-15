import { JetView } from 'webix-jet';

export default class LoginView extends JetView {
  constructor(app, config) {
    super(app, config);
  }

  config() {
    const _ = this.app.getService('locale')._;

    var loginForm = {
      id: 'login',
      view: 'form',
      scroll: false,
      width: 300,
      elements: [
        { view: 'text', label: _('User Code'), name: 'code' },
        {
          view: 'search',
          label: _('Password'),
          icon: 'wxi-eye',
          name: 'password',
          type: 'password',
          value: '',
          on: {
            onSearchIconClick: function () {
              var theInput = this.config.type;

              if (theInput !== 'password') {
                this.config.icon = 'wxi-eye';
                this.config.type = 'password';
              } else if (theInput === 'password') {
                this.config.icon = 'wxi-eye-slash';
                this.config.type = '';
              }
              this.refresh();
            }
          }
        },
        {
          view: 'button',
          value: _('Login'),
          click: () => this.doLogin()
        }
      ],
      rules: {
        password: webix.rules.isNotEmpty,
        code: webix.rules.isNotEmpty
      },
      elementsConfig: {
        labelPosition: 'top'
      },
      on: {
        onValidationError: function (key, obj) {
          var text;

          if (key == 'code') text = _('code can\'t be empty');
          if (key == 'password') text = _('password can\'t be empty');

          webix.message({ type: 'error', text: text });
        }
      }
    };

    return {
      rows: [
        { gravity: 1 },
        {
          align: 'center,middle',
          body: {
            rows: [
              loginForm,
              {
                view: 'template',
                autoheight: true,
                type: 'clean',
                css: { 'margin-top': '3px !important' },
                template: `${_(`Don\'t have an account yet?`)} <a href="/#!/signup">${_('Register Now')}</a>`
              }
            ]
          }
        },
        { gravity: 2 }
      ]
    };
  }

  init() {
    const user = this.app.getService('user');
    if (user.getStatus()) {
      this.show('/index');
    }
  }

  doLogin() {
    const user = this.app.getService('user');
    const form = this.$$('login');

    if (form.validate()) {
      var data = form.getValues();
      user.login(data).fail(resp => {
        webix.message({
          text: JSON.parse(resp.response).message,
          type: 'error',
          expire: 3000
        });
      });
    }
  }
}
