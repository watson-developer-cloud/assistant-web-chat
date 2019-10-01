# Watson Assistant Web Chat Theming

## Overview

As part of your [Configuration Options](../README.md#configuration-options) for your Web Chat, you have the ability to
provide variables for theming your widget. This will allow you to make the Web Chat match your brand on your website.

The list of customizable variables is short for now, but will expand (a lot) as we move toward Web Chat leaving being a BETA
feature of Watson Assistant.

## Example



```html
<script src="https://assistant-web.watsonplatform.net/loadWatsonAssistantChat.js"></script>
<script>
  var options = {
    integrationID: 'YOUR_INTEGRATION_ID', // A UUID like '1d7e34d5-3952-4b86-90eb-7c7232b9b540'
    region: 'YOUR_REGION', // 'us-south', 'us-east', 'jp-tok' 'au-syd', 'eu-gb', 'eu-de', etc
    cssVariables: {
      'BASE-z-index': '99999'
    }
  };
  window.loadWatsonAssistantChat(options).then(function(instance) {
    instance.render();
  });
</script>
```

## Customizable Variables

| Key | Default | Description |
| --- | --- | --- |
| BASE-z-index | 8000 | The z-index on your website that the Web Chat is assigned to. |
