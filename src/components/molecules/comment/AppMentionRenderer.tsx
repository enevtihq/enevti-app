import React from 'react';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';
import { Part, isMentionPartType, PartType, parseValue } from 'react-native-controlled-mentions';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import { StyleProp, TextStyle } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { COLLECTION_MENTION_TRIGGER, NFT_MENTION_TRIGGER, PROFILE_MENTION_TRIGGER } from 'enevti-app/utils/mention';
import { useDispatch } from 'react-redux';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { useTranslation } from 'react-i18next';
import { MentionData } from 'react-native-controlled-mentions/dist/types';

interface AppMentionRendererProps {
  navigation: StackNavigationProp<RootStackParamList>;
  text: string;
  style?: StyleProp<TextStyle>;
  title?: string;
  onTitlePress?: () => void;
}

export default function AppMentionRenderer({ navigation, text, style, title, onTitlePress }: AppMentionRendererProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme() as Theme;

  const profileMentionOnPress = React.useCallback(
    (data?: MentionData) => {
      if (data) {
        navigation.push('Profile', { mode: 'u', arg: data.id });
      } else {
        dispatch(showSnackbar({ mode: 'info', text: t('error:dataUnavailable') }));
      }
    },
    [dispatch, navigation, t],
  );

  const collectionMentionOnPress = React.useCallback(
    (data?: MentionData) => {
      if (data) {
        navigation.push('Collection', { mode: 's', arg: data.id });
      } else {
        dispatch(showSnackbar({ mode: 'info', text: t('error:dataUnavailable') }));
      }
    },
    [dispatch, navigation, t],
  );

  const nftMentionOnPress = React.useCallback(
    (data?: MentionData) => {
      if (data) {
        navigation.push('NFTDetails', { mode: 's', arg: data.id });
      } else {
        dispatch(showSnackbar({ mode: 'info', text: t('error:dataUnavailable') }));
      }
    },
    [dispatch, navigation, t],
  );

  const renderPart = React.useCallback(
    (part: Part, index: number) => {
      if (!part.partType) {
        return <AppTextBody4 key={index}>{part.text}</AppTextBody4>;
      }

      if (isMentionPartType(part.partType)) {
        if (part.partType.trigger === PROFILE_MENTION_TRIGGER) {
          return (
            <AppTextBody4
              key={`${index}-${part.data?.trigger}`}
              style={{ color: theme.colors.link }}
              onPress={() => profileMentionOnPress(part.data)}>
              {part.text}
            </AppTextBody4>
          );
        } else if (part.partType.trigger === COLLECTION_MENTION_TRIGGER) {
          return (
            <AppTextBody4
              key={`${index}-${part.data?.trigger}`}
              style={{ color: theme.colors.link }}
              onPress={() => collectionMentionOnPress(part.data)}>
              {part.text}
            </AppTextBody4>
          );
        } else if (part.partType.trigger === NFT_MENTION_TRIGGER) {
          return (
            <AppTextBody4
              key={`${index}-${part.data?.trigger}`}
              style={{ color: theme.colors.link }}
              onPress={() => nftMentionOnPress(part.data)}>
              {part.text}
            </AppTextBody4>
          );
        }
      }

      return <AppTextBody4 key={`${index}-pattern`}>{part.text}</AppTextBody4>;
    },
    [collectionMentionOnPress, nftMentionOnPress, profileMentionOnPress, theme.colors.link],
  );

  const renderValue = React.useCallback(
    (value: string, partTypes: PartType[]) => {
      const { parts } = parseValue(value, partTypes);
      return parts.map(renderPart);
    },
    [renderPart],
  );

  return (
    <AppTextBody4 style={style}>
      {title ? <AppTextHeading4 onPress={onTitlePress}>{title} </AppTextHeading4> : null}
      {renderValue(text, [
        { trigger: PROFILE_MENTION_TRIGGER },
        { trigger: COLLECTION_MENTION_TRIGGER },
        { trigger: NFT_MENTION_TRIGGER },
      ])}
    </AppTextBody4>
  );
}
