import { Dimensions, StyleSheet, View } from 'react-native';
import React from 'react';
import { NFTBase } from '../../../types/nft';
import UtilityBackground from '../../atoms/nft/utility/UtilityBackground';
import { NFTTemplateItem } from '../../../types/nft/NFTTemplate';
import NFTData from '../../atoms/nft/data/NFTData';
import Box from '../../atoms/nft/misc/Box';
import RarityIcon from '../../atoms/nft/rarity/RarityIcon';
import RarityRank from '../../atoms/nft/rarity/RarityRank';
import RarityPercent from '../../atoms/nft/rarity/RarityPercent';
import Name from '../../atoms/nft/identity/Name';
import Serial from '../../atoms/nft/identity/Serial';
import PartitionIcon from '../../atoms/nft/partition/PartitionIcon';
import PartitionLabel from '../../atoms/nft/partition/PartitionLabel';
import UtilityIcon from '../../atoms/nft/utility/UtilityIcon';
import UtilityLabel from '../../atoms/nft/utility/UtilityLabel';

interface AppNFTRendererProps {
  nft: NFTBase;
}

const THUMBNAIL_TRESHOLD = 0.33;

const handleRenderNFTTemplate = (
  templateItem: NFTTemplateItem,
  nftObject: NFTBase,
  index: number,
) => {
  const key = nftObject.id + templateItem.type + '-' + index.toString();

  switch (templateItem.type) {
    case 'utility-background':
      return (
        <UtilityBackground key={key} nft={nftObject} args={templateItem.args} />
      );
    case 'data':
      return <NFTData key={key} nft={nftObject} args={templateItem.args} />;
    case 'data-box':
      return <NFTData box key={key} nft={nftObject} args={templateItem.args} />;
    case 'box':
      return <Box key={key} args={templateItem.args} />;
    case 'rarity-icon':
      return <RarityIcon key={key} nft={nftObject} args={templateItem.args} />;
    case 'rarity-rank':
      return <RarityRank key={key} nft={nftObject} args={templateItem.args} />;
    case 'rarity-percent':
      return (
        <RarityPercent key={key} nft={nftObject} args={templateItem.args} />
      );
    case 'name':
      return <Name key={key} nft={nftObject} args={templateItem.args} />;
    case 'serial':
      return <Serial key={key} nft={nftObject} args={templateItem.args} />;
    case 'partition-icon':
      return (
        <PartitionIcon key={key} nft={nftObject} args={templateItem.args} />
      );
    case 'partition-label':
      return (
        <PartitionLabel key={key} nft={nftObject} args={templateItem.args} />
      );
    case 'utility-icon':
      return <UtilityIcon key={key} nft={nftObject} args={templateItem.args} />;
    case 'utility-label':
      return (
        <UtilityLabel key={key} nft={nftObject} args={templateItem.args} />
      );
    default:
      return <View key={key} />;
  }
};

export default React.memo(
  function AppNFTRenderer({ nft }: AppNFTRendererProps) {
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
  },
  () => {
    return true;
  },
);

const makeStyle = () =>
  StyleSheet.create({
    nftContainer: {
      width: '100%',
      aspectRatio: 1,
    },
  });
