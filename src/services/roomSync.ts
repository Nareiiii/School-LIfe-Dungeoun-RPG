import { RoomSyncMessage, RoomTimerState, GuildRoomData, TeacherActionPayload, InfractionPayload } from '../types/game';

// BroadcastChannel + LocalStorage cross-tab real-time sync manager
class RoomSyncService {
  private channel: BroadcastChannel | null = null;
  private currentRoomCode: string = '';
  private messageListeners: Array<(message: RoomSyncMessage) => void> = [];
  private storageListener: ((e: StorageEvent) => void) | null = null;

  public init(roomCode: string, onMessage: (message: RoomSyncMessage) => void) {
    const cleanRoom = (roomCode || 'default').trim().toUpperCase();

    // If same room, just register listener
    if (this.channel && this.currentRoomCode === cleanRoom) {
      if (!this.messageListeners.includes(onMessage)) {
        this.messageListeners.push(onMessage);
      }
      return;
    }

    // Close previous channel if room changed
    this.cleanup();

    this.currentRoomCode = cleanRoom;
    this.messageListeners = [onMessage];

    const channelName = `school_rpg_channel_${cleanRoom}`;

    // 1. Initialize BroadcastChannel if supported
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(channelName);
        this.channel.onmessage = (event) => {
          if (event && event.data) {
            this.notifyListeners(event.data as RoomSyncMessage);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel initialization error:', err);
      }
    }

    // 2. Storage Event Listener as fallback & persistence
    if (typeof window !== 'undefined') {
      this.storageListener = (e: StorageEvent) => {
        if (e.key === `school_rpg_sync_${cleanRoom}` && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (parsed && parsed.data) {
              this.notifyListeners(parsed.data as RoomSyncMessage);
            }
          } catch (err) {
            console.error('Storage sync parse error:', err);
          }
        }
      };
      window.addEventListener('storage', this.storageListener);
    }
  }

  private notifyListeners(message: RoomSyncMessage) {
    this.messageListeners.forEach((listener) => {
      try {
        listener(message);
      } catch (err) {
        console.error('Error in room message listener:', err);
      }
    });
  }

  public broadcast(message: RoomSyncMessage) {
    if (!this.currentRoomCode) return;

    // 1. Send via BroadcastChannel
    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (err) {
        console.warn('BroadcastChannel postMessage error:', err);
      }
    }

    // 2. Write to localStorage to trigger cross-tab storage event
    if (typeof window !== 'undefined') {
      try {
        const payload = {
          data: message,
          timestamp: Date.now(),
          random: Math.random(),
        };
        localStorage.setItem(`school_rpg_sync_${this.currentRoomCode}`, JSON.stringify(payload));
      } catch (err) {
        // quota or privacy mode errors
      }
    }
  }

  // Specialized Emitters
  public syncTimer(timer: RoomTimerState) {
    this.broadcast({
      type: 'TIMER_SYNC',
      payload: timer,
    });
  }

  public syncGuild(guild: GuildRoomData) {
    this.broadcast({
      type: 'GUILD_UPDATE',
      payload: guild,
    });
  }

  public sendTeacherAction(action: TeacherActionPayload) {
    this.broadcast({
      type: 'TEACHER_ACTION',
      payload: action,
    });
  }

  public sendInfraction(infraction: InfractionPayload) {
    this.broadcast({
      type: 'INFRACTION_EVENT',
      payload: infraction,
    });
  }

  public requestRoomState(requesterId: string) {
    this.broadcast({
      type: 'REQUEST_ROOM_STATE',
      payload: { requesterId },
    });
  }

  public cleanup() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    if (this.storageListener && typeof window !== 'undefined') {
      window.removeEventListener('storage', this.storageListener);
      this.storageListener = null;
    }
    this.messageListeners = [];
    this.currentRoomCode = '';
  }
}

export const roomSync = new RoomSyncService();
