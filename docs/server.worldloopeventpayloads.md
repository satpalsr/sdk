<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [server](./server.md) &gt; [WorldLoopEventPayloads](./server.worldloopeventpayloads.md)

## WorldLoopEventPayloads interface

Event payloads for WorldLoop emitted events.

**Signature:**

```typescript
export interface WorldLoopEventPayloads 
```

## Properties

<table><thead><tr><th>

Property


</th><th>

Modifiers


</th><th>

Type


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

["WORLD\_LOOP.START"](./server.worldloopeventpayloads._world_loop.start_.md)


</td><td>


</td><td>

{ worldLoop: [WorldLoop](./server.worldloop.md)<!-- -->; }


</td><td>

Emitted when the world loop starts.


</td></tr>
<tr><td>

["WORLD\_LOOP.STOP"](./server.worldloopeventpayloads._world_loop.stop_.md)


</td><td>


</td><td>

{ worldLoop: [WorldLoop](./server.worldloop.md)<!-- -->; }


</td><td>

Emitted when the world loop stops.


</td></tr>
<tr><td>

["WORLD\_LOOP.TICK\_END"](./server.worldloopeventpayloads._world_loop.tick_end_.md)


</td><td>


</td><td>

{ worldLoop: [WorldLoop](./server.worldloop.md)<!-- -->; tickDurationMs: number; }


</td><td>

Emitted when the world loop tick ends.


</td></tr>
<tr><td>

["WORLD\_LOOP.TICK\_ERROR"](./server.worldloopeventpayloads._world_loop.tick_error_.md)


</td><td>


</td><td>

{ worldLoop: [WorldLoop](./server.worldloop.md)<!-- -->; error: Error; }


</td><td>

Emitted when an error occurs during a world loop tick.


</td></tr>
<tr><td>

["WORLD\_LOOP.TICK\_START"](./server.worldloopeventpayloads._world_loop.tick_start_.md)


</td><td>


</td><td>

{ worldLoop: [WorldLoop](./server.worldloop.md)<!-- -->; tickDeltaMs: number; }


</td><td>

Emitted when the world loop tick starts.


</td></tr>
</tbody></table>
