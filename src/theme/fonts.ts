import { Platform, PlatformOSType } from 'react-native';

type Font = {
  fontFamily: string;
  fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
};

type Fonts = {
  regular: Font;
  medium: Font;
  light: Font;
  thin: Font;
};

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'Poppins-Regular',
      fontWeight: 'normal' as 'normal',
    },
    medium: {
      fontFamily: 'Poppins-Medium',
      fontWeight: '700' as '700',
    },
    light: {
      fontFamily: 'Poppins-Light',
      fontWeight: '300' as '300',
    },
    thin: {
      fontFamily: 'Poppins-Thin',
      fontWeight: '100' as '100',
    },
  },
};

export default function configureFonts(config?: {
  [platform in PlatformOSType | 'default']?: Fonts;
}): Fonts {
  const fonts = Platform.select({ ...fontConfig, ...config }) as Fonts;
  return fonts;
}
