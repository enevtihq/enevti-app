import Color from 'color';
import defaultTheme, { Theme } from './default';
import { Colors } from 'react-native-paper';

const darkTheme: Theme = {
  ...defaultTheme,
  dark: true,
  mode: 'adaptive',
  colors: {
    ...defaultTheme.colors,
    primary: '#f72585',
    secondary: '#7209b7',
    accent: '#3a0ca3',
    link: '#Fdc9e0',
    background: '#12122a',
    surface: '#00001c',
    error: '#CF6679',
    success: '#06d6a0',
    onSurface: '#FFFFFF',
    text: Colors.white.toString(),
    disabled: Color(Colors.white.toString()).alpha(0.38).rgb().string(),
    placeholder: Color(Colors.white.toString()).alpha(0.54).rgb().string(),
    backdrop: Color(Colors.black.toString()).alpha(0.5).rgb().string(),
    notification: Colors.pinkA100.toString(),
    card: '#ffffff',
    border: '#ffffff',
  },
};

export default darkTheme;
