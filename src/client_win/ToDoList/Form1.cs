using CefSharp;
using CefSharp.WinForms;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using ToDoList.Properties;

namespace ToDoList
{
    public partial class Form1 : Form
    {
        public readonly string Url = "https://todo.sixpence.top";

        public Form1()
        {
            this.AutoScaleMode = AutoScaleMode.Dpi;
            InitializeComponent();
            InitializeChromium();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
        }

        public void InitializeChromium()
        {
            var cache = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "cache");
            if (!System.IO.Directory.Exists(cache))
                System.IO.Directory.CreateDirectory(cache);

            CefSettings settings = new CefSettings();
            settings.Locale = "zh-CN";
            settings.CachePath = cache;
            Cef.Initialize(settings);
            Cef.EnableHighDPISupport();
            ChromiumWebBrowser chromeBrowser = new ChromiumWebBrowser(Url);
            ResizeBegin += (s, e) => SuspendLayout();
            ResizeEnd += (s, e) => ResumeLayout(true);
            this.panel1.Controls.Add(chromeBrowser);
            chromeBrowser.Dock = DockStyle.Fill;
        }

        private void Form1_FormClosed(object sender, FormClosedEventArgs e)
        {
            Cef.Shutdown();
        }
    }
}
