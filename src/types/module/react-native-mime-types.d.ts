declare module 'react-native-mime-types' {
  /**
   * Lookup the content-type associated with a file.
   */
  export const lookup: (path: string) => string;
  /**
   * Create a full content-type header given a content-type or extension.
   */
  export const contentType: (type: string) => string;
  /**
   * Get the default extension for a content-type.
   */
  export const extension: (type: string) => string;
  /**
   * Lookup the implied default charset of a content-type.
   */
  export const charset: (type: string) => string;
}
