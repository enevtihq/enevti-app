import { StyleSheet, View } from 'react-native';
import React from 'react';
import { NFT } from '../../../types/nft';
import UtilityBackground from './UtilityBackground';
import { NFTTemplateItem } from '../../../types/nft/template';

const nft: NFT = {
  utility: 'videocall',
  template: [{ type: 'utility-background' }],
};

const handleRenderNFTTemplate = (
  templateItem: NFTTemplateItem,
  nftObject: NFT,
  canvasWidth: number,
  index: number,
) => {
  switch (templateItem.type) {
    case 'utility-background':
      return (
        <UtilityBackground key={index} nft={nftObject} width={canvasWidth} />
      );
    default:
      return <View key={index} />;
  }
};

export default function NFTRenderer() {
  const styles = makeStyle();

  const [canvasWidth, setCanvasWidth] = React.useState<number>(0);
  const onLayout = React.useCallback(e => {
    setCanvasWidth(e.nativeEvent.layout.width);
  }, []);

  return (
    <View onLayout={onLayout} style={styles.nftContainer}>
      {nft.template.map((templateItem, index) =>
        handleRenderNFTTemplate(templateItem, nft, canvasWidth, index),
      )}
    </View>
  );
}

const makeStyle = () =>
  StyleSheet.create({
    nftContainer: {
      width: '100%',
      aspectRatio: 1,
    },
  });
