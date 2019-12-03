Welcome to [Watson Assistant](https://www.ibm.com/cloud/watson-assistant/) Web Chat. With just a few lines of code, you can add a Web Chat widget to your website and take advantage of all the best and newest that Watson Assistant has to offer.

This repository is meant for developers who have deployed Web Chat from Watson Assistant and are looking to embed, configure, customize and extend their Web Chat instance. Web Chat is only available to Plus or Premium Watson Assistant plans.

In this documentation, _Web Chat_ refers to the widget code in this repository; _your assistant_ refers to the assistant you have configured within your Watson Assistant service instance.

## Table of Contents

- [Table of Contents](#table-of-contents)
  - [Browser Support](#browser-support)
- [Configuration](#configuration)
  - [Theming](#theming)
    - [Customizable Variables](#customizable-variables)
  - [Languages](#languages)
    - [Available Locales](#available-locales)
- [Managing Your Web Chat After Initialization](#managing-your-web-chat-after-initialization)
  - [instance.render()](#instancerender)
  - [instance.on()](#instanceon)
  - [instance.off()](#instanceoff)
  - [instance.once()](#instanceonce)
  - [instance.send()](#instancesend)
  - [instance.updateLanguagePack()](#instanceupdatelanguagepack)
  - [instance.getLocale()](#instancegetlocale)
  - [instance.updateUserID()](#instanceupdateuserid)
  - [instance.toggleOpen()](#instancetoggleopen)
  - [instance.openWindow()](#instanceopenwindow)
  - [instance.closeWindow()](#instanceclosewindow)
  - [instance.destroy()](#instancedestroy)
- [Events](#events)
  - [Events summary](#events-summary)
  - [Event callbacks](#event-callbacks)
  - [Managing Context](#managing-context)
  - [Event details](#event-details)
    - [`pre:send`](#presend)
    - [`send`](#send)
    - [`pre:receive`](#prereceive)
    - [`receive`](#receive)
    - [`error`](#error)
    - [`customResponse`](#customresponse)
    - [`window:open`](#windowopen)
    - [`window:close`](#windowclose)
    - [Wildcard (`*`)](#wildcard)

### Browser Support

If the last two versions of a browser add up to more than 1% of all web traffic we support it. We support the last two versions of the following browsers unless noted.

**Desktop:** IE11 (most recent IE), Edge, Firefox, Firefox ESR (most recent ESR), Chrome, Safari, Opera

**Mobile:** Safari, Chrome for Android, Samsung Mobile Browser, UC Browser for Android, Mobile Firefox

## Configuration

When you create a Web Chat integration in the Watson Assistant UI, you are given a small embed code to add to your website that looks similar to this example:

```html
<script src="https://assistant-web.watsonplatform.net/loadWatsonAssistantChat.js"></script>
<script>
  var options = {
    integrationID: 'YOUR_INTEGRATION_ID', // A UUID like '1d7e34d5-3952-4b86-90eb-7c7232b9b540'
    region: 'YOUR_REGION' // 'us-south', 'us-east', 'jp-tok' 'au-syd', 'eu-gb', 'eu-de', etc
  };
  window.loadWatsonAssistantChat(options).then(function(instance) {
    instance.render().then(function() {
      console.log('Web Chat has rendered and fetched initial welcome message');
    });
  });
</script>
```

There are additional configuration options you can use to control how your Web Chat instance behaves, including language strings and custom styling.

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| options | <code>Object</code> | Required |  | Web Chat configuration options |
| options.integrationID | <code>string</code> | Required |  |The integration ID of your Web Chat integration. This is exposed as a UUID (for example, `1d7e34d5-3952-4b86-90eb-7c7232b9b540`). |
| options.region | <code>string</code> | Required |  |Which data center your integration was created in (for example, `us-south`). |
| options.userID | <code>string</code> | Optional |  | An ID that uniquely identifies the end user at run time. This can be used to delete the user's data on request, in compliance with GDPR. **Note: this configuration item will be replaced by a JWT based authentication mechanism before this project leaves beta. This configuration option will likely be removed at that time.**
| options.subscriptionID | <code>string</code> | Optional | | The ID of your subscription. For Premium instances, this option is required and is provided in the snippet that you copy and paste. If you are not using a Premium instance, this ID is absent.
| options.cssVariables | <code>object</code> | Optional | |This is a map that can be used to override the values for styling variables in the application. These styles will merge with whatever you have set inside the Watson Assistant configuration page. If there is a conflict, that values set here will override those set inside Watson Assistant. For details on specific values you can set, see [Theming](#theming). |
| options.showLauncher | <code>boolean</code> | Optional | <code>true</code> | Whether to render the chat launcher element used to open and close the chat window. If you specify `false`, your website code is responsible for firing [instance.openWindow()](#instanceopenwindow) from your own chat launcher. Alternatively, you can use `options.openChatByDefault` to open the chat interface at initialization. |
| options.openChatByDefault | <code>boolean</code> | Optional | <code>false</code> | Whether to render the chat window initially in an open state. By default, the chat window is rendered in a closed state. |
| options.languagePack | <code>Object</code> | Optional |  | An object with strings in the format of the `.json` files in the [languages folder](https://github.com/watson-developer-cloud/assistant-web-chat/tree/master/languages). See [the languages section](#languages) for more details. This setting replaces all of the default strings based on your `options.locale` setting. This setting performs a replacement rather than a merge, so the provided language pack must contain a full set of strings.
| options.locale | <code>string</code> | Optional |  | The locale to use for UI strings and date string formatting. See [the languages section](#languages) for the available locales. By default, the locale is automatically detected based on the browser language preferences. If the browser language is not a supported language, the default is US English (`en`). |
| options.element | <code>Element</code> | Optional |  | The containing DOM element where the Web Chat widget should be rendered within the page. By default, Web Chat generates its own element. |
| options.debug | <code>boolean</code> |  Optional | <code>false</code> | Automatically adds a listener that outputs a console message for each event and sends other logging info to console.log.

### Theming

As part of your [Configuration Options](#configuration) for your Web Chat, you have the ability to
provide variables for theming your widget. This will allow you to make the Web Chat match your brand on your website.

The list of customizable variables is short for now, but it will expand significantly by the time beta testing completes and Web Chat becomes a generally available feature of Watson Assistant.

**Example**
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

#### Customizable Variables

| Key | Default | Description |
| --- | --- | --- |
| BASE-z-index | 8000 | The z-index on your website that the Web Chat is assigned to. |

### Languages

The [languages folder](https://github.com/watson-developer-cloud/assistant-web-chat/tree/master/languages) contains [ICU Message Format](http://userguide.icu-project.org/formatparse/messages) JSON representations of all of the languages that are supported by both Watson Assistant dialog skills and the Web Chat widget. Web Chat defaults to English (US), but you can pass in an object of language strings with
[the updateLanguagePack](#instanceupdatelanguagepack) method.

*Note that the provided JSON object does not need to contain all strings, but just the strings you want to update. Your changes will be merged with the existing language strings.*

Even if you do not need to change languages, you can also edit these strings if you want to customize the messages for branding or stylistic reasons.

#### Available Locales

In addition to language strings, we allow a more specific setting of `locale`. A `locale` goes beyond language strings.

A `locale` also controls the format dates and times the web chat shows. For instance, date strings in UK English vs US
English will be different (DD-MM-YYYY vs MM-DD-YYYY). This setting does NOT automatically change any strings in your
dialog or search skill, but applies to any strings generated by Web Chat itself. The current accepted locales are listed
below. They are a superset of the languages available for your dialog skill.

 **Available locales**: ar, 'ar-dz', 'ar-kw', 'ar-ly', 'ar-ma', 'ar-sa', 'ar-tn', cs, de, 'de-at', 'de-ch', en, 'en-sg', 'en-au', 'en-ca', 'en-gb', 'en-ie', 'en-il', 'en-nz', es, 'es-do', 'es-us', fr, 'fr-ca', 'fr-ch', it, 'it-ch', ja, ko, pt, 'pt-br', zh, 'zh-cn', 'zh-tw'

## Managing Your Web Chat After Initialization

After you have started your Web Chat with your configuration, the returned instance has an API to allow you to [manage
events](#events) flowing to or from the Web Chat. This instance also enables you to request that the widget perform
certain actions. The event system is the key to extending and manipulating the Web Chat on your own website. For more
details about the supported events, see [Events](#events).

You can subscribe to events using the [`on`](#instance.on) and [`once`](#instance.once) methods. Event handlers are called in the order in which they were registered.

```html
<script src="https://assistant-web.watsonplatform.net/loadWatsonAssistantChat.js"></script>
<script>
  var options = {
    integrationID: 'YOUR_INTEGRATION_ID',
    region: 'YOUR_REGION'
  };
  window.loadWatsonAssistantChat(options).then(function(instance) {
    // Your handler
    function handler(obj) {
      console.log(obj.type, obj.data);
    }
    console.log('instance', instance);

    // console.log out details of any "receive" event
    instance.on({ type: "receive", handler: handler });
    // console.log out details of any "send" event
    instance.on({ type: "send", handler: handler });

    // 30 seconds later, unsubscribe from listening to "send" events
    setTimeout(function(){
      instance.off({ type: "send", handler: handler});
    }, 30000);

    // Actually render the Web Chat.
    instance.render();
  });
</script>
```

<a name="instance.render"></a>
### instance.render()

Renders the Web Chat on your page.

This method returns a Promise that succeeds if you successfully render. As part of the render process we fetch your
welcome message. If you want to include our fetch of the welcome message in your `pre:send` or `pre:receive` event
handlers, register them before you call the `render` method. If not, do so when the promise is returned.

**Example**
```js
  window.loadWatsonAssistantChat(options).then(function(instance) {
    instance.render().then(function() {
      console.log('It worked!')
    }).catch(e => {
      console.error(e);
    });
  });
```

<a name="instance.on"></a>
### instance.on()
Subscribes to a type of event, using a callback that will be called whenever events of the specified type are fired. You can register as many subscriptions to an event type as you want. Subscriptions are called in order, starting with the first registered.

This method returns the instance itself, for chaining purposes.

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| options | <code>Object</code> | Required | | Method options. |
| options.type | <code>string</code> | Required | | The event to listen to (for example, `*` or `send`). For more information, see [Events](#events). |
| options.handler | <code>function</code> | Required | | The callback that will handle the event. |

**Example**
```js
  window.loadWatsonAssistantChat(options).then(function(instance) {
    // Your handler
    function handler(obj) {
      console.log(obj.type, obj.data);
    }

    instance.on({ type: "receive", handler: handler });
    instance.on({ type: "send", handler: handler });

    // You can also pass AN ARRAY of objects to the method

    instance.on([
      { type: "receive", handler: handler },
      { type: "send", handler: handler }
    ]);

    // Render your Web Chat.
    instance.render();
  });
```

<a name="instance.off"></a>
### instance.off()
Removes a subscription to an event type. After you remove a subscription, the callback handler is no longer called for that event type.

This method returns the instance itself, for chaining purposes.

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| options | <code>Object</code> | Required |  | Method options. |
| options.type | <code>string</code> | Required |  | The event type you no longer want to listen for (for example, `*` or `send`). For more information, see [Events](#events). |
| options.handler | <code>function</code> | Optional |  | A reference to the callback you want to unsubscribe. Specify this parameter to indicate which callback you want to unsubscribe, if you have subscribed multiple callbacks to the same event type. By default, all subscriptions registered to the event type are removed. |

**Example**
```js
  window.loadWatsonAssistantChat(options).then(function(instance) {
    // Your handler
    function handler(obj) {
      console.log(obj.type, obj.data);
    }

    instance.on({ type: "receive", handler: handler });
    instance.on({ type: "send", handler: handler });

    instance.off({ type: "receive", handler: handler });
    instance.off({ type: "send", handler: handler });

    // You can also pass AN ARRAY of objects to the method

    instance.on([
      { type: "receive", handler: handler },
      { type: "send", handler: handler }
    ]);

    instance.off([
      { type: "receive", handler: handler },
      { type: "send", handler: handler }
    ]);

    // You can also just "unsubscribe from all" by not passing a handler
    instance.on({ type: "send", handler: handler });
    instance.off({ type: "send" });

    // Render your Web Chat.
    instance.render();
  });
```

<a name="instance.once"></a>
### instance.once()
Subscribes an event handler as a listener for only one occurrence of the specified event type. After the next event of the specified type is handled, this handler is automatically removed.

This method returns the instance itself, for chaining purposes.

| Parameter| Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| options | <code>Object</code> | Required |  | Method options. |
| options.type | <code>string</code> | Required |  | The event type to listen for (for example, `*` or `send`). For more information, see [Events](#events). |
| options.handler | <code>function</code> | Required |  | The callback that will handle the event. See [Events](#events). |

**Example**
```js
  window.loadWatsonAssistantChat(options).then(function(instance) {
    // Your handler
    function handler(obj) {
      console.log(obj.type, obj.data);
    }

    var mockSendObject = {};

    instance.once({ type: "send", handler: handler });

    instance.send(mockSendObject);

    // The subscription is now removed.

    // You can also pass AN ARRAY of objects to the method

    instance.once([
      { type: "receive", handler: handler },
      { type: "send", handler: handler }
    ]);

    // Render your Web Chat.
    instance.render();
  });
```

<a name="instance.send"></a>
### instance.send()
Sends the specified message to the assistant. This results in [`pre:send`](#event-presend) and [`send`](#event-send) events being fired on the event bus.

This method returns a Promise that resolved successfully if the message was successfully sent.

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| message | <code>Object</code> | Required |  | A v2 message request object. (For more information, see [the API Reference](https://cloud.ibm.com/apidocs/assistant-v2#send-user-input-to-assistant).) |
| options | <code>Object</code> |  |  | Method options. |
| options.silent | <code>Boolean</code> |  |  | Whether the message should be hidden from the UI. If this option is set to `true`, the message is sent to the assistant, but does not appear in the Web Chat UI. |

**Example**
```js
var sendObject = {
  "input": {
    "message_type": "text",
    "text": "get human agent"
  }
};
var sendOptions = {
  "silent": true
}
instance.send(mockSendObject, sendOptions).catch(function(error) {
  console.error('This message did not send!');
});
```

<a name="instance.updateLanguagePack"></a>
### instance.updateLanguagePack()
Updates the current language pack with the values from the provided language pack. This language pack does not need to be complete; only the strings it contains are updated, and all other strings remain unchanged. If you need to make an update based on the user's locale, use [getLocale](#instance.getLocale) to identify the current locale.

**Example**
```js
var languagePack = {};
instance.updateLanguagePack(languagePack);
```

<a name="instance.getLocale"></a>
### instance.getLocale()
Returns the current locale in use by the widget. Note that this might not match the locale that was specified in the original configuration, if that value was invalid or if the locale has since been changed.

This method returns a string containing the language code or the language and region codes (for example, `en` or `en-us`).

**Example**
```js
console.log(instance.getLocale());
```

<a name="instance.updateUserID"></a>
### instance.updateUserID()
Sets the ID of the current user who is interacting with the Web Chat widget at run time. This method can be used only to set the user ID if it has not previously been set. It cannot be used to change to a different user ID. **This method is going to be replaced by a JWT based auth mechanism before Web Chat leaves beta.**

**Example**
```js
instance.updateUserID('some-user-id');
```

<a name="instance.toggleOpen"></a>
### instance.toggleOpen()
Toggles the current open or closed state of the window.

**Example**
```js
instance.toggleOpen();
```

<a name="instance.openWindow"></a>
### instance.openWindow()
Opens the chat window if it is currently closed, and fires the [`window:open`](#event-windowopen) event.

**Example**
```js
instance.openWindow();
```

<a name="instance.closeWindow"></a>
### instance.closeWindow()
Closes the chat window if it is currently open, and fires the [`window:close`](#event-windowclose) event.

**Example**
```js
instance.closeWindow();
```

<a name="instance.destroy"></a>
### instance.destroy()
Destroy the Web Chat widget and return initial content to the DOM. The chat window and chat launcher are both destroyed. All subscriptions to events are removed.

**Example**
```js
instance.destroy();
```

## Events

The Web Chat uses an event system to communicate with your website. With these events you can build your own custom UI responses, send messages to your assistant from your website code, or even have your website react to changes of state within the Web Chat. See the [examples for how to use events](https://watson-developer-cloud.github.io/assistant-web-chat/examples.html).

### Events summary

The following table summarizes the events that are fired by Web Chat. For more information about an event, see [Event details](#event-details).

| Event | Fired When |
| --- | --- |
| [*](#event-wildcard) | Fired with every event.
| [pre:send](#event-presend) | Fired before the Web Chat sends a message to your assistant, before the `send` event.
| [send](#event-send) | Fired when the Web Chat sends a message to your assistant, after the `pre:send` event.
| [pre:receive](#event-prereceive) | Fired before the Web Chat receives a response from your assistant, before the `receive` event.
| [receive](#event-receive) | Fired when the Web Chat receives a response from your assistant, after the `pre:receive` event.
| [error](#event-error) | Fired when the Web Chat encounters an error.
| [customResponse](#event-customResponse) | Fired if a response with an unrecognized or `user_defined` response type is received.
| [window:open](#event-windowopen) | Fired when the chat window is opened.
| [window:close](#event-windowclose) | Fired when the chat window is closed.

### Event callbacks

When an event fires, subscribed callbacks are called in the order in which they were subscribed using the `on` or `once` method. Each callback parameter is an object:

```javascript
{
  type: 'string',
  data: {} //object specific to event type
}
```

To prevent accidental reassignment of data that might be in use by other methods, the parameters for most callbacks are
deep clones of the event data rather than references to the original objects. The exceptions are the `pre:send` and
`pre:receive` events. These events do provide references to the original objects, making it possible for your code to
manipulate the data before it is passed on to the `send` or `receive` events. For example, you might use the `pre:send`
event to modify context variables before sending a message to your assistant.

By default, Event callbacks require no return value. However, you may *optionally* return a Promise object. In that case
we will pause processing the queue of events until the Promise is resolved. This is helpful for asyncronyous methods
that need to be called when you are pre-processing data from your `pre:send` or `pre:receive` event handlers.

### Managing Context

The Web Chat is build on top of the v2 Watson Assistant API. In the v1 version of the Watson Assistant API, developers
had to manage context on their own. With the v2 version of the API, we manage context for you as part of the session. This means you do not have to pass
context back and forth on every message from the Web Chat, but it will be available in your dialog skill. If you do pass
in context variables (see [`pre:send`](#presend)), it will merge with the
existing context in memory. When merging, the variables you are passing in will overwrite existing values if there is a conflict. See the
Watson Assistant documentation sections on [Create a
session](https://cloud.ibm.com/apidocs/assistant-v2#create-a-session) and [Send user input to an
Assistant](https://cloud.ibm.com/apidocs/assistant-v2#send-user-input-to-assistant) for more information on sessions in
the v2 API.

### Event details

<a name="event-presend"></a>

#### `pre:send`

Fired when sending a message to the assistant, before the `send` event. The `pre:send` event gives you the opportunity to synchronously manipulate the object referenced by `event.data` before the Web Chat passes it to the `send` event (for example, to update context data).

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | The event |
| event.type | <code>String</code> | Event type (`pre:send`) |
| event.data | <code>Object</code> | A v2 `message` API request object. (For more information, see the [API Reference](https://cloud.ibm.com/apidocs/assistant-v2#send-user-input-to-assistant).) Note that this parameter is a reference to the object that will be sent, so you can modify it in place. |

**Example**

```js
/**
 * Console out the context object.
 */
function handler(event) {
  console.log(event.data.context); // You can also manipulate context here.
  console.log(event.data.input); // You can also manipulate input here. Maybe filter private data?
}
instance.on({ type: "pre:send", handler: handler });
```

<a name="event-send"></a>

#### `send`

Fired when sending a message to the assistant, after the `pre:send` event. This event indicates that the message has been sent to the assistant.

| Parameter | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | The event |
| event.type | <code>String</code> | Event type (`send`) |
| event.data | <code>Object</code> | A v2 `message` API request object. (For more information, see the [API Reference](https://cloud.ibm.com/apidocs/assistant-v2#send-user-input-to-assistant).) This parameter is a copy of the message that was sent.|

**Example**

```js
function handler(obj) {
  console.log(obj.type, obj.data);
}
instance.on({ type: "send", handler: handler });
```

<a name="event-prereceive"></a>

#### `pre:receive`

Fired when receiving a response from the assistant, before the `receive` event. The `pre:receive` event gives you the opportunity to synchronously manipulate the object referenced by `event.data` before the Web Chat passes it to the `receive` event for processing.

| Parameter | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | The event |
| event.type | <code>String</code> | Event type (`pre:receive`)|
| event.data | <code>Object</code> | A v2 `message` API response object. (For more information, see the [API Reference](https://cloud.ibm.com/apidocs/assistant-v2#send-user-input-to-assistant).) Note that this parameter is a reference to the object that will be received, so you can modify it in place.|

**Example**

```js
/**
 * Override our response_type for options with one of your own.
 */
function handler(event) {
  var generic = event.data.output.generic;
  for (var i = 0; i < generic.length; i++) {
    var item = generic[i];
    if (item.response_type === "options") {
      item.response_type = "my_custom_options_override";
    }
    if (item.response_type === "connect_to_agent") {
      item.response_type = "text";
      item.text = "All our agents are busy, please call us at 555-555-5555."
    }
  }
}
instance.on({ type: "pre:receive", handler: handler });
```

<a name="event-receive"></a>

#### `receive`

Fired when the Web Chat receives a response from your assistant, after the `pre:receive` event. This event indicates that the response has been received; if the response type is recognized, the response is then rendered in your chat window.

| Parameter | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | The event |
| event.type | <code>String</code> | Event type (`receive`)|
| event.data | <code>Object</code> | A v2 `message` API response object. (For more information, see the [API Reference](https://cloud.ibm.com/apidocs/assistant-v2#send-user-input-to-assistant).) This parameter is a copy of the response that was received.|

**Example**

```js
/**
 * Console.log out intents on every message you receive from your Assistant.
 */
function handler(event) {
  console.log('intents:', event.data.output.intents);
}
instance.on({ type: "receive", handler: handler });
```

<a name="event-error"></a>

#### `error`

Fired when the Web Chat encounters an error (including network, response format, or uncaught code errors).

| Parameter | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | The event |
| event.type | <code>String</code> | Event type (`error`)|
| event.data | <code>Object</code> | Error data |

<a name="event-customResponse"></a>

#### `customResponse`

Fired when the Web Chat receives a response with an unrecognized response type from your assistant. The event includes
the response data and the DOM element where any response should be rendered. Based on the response type, you can choose
to render a custom view, perform an action on your website, or both.

There are two use cases for this event.

1) A `user_defined` response type. This is a response type that allows you to define your own content. You also have a
   chance to mark your `user_defined` response type as `silent` and not render anything, but throw an action on your web
   page, instead. For instance, you could kick off a tutorial or interact with other widgets on your web page. Please see
   [the examples on user_defined response types](https://watson-developer-cloud.github.io/assistant-web-chat/examples.html).
2) A known response type that the Web Chat does not handle. _Currently_, the Web Chat does not have support for the
   `connect_to_agent` response type outside of the private beta program.

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | The event |
| event.type | <code>String</code> | Event type (`customResponse`) |
| event.data | <code>Object</code> | Event data |
| event.data.message | <code>Object</code> | A v2 message API Response object. (For more information, see the [API Reference](https://cloud.ibm.com/apidocs/assistant-v2#send-user-input-to-assistant).) This parameter is a copy of the response that was received. |
| event.data.element | <code>Element</code> | A DOM element inside the chat window where the response should be rendered. This will be null if a `user_defined` message has the `silent` attribute set to `true`.  |

**Example**

```js
function handler(event) {
  var type = event.type;
  var message = JSON.stringify(event.data.message);
  var element = event.data.element;
  if (type === "my_silly_response_type") {
    element.innerHTML = message;
  }
}
instance.on({ type: "customResponse", handler: handler });
```

<a name="event-windowopen"></a>

#### `window:open`

Fired when the Web Chat window opens.

| Parameter | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | The event |
| event.type | <code>String</code> | Event type (`window:open`) |

<a name="event-windowclose"></a>

#### `window:close`

Fired when the Web Chat window closes.

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | The event |
| event.type | <code>String</code> | Event type (`window:close`) |

<a name="wildcard"></a>

#### Wildcard (`*`)

Wildcard event. When any event is fired, callbacks that are subscribed to the wildcard event are called _after_ any subscriptions to the specific event type.

| Parameter | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | The event |
| event.type | <code>String</code> | Event type |
| event.data | <code>Object</code> | Event data (content depends on event type) |

**Example**

```js
function handler(event) {
  console.log(event.type, event.data);
}
instance.on({ type: "*", handler: handler });
```
