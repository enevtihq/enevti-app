import { View, Text } from 'react-native';
import React from 'react';
import AppCountdown from '../../components/atoms/date/AppCountdown';
import AppView from '../../components/atoms/view/AppView';
import AppNetworkImage from '../../components/atoms/image/AppNetworkImage';
import { IPFStoURL } from '../../service/ipfs';
import { wp } from '../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Collection() {
  const insets = useSafeAreaInsets();
  const coverWidth = React.useMemo(() => wp('100%', insets), [insets]);
  const coverHeight = React.useMemo(
    () => insets.top + coverWidth * 0.5625,
    [coverWidth, insets],
  );

  console.log('insets.top', insets.top);

  return (
    <AppView edges={['bottom', 'left', 'right']}>
      <AppNetworkImage
        url={IPFStoURL('Qmb3jKA6Vn1azR6aSMnT6geGMkg818uBkfSHNg8ui1a9dy')}
        style={{ width: coverWidth, height: coverHeight }}
      />
      <AppCountdown until={1000000} />
    </AppView>
  );
}
