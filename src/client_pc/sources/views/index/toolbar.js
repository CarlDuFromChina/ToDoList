import { JetView } from "webix-jet";
import AccountView from './account';

export default class ToolbarView extends JetView {
  constructor(app, config) {
    super(app, config);
    this.lang = webix.storage.local.get('lang');
  }

  config() {
    const locale = this.app.getService('locale');
    const _ = locale._;

    return {
      id: 'toolbar',
      view: 'toolbar',
      css: 'webix_dark',
      height: 45,
      paddingX: 6,
      elements: [
        {
          view: 'label',
          autowidth: true,
          label: "<span class='webix_icon mdi mdi-playlist-check'></span>"
        },
        { view: 'label', autowidth: true, label: 'ToDoList' },
        {},
        {
          view: 'search',
          id: 'search_input',
          clear: 'hover',
          minWidth: 150,
          on: {
            onTimedKeyPress: searchHandler
          }
        },
        {
          view: 'icon',
          icon: 'mdi mdi-google-translate',
          height: 25,
          popup: {
            view: 'contextmenu',
            data: [
              { id: 'en_US', value: 'English' },
              { id: 'zh_CN', value: '中文' }
            ],
            value: this.lang,
            on: {
              onMenuItemClick(id) {
                if (id !== this.lang) {
                  this.lang = id;
                  webix.storage.local.put('lang', id);
                  locale.setLang(id);
                }
              }
            }
          }
        },
        {
          view: 'icon',
          height: 25,
          autowidth: true,
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

export function createNewTaskHandler() {
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

export function filterToDoList(status) {
  const list = $$('todo_list');
  if (status === undefined) {
    list.filter();
  } else {
    list.filter(function (obj) {
      return obj.status === status;
    });
  }
}