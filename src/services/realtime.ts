import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@services/api';
import {
  GatheringUpdatedPayload,
  JoinRequestReceivedPayload,
  JoinRequestResolvedPayload,
} from '@/types';

export interface RealtimeHandlers {
  onJoinRequestReceived?: (payload: JoinRequestReceivedPayload) => void;
  onJoinRequestResolved?: (payload: JoinRequestResolvedPayload) => void;
  onGatheringUpdated?: (payload: GatheringUpdatedPayload) => void;
}

let connection: HubConnection | null = null;

/**
 * Connects to the backend's notification hub so join requests, approvals and
 * gathering changes show up without a manual refresh. Best effort: if the
 * connection fails the app still works through pull-to-refresh.
 */
export async function startRealtime(handlers: RealtimeHandlers) {
  await stopRealtime();

  connection = new HubConnectionBuilder()
    .withUrl(`${BASE_URL}/hub/notifications`, {
      accessTokenFactory: async () => (await AsyncStorage.getItem('accessToken')) ?? '',
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Warning)
    .build();

  if (handlers.onJoinRequestReceived) {
    connection.on('JoinRequestReceived', handlers.onJoinRequestReceived);
  }
  if (handlers.onJoinRequestResolved) {
    connection.on('JoinRequestResolved', handlers.onJoinRequestResolved);
  }
  if (handlers.onGatheringUpdated) {
    connection.on('GatheringUpdated', handlers.onGatheringUpdated);
  }

  try {
    await connection.start();
  } catch (error) {
    console.warn('Live updates unavailable, falling back to refresh:', error);
  }
}

export async function stopRealtime() {
  const current = connection;
  connection = null;
  if (current && current.state !== HubConnectionState.Disconnected) {
    await current.stop().catch(() => {});
  }
}
