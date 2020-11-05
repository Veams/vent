[//]: # ({{#wrapWith "content-section"}})

[//]: #     ({{#wrapWith "grid-row"}})
[//]: #         ({{#wrapWith "grid-col" colClasses="is-col-tablet-l-8"}})

# Vent (`@veams/vent`)

Vent is a simple publish and subscribe system you can use to communicate between modules independently.

---------------------

## Installation

### NPM

``` bash 
npm install @veams/vent --save
```

### Yarn 

``` bash 
yarn add @veams/vent
```

---------------------

## Standalone Usage

Use Vent to trigger events globally and subscribe to it!

## Example

### Default events like `click`, `resize` and more

``` js
import createVent from '@veams/vent';

const Vent = createVent(); // If using the plugin you do not need this and have the functionality available in the namespace (like `Veams.Vent`)

// Let's add a throttle to the scroll event and trigger that
window.onscroll = Veams.helpers.throttle((e) => {
    Vent.publish('scroll', e);
}, 200);

// Now we can easily catch that ...
Vent.subscribe('scroll', () => {
    console.log('Throttled scroll captured ... ');
});
```

### Custom events

``` js
import createVent from '@veams/vent';

const Vent = createVent(); // If using the plugin you do not need this and have the functionality available in the namespace (like `Veams.Vent`)

const dataHandler = (data) => {
    // Make something with the data ...
    console.log('my custom data received by publish(): ', data);
})

Vent.subscribe('custom:event', dataHandler);

Vent.subscribe('resize', () => {
    // First we want to publish it, so that `dataHandler()` will be executed
    Vent.publish('custom:event', {
        testData: 'My test data'
    });
	
    // After that we unsubscribe to make sure that `dataHandler()` is only executed once
    Vent.unsubscribe('custom:event', dataHandler);
});
```

## Veams Plugin

Additionally we have a plugin in place giving you the flexibility to use `@veams/vent` in the Veams eco system. 
Veams exposes a global event object (`Veams.EVENTS`) which can be used and extended by this plugin.

The module extends the default `EVENTS` object of Veams when you pass the option called `furtherEvents`.

### Usage

``` js
import Veams from '@veams/core';
import VentPlugin from '@veams/vent/lib/plugin/vent';
import EVENTS from './custom-events';

// Intialize core of Veams
Veams.onInitialize(() => {
    // Add plugins to the Veams system
    Veams.use(VentPlugin, {
        furtherEvents: EVENTS
    });
});
```

### Options

| Option | Type | Default | Description |
|:--- |:---:|:---:|:--- |
| _furtherEvents_ | {`Object`} | [`false`] | Add your custom events to the global events object of Veams. |

## Api

When enabled the Api provides a way to subscribe and unsubscribe from global events and publish to the subscribers.

#### Vent.subscribe(`name:string`, `callback:function`)

_alias: `.on()`_

* @param {`String`} name - Event name which you subscribed to.
* @param {`Function`} callback - The callback function which get executed when event is triggered.

#### Vent.unsubscribe(`name:string`, `callback:function`)

_alias: `.off()`_

* @param {`String`} name - Event name which you have subscribed to.
* @param {`Function`} callback - The callback function which is registered.

#### Vent.publish(`name:string`, `obj?:object`, `scope?:any`)

_alias: `.trigger()`_

* @param {`String`} name - Event name which you have subscribed to.
* @param {`Object`} obj - Optional custom data object which you can pass.
* @param {`scope`} any - Optional scope/context on which you want to execute `.call()`.


[//]: #         ({{/wrapWith}})
[//]: #     ({{/wrapWith}})

[//]: # ({{/wrapWith}})
