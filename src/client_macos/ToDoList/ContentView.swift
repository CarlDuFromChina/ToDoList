//
//  ContentView.swift
//  ToDoList
//
//  Created by Karl Du on 2022/8/8.
//

import SwiftUI
import WebKit

struct WebView: NSViewRepresentable {
    let url: URL

    func makeNSView(context: Context) -> WKWebView {
        let view = WKWebView()
        view.autoresizingMask = [.width, .height]
        return view
    }

    func updateNSView(_ nsView: WKWebView, context: Context) {
        guard context.coordinator.needsToLoadURL else { return }
        nsView.load(URLRequest(url: url))
    }

    func makeCoordinator() -> WebView.Coordinator {
        Coordinator()
    }

    class Coordinator {
        var needsToLoadURL = true
    }
}

struct WebKitView_Previews: PreviewProvider {
    static var previews: some View {
        WebView(url: URL(string: "https://todo.sixpence.top")!)
    }
}
