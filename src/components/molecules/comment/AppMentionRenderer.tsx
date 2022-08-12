import React from 'react';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';
import { Part, isMentionPartType, PartType, parseValue } from 'react-native-controlled-mentions';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import { StyleProp, TextStyle } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';

interface AppMentionRendererProps {
  navigation: StackNavigationProp<RootStackParamList>;
  text: string;
  style?: StyleProp<TextStyle>;
  title?: string;
  onTitlePress?: () => void;
}

export default function AppMentionRenderer({ navigation, text, style, title, onTitlePress }: AppMentionRendererProps) {
  const theme = useTheme() as Theme;
  const renderPart = React.useCallback(
    (part: Part, index: number) => {
      if (!part.partType) {
        return <AppTextBody4 key={index}>{part.text}</AppTextBody4>;
      }

      if (isMentionPartType(part.partType)) {
        if (part.partType.trigger === '@') {
          return (
            <AppTextBody4
              key={`${index}-${part.data?.trigger}`}
              style={{ color: theme.colors.link }}
              onPress={() => navigation.push('Profile', { mode: 'a', arg: part.data!.id })}>
              {part.text}
            </AppTextBody4>
          );
        } else if (part.partType.trigger === '$') {
          return (
            <AppTextBody4
              key={`${index}-${part.data?.trigger}`}
              style={{ color: theme.colors.link }}
              onPress={() => navigation.push('Collection', { mode: 'id', arg: part.data!.id })}>
              {part.text}
            </AppTextBody4>
          );
        } else if (part.partType.trigger === '*') {
          return (
            <AppTextBody4
              key={`${index}-${part.data?.trigger}`}
              style={{ color: theme.colors.link }}
              onPress={() => navigation.push('NFTDetails', { mode: 'id', arg: part.data!.id })}>
              {part.text}
            </AppTextBody4>
          );
        }
      }

      return <AppTextBody4 key={`${index}-pattern`}>{part.text}</AppTextBody4>;
    },
    [navigation, theme.colors.link],
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
      {renderValue(text, [{ trigger: '@' }, { trigger: '$' }, { trigger: '*' }])}
    </AppTextBody4>
  );
}
