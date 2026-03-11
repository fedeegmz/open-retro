import { ref, onUnmounted } from 'vue'
import type { WsMessage } from '../types/board'

export function useWebSocket(url: string) {
  const isConnected = ref(false)
  let ws: WebSocket | null = null
  let onMessageCallback: ((msg: WsMessage) => void) | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null

  function connect() {
    ws = new WebSocket(url)

    ws.onopen = () => {
      isConnected.value = true
      console.log('[WS] Connected')
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data) as WsMessage
      onMessageCallback?.(msg)
    }

    ws.onclose = () => {
      isConnected.value = false
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
    if (reconnectTimer) clearTimeout(reconnectTimer)
    reconnectTimer = null
    ws?.close()
    ws = null
  }

  connect()

  onUnmounted(disconnect)

  return { isConnected, send, onMessage, disconnect }
}
