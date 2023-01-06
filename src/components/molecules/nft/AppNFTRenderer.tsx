import { Dimensions, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import UtilityBackground from 'enevti-app/components/atoms/nft/utility/UtilityBackground';
import { NFTTemplateItem } from 'enevti-app/types/core/chain/nft/NFTTemplate';
import NFTData from 'enevti-app/components/atoms/nft/data/NFTData';
import Box from 'enevti-app/components/atoms/nft/misc/Box';
import RarityIcon from 'enevti-app/components/atoms/nft/rarity/RarityIcon';
import RarityRank from 'enevti-app/components/atoms/nft/rarity/RarityRank';
import RarityPercent from 'enevti-app/components/atoms/nft/rarity/RarityPercent';
import Name from 'enevti-app/components/atoms/nft/identity/Name';
import Serial from 'enevti-app/components/atoms/nft/identity/Serial';
import PartitionIcon from 'enevti-app/components/atoms/nft/partition/PartitionIcon';
import PartitionLabel from 'enevti-app/components/atoms/nft/partition/PartitionLabel';
import UtilityIcon from 'enevti-app/components/atoms/nft/utility/UtilityIcon';
import UtilityLabel from 'enevti-app/components/atoms/nft/utility/UtilityLabel';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { TouchableRipple } from 'react-native-paper';
import { SizeCode } from 'enevti-app/types/core/service/api';
import useDebouncedNavigation from 'enevti-app/utils/hook/useDebouncedNavigation';

interface AppNFTRendererProps {
  nft: NFTBase;
  width: number;
  lazy?: boolean;
  style?: StyleProp<ViewStyle>;
  dataUri?: string;
  realRatio?: boolean;
  navigation?: StackNavigationProp<RootStackParamList>;
  imageSize?: SizeCode;
  onPress?: () => void;
}

const THUMBNAIL_TRESHOLD = 0.33;

export default React.memo(
  function AppNFTRenderer({
    nft,
    width,
    lazy,
    style,
    dataUri,
    realRatio,
    navigation,
    onPress,
    imageSize = 'og',
  }: AppNFTRendererProps) {
    const styles = React.useMemo(() => makeStyles(), []);
    const dnavigation = useDebouncedNavigation(navigation);

    const onNavigate = React.useCallback(
      () => (onPress ? onPress() : navigation ? dnavigation('NFTDetails', { arg: nft.id, mode: 'id' }) : undefined),
      [navigation, dnavigation, nft.id, onPress],
    );

    const handleRenderNFTTemplate = React.useCallback(
      (
        templateItem: NFTTemplateItem,
        nftObject: NFTBase,
        index: number,
        canvasWidth: number,
        imgSize: SizeCode,
        data?: string,
        ratio?: boolean,
        isLazy?: boolean,
      ) => {
        const key = nftObject.id + templateItem.type + '-' + index.toString();

        switch (templateItem.type) {
          case 'utility-background':
            return <UtilityBackground key={key} nft={nftObject} args={templateItem.args} />;
          case 'data':
            return (
              <NFTData
                key={key}
                lazy={isLazy}
                width={canvasWidth}
                imageSize={imgSize}
                nft={nftObject}
                args={templateItem.args}
                dataUri={data}
                realRatio={ratio}
              />
            );
          case 'data-box':
            return (
              <NFTData
                box
                key={key}
                width={canvasWidth}
                imageSize={imgSize}
                nft={nftObject}
                args={templateItem.args}
                dataUri={data}
                realRatio={ratio}
              />
            );
          case 'box':
            return <Box key={key} args={templateItem.args} />;
          case 'rarity-icon':
            return <RarityIcon key={key} nft={nftObject} args={templateItem.args} />;
          case 'rarity-rank':
            return <RarityRank key={key} nft={nftObject} args={templateItem.args} width={canvasWidth} />;
          case 'rarity-percent':
            return <RarityPercent key={key} nft={nftObject} args={templateItem.args} width={canvasWidth} />;
          case 'name':
            return <Name key={key} nft={nftObject} args={templateItem.args} width={canvasWidth} />;
          case 'serial':
            return <Serial key={key} nft={nftObject} args={templateItem.args} width={canvasWidth} />;
          case 'partition-icon':
            return <PartitionIcon key={key} nft={nftObject} args={templateItem.args} width={canvasWidth} />;
          case 'partition-label':
            return <PartitionLabel key={key} nft={nftObject} args={templateItem.args} width={canvasWidth} />;
          case 'utility-icon':
            return <UtilityIcon key={key} nft={nftObject} args={templateItem.args} width={canvasWidth} />;
          case 'utility-label':
            return <UtilityLabel key={key} nft={nftObject} args={templateItem.args} width={canvasWidth} />;
          default:
            return <View key={key} />;
        }
      },
      [],
    );

    return (
      <View style={[styles.nftContainer, style]}>
        {width < Dimensions.get('screen').width * THUMBNAIL_TRESHOLD && nft.template.thumbnail.length > 0
          ? nft.template.thumbnail.map((templateItem, index) =>
              handleRenderNFTTemplate(templateItem, nft, index, width, imageSize, dataUri, realRatio, lazy),
            )
          : nft.template.main.map((templateItem, index) =>
              handleRenderNFTTemplate(templateItem, nft, index, width, imageSize, dataUri, realRatio, lazy),
            )}
        {navigation || onPress ? (
          <TouchableRipple style={styles.rippleOverlay} onPress={onNavigate}>
            <View />
          </TouchableRipple>
        ) : null}
      </View>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.nft === nextProps.nft && prevProps.dataUri === nextProps.dataUri;
  },
);

const makeStyles = () =>
  StyleSheet.create({
    nftContainer: {
      width: '100%',
      aspectRatio: 1,
    },
    rippleOverlay: {
      ...StyleSheet.absoluteFillObject,
    },
  });
