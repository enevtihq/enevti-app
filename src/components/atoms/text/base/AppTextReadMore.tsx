import React from 'react';
import { StyleProp, Text, TextStyle, Pressable, NativeSyntheticEvent, TextLayoutEventData } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';

interface AppTextReadMoreProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  readMoreLimit?: number;
  onPress?: () => void;
  onTextLayout?: (event: NativeSyntheticEvent<TextLayoutEventData>) => void;
  selectable?: boolean;
}

export default function AppTextReadMore({
  children,
  selectable,
  style,
  readMoreLimit,
  onPress,
  onTextLayout,
}: AppTextReadMoreProps) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;

  const [childrenCollapsed, setChildrenCollapsed] = React.useState<boolean>(false);
  const text = React.useMemo(
    () =>
      !childrenCollapsed
        ? `${(children! as string).substring(0, readMoreLimit! - t('form:seeMore').length)}...`
        : `${children}`,
    [t, children, childrenCollapsed, readMoreLimit],
  );
  const onReadMorePress = React.useCallback(() => setChildrenCollapsed(old => !old), []);

  return (
    <Pressable onPress={onReadMorePress}>
      <Text onTextLayout={onTextLayout} selectable={selectable} style={style} onPress={onPress}>
        {text}{' '}
        <Text
          style={{
            color: theme.colors.placeholder,
            fontFamily: theme.fonts.medium.fontFamily,
            fontWeight: theme.fonts.medium.fontWeight,
          }}>
          ({childrenCollapsed ? t('form:seeLess') : t('form:seeMore')})
        </Text>
      </Text>
    </Pressable>
  );
}
