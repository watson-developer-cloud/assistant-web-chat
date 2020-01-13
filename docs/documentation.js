/**
 * This file grabs the markdown from the public docs and converts it to HTML.
*/

function httpGetAsync(url, callback) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) callback(xmlHttp.responseText);
  };
  xmlHttp.open('GET', url, true);
  xmlHttp.send(null);
}
const documentation = document.querySelector('#documentation');
const url = 'https://raw.githubusercontent.com/watson-developer-cloud/assistant-web-chat/master/API.md';
httpGetAsync(url, function(text) {
  const converter = new showdown.Converter({ tables: true, ghCompatibleHeaderId: true });
  const html = converter.makeHtml(text);
  const div = document.createElement('div');
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
    const text = th.textContent;
    th.innerHTML = '<span class="bx--table-header-label">' + text + '</span>';
  });
  documentation.appendChild(div);
  documentation.querySelectorAll('pre code').forEach(function(block) {
    hljs.highlightBlock(block);
  });
  if (window.location.hash) {
    const el = document.querySelector(window.location.hash);
    el.scrollIntoView();
  }
});
