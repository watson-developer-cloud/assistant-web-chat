/* eslint-disable prefer-template */
/* eslint-disable header/header */
// This file takes the actual code written to make the Web Chat run on this page, and copies and formats it on the html
// page when rendered.

// THERE ARE NO WEB CHAT EXAMPLES IN THIS CODE, THIS CODE IS JUST TO STYLE THE EXAMPLE PAGES.

const header =
  '<header id="header" class="bx--header" aria-label="IBM Watson Assistant Web Chat Examples" role="banner"><a class="bx--header__name" href="index.html"><span class="bx--header__name--prefix">IBM</span>&nbsp;Watson Assistant Web Chat Examples</a></header>';

function scaffoldContainer(options) {
  const container = document.createElement('div');

  const breadcrumb =
    '<nav id="nav" class="bx--breadcrumb" aria-label="breadcrumb"><div class="bx--breadcrumb-item"><a href="index.html" class="bx--link">Home</a></div><div class="bx--breadcrumb-item"><a href="examples.html" class="bx--link">Examples</a></div><div class="bx--breadcrumb-item">' +
    options.title +
    '</div></nav>';

  const example = options.hideExample
    ? ''
    : '<div class="content" id="code"><h3>Example Code</h3><p>Below is a full html page including all the styles, markup and script needed to run this example. You can cut, paste and run this html file locally with something like <a href="https://www.npmjs.com/package/http-server">http-server</a>.</p><pre><code></code></pre></div>';

  let content =
    '<div class="content"><h2 id="title">' +
    options.title +
    '</h2><p><em>Open the Web Chat on this page to try this out.</em></p><div id="html_content">' +
    options.html_content +
    '</div>';

  content += '</div><div id="files"></div>';

  container.classList.add('container');
  container.innerHTML = header + '<div class="bx--content">' + breadcrumb + content + example + '</div>';
  return container;
}

function addAndFormatSampleCode(container, options) {
  let textContent = '';
  const code_element = container.querySelector('code');
  const template_script = document.querySelector('#template_script');
  const template_styles = document.querySelector('#template_styles');
  const template_html = document.querySelector('#template_html');
  // Add all the example code and format it with highlight js.

  if (code_element) {
    textContent += '<!DOCTYPE html>\n<html>\n<head>\n<title>IBM Watson Assistant Web Chat</title>\n';

    if (template_styles) {
      textContent += '<style type="text/css">\n\t' + template_styles.textContent + '\n</style>\n';
    }

    textContent += '</head>\n<body>\n\n';

    if (template_html) {
      textContent += template_html.innerHTML.trim() + '\n\n';
    }

    if (template_script) {
      textContent +=
        '<script src="https://web-chat.assistant.watson.cloud.ibm.com/loadWatsonAssistantChat.js"></script>\n<script>\n\n    // integrationID and region are required config options to your Web Chat.\n    // We provide them here, but can extend this "options" variable\n    // before we initialize the Web Chat.\n    const options = {\n        integrationID: "' +
        options.integrationID +
        '",\n        region: "' +
        options.region +
        '"\n    };\n' +
        template_script.textContent +
        '\n</script>';
    }

    textContent += '\n</body>\n</html>';
    code_element.textContent = textContent;
  }

  const codeBlocks = container.querySelectorAll('pre code');
  if (Array.isArray(codeBlocks)) {
    for (let i = 0; i < codeBlocks.length; i++) {
      const codeBlock = clodeBlocks[i];
      hljs.highlightBlock(codeBlock);
    }
  }
}

function addDownloadableFiles(container, options) {
  if (options.files && options.files.length) {
    const files = container.querySelector('#files');
    let html =
      '<div class="files"><h3>Related files</h3><div>Files needed to be able to run this example locally.</div>';
    html += '<section class="bx--structured-list"><div class="bx--structured-list-tbody">';
    options.files.forEach(function addFileHTML(file) {
      html +=
        '<div class="bx--structured-list-row"><div class="bx--structured-list-td"><h4>' +
        file.name +
        '</h4>' +
        file.description +
        '</div><div class="bx--structured-list-td"><a download class="bx--btn bx--btn--primary bx--btn--sm" href="' +
        file.href +
        '">Download</a></div></div>';
    });
    html += '</div></section></div>';
    files.innerHTML = html;
  }
}

function writeTemplate(options) {
  const container = scaffoldContainer(options);
  addAndFormatSampleCode(container, options);
  addDownloadableFiles(container, options);
  document.body.appendChild(container);
}
