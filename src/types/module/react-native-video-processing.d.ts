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

type PreviewMaxSize = {
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

type VideoPlayerConstants = {
  resizeMode: {
    CONTAIN: string;
    COVER: string;
    STRETCH: string;
    NONE: string;
  };
  quality: {
    QUALITY_LOW: 'low';
    QUALITY_MEDIUM: 'medium';
    QUALITY_HIGHEST: 'highest';
    QUALITY_640x480: '640x480';
    QUALITY_960x540: '960x540';
    QUALITY_1280x720: '1280x720';
    QUALITY_1920x1080: '1920x1080';
    QUALITY_3840x2160: '3840x2160';
    QUALITY_PASS_THROUGH: 'passthrough';
  };
};

declare module 'react-native-video-processing' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  export class ProcessingManager {
    /**
     * callback are iOS only
     */
    static trim(source: string, options: TrimOptions, callback?: iOSProcessingCallback): Promise<string>;

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
      maximumSize?: PreviewMaxSize,
    ): Promise<Array<{ image: string }>>;

    /**
     * Android and iOS
     */
    static getPreviewForSecond(
      source: string,
      second: number,
      maximumSize: PreviewMaxSize,
      format: Format,
    ): Promise<Array<string>>;

    /**
     * Android and iOS
     */
    static crop(source: string, options: CropOptions): Promise<{ source: string }>;

    /**
     * Android only
     */
    static merge(source: ArrayType, cmd: string): Promise<{ source: string }>;

    /**
     * Android and iOS
     */
    static reverse(source: string): Promise<any>;

    /**
     * Android and iOS
     */
    static boomerang(source: string): Promise<any>;
  }

  export class Trimmer extends Component<TrimmerViewProps> {}
  export class VideoPlayer extends Component<ViewProps & VideoPlayerProps> {
    static Constants: VideoPlayerConstants;
  }
}
