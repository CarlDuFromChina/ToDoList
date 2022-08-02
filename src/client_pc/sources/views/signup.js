import { JetView } from "webix-jet";

export default class SignupView extends JetView {
  constructor(app, config) {
    super(app, config);
  }

  config() {
    var app = this.app;
    const _ = this.app.getService('locale')._;
    
    var form = {
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
          view: 'search',
          label: _('Confirm Password'),
          icon: 'wxi-eye',
          name: 'password2',
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
          value: 'Submit',
          click: function () {
            if (this.getParentView().validate()) {
              signup(app, this.getParentView().getValues());
            }
          }
        }
      ],
      rules: {
        password: webix.rules.isNotEmpty,
        password2: function (v2) {
          var v1 = this.getValues().password;
          return v1 === v2;
        },
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
          if (key == 'password2') text = _('the two passwords are different');

          webix.message({ type: 'error', text: text });
        }
      }
    };

    return {
      rows: [
        { gravity: 1 },
        {
          align: 'center,middle',
          body: form
        },
        { gravity: 2 }
      ]
    };
  }
}

function signup(app, form) {
  webix.ajax().post('/api/auth/signup', form)
    .then(() => app.show('/login'))
    .fail(resp => {
      webix.message({
        text: JSON.parse(resp.response).message,
        type: 'error',
        expire: 3000
      })
    })
}