import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppListPickerItem from '../../molecules/listpicker/AppListPickerItem';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import { handleError } from '../../../utils/error/handle';
import AppIconButton from '../../atoms/icon/AppIconButton';
import { SafeAreaInsets, wp } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import mimeToIcon from '../../../utils/mime/mimeToIcon';
import { fileSizeKMG } from '../../../utils/format/fileSize';
import { useTranslation } from 'react-i18next';
import { shallowEqual } from 'react-redux';

interface AppContentPickerProps {
  value?: DocumentPickerResponse;
  onSelected?: (item: DocumentPickerResponse) => void;
  onDelete?: () => void;
  memoKey?: (keyof AppContentPickerProps)[];
}

function Component({
  value,
  onSelected,
  onDelete,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppContentPickerProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyle(insets), [insets]);

  const handleDocumentSelection = React.useCallback(async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
      });
      onSelected && onSelected(response);
    } catch (err) {
      handleError(err);
    }
  }, [onSelected]);

  return (
    <View>
      {value && value.name && value.size && value.type && value.uri ? (
        <AppListPickerItem
          right={
            <AppIconButton
              icon={iconMap.delete}
              onPress={onDelete}
              size={20}
              style={styles.listDropDown}
            />
          }
          icon={mimeToIcon(value.type)}
          title={value.name}
          description={fileSizeKMG(value.size, 2)}
        />
      ) : (
        <AppListPickerItem
          showDropDown
          dropDownIcon={iconMap.arrowRight}
          onPress={handleDocumentSelection}
          icon={iconMap.add}
          title={t('createNFT:selectContent')}
          description={t('createNFT:selectContentDescription')}
        />
      )}
    </View>
  );
}

const makeStyle = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    listDropDown: {
      marginLeft: wp('3%', insets),
      alignSelf: 'center',
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
