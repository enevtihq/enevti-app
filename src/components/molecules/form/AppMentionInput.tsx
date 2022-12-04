import { LayoutChangeEvent, StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import React from 'react';
import { MentionInput, MentionSuggestionsProps } from 'react-native-controlled-mentions';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import AppNetworkImage from 'enevti-app/components/atoms/image/AppNetworkImage';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { getTagUsername, CollectionTag, getTagCollection, getTagNFT } from 'enevti-app/service/enevti/tag';
import { IPFStoURL } from 'enevti-app/service/ipfs';
import { Persona } from 'enevti-app/types/core/account/persona';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { handleError } from 'enevti-app/utils/error/handle';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/layout/imageRatio';
import { useDebouncedCallback } from 'use-debounce';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import AppNFTRenderer from 'enevti-app/components/molecules/nft/AppNFTRenderer';
import Color from 'color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';

interface AppMentionInputProps {
  value: string;
  onChange: (e: string) => void;
  maxLength?: number;
  bottom?: boolean;
  inputRef?: React.RefObject<TextInput>;
  onLayout?: (layout: LayoutChangeEvent) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  suggestionStyle?: StyleProp<ViewStyle>;
}

export default function AppMentionInput({
  onLayout,
  value,
  bottom,
  maxLength,
  onChange,
  placeholder,
  style,
  suggestionStyle,
  inputRef,
}: AppMentionInputProps) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);

  const abortController = React.useRef<AbortController>();
  const [isError, setIsError] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    abortController.current = new AbortController();
    return () => {
      abortController.current && abortController.current.abort();
    };
  }, []);

  const SuggestionError = React.useMemo(
    () => (
      <View style={[styles.suggestionContainer, suggestionStyle]}>
        <AppTextBody4 style={styles.suggestionError}>{t('error:clientError')}</AppTextBody4>
      </View>
    ),
    [styles.suggestionContainer, styles.suggestionError, t, suggestionStyle],
  );

  const SuggestionLoading = React.useMemo(
    () => (
      <View style={[styles.suggestionContainer, suggestionStyle]}>
        <AppActivityIndicator animating />
      </View>
    ),
    [styles.suggestionContainer, suggestionStyle],
  );

  const SuggestionNotFound = React.useMemo(
    () => (
      <View style={[styles.suggestionContainer, suggestionStyle]}>
        <AppTextBody4 style={styles.suggestionInfo}>{t('error:notFound')}</AppTextBody4>
      </View>
    ),
    [styles.suggestionContainer, styles.suggestionInfo, t, suggestionStyle],
  );

  const [usernameSuggestion, setUsernameSuggestion] = React.useState<Persona[]>([]);
  const debouncedSetUsernameSuggestion = useDebouncedCallback(async (keyword: string) => {
    try {
      if (loading) {
        const personaResponse = await getTagUsername(
          keyword,
          abortController.current ? abortController.current.signal : undefined,
        );
        if (personaResponse.status !== 200) {
          setIsError(true);
        }
        setUsernameSuggestion(personaResponse.data);
        setLoading(false);
        setIsError(false);
      }
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  }, 1000);

  const renderUsernameSuggestions: React.FC<MentionSuggestionsProps> = React.useCallback(
    ({ keyword, onSuggestionPress }) => {
      if (keyword == null) {
        return null;
      }

      debouncedSetUsernameSuggestion(keyword);

      if (isError) {
        return SuggestionError;
      }
      if (loading) {
        return SuggestionLoading;
      }
      if (usernameSuggestion.length === 0) {
        return SuggestionNotFound;
      }

      return (
        <View style={[styles.suggestionSuccess, suggestionStyle]}>
          {usernameSuggestion.map(suggestion => (
            <AppListItem
              key={suggestion.address}
              onPress={() => onSuggestionPress({ id: suggestion.username, name: suggestion.username })}
              containerStyle={styles.accountCard}
              leftContent={
                <View style={styles.collectionCoverContainer}>
                  <AppAvatarRenderer persona={suggestion} size={hp(5, insets)} style={styles.avatar} />
                </View>
              }>
              <AppTextHeading3 numberOfLines={1}>{parsePersonaLabel(suggestion)}</AppTextHeading3>
              {suggestion.username ? (
                <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={1}>
                  {suggestion.base32}
                </AppTextBody4>
              ) : null}
            </AppListItem>
          ))}
        </View>
      );
    },
    [
      SuggestionError,
      SuggestionLoading,
      SuggestionNotFound,
      debouncedSetUsernameSuggestion,
      insets,
      isError,
      loading,
      styles.accountCard,
      styles.avatar,
      styles.collectionCoverContainer,
      styles.suggestionSuccess,
      theme.colors.placeholder,
      usernameSuggestion,
      suggestionStyle,
    ],
  );

  const [collectionSuggestion, setCollectionSuggestion] = React.useState<CollectionTag[]>([]);
  const debouncedSetCollectionSuggestion = useDebouncedCallback(async (keyword: string) => {
    try {
      if (loading) {
        const collectionResponse = await getTagCollection(
          keyword,
          abortController.current ? abortController.current.signal : undefined,
        );
        if (collectionResponse.status !== 200) {
          setIsError(true);
        }
        setCollectionSuggestion(collectionResponse.data);
        setLoading(false);
        setIsError(false);
      }
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  }, 1000);

  const renderCollectionSuggestions: React.FC<MentionSuggestionsProps> = React.useCallback(
    ({ keyword, onSuggestionPress }) => {
      if (keyword == null) {
        return null;
      }

      debouncedSetCollectionSuggestion(keyword);

      if (isError) {
        return SuggestionError;
      }
      if (loading) {
        return SuggestionLoading;
      }
      if (collectionSuggestion.length === 0) {
        return SuggestionNotFound;
      }

      return (
        <View style={[styles.suggestionSuccess, suggestionStyle]}>
          {collectionSuggestion.map(suggestion => (
            <AppListItem
              key={suggestion.id}
              onPress={() => onSuggestionPress({ id: suggestion.symbol, name: suggestion.name })}
              containerStyle={styles.accountCard}
              leftContent={
                <View style={styles.collectionCoverContainer}>
                  <AppNetworkImage
                    style={{ width: hp(5, insets), height: hp(5, insets) }}
                    url={IPFStoURL(suggestion.cover.cid)}
                  />
                </View>
              }>
              <AppTextHeading3 numberOfLines={1}>
                {suggestion.name} ({suggestion.symbol})
              </AppTextHeading3>
              <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={1}>
                {t('explorer:createdBy', { creator: parsePersonaLabel(suggestion.creator) })}
              </AppTextBody4>
            </AppListItem>
          ))}
        </View>
      );
    },
    [
      SuggestionError,
      SuggestionLoading,
      SuggestionNotFound,
      collectionSuggestion,
      debouncedSetCollectionSuggestion,
      insets,
      isError,
      loading,
      styles.accountCard,
      styles.collectionCoverContainer,
      styles.suggestionSuccess,
      t,
      theme.colors.placeholder,
      suggestionStyle,
    ],
  );

  const [NFTSuggestion, setNFTSuggestion] = React.useState<(NFTBase & { owner: Persona })[]>([]);
  const debouncedSetNFTSuggestion = useDebouncedCallback(async (keyword: string) => {
    try {
      if (loading) {
        const nftResponse = await getTagNFT(
          keyword,
          abortController.current ? abortController.current.signal : undefined,
        );
        if (nftResponse.status !== 200) {
          setIsError(true);
        }
        setNFTSuggestion(nftResponse.data);
        setLoading(false);
        setIsError(false);
      }
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  }, 1000);

  const renderNFTSuggestions: React.FC<MentionSuggestionsProps> = React.useCallback(
    ({ keyword, onSuggestionPress }) => {
      if (keyword == null) {
        return null;
      }

      debouncedSetNFTSuggestion(keyword);

      if (isError) {
        return SuggestionError;
      }
      if (loading) {
        return SuggestionLoading;
      }
      if (NFTSuggestion.length === 0) {
        return SuggestionNotFound;
      }

      return (
        <View style={[styles.suggestionSuccess, suggestionStyle]}>
          {NFTSuggestion.map(suggestion => (
            <AppListItem
              key={suggestion.id}
              onPress={() =>
                onSuggestionPress({
                  id: `${suggestion.symbol}#${suggestion.serial}`,
                  name: `${suggestion.symbol}#${suggestion.serial}`,
                })
              }
              containerStyle={styles.accountCard}
              leftContent={
                <View style={styles.collectionCoverContainer}>
                  <View style={{ height: hp(5, insets), width: hp(5, insets) }}>
                    <AppNFTRenderer imageSize={'s'} nft={suggestion} width={hp(5, insets)} />
                  </View>
                </View>
              }>
              <AppTextHeading3 numberOfLines={1}>
                {suggestion.symbol}#{suggestion.serial}
              </AppTextHeading3>
              <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={1}>
                {suggestion.owner.address ? parsePersonaLabel(suggestion.owner) : t('explorer:notMinted')}
              </AppTextBody4>
            </AppListItem>
          ))}
        </View>
      );
    },
    [
      NFTSuggestion,
      SuggestionError,
      SuggestionLoading,
      SuggestionNotFound,
      debouncedSetNFTSuggestion,
      insets,
      isError,
      loading,
      styles.accountCard,
      styles.collectionCoverContainer,
      styles.suggestionSuccess,
      t,
      theme.colors.placeholder,
      suggestionStyle,
    ],
  );

  return (
    <View>
      <MentionInput
        inputRef={inputRef}
        onLayout={onLayout}
        value={value}
        onChange={e => {
          onChange(e);
          setLoading(true);
        }}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.placeholder}
        style={[{ color: theme.colors.text }, style]}
        partTypes={[
          {
            trigger: '@',
            renderSuggestions: renderUsernameSuggestions,
            textStyle: { fontWeight: 'bold', color: theme.colors.link },
            isBottomMentionSuggestionsRender: bottom,
          },
          {
            trigger: '$',
            renderSuggestions: renderCollectionSuggestions,
            textStyle: { fontWeight: 'bold', color: theme.colors.link },
            allowedSpacesCount: 20,
            isBottomMentionSuggestionsRender: bottom,
          },
          {
            trigger: '*',
            renderSuggestions: renderNFTSuggestions,
            textStyle: { fontWeight: 'bold', color: theme.colors.link },
            isBottomMentionSuggestionsRender: bottom,
          },
        ]}
      />
      {maxLength !== undefined ? ( // TODO: fix maxLength for mentioned input
        <AppTextBody5 style={styles.maxLength}>
          {value.length} / {maxLength}
        </AppTextBody5>
      ) : null}
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    maxLength: {
      color: theme.colors.placeholder,
      position: 'absolute',
      bottom: 3,
      right: 15,
    },
    suggestionContainer: {
      padding: hp(2, insets),
      borderColor: Color(theme.colors.placeholder).alpha(0.05).rgb().toString(),
      borderBottomWidth: 1,
      backgroundColor: theme.colors.background,
    },
    suggestionError: {
      color: theme.colors.error,
      alignSelf: 'center',
    },
    suggestionInfo: {
      alignSelf: 'center',
    },
    suggestionSuccess: {
      borderColor: Color(theme.colors.placeholder).alpha(0.05).rgb().toString(),
      borderBottomWidth: 1,
    },
    accountCard: {
      marginHorizontal: 0,
      marginVertical: 0,
      backgroundColor: theme.colors.background,
      borderRadius: 0,
      borderWidth: 0,
      borderColor: undefined,
    },
    collectionCoverContainer: {
      marginRight: wp('3%', insets),
      overflow: 'hidden',
      alignSelf: 'center',
    },
    avatar: {
      alignSelf: 'center',
    },
  });
