declare module 'react-native-vector-icons/MaterialIcons';
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

  export interface MapViewProps extends ViewProps {
    provider?: string;
    region?: Region;
    initialRegion?: Region;
    onRegionChangeComplete?: (region: Region) => void;
  }

  export interface MarkerProps extends ViewProps {
    coordinate: LatLng;
    title?: string;
    description?: string;
    pinColor?: string;
    onPress?: () => void;
  }

  export default class MapView extends Component<MapViewProps> {}
  export class Marker extends Component<MarkerProps> {}
  export const PROVIDER_DEFAULT: string;
  export const PROVIDER_GOOGLE: string;
}
