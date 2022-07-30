import { JetView } from 'webix-jet';
import ListView from './list';
import ToolbarView from './toolbar';

export default class IndexView extends JetView {
  constructor(app, config) {
    super(app, config);
  }

  config() {
    return {
      rows: [ToolbarView, ListView],
    };
  }
}
