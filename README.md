# Watson Assistant Web Chat (BETA)

This project is currently in BETA.

## Contents

- [Introduction](#introduction)
- [Configuration](#configuration-options)
- [Initializing your Web Chat](#initializing-your-web-chat)
- [Instance API](#instance-api)
- [Events](#events)
- [Event callbacks](#event-callbacks)
- [Event details](#event-details)

## Introduction

Welcome to [Watson Assistant](https://www.ibm.com/cloud/watson-assistant/) Web Chat (BETA). With just a few lines of code, you can add a Web Chat widget to your website and take advantage of all the best and newest that Watson Assistant has to offer.

This repository is meant for developers who have deployed Web Chat from Watson Assistant and are looking to embed, configure, customize and extend their Web Chat instance. Web Chat is only available to Plus or Dedicated Watson Assistant plans.

**Note:** In this documentation, _Web Chat_ refers to the widget code in this repository; _your assistant_ refers to the assistant you have configured within your Watson Assistant service instance.

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

There are additional configuration options you can use to control how your Web Chat instance behaves, including language strings and custom styling. Most users do not need to modify any of these options; the most commonly used is `options.language`.

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| options | <code>Object</code> | Required |  | Web Chat configuration options |
| options.integrationID | <code>string</code> | Required |  |The integration ID of your Web Chat integration. This is exposed as a UUID (for example, `1d7e34d5-3952-4b86-90eb-7c7232b9b540`). |
| options.region | <code>string</code> | Required |  |Which data center your integration was created in (for example, `us-south`). |
| options.userID | <code>string</code> | Optional |  | An ID that uniquely identifies the end user at run time. This can be used to delete the user's data on request, in compliance with GDPR.
| options.subscriptionID | <code>string</code> | Optional | | The ID of your subscription. For Premium instances, this option is required and is provided in the snippet that you copy and paste. If you are not using a Premium instance, this ID is absent.
| options.showLauncher | <code>boolean</code> | Optional | <code>true</code> | Whether to render the chat launcher element used to open and close the chat window. If you specify `false`, your website code is responsible for firing the [launcher:toggle](#launchertoggle-event), [launcher:open](#launcheropen-event) or [launcher:close](#launcherclose-event) events from your own chat launcher. Alternatively, you can use `options.openChatByDefault` to open the chat interface at initialization. |
| options.openChatByDefault | <code>boolean</code> | Optional | <code>false</code> | Whether to render the chat window initially in an open state. By default, the chat window is rendered in a closed state. |
| options.languagePack | <code>Object</code> | Optional |  | An object with strings in the format of the `.json` files in [languages](languages). See [languages/README.md](languages/README.md) for more details. This setting replaces all of the default strings based on your `options.locale` setting. This setting performs a replacement rather than a merge, so the provided language pack must contain a full set of strings.
| options.locale | <code>string</code> | Optional |  | The locale to use for UI strings and date string formatting. See [languages/README.md](languages/README.md) for the available locales. By default, the locale is automatically detected based on the browser language preferences. If the browser language is not a supported language, the default is US English (`en`). |
| options.element | <code>Element</code> | Optional |  | The containing DOM element where the the Web Chat widget should be rendered within the page. By default, Web Chat generates its own element. |
| options.debug | <code>boolean</code> |  Optional | <code>false</code> | Automatically adds a listener that outputs a console message for each event.

## Initializing your Web Chat

The `loadWatsonAssistantChat` method returns a promise that resolves with an instance whose API you can use to subscribe to events and issue actions.

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

    // Actually render the Web Chat. We fetch initial data like your initial welcome message in this step as well.
    instance.render();
  });
</script>
```

## Instance API

The returned instance has an API to allow you to [manage events](#events) flowing to or from the Web Chat. This instance also enables you to request that the widget perform certain actions. The event system is the key to extending and manipulating the Web Chat on your own website. For more details about the supported events, see [Events](#events).

You can subscribe to events using the [`on`](#instance.on) and [`once`](#instance.once) methods. Event handlers are called in the order in which they were registered.

- [Watson Assistant Web Chat (BETA)](#watson-assistant-web-chat-beta)
  - [Contents](#contents)
  - [Introduction](#introduction)
  - [Configuration](#configuration)
  - [Initializing your Web Chat](#initializing-your-web-chat)
  - [Instance API](#instance-api)
    - [instance.render() ⇒ <code>Promise<instance></code>](#instancerender-%e2%87%92-codepromiseinstancecode)
    - [instance.on(options) ⇒ <code>instance</code>](#instanceonoptions-%e2%87%92-codeinstancecode)
    - [instance.off(options) ⇒ <code>instance</code>](#instanceoffoptions-%e2%87%92-codeinstancecode)
    - [instance.once(options) ⇒ <code>instance</code>](#instanceonceoptions-%e2%87%92-codeinstancecode)
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
  - [Examples](#examples)


<a name="instance.render"></a>
### instance.render() ⇒ <code>Promise<instance></code>

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
### instance.on(options) ⇒ <code>instance</code>
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
### instance.off(options) ⇒ <code>instance</code>
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
### instance.once(options) ⇒ <code>instance</code>
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

The Web Chat uses an event system to communicate with your website. With these events you can build your own custom UI responses, send messages to your assistant from your website code, or even have your website react to changes of state within the Web Chat. See the [examples for how to use events](examples/README.md).

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
| [customResponse](#event-customResponse) | Fired if a response with an unrecognized `response_type` is received.
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

To prevent accidental reassignment of data that might be in use by other methods, the parameters for most callbacks are deep clones of the event data rather than references to the original objects. The exceptions are the `pre:send` and `pre:receive` events. These events do provide references to the original objects, making it possible for your code to manipulate the data before it is passed on to the `send` or `receive` events. For example, you might use the `pre:send` event to modify context variables before sending a message to your assistant.

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

Fired when the Web Chat receives a response from your assistant, after the `pre:receive` event. This event indicates that the response has been received; if the `response_type` is recognized, the response is then rendered in your chat window.

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
var myMessage = {
  output: {
    generic: [
      { response_type: 'text', text: 'test' }
    ]
  }
};
instance.fire({ type: "receive", data: myMessage });
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

Fired when the Web Chat receives a response with an unrecognized `response_type` from your assistant. The event includes the response data and the DOM element where any response should be rendered. Based on the response type, you can choose to render a custom view, perform an action on your website, or both.

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | The event |
| event.type | <code>String</code> | Event type (`customResponse`) |
| event.data | <code>Object</code> | Event data |
| event.data.message | <code>Object</code> | A v2 message API Response object. (For more information, see the [API Reference](https://cloud.ibm.com/apidocs/assistant-v2#send-user-input-to-assistant).) This parameter is a copy of the response that was received. |
| event.data.element | <code>Element</code> | A DOM element inside the chat window where the response should be rendered. |

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

<a name="event-wildcard"></a>

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

## Examples

For a full list of examples showing why and how to use these events, see the [Examples](examples/README.md).
