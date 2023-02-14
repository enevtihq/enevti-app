import ImageCropPicker from 'react-native-image-crop-picker';
import { handleError, handleResponseCode } from 'enevti-app/utils/error/handle';
import { NFT } from 'enevti-types/chain/nft';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import {
  apiFetch,
  apiFetchVersioned,
  apiFetchVersionRoot,
  appFetch,
  isInternetReachable,
} from 'enevti-app/utils/app/network';
import {
  urlGetIsNameExists,
  urlGetIsSymbolExists,
  urlGetNFTById,
  urlGetNFTBySerial,
  urlGetSerialToNFTId,
  urlGetNFTActivityById,
  urlGetIsNFTOwnerOrCreator,
  urlGetNFTMomentById,
} from 'enevti-app/utils/constant/URLCreator';
import { APIResponse, APIResponseVersioned, APIResponseVersionRoot, ResponseJSON } from 'enevti-types/service/api';
import { NFTActivity } from 'enevti-types/chain/nft/NFTActivity';
import { NFT_ACTIVITY_INITIAL_LENGTH, NFT_MOMENT_INITIAL_LENGTH } from 'enevti-app/utils/constant/limit';
import { getMyAddress } from './persona';
import i18n from 'enevti-app/translations/i18n';
import { MomentBase } from 'enevti-types/chain/moment';

type NFTDetailsRoute = StackScreenProps<RootStackParamList, 'NFTDetails'>['route']['params'];
type NFTDetailsVersions = { activity: number; moment: number };

export const NFT_RESOLUTION = 500;

export function cleanTMPImage() {
  ImageCropPicker.clean().catch(e => {
    handleError(e);
  });
}

async function fetchIsNFTOwnerOrCreator(id: string, signal?: AbortController['signal']): Promise<APIResponse<boolean>> {
  const myAddress = await getMyAddress();
  return await apiFetch<boolean>(urlGetIsNFTOwnerOrCreator(id, myAddress), signal);
}

export async function isNameAvailable(name: string, signal?: AbortController['signal']): Promise<boolean> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetIsNameExists(name), { signal });
    const ret = (await res.json()) as ResponseJSON<boolean>;
    handleResponseCode(res, ret);
    return !ret.data;
  } catch (err) {
    handleError(err);
    return false;
  }
}

export async function isSymbolAvailable(symbol: string, signal?: AbortController['signal']): Promise<boolean> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetIsSymbolExists(symbol), { signal });
    const ret = (await res.json()) as ResponseJSON<boolean>;
    handleResponseCode(res, ret);
    return !ret.data;
  } catch (err) {
    handleError(err);
    return false;
  }
}

async function fetchNFTbyId(
  id: string,
  withInitialData: boolean,
  signal?: AbortController['signal'],
): Promise<APIResponseVersionRoot<NFT, NFTDetailsVersions>> {
  const myAddress = await getMyAddress();
  return await apiFetchVersionRoot<NFT, NFTDetailsVersions>(urlGetNFTById(id, myAddress, withInitialData), signal);
}

async function fetchNFTbySerial(
  symbol: string,
  serial: string,
  withInitialData: boolean,
  signal?: AbortController['signal'],
): Promise<APIResponseVersionRoot<NFT, NFTDetailsVersions>> {
  const myAddress = await getMyAddress();
  return await apiFetchVersionRoot<NFT, NFTDetailsVersions>(
    urlGetNFTBySerial(`${symbol}#${serial}`, myAddress, withInitialData),
    signal,
  );
}

async function fetchNFTIdFromSerial(serial: string, signal?: AbortController['signal']): Promise<APIResponse<string>> {
  return await apiFetch<string>(urlGetSerialToNFTId(serial), signal);
}

async function fetchNFTActivity(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<NFTActivity[]>> {
  return await apiFetchVersioned<NFTActivity[]>(urlGetNFTActivityById(id, offset, limit, version), signal);
}

async function fetchNFTMoment(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<MomentBase[]>> {
  const myAddress = await getMyAddress();
  return await apiFetchVersioned<MomentBase[]>(urlGetNFTMomentById(id, offset, limit, version, myAddress), signal);
}

export async function getIsNFTOwnerOrCreator(id: string, signal?: AbortController['signal']) {
  return await fetchIsNFTOwnerOrCreator(id, signal);
}

export async function getNFTActivity(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<NFTActivity[]>> {
  return await fetchNFTActivity(id, offset, limit, version, signal);
}

export async function getNFTMoment(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<MomentBase[]>> {
  return await fetchNFTMoment(id, offset, limit, version, signal);
}

export async function getNFTInitialActivity(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<NFTActivity[]>> {
  return await fetchNFTActivity(id, 0, NFT_ACTIVITY_INITIAL_LENGTH, 0, signal);
}

export async function getNFTInitialMoment(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<MomentBase[]>> {
  return await fetchNFTMoment(id, 0, NFT_MOMENT_INITIAL_LENGTH, 0, signal);
}

export async function getNFTIdFromSerial(
  serial: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  return await fetchNFTIdFromSerial(serial, signal);
}

export async function getNFTIdFromRouteParam(routeParam: NFTDetailsRoute, signal?: AbortController['signal']) {
  switch (routeParam.mode) {
    case 'id':
      return routeParam.arg;
    case 's':
      const nftId = await getNFTIdFromSerial(routeParam.arg, signal);
      if (nftId.status !== 200) {
        throw Error(i18n.t('error:clientError'));
      }
      return nftId.data;
  }
}

export async function getNFTbyId(
  id: string,
  withInitialData: boolean,
  signal?: AbortController['signal'],
): Promise<APIResponse<NFT>> {
  return await fetchNFTbyId(id, withInitialData, signal);
}

export async function getNFTbyRouteParam(
  routeParam: NFTDetailsRoute,
  withInitialData: boolean,
  signal?: AbortController['signal'],
) {
  switch (routeParam.mode) {
    case 's':
      const symbol = routeParam.arg.split('#')[0];
      const serial = routeParam.arg.split('#')[1];
      return await fetchNFTbySerial(symbol, serial, withInitialData, signal);
    case 'id':
      return await fetchNFTbyId(routeParam.arg, withInitialData, signal);
    default:
      return await fetchNFTbyId(routeParam.arg, withInitialData, signal);
  }
}

export async function getIsNFTOwnerOrCreatorByRouteParam(
  routeParam: NFTDetailsRoute,
  signal?: AbortController['signal'],
) {
  const id = await getNFTIdFromRouteParam(routeParam, signal);
  return await fetchIsNFTOwnerOrCreator(id, signal);
}
