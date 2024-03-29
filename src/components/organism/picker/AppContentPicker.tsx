import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppListPickerItem from 'enevti-app/components/molecules/listpicker/AppListPickerItem';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { handleError } from 'enevti-app/utils/error/handle';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { wp } from 'enevti-app/utils/layout/imageRatio';
import mimeToIcon from 'enevti-app/utils/icon/mimeToIcon';
import { fileSizeKMG } from 'enevti-app/utils/format/fileSize';
import { shallowEqual } from 'react-redux';
import { Theme } from 'enevti-app/theme/default';
import Color from 'color';
import { useTheme } from 'react-native-paper';
import ImageCropPicker from 'react-native-image-crop-picker';
import getPath from '@flyerhq/react-native-android-uri-path';

export const IMAGE_CROP_PICKER_OPTION = {
  // compressImageQuality: 1,
  // cropping: true,
  // freeStyleCropEnabled: true,
  // enableRotationGesture: true,
  // cropperToolbarColor: darkTheme.colors.background,
  // cropperStatusBarColor: darkTheme.colors.background,
  // cropperActiveWidgetColor: darkTheme.colors.primary,
  // cropperToolbarWidgetColor: darkTheme.colors.text,
  // hideBottomControls: true,
  // cropperRotateButtonsHidden: true,
  // cropperToolbarTitle: i18n.t('createNFT:editImage'),
  // cropperCancelText: i18n.t('createNFT:cancelEdit'),
  // cropperChooseText: i18n.t('createNFT:continue'),
};

interface AppContentPickerProps {
  title: string;
  description: string;
  value?: DocumentPickerResponse;
  onSelected?: (item: DocumentPickerResponse) => void;
  onDelete?: () => void;
  type?: string | string[];
  memoKey?: (keyof AppContentPickerProps)[];
}

function Component({
  title,
  description,
  value,
  onSelected,
  onDelete,
  type = DocumentPicker.types.allFiles,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppContentPickerProps) {
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme), [theme]);

  const handleDocumentSelection = React.useCallback(async () => {
    try {
      if (type === DocumentPicker.types.images) {
        const response = await ImageCropPicker.openPicker(IMAGE_CROP_PICKER_OPTION);
        onSelected &&
          onSelected({
            fileCopyUri: null,
            name: response.path.substring(response.path.lastIndexOf('/') + 1),
            size: response.size,
            type: response.mime,
            uri: response.path,
          });
      } else {
        const response = await DocumentPicker.pickSingle({
          presentationStyle: 'fullScreen',
          type: type,
        });
        onSelected && onSelected({ ...response, uri: getPath(response.uri) });
      }
    } catch (err) {
      handleError(err);
    }
  }, [onSelected, type]);

  return (
    <View>
      {value && value.name && value.size && value.type && value.uri ? (
        <AppListPickerItem
          right={<AppIconButton icon={iconMap.delete} onPress={onDelete} size={20} style={styles.listDropDown} />}
          icon={mimeToIcon(value.type)}
          title={value.name}
          description={fileSizeKMG(value.size, 2)}
          style={styles.pickerItem}
        />
      ) : (
        <AppListPickerItem
          showDropDown
          dropDownIcon={iconMap.arrowRight}
          style={styles.pickerItem}
          onPress={handleDocumentSelection}
          icon={iconMap.add}
          title={title}
          description={description}
        />
      )}
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    listDropDown: {
      marginLeft: wp('3%'),
      alignSelf: 'center',
    },
    pickerItem: {
      backgroundColor: theme.dark
        ? Color(theme.colors.background).lighten(0.5).rgb().string()
        : Color(theme.colors.background).darken(0.04).rgb().string(),
    },
  });

const AppContentPicker = React.memo(Component, (prevProps, nextProps) => {
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
export default AppContentPicker;
