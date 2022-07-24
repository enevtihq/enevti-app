import { Pressable, View } from 'react-native';
import React from 'react';
import Color from 'color';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';
import { wp, hp } from 'enevti-app/utils/imageRatio';
import AppAvatarRenderer from '../avatar/AppAvatarRenderer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import { isMentionPartType, parseValue, Part, PartType } from 'react-native-controlled-mentions';

const data = 'Hello @[budi](envtq7munbq7zgxw7qayc2pnwmyymupsbr9ogxtjvq)! How are you?';

export default function AppCommentItem() {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;

  const renderPart = React.useCallback((part: Part, index: number) => {
    if (!part.partType) {
      return <AppTextBody4 key={index}>{part.text}</AppTextBody4>;
    }

    if (isMentionPartType(part.partType)) {
      return (
        <AppTextBody4
          key={`${index}-${part.data?.trigger}`}
          style={{ color: theme.colors.primary }}
          onPress={() => console.log('Pressed', part.data)}>
          {part.text}
        </AppTextBody4>
      );
    }

    return <AppTextBody4 key={`${index}-pattern`}>{part.text}</AppTextBody4>;
  }, []);

  const renderValue = React.useCallback(
    (value: string, partTypes: PartType[]) => {
      const { parts } = parseValue(value, partTypes);
      return parts.map(renderPart);
    },
    [renderPart],
  );

  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={{ marginHorizontal: wp(4, insets) }}>
        <AppAvatarRenderer base32={'envtq7munbq7zgxw7qayc2pnwmyymupsbr9ogxtjvq'} size={hp(5, insets)} />
      </View>
      <View style={{ flex: 1 }}>
        <AppTextBody4 style={{ marginBottom: hp(0.5) }}>
          <AppTextHeading4>aldhosutra</AppTextHeading4> {renderValue(data, [{ trigger: '@' }])}
        </AppTextBody4>
        <View style={{ flexDirection: 'row' }}>
          <AppTextHeading4 style={{ color: theme.colors.placeholder, marginRight: wp(4, insets) }}>3d</AppTextHeading4>
          <AppTextHeading4 style={{ color: theme.colors.placeholder, marginRight: wp(4, insets) }}>
            203 likes
          </AppTextHeading4>
          <AppTextHeading4 style={{ color: theme.colors.placeholder, marginRight: wp(4, insets) }}>
            Reply
          </AppTextHeading4>
        </View>
        <View style={{ flexDirection: 'row', marginVertical: hp(2, insets) }}>
          <View
            style={{
              height: 2,
              width: wp(10, insets),
              backgroundColor: Color(theme.colors.placeholder).alpha(0.1).rgb().toString(),
              alignSelf: 'center',
              marginRight: wp(4, insets),
            }}
          />
          <AppTextHeading4 style={{ color: theme.colors.placeholder }}>View 13 more replies</AppTextHeading4>
        </View>
      </View>
      <View style={{ marginHorizontal: wp(4, insets) }}>
        <AppIconButton icon={iconMap.likeInactive} size={hp(2.25, insets)} />
      </View>
    </View>
  );
}
