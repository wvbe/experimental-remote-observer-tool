import { EventEmitter } from './util/EventEmitter.ts';

const EVENTS = new EventEmitter();
EVENTS.silent = false;

export default EVENTS;
