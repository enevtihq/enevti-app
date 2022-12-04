import React from 'react';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import AppMenuItem from 'enevti-app/components/atoms/menu/AppMenuItem';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useTranslation } from 'react-i18next';
import { menuItemHeigtPercentage } from 'enevti-app/utils/layout/menuItemHeigtPercentage';
import ImageCropPicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { IMAGE_CROP_PICKER_OPTION } from './AppContentPicker';
import { handleError } from 'enevti-app/utils/error/handle';
import { shallowEqual } from 'react-redux';
import { Platform } from 'react-native';

type AppCameraGalleryType = 'photoCamera' | 'videoCamera' | 'photoGallery' | 'videoGallery' | 'anyGallery';

interface AppCameraGalleryPickerProps {
  visible: boolean;
  onSelected: (image: ImageOrVideo) => void;
  onDismiss?: () => void;
  type?: AppCameraGalleryType[];
  memoKey?: (keyof AppCameraGalleryPickerProps)[];
}

function Component({
  visible,
  onSelected,
  onDismiss,
  type = ['photoCamera', 'photoGallery'],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppCameraGalleryPickerProps) {
  const { t } = useTranslation();
  const snapPoints = React.useMemo(() => [`${menuItemHeigtPercentage(type.length)}%`], [type]);

  const galleryHandler = React.useCallback(
    (mediaType: 'photo' | 'video' | 'any') => () => {
      const compressVideoPreset = Platform.OS === 'ios' && mediaType === 'video' ? 'HighestQuality' : undefined;
      ImageCropPicker.openPicker({ ...IMAGE_CROP_PICKER_OPTION, mediaType, compressVideoPreset })
        .then(image => {
          onSelected(image);
          onDismiss && onDismiss();
        })
        .catch(err => handleError(err));
    },
    [onSelected, onDismiss],
  );

  const cameraHandler = React.useCallback(
    (mediaType: 'photo' | 'video') => () => {
      const compressVideoPreset = Platform.OS === 'ios' && mediaType === 'video' ? 'HighestQuality' : undefined;
      ImageCropPicker.openCamera({ ...IMAGE_CROP_PICKER_OPTION, mediaType, compressVideoPreset })
        .then(image => {
          onSelected(image);
          onDismiss && onDismiss();
        })
        .catch(err => handleError(err));
    },
    [onSelected, onDismiss],
  );

  const handleRender = React.useCallback(
    (tp: AppCameraGalleryType) => {
      switch (tp) {
        case 'photoCamera':
          return (
            <AppMenuItem
              key={tp}
              onPress={cameraHandler('photo')}
              icon={iconMap.cameraPhoto}
              title={t('createNFT:photoCamera')}
            />
          );
        case 'photoGallery':
          return (
            <AppMenuItem
              key={tp}
              onPress={galleryHandler('photo')}
              icon={iconMap.galleryPhoto}
              title={t('createNFT:photoGallery')}
            />
          );
        case 'videoCamera':
          return (
            <AppMenuItem
              key={tp}
              onPress={cameraHandler('video')}
              icon={iconMap.cameraVideo}
              title={t('createNFT:videoCamera')}
            />
          );
        case 'videoGallery':
          return (
            <AppMenuItem
              key={tp}
              onPress={galleryHandler('video')}
              icon={iconMap.galleryPhoto}
              title={t('createNFT:videoGallery')}
            />
          );
        case 'anyGallery':
          return (
            <AppMenuItem
              key={tp}
              onPress={galleryHandler('any')}
              icon={iconMap.gallery}
              title={t('createNFT:anyGallery')}
            />
          );
        default:
          return null;
      }
    },
    [cameraHandler, galleryHandler, t],
  );

  return (
    <AppMenuContainer
      memoKey={['visible']}
      visible={visible}
      snapPoints={snapPoints}
      tapEverywhereToDismiss={true}
      onDismiss={onDismiss ? onDismiss : () => {}}>
      {type.map(handleRender)}
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
