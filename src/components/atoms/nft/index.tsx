import { StyleSheet, View } from 'react-native';
import React from 'react';
import { NFT } from '../../../types/nft';
import UtilityBackground from './UtilityBackground';
import { NFTTemplateItem } from '../../../types/nft/NFTTemplate';
import NFTData from './NFTData';
import Box from './Box';
import RarityIcon from './RarityIcon';
import RarityRank from './RarityRank';
import RarityPercent from './RarityPercent';
import Name from './Name';
import Serial from './Serial';
import PartitionIcon from './PartitionIcon';
import PartitionLabel from './PartitionLabel';

const nft: NFT = {
  serial: 'eyecollection-001',
  name: 'EyeCollection',
  data: 'Qmb3jKA6Vn1azR6aSMnT6geGMkg818uBkfSHNg8ui1a9dy',
  contentType: 'image',
  NFTType: 'packed',
  utility: 'videocall',
  rarity: {
    stat: {
      rank: 12,
      percent: 4,
    },
    trait: [
      {
        key: 'utility',
        value: 'videocall',
      },
    ],
  },
  redeem: {
    parts: [
      'wfvfasdfwfwrgegwrhjtjut',
      'wfvfasdfwfwrgegwrhjtjut',
      'wfvfasdfwfwrgegwrhjtjut',
      'wfvfasdfwfwrgegwrhjtjut',
    ],
    upgradeMaterial: 4,
  },
  template: [
    {
      type: 'utility-background',
      args: { x: '0%', y: '0%', width: '100%', height: '100%', rotate: '0deg' },
    },
    {
      type: 'data-box',
      args: {
        x: '12.5%',
        y: '12.5%',
        width: '75%',
        height: '75%',
        rotate: '0deg',
      },
    },
    {
      type: 'box',
      args: { x: '42%', y: '0%', width: '16%', height: '15%', rotate: '0deg' },
    },
    {
      type: 'rarity-icon',
      args: { x: '42%', y: '0%', width: '16%', height: '8.5%', rotate: '0deg' },
    },
    {
      type: 'rarity-rank',
      args: { x: '42%', y: '7.5%', width: '16%', height: '4%', rotate: '0deg' },
    },
    {
      type: 'rarity-percent',
      args: {
        x: '42%',
        y: '11.5%',
        width: '16%',
        height: '2%',
        rotate: '0deg',
      },
    },
    {
      type: 'name',
      args: {
        x: '12.5%',
        y: '87.5%',
        width: '75%',
        height: '12.5%',
        rotate: '0deg',
      },
    },
    {
      type: 'serial',
      args: {
        x: '75%',
        y: '43.75%',
        width: '37.5%',
        height: '12.5%',
        rotate: '-90deg',
      },
    },
    {
      type: 'box',
      args: {
        x: '3%',
        y: '62%',
        width: '6.5%',
        height: '6.5%',
        rotate: '0deg',
      },
    },
    {
      type: 'partition-icon',
      args: {
        x: '3%',
        y: '62%',
        width: '6.5%',
        height: '6.5%',
        rotate: '0deg',
      },
    },
    {
      type: 'partition-label',
      args: {
        x: '1%',
        y: '51%',
        width: '11%',
        height: '6.5%',
        rotate: '-90deg',
      },
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
    case 'name':
      return <Name key={index} nft={nftObject} args={templateItem.args} />;
    case 'serial':
      return <Serial key={index} nft={nftObject} args={templateItem.args} />;
    case 'partition-icon':
      return (
        <PartitionIcon key={index} nft={nftObject} args={templateItem.args} />
      );
    case 'partition-label':
      return (
        <PartitionLabel key={index} nft={nftObject} args={templateItem.args} />
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
