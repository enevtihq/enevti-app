import { Colors } from 'react-native-paper';
import color from 'color';
import configureFonts from './fonts';

const defaultTheme = {
  dark: false,
  roundness: 4,
  colors: {
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#f6f6f6',
    surface: Colors.white.toString(),
    error: '#B00020',
    text: Colors.black.toString(),
    onSurface: '#000000',
    disabled: color(Colors.black.toString()).alpha(0.26).rgb().string(),
    placeholder: color(Colors.black.toString()).alpha(0.54).rgb().string(),
    backdrop: color(Colors.black.toString()).alpha(0.5).rgb().string(),
    notification: Colors.pinkA400.toString(),
    card: '#ffffff',
    border: '#ffffff',
  },
  fonts: configureFonts(),
  animation: {
    scale: 1.0,
  },
};

export default defaultTheme;
