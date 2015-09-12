// ref: [mithril.js/mock.js at next · lhorie/mithril.js](https://github.com/lhorie/mithril.js/blob/next/tests/mock.js)
'use strict';

export default function mockWindow() {
  let window = {};

  window.document = {}
  window.document.childNodes = []
  window.document.createElement = function(tag) {
    return {
      style: {},
      childNodes: [],
      nodeType: 1,
      nodeName: tag.toUpperCase(),
      appendChild: window.document.appendChild,
      removeChild: window.document.removeChild,
      replaceChild: window.document.replaceChild,
      insertBefore: function(node, reference) {
        node.parentNode = this
        var referenceIndex = this.childNodes.indexOf(reference)
        var index = this.childNodes.indexOf(node)
        if (index > -1) this.childNodes.splice(index, 1)
        if (referenceIndex < 0) this.childNodes.push(node)
        else this.childNodes.splice(referenceIndex, 0, node)
      },
      insertAdjacentHTML: function(position, html) {
        // todo: accept markup
        if (position === "beforebegin") {
          this.parentNode.insertBefore(window.document.createTextNode(html), this)
        }
        else if (position === "beforeend") {
          this.appendChild(window.document.createTextNode(html))
        }
      },
      setAttribute: function(name, value) {
        this[name] = value.toString()
      },
      setAttributeNS: function(namespace, name, value) {
        this.namespaceURI = namespace
        this[name] = value.toString()
      },
      getAttribute: function(name, value) {
        return this[name]
      },
      addEventListener: function () {},
      removeEventListener: function () {}
    }
  }
  window.document.createElementNS = function(namespace, tag) {
    var element = window.document.createElement(tag)
    element.namespaceURI = namespace
    return element
  }
  window.document.createTextNode = function(text) {
    return {nodeValue: text.toString()}
  }
  window.document.documentElement = window.document.createElement("html")
  window.document.replaceChild = function(newChild, oldChild) {
    var index = this.childNodes.indexOf(oldChild)
    if (index > -1) this.childNodes.splice(index, 1, newChild)
    else this.childNodes.push(newChild)
    newChild.parentNode = this
    oldChild.parentNode = null
  }
  window.document.appendChild = function(child) {
    var index = this.childNodes.indexOf(child)
    if (index > -1) this.childNodes.splice(index, 1)
    this.childNodes.push(child)
    child.parentNode = this
  }
  window.document.removeChild = function(child) {
    var index = this.childNodes.indexOf(child)
    this.childNodes.splice(index, 1)
    child.parentNode = null
  }
  // getElementsByTagName is only used by JSONP tests, it's not required by
  // Mithril
  window.document.getElementsByTagName = function(name){
    name = name.toLowerCase();
    var out = [];

    var traverse = function(node){
      if(node.childNodes && node.childNodes.length > 0){
        node.childNodes.map(function(curr){
          if (curr.nodeName.toLowerCase() === name) {
            out.push(curr);
          }
          traverse(curr);
        });
      }
    }

    traverse(window.document);
    return out;
  }
  window.scrollTo = function() {}
  window.cancelAnimationFrame = function() {}
  window.requestAnimationFrame = function(callback) {
    window.requestAnimationFrame.$callback = callback
    return window.requestAnimationFrame.$id++
  }
  window.requestAnimationFrame.$id = 1
  window.requestAnimationFrame.$resolve = function() {
    if (window.requestAnimationFrame.$callback) {
      var callback = window.requestAnimationFrame.$callback
      window.requestAnimationFrame.$callback = null
      callback()
    }
  }
  window.XMLHttpRequest = (function() {
    var request = function() {
      this.$headers = {}
      this.setRequestHeader = function(key, value) {
        this.$headers[key] = value
      }
      this.open = function(method, url) {
        this.method = method
        this.url = url
      }
      this.send = function() {
        this.responseText = JSON.stringify(this)
        this.readyState = 4
        this.status = 200
        request.$instances.push(this)
      }
    }
    request.$instances = []
    return request
  }())
  window.location = {search: "", pathname: "", hash: ""}
  window.history = {}
  window.history.$$length = 0
  window.history.pushState = function(data, title, url) {
    window.history.$$length++
    window.location.pathname = window.location.search = window.location.hash = url
  }
  window.history.replaceState = function(data, title, url) {
    window.location.pathname = window.location.search = window.location.hash = url
  }

  // Custom

  window.screen = {
    availHeight: 820,
    availLeft: 0,
    availTop: 23,
    availWidth: 1440,
    colorDepth: 24,
    height: 900,
    orientation: {},
    pixelDepth: 24,
    width: 1440
  };

  return window;
}