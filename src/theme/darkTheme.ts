import color from 'color';
import defaultTheme from './defaultTheme';
import { Colors } from 'react-native-paper';

const darkTheme = {
  ...defaultTheme,
  dark: true,
  mode: 'adaptive',
  colors: {
    ...defaultTheme.colors,
    primary: '#BB86FC',
    accent: '#03dac6',
    background: '#121212',
    surface: '#121212',
    error: '#CF6679',
    onSurface: '#FFFFFF',
    text: Colors.white.toString(),
    disabled: color(Colors.white.toString()).alpha(0.38).rgb().string(),
    placeholder: color(Colors.white.toString()).alpha(0.54).rgb().string(),
    backdrop: color(Colors.black.toString()).alpha(0.5).rgb().string(),
    notification: Colors.pinkA100.toString(),
    card: '#ffffff',
    border: '#ffffff',
  },
};

export default darkTheme;
