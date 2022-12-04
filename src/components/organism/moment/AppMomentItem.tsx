import React from 'react';
import AppPortraitOverlayBox from 'enevti-app/components/molecules/list/AppPortraitOverlayBox';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import AppNetworkImage from 'enevti-app/components/atoms/image/AppNetworkImage';
import { Moment } from 'enevti-app/types/core/chain/moment';
import { fetchIPFS, IPFStoURL } from 'enevti-app/service/ipfs';

interface AppMomentItemProps {
  moment: Moment;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export default function AppMomentItem({ moment, style, onPress }: AppMomentItemProps) {
  const styles = React.useMemo(() => makeStyles(), []);
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
      title={title}
      style={style}
      onPress={onPress}
      background={<AppNetworkImage url={IPFStoURL(moment.data.cid)} style={styles.image} />}
    />
  );
}

const makeStyles = () =>
  StyleSheet.create({
    image: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
