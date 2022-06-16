import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { Linking } from 'react-native';
import { store } from 'enevti-app/store/state';
import { selectLockedState } from 'enevti-app/store/slices/ui/screen/locked';
import { selectAuthState } from 'enevti-app/store/slices/auth';

export type AppLinking = (
  initialRouteName: keyof RootStackParamList,
  currentRoute: string | undefined,
) => LinkingOptions<RootStackParamList>;

export type HostnameToRoute = (hostname: string) => keyof RootStackParamList | undefined;

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
const screens = {
  NFTDetails: {
    path: 'nft',
  },
  Collection: {
    path: 'collection',
  },
  StakePool: {
    path: 'stake',
  },
  Profile: {
    path: 'profile',
  },
  Login: {
    path: 'login',
  },
  CreateAccount: {
    path: 'createaccount',
  },
};

export const hostnameToRoute: HostnameToRoute = (hostname: string) => {
  const host = hostname.charAt(0) === '/' ? hostname.substring(1).toLowerCase() : hostname.toLowerCase();
  let ret = '';
  for (const [key] of Object.entries(screens)) {
    if (screens[key as keyof typeof screens].path === host) {
      ret = key;
      break;
    }
  }
  return ret !== '' ? (ret as unknown as keyof RootStackParamList) : undefined;
};

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

export const linking: AppLinking = (initialRouteName, currentRoute) => {
  return {
    prefixes: [APP_LINK, UNIVERSAL_LINK_HTTP, UNIVERSAL_LINK_HTTPS],
    config: { initialRouteName, screens },
    async getInitialURL() {
      const auth = selectAuthState(store.getState());
      const initialRoute = auth.encrypted ? 'Login' : auth.token ? 'Home' : 'CreateAccount';

      if (initialRoute === 'Login') {
        const url = await Linking.getInitialURL();
        if (url !== null) {
          const loginURL = `${APP_LINK}login?path=${encodeURIComponent(url)}`;
          return loginURL;
        } else {
          return `${APP_LINK}login`;
        }
      } else if (initialRoute === 'CreateAccount') {
        return `${APP_LINK}createaccount`;
      } else {
        return Linking.getInitialURL();
      }
    },
    subscribe(listener) {
      const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
        const locked = selectLockedState(store.getState());
        const auth = selectAuthState(store.getState());

        if (currentRoute === 'Login' || (auth.encrypted && locked)) {
          const loginURL = `${APP_LINK}login?path=${encodeURIComponent(url)}`;
          listener(loginURL);
        } else {
          listener(url);
        }
      });

      return () => {
        linkingSubscription.remove();
      };
    },
  };
};

export function getAppLink(namespace: AppLinkNamespace, arg: string, prefix: string = `${UNIVERSAL_LINK_HTTPS}/`) {
  let ret: string = prefix;
  switch (namespace) {
    case '':
      return `${APP_LINK}/${arg}`;
    case 'nft-serial':
      ret += `nft?mode=s&arg=${encodeURIComponent(arg)}`;
      break;
    case 'nft-id':
      ret += `nft?mode=id&arg=${encodeURIComponent(arg)}`;
      break;
    case 'collection-serial':
      ret += `collection?mode=s&arg=${encodeURIComponent(arg)}`;
      break;
    case 'collection-id':
      ret += `collection?mode=id&arg=${encodeURIComponent(arg)}`;
      break;
    case 'stake-pool-base32':
      ret += `stake?mode=b&arg=${encodeURIComponent(arg)}`;
      break;
    case 'stake-pool-address':
      ret += `stake?mode=a&arg=${encodeURIComponent(arg)}`;
      break;
    case 'stake-pool-username':
      ret += `stake?mode=u&arg=${encodeURIComponent(arg)}`;
      break;
    case 'profile-base32':
      ret += `profile?mode=b&arg=${encodeURIComponent(arg)}`;
      break;
    case 'profile-address':
      ret += `profile?mode=a&arg=${encodeURIComponent(arg)}`;
      break;
    case 'profile-username':
      ret += `profile?mode=u&arg=${encodeURIComponent(arg)}`;
      break;
    default:
      break;
  }
  return ret;
}
