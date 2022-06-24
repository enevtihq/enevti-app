import { View, StyleSheet } from 'react-native';
import React from 'react';
import { wp } from 'enevti-app/utils/imageRatio';
import Color from 'color';
import { Theme } from 'enevti-app/theme/default';
import { useTheme } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';

interface AppQRCodeProps {
  value: string;
  size: number;
}

export default function AppQRCode({ value, size }: AppQRCodeProps) {
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.qrBox}>
      <QRCode value={value} size={size} color={'black'} backgroundColor={'white'} />
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    qrBox: {
      padding: wp(2.5),
      backgroundColor: 'white',
      borderRadius: 15,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Color(theme.colors.text).alpha(0.2).rgb().toString(),
    },
  });
