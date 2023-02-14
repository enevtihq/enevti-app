import React from 'react';
import AppPortraitOverlayBox from 'enevti-app/components/molecules/list/AppPortraitOverlayBox';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import AppNetworkImage from 'enevti-app/components/atoms/image/AppNetworkImage';
import { MomentBase } from 'enevti-types/chain/moment';
import { fetchIPFS, IPFStoURL } from 'enevti-app/service/ipfs';
import AppIconComponent, { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { numberKMB } from 'enevti-app/utils/format/amount';
import darkTheme from 'enevti-app/theme/dark';

interface AppMomentItemProps {
  moment: MomentBase;
  width?: number;
  showLike?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export default function AppMomentItem({ moment, showLike, style, onPress, width = 25 }: AppMomentItemProps) {
  const styles = React.useMemo(() => makeStyles(width), [width]);
  const [title, setTitle] = React.useState<string>(() => moment.textPlain ?? '');

  const onLoad = React.useCallback(async () => {
    if (!moment.textPlain) {
      const data = await fetchIPFS(moment.text);
      if (data) {
        setTitle(data);
      }
    }
  }, [moment.text, moment.textPlain]);

  React.useEffect(() => {
    onLoad();
  }, [onLoad]);

  return (
    <AppPortraitOverlayBox
      width={width}
      titleComponent={
        showLike ? (
          <View style={styles.showLikeContainer}>
            <AppIconComponent
              name={moment.liked ? iconMap.likeActive : iconMap.likeInactive}
              color={moment.liked ? darkTheme.colors.primary : 'white'}
              size={hp(2)}
              style={{ marginRight: wp(1) }}
            />
            <AppTextBody4 style={styles.likeText} numberOfLines={1}>
              {numberKMB(moment.like, 2, true, ['K', 'M', 'B'], 10000)}
            </AppTextBody4>
          </View>
        ) : undefined
      }
      title={title}
      style={style}
      onPress={onPress}
      background={<AppNetworkImage url={IPFStoURL(moment.cover.cid)} style={styles.image} />}
    />
  );
}

const makeStyles = (width: number) =>
  StyleSheet.create({
    image: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    showLikeContainer: {
      flexDirection: 'row',
      position: 'absolute',
      padding: 3,
      top: wp(width) * 1.45,
      left: wp('1%'),
    },
    likeText: {
      color: 'white',
    },
  });
