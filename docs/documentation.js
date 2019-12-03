/**
 * This file grabs the markdown from the public docs and converts it to HTML.
*/

function httpGetAsync(url, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) callback(xmlHttp.responseText);
  };
  xmlHttp.open('GET', url, true);
  xmlHttp.send(null);
}
var documentation = document.querySelector('#documentation');
var url =
  window.location.hostname === 'https://raw.githubusercontent.com/watson-developer-cloud/assistant-web-chat/master/API.md';
httpGetAsync(url, function(text) {
  var converter = new showdown.Converter({ tables: true, ghCompatibleHeaderId: true });
  var html = converter.makeHtml(text);
  var div = document.createElement('div');
  div.innerHTML = html;
  // Add a bunch of CSS classnames.
  div.querySelectorAll('ul').forEach(function(ul) {
    ul.classList.add('bx--list--unordered');
  });
  div.querySelectorAll('ol').forEach(function(ol) {
    ol.classList.add('bx--list--ordered');
  });
  div.querySelectorAll('li').forEach(function(li) {
    li.classList.add('bx--list__item');
  });
  div.querySelectorAll('table').forEach(function(table) {
    table.classList.add('bx--data-table');
  });
  div.querySelectorAll('th').forEach(function(th) {
    var text = th.textContent;
    th.innerHTML = '<span class="bx--table-header-label">' + text + '</span>';
  });
  documentation.appendChild(div);
  documentation.querySelectorAll('pre code').forEach(function(block) {
    hljs.highlightBlock(block);
  });
});
