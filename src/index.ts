/**
 * @module EventsHandler
 *
 * Pub/Sub system for Loosely Coupled logic.
 * Based on Peter Higgins' port from Dojo to jQuery
 * https://github.com/phiggins42/bloody-jquery-plugins/blob/master/pubsub.js
 * adopted https://github.com/phiggins42/bloody-jquery-plugins/blob/55e41df9bf08f42378bb08b93efcb28555b61aeb/pubsub.js
 *
 * modified by Sebastian Fitzner
 *
 */
type Callback = (data: any) => void;

export interface EventHandler<E> {
  publish: (this: EventHandler<E>, topic: E, data?: any, scope?) => void;
  trigger: EventHandler<E>['publish'];
  subscribe: (string: E, callback: Callback) => void;
  on: EventHandler<E>['subscribe'];
  unsubscribe: (topic: E, handle: Callback, completly?: boolean) => void;
  off: EventHandler<E>['unsubscribe'];
}

export default function createEventHandling<E>(): EventHandler<E> {
  const cache: Record<Extract<E, string>, Callback[]> = {} as Record<
      Extract<E, string>,
      Callback[]
    >,
    /**
     *    Events.publish
     *    e.g.:
     *      Events.publish("/Article/added", {article: article}, this);
     *
     *    @class Events
     *    @method publish
     *    @param topic {String}
     *    @param data {Object|String|Number|Null}
     *    @param scope {Object} Optional
     */
    publish: EventHandler<Extract<E, string>>['publish'] = function (
      this,
      topic,
      data,
      scope = this
    ) {
      if (cache[topic]) {
        const thisEvents = cache[topic];
        let i = thisEvents.length - 1;

        for (i; i >= 0; i -= 1) {
          thisEvents[i].call(scope, data);
        }
      }
    },
    /**
     *    Events.subscribe
     *    e.g.: Events.subscribe("/Article/added", Articles.validate)
     *
     *    @class Events
     *    @method subscribe
     *    @param topic {String}
     *    @param callback {Function}
     */
    subscribe: EventHandler<Extract<E, string>>['subscribe'] = function (
      topic: Extract<E, string>,
      callback
    ) {
      const topics = topic.split(' ');

      for (let i = 0; i < topics.length; i++) {
        const topic = topics[i];

        if (!cache[topic]) {
          cache[topic] = [];
        }

        cache[topic].push(callback);
      }
    },
    /**
     *    Events.unsubscribe
     *    e.g.:
     *      var handle = Events.subscribe("/Article/added", Articles.validate);
     *      Events.unsubscribe("/Article/added", Articles.validate);
     *
     *    @class Events
     *    @method unsubscribe
     *    @param topic {String}
     *    @param handle {Function}
     *    @param completly {boolean}
     */
    unsubscribe: EventHandler<Extract<E, string>>['unsubscribe'] = function (
      topic: Extract<E, string>,
      handle,
      completly = false
    ) {
      let i = cache[topic].length - 1;

      if (cache[topic]) {
        for (i; i >= 0; i--) {
          if (cache[topic][i] === handle) {
            cache[topic].splice(i, 1);

            if (completly) {
              delete cache[topic];
            }
          }
        }
      }
    };
  return {
    publish: publish,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    trigger: publish,
    on: subscribe,
    off: unsubscribe,
  };
}
