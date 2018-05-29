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
export declare class StateMachine {
    transitions: FSMStates;
    current: string;
    error: any;
    events: any;
    /**
     * Finite State Machine: Constructor
     * @param {FSMStates} states
     * @param {string} initial
     * @param {Function} error
     * @param {FSMMethods} methods
     */
    constructor({states, initial, error, methods}: FSMConfiguration);
    /**
     * Attach an event handler function for one or more events
     * @param {string} event
     * @param {Function} handler - A function to execute when the event is triggered.
     * @returns {StateMachine}
     */
    on(event: string, handler: Function): this;
    /**
     * Remove an event handler
     * @param event
     * @param handler - A handler function previously attached for the event(s)
     * @returns {StateMachine}
     */
    off(event: any, handler: Function): this;
    /**
     * Transition to different state with state params
     * @param next
     * @param params
     * @returns {StateMachine}
     */
    to(next: any, ...params: any[]): this;
    /**
     * The onError event is triggered if an error occurs
     * @param args
     */
    private onError(args);
    /**
     * Synchronously calls each of the listeners registered for the event named eventName,
     * in the order they were registered, passing the supplied arguments to each.
     * @param {string} eventName
     * @param args
     */
    private emit(eventName, args);
}
