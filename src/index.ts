/**
 * Finite State Machine: States Interface
 */
export interface FSMStates {
  [state: string]: string[];
}

/**
 * Finite State Machine: User Methods Interface
 */
export interface FSMMethods {
  [eventName: string]: Function;
}

/**
 * Finite State Machine: Configuration Interface
 */
export interface FSMConfiguration {
  initial?: string;
  states?: FSMStates;
  error?: (e: any) => void;
  methods?: FSMMethods;
}

/**
 * Finite State Machine
 */
export class StateMachine {
  transitions: FSMStates;
  current: string;
  error: any;

  events: any = {};

  /**
   * Finite State Machine: Constructor
   * @param {FSMStates} states
   * @param {string} initial
   * @param {Function} error
   * @param {FSMMethods} methods
   */
  constructor({states = {}, initial = '', error = null, methods = {}}: FSMConfiguration) {
    this.transitions = states;
    this.current = initial;
    this.error = error;
    for (let methodName in methods) {
      this.on(methodName, methods[methodName]);
    }
  }

  /**
   * Attach an event handler function for one or more events
   * @param {string} event
   * @param {Function} handler - A function to execute when the event is triggered.
   * @returns {StateMachine}
   */
  public on(event: string, handler: Function) {
    this.events[event] = (this.events[event] || []).concat(handler);
    return this;
  };

  /**
   * Remove an event handler
   * @param event
   * @param handler - A handler function previously attached for the event(s)
   * @returns {StateMachine}
   */
  public off(event: any, handler: Function) {
    if (event in this.events && this.events[event].indexOf(handler) > -1) {
      this.events[event].splice(this.events[event].indexOf(handler), 1);
    }
    return this;
  };

  /**
   * Transition to different state with state params
   * @param next
   * @param params
   * @returns {StateMachine}
   */
  public to(next: any, ...params: any[]) {
    const prev = this.current;

    if (this.transitions[prev].indexOf(next) > -1) {
      this.emit('onAfter' + capitalizeString(prev), [next].concat(params));
      this.emit('onBefore' + capitalizeString(next), [prev].concat(params));
      this.current = next;
      this.emit('on' + capitalizeString(next), [prev].concat(params));
      this.emit('onChange', [prev, next].concat(params));
    } else {
      this.onError([new FSMError(prev, next), prev, next].concat(params));
    }
    return this;
  }

  /**
   * The onError event is triggered if an error occurs
   * @param args
   */
  private onError(args: any) {
    if (typeof this.error === 'function') {
      this.error.apply(this, args);
    } else {
      throw args[0];
    }
  }

  /**
   * Synchronously calls each of the listeners registered for the event named eventName,
   * in the order they were registered, passing the supplied arguments to each.
   * @param {string} eventName
   * @param args
   */
  private emit(eventName: string, args: any) {
    if (eventName in this.events) {
      const eventsList = this.events[eventName];
      for (let i = 0; i < eventsList.length; ++i) {
        try {
          eventsList[i].apply(this, args);
        } catch (e) {
          this.onError([e]);
        }
      }
    }
  }
}

/**
 * Finite State Machine: Custom Error
 */
class FSMError extends Error {
  constructor(from: string, to: string) {
    super();
    this.name = 'IllegalTransitionException';
    this.message = `Transition from "${from}" to "${to}" is not allowed`;

    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, FSMError);
    } else {
      this.stack = (new Error()).stack;
    }
  }
}

/**
 * Capitalize String
 * @param {string} text
 * @returns {string}
 */
function capitalizeString(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
