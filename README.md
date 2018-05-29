# MicroFSM
Finite State Machine in TypeScript

### GETTING STARTED

```
npm install sibvrv/MicroFSM
```

### Available scripts

* `npm run build` - transpile TypeScript to ES6

### Lifecycle Events

In addition to the general-purpose events, transitions can be observed using your specific transition and state names:

* `onAfter<TRANSITION>` - fired after a specific TRANSITION completes
* `onBefore<TRANSITION>` - fired before a specific TRANSITION begins
* `on<STATE>` - fired when entering a specific STATE
* `onChange` - fired after any transition

#### Example
```typescript
const state = new StateMachine({
  initial: 'start',
  states: {
    start: ['end', 'start'],
    end: ['start']
  },
  methods: {
    onChange: (prev: string, next: string) => {
      console.log(`State changed from ${prev} to ${next}`);
    },
    onBeforeStart: (prev: string, param: string) => {
      console.log(`We can check the parameters before the start: ${param}`);
    },
    onAfterStart: (next: string) => {
      console.log(`Going to ${next} state`);
    },
    onEnd: (prev: any, param: any) => {
      console.log(`Game over! ${param}`);
    }
  }
});

state.to('end', 'Is it the End of the Line for the RED team?');
state.to('start', 'Hello world!');
```