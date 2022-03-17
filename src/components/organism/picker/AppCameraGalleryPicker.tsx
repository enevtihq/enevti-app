import React from 'react';
import AppMenuContainer from '../../atoms/menu/AppMenuContainer';
import AppMenuItem from '../../atoms/menu/AppMenuItem';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import { useTranslation } from 'react-i18next';
import { menuItemHeigtPercentage } from '../../../utils/layout/menuItemHeigtPercentage';
import ImageCropPicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { IMAGE_CROP_PICKER_OPTION } from './AppContentPicker';
import { handleError } from '../../../utils/error/handle';
import { shallowEqual } from 'react-redux';

interface AppCameraGalleryPickerProps {
  visible: boolean;
  onSelected: (image: ImageOrVideo) => void;
  onDismiss?: () => void;
  memoKey?: (keyof AppCameraGalleryPickerProps)[];
}

function Component({
  visible,
  onSelected,
  onDismiss,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppCameraGalleryPickerProps) {
  const { t } = useTranslation();
  const nothing = React.useCallback(() => {}, []);

  const snapPoints = React.useMemo(
    () => [`${menuItemHeigtPercentage(2)}%`],
    [],
  );

  const pickFromGallery = React.useCallback(() => {
    ImageCropPicker.openPicker(IMAGE_CROP_PICKER_OPTION)
      .then(image => {
        onSelected(image);
        onDismiss && onDismiss();
      })
      .catch(err => handleError(err));
  }, [onSelected, onDismiss]);

  const openCamera = React.useCallback(() => {
    ImageCropPicker.openCamera(IMAGE_CROP_PICKER_OPTION)
      .then(image => {
        onSelected(image);
        onDismiss && onDismiss();
      })
      .catch(err => handleError(err));
  }, [onSelected, onDismiss]);

  return (
    <AppMenuContainer
      memoKey={['visible']}
      visible={visible}
      snapPoints={snapPoints}
      tapEverywhereToDismiss={true}
      onDismiss={onDismiss ? onDismiss : nothing}>
      <AppMenuItem
        onPress={openCamera}
        icon={iconMap.camera}
        title={t('createNFT:openCamera')}
      />
      <AppMenuItem
        onPress={pickFromGallery}
        icon={iconMap.gallery}
        title={t('createNFT:pickFromGallery')}
      />
    </AppMenuContainer>
  );
}

const AppCameraGalleryPicker = React.memo(Component, (prevProps, nextProps) => {
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
export default AppCameraGalleryPicker;
