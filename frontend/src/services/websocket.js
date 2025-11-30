// Replace with your Laptop's IP Address (Keep port 8000)
const WS_URL = 'ws://192.168.203.137:8000/ws/chat';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.onReceiveAudio = null; // Callback for audio
    this.onReceiveText = null;  // ✅ Callback for text (Fallback)
  }

  connect() {
    this.socket = new WebSocket(WS_URL);

    this.socket.onopen = () => {
      console.log('✅ WebSocket Connected to Brain');
    };

    this.socket.onmessage = (e) => {
      try {
        const message = JSON.parse(e.data);
        
        // 1. Handle Audio
        if (message.type === 'audio' && this.onReceiveAudio) {
          this.onReceiveAudio(message.data); 
        }

        // 2. ✅ Handle Text (New)
        if (message.type === 'text' && this.onReceiveText) {
          this.onReceiveText(message.data); 
        }

      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    this.socket.onclose = () => {
      console.log('⚠️ WebSocket Disconnected. Reconnecting...');
      setTimeout(() => this.connect(), 3000); 
    };

    this.socket.onerror = (e) => {
      console.log('WebSocket Error:', e.message);
    };
  }

  sendAudioChunk(base64Audio) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'audio_input',
        data: base64Audio
      }));
    } else {
      console.warn('Cannot send audio: WebSocket not open');
    }
  }
}

export default new WebSocketService();