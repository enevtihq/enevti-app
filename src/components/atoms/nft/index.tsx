import { StyleSheet, View } from 'react-native';
import React from 'react';
import { NFT } from '../../../types/nft';
import UtilityBackground from './UtilityBackground';
import { NFTTemplateItem } from '../../../types/nft/template';
import NFTData from './NFTData';
import Box from './Box';
import RarityIcon from './RarityIcon';
import RarityRank from './RarityRank';
import RarityPercent from './RarityPercent';

const nft: NFT = {
  data: 'Qmb3jKA6Vn1azR6aSMnT6geGMkg818uBkfSHNg8ui1a9dy',
  contentType: 'image',
  utility: 'videocall',
  rarity: {
    stat: {
      rank: 12,
      percent: 4,
    },
    trait: [
      {
        key: 'utilityx',
        value: 'videocall',
      },
    ],
  },
  template: [
    {
      type: 'utility-background',
      args: { x: '0%', y: '0%', width: '100%', height: '100%' },
    },
    {
      type: 'data-box',
      args: { x: '12.5%', y: '12.5%', width: '75%', height: '75%' },
    },
    { type: 'box', args: { x: '42%', y: '0%', width: '16%', height: '15%' } },
    {
      type: 'rarity-icon',
      args: { x: '42%', y: '0%', width: '16%', height: '8.5%' },
    },
    {
      type: 'rarity-rank',
      args: { x: '42%', y: '7.5%', width: '16%', height: '4%' },
    },
    {
      type: 'rarity-percent',
      args: { x: '42%', y: '11.5%', width: '16%', height: '2%' },
    },
  ],
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
        <UtilityBackground
          key={index}
          nft={nftObject}
          args={templateItem.args}
        />
      );
    case 'data':
      return <NFTData key={index} nft={nftObject} args={templateItem.args} />;
    case 'data-box':
      return (
        <NFTData box key={index} nft={nftObject} args={templateItem.args} />
      );
    case 'box':
      return <Box key={index} args={templateItem.args} />;
    case 'rarity-icon':
      return (
        <RarityIcon key={index} nft={nftObject} args={templateItem.args} />
      );
    case 'rarity-rank':
      return (
        <RarityRank key={index} nft={nftObject} args={templateItem.args} />
      );
    case 'rarity-percent':
      return (
        <RarityPercent key={index} nft={nftObject} args={templateItem.args} />
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
