import './styles/app.css';
import '@xbs/webix-pro/webix.css';
import '@mdi/font/css/materialdesignicons.css';
import * as webix from 'webix';
import { JetApp } from 'webix-jet';
import { plugins } from 'webix-jet';
import session from 'models/session';

export default class MyApp extends JetApp {
  constructor(config) {
    super(
      webix.extend(
        {
          id: APPNAME,
          version: VERSION,
          start: '/login',
          debug: !PRODUCTION
        },
        config,
        true
      )
    );

    /* error tracking */
    this.attachEvent('app:error:resolve', function (name, error) {
      window.console.error(error);
    });
  }
}

webix.ready(function () {
  if (!window.webix) {
    window.webix = webix;
  }
  
  if (webix.env.touch) webix.ui.fullScreen();
  else if (webix.CustomScroll) webix.CustomScroll.init();

  const app = new MyApp({});
  app.use(plugins.Locale, { lang: 'zh_CN' });
  app.use(plugins.User, {
    model: session,
    ping: 15000,
    afterLogin: 'index',
    user: {
      code: '',
      token: ''
    }
  });
  window.tr = app.getService('locale')._;
  app.render();

  // 请求前加上认证
  webix.attachEvent('onBeforeAjax', function (mode, url, data, request, headers, files, promise) {
    let user = webix.storage.local.get('user');
    if (user && user.token) {
      headers['token'] = user.token;
    }
  });
  
  // 监听请求异常
  webix.attachEvent('onAjaxError', function (xhr) {
    if (xhr.status === 401) {
      webix.message({
        type: 'error',
        text: 'Access Denied'
      })
    }
  });

  webix.message.position = 'top';
  webix.message.expire = 3000;
});
