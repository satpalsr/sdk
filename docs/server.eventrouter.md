<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [server](./server.md) &gt; [EventRouter](./server.eventrouter.md)

## EventRouter class

Manages event emission and assigned listener callbacks.

**Signature:**

```typescript
export default class EventRouter 
```

## Methods

<table><thead><tr><th>

Method


</th><th>

Modifiers


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[emit(eventType, payload)](./server.eventrouter.emit.md)


</td><td>


</td><td>

Emit an event, invoking all registered listeners for the event type.


</td></tr>
<tr><td>

[emitWithGlobal(eventType, payload)](./server.eventrouter.emitwithglobal.md)


</td><td>


</td><td>

Emits an event to the local and global server instance event routers.


</td></tr>
<tr><td>

[emitWithWorld(world, eventType, payload)](./server.eventrouter.emitwithworld.md)


</td><td>


</td><td>

Emits an event to local and provided world event routers.


</td></tr>
<tr><td>

[hasListeners(eventType)](./server.eventrouter.haslisteners.md)


</td><td>


</td><td>

Check if there are listeners for a specific event type.


</td></tr>
<tr><td>

[listenerCount(eventType)](./server.eventrouter.listenercount.md)


</td><td>


</td><td>

Get the number of listeners for a specific event type.


</td></tr>
<tr><td>

[listeners(eventType)](./server.eventrouter.listeners.md)


</td><td>


</td><td>

Get all listeners for a specific event type.


</td></tr>
<tr><td>

[off(eventType, listener)](./server.eventrouter.off.md)


</td><td>


</td><td>

Remove a listener for a specific event type.


</td></tr>
<tr><td>

[offAll(eventType)](./server.eventrouter.offall.md)


</td><td>


</td><td>

Remove all listeners or all listeners for a provided event type.


</td></tr>
<tr><td>

[on(eventType, listener)](./server.eventrouter.on.md)


</td><td>


</td><td>

Register a listener for a specific event type.


</td></tr>
<tr><td>

[once(eventType, listener)](./server.eventrouter.once.md)


</td><td>


</td><td>

Register a listener for a specific event type that will be invoked once.


</td></tr>
</tbody></table>
