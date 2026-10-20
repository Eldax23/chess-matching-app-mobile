declare module 'react-native-vector-icons/MaterialIcons';
declare module 'react-native-vector-icons/MaterialCommunityIcons';
declare module 'react-native-safe-area-context';
declare module 'react-native-maps' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  export interface LatLng {
    latitude: number;
    longitude: number;
  }

  export interface Region extends LatLng {
    latitudeDelta: number;
    longitudeDelta: number;
  }

  export interface MapPressEvent {
    nativeEvent: { coordinate: LatLng };
  }

  export interface MapViewProps extends ViewProps {
    provider?: string;
    onPress?: (event: MapPressEvent) => void;
    region?: Region;
    initialRegion?: Region;
    onRegionChangeComplete?: (region: Region) => void;
    customMapStyle?: object[];
    userInterfaceStyle?: 'light' | 'dark';
  }

  export interface MarkerProps extends ViewProps {
    coordinate: LatLng;
    title?: string;
    description?: string;
    pinColor?: string;
    draggable?: boolean;
    onDragEnd?: (event: MapPressEvent) => void;
    onPress?: () => void;
  }

  export interface CircleProps {
    center: LatLng;
    radius: number;
    strokeColor?: string;
    fillColor?: string;
    strokeWidth?: number;
  }

  export default class MapView extends Component<MapViewProps> {}
  export class Marker extends Component<MarkerProps> {}
  export class Circle extends Component<CircleProps> {}
  export const PROVIDER_DEFAULT: string;
  export const PROVIDER_GOOGLE: string;
}
