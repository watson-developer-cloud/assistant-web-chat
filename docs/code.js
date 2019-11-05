// This file takes the actual code written to make the Web Chat run on this page, and copies and formats it on the html
// page when rendered.

// THERE ARE NO WEB CHAT EXAMPLES IN THIS CODE, THIS CODE IS JUST TO STYLE THE EXAMPLE PAGES.

var container = document.createElement('div');
container.classList.add('container');
container.innerHTML = '<header id="header" class="bx--header" aria-label="IBM Watson Assistant Web Chat Examples" role="banner"><a class="bx--header__name" href="index.html"><span class="bx--header__name--prefix">IBM</span>&nbsp;Watson Assistant Web Chat Examples</a></header><div class="bx--content"><nav id="nav" class="bx--breadcrumb" aria-label="breadcrumb"><div class="bx--breadcrumb-item"><a href="index.html" class="bx--link">Home</a></div><div class="bx--breadcrumb-item"><a href="examples.html" class="bx--link">Examples</a></div><div class="bx--breadcrumb-item">' + TITLE + '</div></nav><div class="content"><h2 id="title">' + TITLE + '</h2><div id="text_content">' + TEXT_CONTENT + '</div><div id="try_it_out"><button class="bx--btn bx--btn--primary bx--btn--sm" type="button" disabled>Try ' + TITLE + '</button></div></div><div id="files"></div><div class="content" id="code"><h3>Example Code</h3><pre><code></code></pre></div></div>';


// Add all the example code and format it with highlight js.
var code_element = container.querySelector('code');
var custom_content = document.querySelector('#custom_content');

if (code_element && custom_content) {
  code_element.textContent = '<script src="https://assistant-web.watsonplatform.net/loadWatsonAssistantChat.js"></script>\n<script>\n\n    var config = { integrationID: "' + INTEGRATION_ID + '", region: "' + REGION + '" };\n' + custom_content.textContent + '\n</script>';
}

container.querySelectorAll('pre code').forEach(function(block) {
  hljs.highlightBlock(block);
});

// Populate the "try it out" link.

var tryItLink = container.querySelector('#try_it_out');

function writeTryItLink() {
  if(window.instance) {
    clearInterval(tryItCheck);
    var button = tryItLink.querySelector('button');
    button.onclick = function() {
      window.instance.openWindow();
    }
    button.removeAttribute('disabled');
  }
}

if (tryItLink) {
  var tryItCheck = setInterval(writeTryItLink, 1000);
}

if (FILES.length) {
  var files = container.querySelector('#files');
  var html = '<div class="files"><h3>Related files</h3><div>Files needed to be able to run this example locally.</div>';
  html += '<section class="bx--structured-list"><div class="bx--structured-list-tbody">';
  FILES.forEach(function(file, index) {
    html += '<div class="bx--structured-list-row"><div class="bx--structured-list-td"><h4>' + file.name + '</h4>' + file.description + '</div><div class="bx--structured-list-td"><a download class="bx--btn bx--btn--primary bx--btn--sm" href="' + file.href + '">Download</a></div></div>';
  });
  html += '</div></section></div>';
  files.innerHTML = html;
}

document.body.appendChild(container);