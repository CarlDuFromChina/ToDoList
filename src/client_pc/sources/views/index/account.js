import { $$ } from '@xbs/webix-pro';
import { JetView } from 'webix-jet';

export default class AccountView extends JetView {
  config() {
    const user = this.app.getService('user');
    var userinfo = webix.storage.local.get('user');
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
              { id: '1', name: (userinfo || {}).code || '' },
              { id: '2', name: 'logout', click: () => user.logout().then(() => this.app.show('/login')) },
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
