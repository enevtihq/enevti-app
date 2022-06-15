import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { Linking } from 'react-native';

export type AppLinking = (initialRouteName: keyof RootStackParamList) => LinkingOptions<RootStackParamList>;

export type AppLinkNamespace =
  | ''
  | 'nft-serial'
  | 'nft-id'
  | 'collection-serial'
  | 'collection-id'
  | 'stake-pool-base32'
  | 'stake-pool-address'
  | 'stake-pool-username'
  | 'profile-base32'
  | 'profile-address'
  | 'profile-username';

export const APP_LINK = 'enevti://';
export const UNIVERSAL_LINK_HTTP = 'http://app.enevti.com';
export const UNIVERSAL_LINK_HTTPS = 'https://app.enevti.com';

const KNOWN_LINK = ['nft', 'collection', 'stake', 'profile'];

export const isAppLink = (link: string) => {
  try {
    const url = new URL(link);
    return `${url.protocol}//` === APP_LINK;
  } catch (err) {
    return false;
  }
};

export const isRawLink = (link: string) => {
  try {
    const url = new URL(link);
    return url.hostname === '';
  } catch {
    return false;
  }
};

export const isLinkKnown = (link: string) => {
  return KNOWN_LINK.includes(link);
};

export const linking: AppLinking = initialRouteName => {
  return {
    prefixes: [APP_LINK, UNIVERSAL_LINK_HTTP, UNIVERSAL_LINK_HTTPS],
    config: {
      initialRouteName,
      screens: {
        NFTDetails: {
          path: 'nft/:mode/:arg',
        },
        Collection: {
          path: 'collection/:mode/:arg',
        },
        StakePool: {
          path: 'stake/:mode/:arg',
        },
        Profile: {
          path: 'profile/:mode/:arg',
        },
      },
    },
    async getInitialURL() {
      return Linking.getInitialURL();
    },
  };
};

export function getAppLink(namespace: AppLinkNamespace, arg: string, prefix: string = `${UNIVERSAL_LINK_HTTPS}/`) {
  let ret: string = prefix;
  switch (namespace) {
    case '':
      return `${APP_LINK}/${arg}`;
    case 'nft-serial':
      ret += `nft/s/${arg}`;
      break;
    case 'nft-id':
      ret += `nft/id/${arg}`;
      break;
    case 'collection-serial':
      ret += `collection/s/${arg}`;
      break;
    case 'collection-id':
      ret += `collection/id/${arg}`;
      break;
    case 'stake-pool-base32':
      ret += `stake/pool/b/${arg}`;
      break;
    case 'stake-pool-address':
      ret += `stake/pool/a/${arg}`;
      break;
    case 'stake-pool-username':
      ret += `stake/pool/u/${arg}`;
      break;
    case 'profile-base32':
      ret += `profile/b/${arg}`;
      break;
    case 'profile-address':
      ret += `profile/a/${arg}`;
      break;
    case 'profile-username':
      ret += `profile/u/${arg}`;
      break;
    default:
      break;
  }
  return ret;
}
