import { Dimensions, StyleSheet, View } from 'react-native';
import React from 'react';
import { NFT } from '../../types/nft';
import UtilityBackground from '../atoms/nft/utility/UtilityBackground';
import { NFTTemplateItem } from '../../types/nft/NFTTemplate';
import NFTData from '../atoms/nft/data/NFTData';
import Box from '../atoms/nft/misc/Box';
import RarityIcon from '../atoms/nft/rarity/RarityIcon';
import RarityRank from '../atoms/nft/rarity/RarityRank';
import RarityPercent from '../atoms/nft/rarity/RarityPercent';
import Name from '../atoms/nft/identity/Name';
import Serial from '../atoms/nft/identity/Serial';
import PartitionIcon from '../atoms/nft/partition/PartitionIcon';
import PartitionLabel from '../atoms/nft/partition/PartitionLabel';
import UtilityIcon from '../atoms/nft/utility/UtilityIcon';
import UtilityLabel from '../atoms/nft/utility/UtilityLabel';

const nft: NFT = {
  serial: 'eyecollection-001',
  name: 'EyeCollection',
  data: 'Qmb3jKA6Vn1azR6aSMnT6geGMkg818uBkfSHNg8ui1a9dy',
  contentType: 'image',
  NFTType: 'one-kind',
  utility: 'chat',
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
  template: {
    main: [
      {
        type: 'utility-background',
        args: {
          x: '0%',
          y: '0%',
          width: '100%',
          height: '100%',
          rotate: '0deg',
        },
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
        args: {
          x: '42%',
          y: '0%',
          width: '16%',
          height: '15%',
          rotate: '0deg',
        },
      },
      {
        type: 'rarity-icon',
        args: {
          x: '42%',
          y: '0%',
          width: '16%',
          height: '8.5%',
          rotate: '0deg',
        },
      },
      {
        type: 'rarity-rank',
        args: {
          x: '42%',
          y: '7.5%',
          width: '16%',
          height: '4%',
          rotate: '0deg',
        },
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
          y: '67%',
          width: '6.5%',
          height: '6.5%',
          rotate: '0deg',
        },
      },
      {
        type: 'partition-icon',
        args: {
          x: '3%',
          y: '67%',
          width: '6.5%',
          height: '6.5%',
          rotate: '0deg',
        },
      },
      {
        type: 'partition-label',
        args: {
          x: '-1%',
          y: '55%',
          width: '14%',
          height: '6.5%',
          rotate: '-90deg',
        },
      },
      {
        type: 'box',
        args: {
          x: '3%',
          y: '42%',
          width: '6.5%',
          height: '6.5%',
          rotate: '0deg',
        },
      },
      {
        type: 'utility-icon',
        args: {
          x: '3%',
          y: '42%',
          width: '6.5%',
          height: '6.5%',
          rotate: '0deg',
        },
      },
      {
        type: 'utility-label',
        args: {
          x: '-6.5%',
          y: '25%',
          width: '25%',
          height: '4%',
          rotate: '-90deg',
        },
      },
    ],
    thumbnail: [
      {
        type: 'utility-background',
        args: {
          x: '0%',
          y: '0%',
          width: '100%',
          height: '100%',
          rotate: '0deg',
        },
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
    ],
  },
};

const THUMBNAIL_TRESHOLD = 0.33;

const handleRenderNFTTemplate = (
  templateItem: NFTTemplateItem,
  nftObject: NFT,
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
    case 'utility-icon':
      return (
        <UtilityIcon key={index} nft={nftObject} args={templateItem.args} />
      );
    case 'utility-label':
      return (
        <UtilityLabel key={index} nft={nftObject} args={templateItem.args} />
      );
    default:
      return <View key={index} />;
  }
};

export default function AppNFTRenderer() {
  const styles = makeStyle();

  const [canvasWidth, setCanvasWidth] = React.useState<number>(0);
  const onLayout = React.useCallback(e => {
    setCanvasWidth(e.nativeEvent.layout.width);
  }, []);

  return (
    <View onLayout={onLayout} style={styles.nftContainer}>
      {canvasWidth ? (
        canvasWidth < Dimensions.get('window').width * THUMBNAIL_TRESHOLD &&
        nft.template.thumbnail.length > 0 ? (
          nft.template.thumbnail.map((templateItem, index) =>
            handleRenderNFTTemplate(templateItem, nft, index),
          )
        ) : (
          nft.template.main.map((templateItem, index) =>
            handleRenderNFTTemplate(templateItem, nft, index),
          )
        )
      ) : (
        <View />
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
