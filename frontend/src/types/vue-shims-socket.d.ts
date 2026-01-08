import 'vue';
import type { Socket } from 'socket.io-client';
import { socket } from '../socket';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $socket: typeof socket;
  }
}


