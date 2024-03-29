import React from 'react';
import { PickerItem } from 'enevti-app/types/ui/screen/PickerItem';
import { useTranslation } from 'react-i18next';
import AppListPicker from 'enevti-app/components/molecules/listpicker/AppListPicker';
import { shallowEqual } from 'react-redux';
import utilityToIcon from 'enevti-app/utils/icon/utilityToIcon';
import AppIconComponent from 'enevti-app/components/atoms/icon/AppIconComponent';
import { StyleSheet, View } from 'react-native';
import { wp } from 'enevti-app/utils/layout/imageRatio';
import UtilityBackground from 'enevti-app/components/atoms/nft/utility/UtilityBackground';
import { makeDummyNFT } from 'enevti-app/utils/dummy/nft';
import { NFTUtility } from 'enevti-types/chain/nft/NFTUtility';

interface AppUtilityPickerProps {
  value?: string;
  onSelected?: (item: PickerItem) => void;
  memoKey?: (keyof AppUtilityPickerProps)[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Component({ value, onSelected, memoKey }: AppUtilityPickerProps) {
  const { t } = useTranslation();
  const styles = React.useMemo(() => makeStyles(), []);

  const LeftComponent = React.useCallback(
    (item: PickerItem) => (
      <View style={styles.listIconContainer}>
        <UtilityBackground
          nft={makeDummyNFT(undefined, undefined, undefined, item.value as NFTUtility)}
          args={{ height: '100%', width: '100%', x: '0%', y: '0%', rotate: '0deg' }}
        />
        <AppIconComponent name={item.icon} size={25} color={'white'} />
      </View>
    ),
    [styles.listIconContainer],
  );

  const utilityItem: PickerItem[] = React.useMemo(
    () => [
      {
        value: 'content',
        icon: utilityToIcon('content'),
        title: t('createNFT:utilityContent'),
        description: t('createNFT:utilityContentDescription'),
        disabled: false,
      },
      {
        value: 'videocall',
        icon: utilityToIcon('videocall'),
        title: t('createNFT:utilityVideoCall'),
        description: t('createNFT:utilityVideoCallDescription'),
        disabled: false,
      },
      {
        value: 'gift',
        icon: utilityToIcon('gift'),
        title: t('createNFT:utilityGift'),
        description: t('createNFT:utilityGiftDescription'),
        disabled: true,
      },
      {
        value: 'qr',
        icon: utilityToIcon('qr'),
        title: t('createNFT:utilityQR'),
        description: t('createNFT:utilityQRDescription'),
        disabled: true,
      },
    ],
    [t],
  );

  return (
    <AppListPicker
      items={utilityItem}
      left={LeftComponent}
      label={t('createNFT:selectUtility')}
      subLabel={t('createNFT:selectUtilityDescription')}
      onSelected={onSelected}
      value={value}
    />
  );
}

const AppUtilityPicker = React.memo(Component, (prevProps, nextProps) => {
  if (prevProps.memoKey) {
    let ret = true;
    prevProps.memoKey.forEach(key => {
      if (prevProps[key] !== nextProps[key]) {
        ret = false;
      }
    });
    return ret;
  } else {
    return shallowEqual(prevProps, nextProps);
  }
});
export default AppUtilityPicker;

const makeStyles = () =>
  StyleSheet.create({
    listIconContainer: {
      marginRight: wp('3%'),
      alignSelf: 'center',
      width: wp('10%'),
      height: wp('10%'),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: wp('10%'),
      overflow: 'hidden',
    },
  });
