/**
 * iOS only.
 */
type iOSTrimQuality =
  | 'low'
  | 'medium'
  | 'highest'
  | '640x480'
  | '960x540'
  | '1280x720'
  | '1920x1080'
  | '3840x2160'
  | 'passthrough';

/**
 * iOS only.
 */
type iOSCompressOptions = {
  bitrateMultiplier: number;
  height: number;
  width: number;
  minimumBitrate: number;
};

/**
 * quality and cameraType are iOS only.
 */
type TrimOptions = {
  startTime: number;
  endTime: number;
  quality?: iOSTrimQuality;
  cameraType?: 'front' | 'back';
};

/**
 * quality and cameraType are iOS only.
 */
type iOSProcessingCallback = Function;

type iOSPreviewMaxSize = {
  width: number;
  height: number;
};

type Format = 'base64' | 'JPEG';

type CropOptions = {
  cropOffsetX: number;
  cropOffsetY: number;
  cropWidth: number;
  cropHeight: number;
  quality?: iOSTrimQuality;
};

type ArrayType = Array<string>;

/**
 * other than source and onChange are iOS only.
 */
type TrimmerViewProps = {
  source: string;
  onChange?: (event: { startTime: number; endTime: number }) => void;
  width?: number;
  height?: number;
  showTrackerHandle?: boolean;
  tranckerHandleColor?: boolean;
  themeColor?: string;
  onTrackerMove?: (event: { currentTime: number }) => void;
  minLength?: number;
  maxLength?: number;
  currentTime?: number;
  trackerColor?: string;
  thumbWidth?: number;
  borderWidth?: number;
};

/**
 * rotate, backgound_Color, playerWidth, playerHeight are iOS only.
 */
type VideoPlayerProps = {
  source: string;
  play?: boolean;
  replay?: boolean;
  volume?: number;
  onChange?: (event: any) => void;
  currentTime?: number;
  endTime?: number;
  startTime?: number;
  progressEventDelay?: number;
  resizeMode?: string;
  rotate?: boolean;
  background_Color?: string;
  playerWidth?: number;
  playerHeight?: number;
};

declare module 'react-native-video-processing' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  export class ProcessingManager {
    /**
     * callback are iOS only
     */
    static trim(source: string, options: TrimOptions, callback?: iOSProcessingCallback): Promise<{ source: string }>;

    /**
     * callback are iOS only
     */
    static compress(source: string, options: any, callback?: iOSProcessingCallback): Promise<any>;

    /**
     * Android only
     */
    static getVideoInfo(source: string): Promise<any>;

    /**
     * iOS only
     */
    static getAssetInfo(source: string, callback?: iOSProcessingCallback): void;

    /**
     * Android only
     */
    static getPreviewImages(source: string): Promise<any>;

    /**
     * Android and iOS
     */
    static getPreviewImageAtPosition(
      source: string,
      second: number,
      callback?: iOSProcessingCallback,
    ): Promise<{ image: string }>;

    /**
     * Android and iOS
     */
    static getTrimmerPreviewImages(
      source: string,
      startTime: number,
      endTime: number,
      step: number,
      maximumSize?: iOSPreviewMaxSize,
    ): Promise<Array<{ image: string }>>;

    /**
     * Android and iOS
     */
    static crop(source: string, options: CropOptions): Promise<{ source: string }>;

    /**
     * Android only
     */
    static merge(source: ArrayType, cmd: string): Promise<{ source: string }>;
  }

  export class Trimmer extends Component<TrimmerViewProps> {}
  export class VideoPlayer extends Component<ViewProps & VideoPlayerProps> {}
}
