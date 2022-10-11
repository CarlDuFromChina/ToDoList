using CefSharp;
using CefSharp.WinForms;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ToDoList
{
    public partial class Form1 : Form
    {
        public readonly string Url = "https://todo.sixpence.top";

        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            Cef.Initialize(new CefSettings());
            var browser = GetWebBrowser(Url);
            this.Controls.Add(browser);
        }

        private ChromiumWebBrowser GetWebBrowser(string url)
        {
            ChromiumWebBrowser webBrowser = new ChromiumWebBrowser(url)
            {
                Dock = DockStyle.Fill,
                Width = this.Width,
                Height = this.Height
            };
            return webBrowser;
        }

        private void Form1_FormClosed(object sender, FormClosedEventArgs e)
        {
            Cef.Shutdown();
        }
    }
}
