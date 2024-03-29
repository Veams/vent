'use strict';

/**
 * Imports
 */
import { extend } from '@veams/helpers';
import createEventHandling from '../index.js';

/**
 * Interfaces
 */
export interface IEvents {
  [name: string]: string;
}

export interface IVentOptions {
  furtherEvents?: IEvents;
}

export interface IVeamsExtendedByVent {
  Vent: any;
  EVENTS: IEvents;
}

export interface IVentPlugin {
  options: IVentOptions;
  pluginName: string;
  initialize: any;
}

/**
 * Represents a Vent plugin which creates an empty object.
 * The object will be used as publish/subscribe plugin.
 *
 * The module extends the default EVENTS object of Veams
 * when you pass the option called 'furtherEvents'.
 *
 * @module VeamsVent
 *
 * @author Sebastian Fitzner
 */
const VentPlugin: IVentPlugin = {
  options: {
    furtherEvents: {},
  },
  pluginName: 'Vent',
  initialize: function (Veams, opts: IVentOptions): IVeamsExtendedByVent {
    if (opts) {
      this.options = extend(this.options, opts || {});
    }

    Veams.Vent = createEventHandling();
    Veams.EVENTS = extend(Veams.EVENTS, this.options.furtherEvents);

    return Veams;
  },
};

export default VentPlugin;
