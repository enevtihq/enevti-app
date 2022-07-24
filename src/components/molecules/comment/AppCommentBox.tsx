import { Platform, Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import AppAvatarRenderer from '../avatar/AppAvatarRenderer';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import { MentionInput, MentionSuggestionsProps } from 'react-native-controlled-mentions';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import Color from 'color';
import { useDebouncedCallback } from 'use-debounce';

export default function AppCommentBox() {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);

  const [value, setValue] = React.useState<string>('');
  const debouncedSetValue = useDebouncedCallback((t: string) => setValue(t), 1000);

  const myPersona = useSelector(selectMyPersonaCache);

  const suggestions = React.useMemo(() => {
    return [
      { id: '1', name: 'David Tabaka' },
      { id: '2', name: 'Mary' },
      { id: '3', name: 'Tony' },
      { id: '4', name: 'Mike' },
      { id: '5', name: 'Grey' },
    ];
  }, []);

  const renderSuggestions: React.FC<MentionSuggestionsProps> = React.useCallback(
    ({ keyword, onSuggestionPress }) => {
      if (keyword == null) {
        return null;
      }

      return (
        <View
          style={{ borderColor: Color(theme.colors.placeholder).alpha(0.05).rgb().toString(), borderBottomWidth: 1 }}>
          {suggestions
            .filter(one => one.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()))
            .map(one => (
              <Pressable key={one.id} onPress={() => onSuggestionPress(one)} style={{ padding: 12 }}>
                <AppTextBody3>{one.name}</AppTextBody3>
              </Pressable>
            ))}
        </View>
      );
    },
    [suggestions, theme.colors.placeholder],
  );

  return (
    <View style={styles.commentBoxContainer}>
      <View>
        <View style={styles.avatarBox}>
          <AppAvatarRenderer size={hp(5, insets)} persona={myPersona} />
        </View>
        <View>
          <MentionInput
            value={value}
            onChange={setValue}
            placeholder={'Tag username with "@", collection with "$", or NFT with "*"'}
            placeholderTextColor={theme.colors.placeholder}
            style={styles.commentInput}
            partTypes={[
              {
                trigger: '@',
                renderSuggestions,
                textStyle: { fontWeight: 'bold', color: 'blue' },
              },
            ]}
          />
        </View>
        <View style={styles.commentActionContainer}>
          <View style={styles.commentActionBg} />
          <AppIconButton icon={iconMap.sendPost} color={theme.colors.primary} size={hp(4, insets)} onPress={() => {}} />
        </View>
      </View>
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    commentBoxContainer: {
      position: 'absolute',
      width: '100%',
      backgroundColor: theme.colors.background,
      bottom: 0,
      paddingBottom: hp(2, insets) + insets.bottom,
      borderColor: Color(theme.colors.placeholder).alpha(0.05).rgb().toString(),
      borderTopWidth: 1,
    },
    avatarBox: {
      position: 'absolute',
      bottom: hp(1, insets),
      left: wp(3, insets),
    },
    commentInput: {
      marginTop: Platform.OS === 'ios' ? hp(2, insets) : undefined,
      marginLeft: wp(15, insets),
      marginRight: wp(15, insets),
      minHeight: hp(6, insets),
      maxHeight: hp(14, insets),
      color: theme.colors.text,
      fontSize: 12,
      fontFamily: theme.fonts.regular.fontFamily,
    },
    commentActionContainer: {
      position: 'absolute',
      bottom: hp(1, insets),
      right: wp(4, insets),
      justifyContent: 'center',
    },
    commentActionBg: {
      position: 'absolute',
      backgroundColor: 'white',
      width: '50%',
      height: '50%',
      alignSelf: 'center',
      borderRadius: hp(4, insets),
    },
  });
