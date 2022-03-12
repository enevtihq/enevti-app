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

interface AppContentPickerProps {
  value?: DocumentPickerResponse;
  onSelected?: (item: DocumentPickerResponse) => void;
  onDelete?: () => void;
}

export default function AppContentPicker({
  value,
  onSelected,
  onDelete,
}: AppContentPickerProps) {
  const insets = useSafeAreaInsets();
  const styles = makeStyle(insets);

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
          icon={iconMap.add}
          title={value.name}
          description={`${(value.size / 1000).toFixed(2)} KB`}
        />
      ) : (
        <AppListPickerItem
          showDropDown
          dropDownIcon={iconMap.arrowRight}
          onPress={handleDocumentSelection}
          icon={iconMap.add}
          title={'Select File'}
          description={'Set secret content inside your NFT'}
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
