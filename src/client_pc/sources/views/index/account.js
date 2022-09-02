import { $$ } from '@xbs/webix-pro';
import { JetView } from 'webix-jet';

export default class AccountView extends JetView {
  config() {
    const _ = this.app.getService('locale')._;
    const user = this.app.getService('user');
    var userInfo = webix.storage.local.get('user');
    var logout = () => {
      user.logout().then(() => this.app.show('/login'));
    }
    if (!userInfo) {
      logout();
    }
    var userName = (userInfo || {}).code || '';

    return {
      view: 'popup',
      id: 'my_popup',
      borderless: true,
      body: {
        rows: [
          {
            view: 'list',
            localId: 'list',
            borderless: true,
            width: 100,
            autoheight: true,
            type: {
              template: '#name#'
            },
            data: [
              { id: '1', name: userName },
              { id: '2', name: _('Logout'), click: () => logout() },
            ],
            on: {
              onItemClick(id, e, node) {
                var item = this.getItem(id);
                if (item.click) {
                  item.click();
                }
                $$('my_popup').hide();
              }
            }
          }
        ]
      }
    };
  }

  showWin(pos) {
    this.getRoot().show(pos);
  }
}
