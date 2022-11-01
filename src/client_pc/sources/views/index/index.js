import { JetView } from 'webix-jet';
import ListView from './list';
import ToolbarView, { createNewTaskHandler, filterToDoList } from './toolbar';

webix.protoUI({
  name: 'hover-button',
}, webix.Movable, webix.ui.button);

export default class IndexView extends JetView {
  constructor(app, config) {
    super(app, config);
  }

  config() {
    const _ = this.app.getService('locale')._;

    return {
      rows: [
        ToolbarView,
        {
          cols: [
            {
              id: 'segmented',
              view: 'segmented',
              maxWidth: '300',
              options: [
                { id: 1, value: _('Active') },
                { id: 2, value: _('Completed') }
              ],
              on: {
                onChange: function(id) {
                  const button = $$('create_button');
                  if (id == 2) {
                    filterToDoList(false);
                    button.hide();
                  } else {
                    filterToDoList(true);
                    button.show();
                  }
                }
              }
            },
            {}
          ]
        },
        ListView
      ],
    };
  }

  init() {
    this.ui({
      id: 'create_button',
      view: "hover-button",
      width: 40,
      height: 40,
      type: "icon",
      icon: "mdi mdi-pencil",
      tooltip: "Create",
      click: createNewTaskHandler
    });
  }
}
