import { JetView } from "webix-jet";
import AccountView from './account';

export default class ToolbarView extends JetView {
  config() {
    const _ = this.app.getService('locale')._;

    return {
      id: 'toolbar',
      view: 'toolbar',
      css: 'webix_dark',
      height: 45,
      paddingX: 6,
      elements: [
        {
          view: 'label',
          width: 30,
          label: "<span class='webix_icon mdi mdi-playlist-check'></span>"
        },
        { view: 'label', width: 130, label: 'ToDoList' },
        {
          view: 'button',
          id: 'create_button',
          value: _('+ Create'),
          css: 'webix_primary',
          tooltip: _('Create new task'),
          width: 120,
          click: createNewTaskHandler
        },
        {
          view: 'search',
          id: 'search_input',
          clear: 'hover',
          minWidth: 150,
          maxWidth: 500,
          on: {
            onTimedKeyPress: searchHandler
          }
        },
        {},
        {
          view: 'segmented',
          id: 'segmented',
          width: 240,
          options: [
            { id: 1, value: _('Active') },
            { id: 2, value: _('Completed') }
          ],
          on: { onChange: toggleHandler }
        },
        {
          view: 'icon',
          height: 25,
          width: 40,
          tooltip: '',
          icon: 'mdi mdi-account',
          click: function() {
            this.$scope.account.showWin(this.$view);
          }
        }
      ]
    }
  }

  init() {
    this.account = this.ui(AccountView);
  }
}

function toggleHandler(id) {
  const button = $$('create_button');
  if (id == 2) {
    filterToDoList(false);
    button.hide();
  } else {
    filterToDoList(true);
    button.show();
  }
}

function searchHandler() {
  const search_value = $$('search_input').getValue().toLowerCase();
  const segmented_value = $$('segmented').getValue();
  $$('todo_list').filter(function (obj) {
    if (segmented_value == 2) {
      return !obj.status && obj.task.toLowerCase().indexOf(search_value) !== -1;
    } else {
      return obj.status && obj.task.toLowerCase().indexOf(search_value) !== -1;
    }
  });
}

function createNewTaskHandler() {
  const list = $$('todo_list');
  filterToDoList();
  var data = { task: tr('New Task'), status: true, star: false }
  const item = list.add(data);
  webix.ajax().post('/api/task', data);
  filterToDoList(true);
  list.showItem(item);
  list.select(item);
  list.edit(item);
}

function filterToDoList(status) {
  const list = $$('todo_list');
  if (status === undefined) {
    list.filter();
  } else {
    list.filter(function (obj) {
      return obj.status === status;
    });
  }
}