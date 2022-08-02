import { JetView } from 'webix-jet';
import * as webix from 'webix';

webix.protoUI(
  {
    name: 'editlist'
  },
  webix.EditAbility,
  webix.ui.list
);

export default class ListView extends JetView {
	config() {
	  const _ = this.app.getService("locale")._;

		return {
			view: 'editlist',
			id: 'todo_list',
			tooltip: function (obj) {
				return obj.status ? _('Double click to edit the task') : _('You cannot edit completed tasks');
			},
			type: {
				height: 45,
				css: 'custom_item',
				template: list_template
			},
			select: true,
			drag: 'inner',
			editable: true,
			editor: 'text',
			editValue: 'task',
			editaction: 'dblclick',
			rules: {
				task: webix.rules.isNotEmpty
			},
			onClick: {
				delete_icon: function (e, id) {
					webix
						.confirm({
							title: _('Task would be deleted'),
							text: _('Do you still want to continue?'),
							type: 'confirm-warning'
						})
						.then(
							() => {
								webix.ajax().del(`/api/task/${id}`);
								webix.message({
									text: _('Task was deleted'),
									expire: 1000
								});
								this.remove(id);
								return false;
							},
							function () {
								webix.message(_('Rejected'));
							}
						);
				},
				complete_icon: function (e, id) {
					this.updateItem(id, { status: false, star: false });
					webix.ajax().put('/api/task', this.getItem(id));
					this.moveTop(id);
					filterToDoList(true);
				},
				undo_icon: function (e, id) {
					this.updateItem(id, { status: true });
					webix.ajax().put('/api/task', this.getItem(id));
					this.moveBottom(id);
					filterToDoList(false);
				},
				star_icon: function (e, id) {
					const obj = this.getItem(id);
					this.updateItem(id, { star: !obj.star });
					webix.ajax().put('/api/task', obj).then(() => {
						if (obj.star) {
							this.moveTop(id);
							this.showItem(id);
							this.select(id);
						} else {
							$$('todo_list').clearAll();
							$$('todo_list').load('/api/task/data');
						}
					});
				}
			},
			on: {
				onBeforeDrag: function (id, e) {
					return (e.target || e.srcElement).className == 'drag_icon webix_icon mdi mdi-drag';
				},
				onBeforeEditStart: function (id, e) {
					const obj = $$('todo_list').getItem(id);
					return obj.status;
				},
				onAfterEditStop: function (state, editor, ignoreUpdate) {
					if(state.value != state.old){
						var obj = this.getItem(editor.id)
						webix.ajax().put('/api/task', obj);
					}  
				},
				onAfterDrop: function (context, native_event) {
					if (context.start !== context.target) {
						webix.ajax().post('/api/task/swap', { ids: $$('todo_list').data.order });
					}
				}
			},
			ready: function () {
				filterToDoList(true);
			},
			url: '/api/task/data'
		}
	}
}

function list_template(obj) {
	if (obj.status) {
		//active
		return (
			`
		<span class='drag_icon webix_icon mdi mdi-drag' webix_tooltip='${tr('Drag to reorder the task')}'></span>` +
			obj.task +
			`
		<span class='delete_icon webix_icon mdi mdi-delete' webix_tooltip='${tr('Remove the task')}'></span>
		<span class='complete_icon webix_icon mdi mdi-check-circle' webix_tooltip='${tr('Complete the task')}'></span>
		<span class='star_icon webix_icon mdi mdi-` +
			(obj.star ? 'star' : 'star-outline') +
			`'
		webix_tooltip='` +
			(obj.star ? tr('Unselect the task') : tr('Select the task')) +
			`'></span>`
		);
	} else {
		//completed
		return (
			`
		<span class='done'>Done</span>` +
			obj.task +
			`
		<span class='undo_icon webix_icon mdi mdi-undo-variant' webix_tooltip='Return the task'></span>`
		);
	}
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