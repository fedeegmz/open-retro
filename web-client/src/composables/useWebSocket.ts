import { ref, onUnmounted } from 'vue'
import type { WsMessage } from '@open-retro/shared/types/board'

export type WsError = 'auth' | 'session_full' | 'connection' | null

export function useWebSocket(url: string) {
  const isConnected = ref(false)
  const wsError = ref<WsError>(null)
  let ws: WebSocket | null = null
  let onMessageCallback: ((msg: WsMessage) => void) | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let shouldReconnect = true

  function connect() {
    ws = new WebSocket(url)

    ws.onopen = () => {
      isConnected.value = true
      wsError.value = null
      console.log('[WS] Connected')
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data) as WsMessage
      onMessageCallback?.(msg)
    }

    ws.onclose = (event) => {
      isConnected.value = false

      if (event.code === 4001) {
        wsError.value = 'auth'
        shouldReconnect = false
        console.log('[WS] Authentication failed')
        return
      }

      if (event.code === 4003) {
        wsError.value = 'session_full'
        shouldReconnect = false
        console.log('[WS] Session is full')
        return
      }

      if (!shouldReconnect) return

      wsError.value = 'connection'
      console.log('[WS] Disconnected, reconnecting in 2s...')
      reconnectTimer = setTimeout(connect, 2000)
    }

    ws.onerror = () => {
      ws?.close()
    }
  }

  function send(msg: WsMessage) {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg))
    }
  }

  function onMessage(callback: (msg: WsMessage) => void) {
    onMessageCallback = callback
  }

  function disconnect() {
    shouldReconnect = false
    if (reconnectTimer) clearTimeout(reconnectTimer)
    reconnectTimer = null
    ws?.close()
    ws = null
  }

  connect()

  onUnmounted(disconnect)

  return { isConnected, wsError, send, onMessage, disconnect }
}
