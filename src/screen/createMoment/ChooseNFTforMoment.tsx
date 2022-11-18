import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppHeader from 'enevti-app/components/atoms/view/AppHeader';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from 'enevti-app/theme/default';
import { useTheme } from 'react-native-paper';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/layout/imageRatio';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import { useTranslation } from 'react-i18next';
import AppHeaderWizard from 'enevti-app/components/molecules/view/AppHeaderWizard';

type Props = StackScreenProps<RootStackParamList, 'ChooseNFTforMoment'>;

export default function ChooseNFTforMoment({ navigation, route }: Props) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);

  return (
    <AppView
      withModal
      withPayment
      withLoader
      edges={['bottom', 'left', 'right']}
      headerOffset={insets.top}
      header={
        <AppHeader compact back backIcon={iconMap.close} backIconSize={23} navigation={navigation} title={' '} />
      }>
      <AppHeaderWizard
        title={t('createMoment:addMoment')}
        description={t('createMoment:addMomentDescription')}
        style={styles.header}
        memoKey={[]}
      />
      <ScrollView style={styles.scrollContainer}>
        <Text>ChooseNFTforMoment</Text>
      </ScrollView>
      <View style={styles.actionContainer}>
        <View style={{ height: hp('2%', insets) }} />
        <AppPrimaryButton onPress={() => {}} style={styles.actionButton}>
          {t('createNFT:createButton')}
        </AppPrimaryButton>
        <View style={{ height: Platform.OS === 'ios' ? insets.bottom : hp('2%', insets) }} />
      </View>
    </AppView>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    header: {
      flex: 0,
      marginLeft: wp('3%', insets),
      marginRight: wp('3%', insets),
      marginBottom: hp('3%', insets),
    },
    scrollContainer: {
      zIndex: -9,
    },
    actionContainer: {
      position: 'absolute',
      backgroundColor: theme.colors.background,
      width: '100%',
      bottom: 0,
    },
    actionButton: {
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
  });
