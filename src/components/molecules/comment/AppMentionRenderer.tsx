import React from 'react';
import { Part, isMentionPartType, PartType, parseValue } from 'react-native-controlled-mentions';
import { useTheme } from 'react-native-paper';
import defaultTheme, { Theme } from 'enevti-app/theme/default';
import { NativeSyntheticEvent, StyleProp, TextLayoutEventData, TextStyle } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { COLLECTION_MENTION_TRIGGER, NFT_MENTION_TRIGGER, PROFILE_MENTION_TRIGGER } from 'enevti-app/utils/mention';
import { useDispatch } from 'react-redux';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { useTranslation } from 'react-i18next';
import { MentionData } from 'react-native-controlled-mentions/dist/types';
import AppTextBodyCustom from 'enevti-app/components/atoms/text/AppTextBodyCustom';
import AppTextHeadingCustom from 'enevti-app/components/atoms/text/AppTextHeadingCustom';
import darkTheme from 'enevti-app/theme/dark';
import useDebouncedNavigation from 'enevti-app/utils/hook/useDebouncedNavigation';

interface AppMentionRendererProps {
  text: string;
  navigation?: StackNavigationProp<RootStackParamList>;
  disabled?: boolean;
  style?: StyleProp<TextStyle>;
  color?: string;
  title?: string;
  onTextPress?: () => void;
  onTitlePress?: () => void;
  onTextLayout?: (event: NativeSyntheticEvent<TextLayoutEventData>) => void;
  size?: number;
  numberOfLines?: number;
  theme?: 'dark' | 'light' | 'system';
}

export default function AppMentionRenderer({
  navigation,
  text,
  style,
  color,
  title,
  disabled,
  onTextPress,
  onTitlePress,
  onTextLayout,
  size,
  numberOfLines,
  theme,
}: AppMentionRendererProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const paperTheme = useTheme() as Theme;
  const dnavigation = useDebouncedNavigation(navigation);
  const selectedTheme = React.useMemo(() => {
    if (theme === 'dark') {
      return darkTheme;
    }
    if (theme === 'light') {
      return defaultTheme;
    }
    return paperTheme;
  }, [paperTheme, theme]);

  const profileMentionOnPress = React.useCallback(
    (data?: MentionData) => {
      if (navigation && data) {
        dnavigation('Profile', { mode: 'u', arg: data.id });
      } else {
        dispatch(showSnackbar({ mode: 'info', text: t('error:dataUnavailable') }));
      }
    },
    [dispatch, dnavigation, navigation, t],
  );

  const collectionMentionOnPress = React.useCallback(
    (data?: MentionData) => {
      if (navigation && data) {
        dnavigation('Collection', { mode: 's', arg: data.id });
      } else {
        dispatch(showSnackbar({ mode: 'info', text: t('error:dataUnavailable') }));
      }
    },
    [dispatch, dnavigation, navigation, t],
  );

  const nftMentionOnPress = React.useCallback(
    (data?: MentionData) => {
      if (navigation && data) {
        dnavigation('NFTDetails', { mode: 's', arg: data.id });
      } else {
        dispatch(showSnackbar({ mode: 'info', text: t('error:dataUnavailable') }));
      }
    },
    [dispatch, dnavigation, navigation, t],
  );

  const renderPart = React.useCallback(
    (part: Part, index: number) => {
      if (!part.partType) {
        return (
          <AppTextBodyCustom onPress={onTextPress} size={size === undefined ? 1.8 : size} key={index} style={{ color }}>
            {part.text}
          </AppTextBodyCustom>
        );
      }

      if (isMentionPartType(part.partType)) {
        if (part.partType.trigger === PROFILE_MENTION_TRIGGER) {
          return (
            <AppTextBodyCustom
              size={size === undefined ? 1.8 : size}
              key={`${index}-${part.data?.trigger}`}
              style={{ color: disabled ? (color ? color : selectedTheme.colors.text) : selectedTheme.colors.link }}
              onPress={disabled ? undefined : () => profileMentionOnPress(part.data)}>
              {part.text}
            </AppTextBodyCustom>
          );
        } else if (part.partType.trigger === COLLECTION_MENTION_TRIGGER) {
          return (
            <AppTextBodyCustom
              size={size === undefined ? 1.8 : size}
              key={`${index}-${part.data?.trigger}`}
              style={{ color: disabled ? (color ? color : selectedTheme.colors.text) : selectedTheme.colors.link }}
              onPress={disabled ? undefined : () => collectionMentionOnPress(part.data)}>
              {part.text}
            </AppTextBodyCustom>
          );
        } else if (part.partType.trigger === NFT_MENTION_TRIGGER) {
          return (
            <AppTextBodyCustom
              size={size === undefined ? 1.8 : size}
              key={`${index}-${part.data?.trigger}`}
              style={{ color: disabled ? (color ? color : selectedTheme.colors.text) : selectedTheme.colors.link }}
              onPress={disabled ? undefined : () => nftMentionOnPress(part.data)}>
              {part.text}
            </AppTextBodyCustom>
          );
        }
      }

      return (
        <AppTextBodyCustom size={size === undefined ? 1.8 : size} key={`${index}-pattern`}>
          {part.text}
        </AppTextBodyCustom>
      );
    },
    [
      collectionMentionOnPress,
      onTextPress,
      color,
      disabled,
      nftMentionOnPress,
      profileMentionOnPress,
      size,
      selectedTheme.colors.link,
      selectedTheme.colors.text,
    ],
  );

  const renderValue = React.useCallback(
    (value: string, partTypes: PartType[]) => {
      const { parts } = parseValue(value, partTypes);
      return parts.map(renderPart);
    },
    [renderPart],
  );

  return (
    <AppTextBodyCustom
      onTextLayout={onTextLayout}
      numberOfLines={numberOfLines}
      size={size === undefined ? 1.8 : size}
      style={style}>
      {title ? (
        <AppTextHeadingCustom size={size === undefined ? 1.8 : size} onPress={onTitlePress}>
          {title}{' '}
        </AppTextHeadingCustom>
      ) : null}
      {renderValue(text, [
        { trigger: PROFILE_MENTION_TRIGGER },
        { trigger: COLLECTION_MENTION_TRIGGER },
        { trigger: NFT_MENTION_TRIGGER },
      ])}
    </AppTextBodyCustom>
  );
}
