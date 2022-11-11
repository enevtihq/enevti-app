import { StyleSheet, Image } from 'react-native';
import React from 'react';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import AppNetworkImage from 'enevti-app/components/atoms/image/AppNetworkImage';
import { IPFStoURL } from 'enevti-app/service/ipfs';
import { shallowEqual } from 'react-redux';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';

interface NFTImageDataProps {
  nft: NFTBase;
  dataUri?: string;
  blurRadius?: number;
}

export default React.memo(
  function NFTImageData({ nft, dataUri, blurRadius }: NFTImageDataProps) {
    const theme = useTheme() as Theme;
    const styles = React.useMemo(() => makeStyles(theme), [theme]);

    return dataUri ? (
      <Image style={styles.imageContainer} source={{ uri: dataUri }} blurRadius={blurRadius} />
    ) : (
      <AppNetworkImage url={IPFStoURL(nft.data.cid)} style={styles.imageContainer} />
    );
  },
  (props, nextProps) => {
    return shallowEqual(props, nextProps);
  },
);

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    imageContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.background,
    },
  });
