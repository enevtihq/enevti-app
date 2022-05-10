import ImageCropPicker from 'react-native-image-crop-picker';
import { handleError, handleResponseCode, responseError } from 'enevti-app/utils/error/handle';
import { NFT } from 'enevti-app/types/core/chain/nft';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { appFetch, isInternetReachable } from 'enevti-app/utils/network';
import {
  urlGetIsNameExists,
  urlGetIsSymbolExists,
  urlGetNFTById,
  urlGetNFTBySerial,
} from 'enevti-app/utils/constant/URLCreator';
import { APIResponse, ResponseJSON } from 'enevti-app/types/core/service/api';

type NFTDetailsRoute = StackScreenProps<RootStackParamList, 'NFTDetails'>['route']['params'];

export const NFT_RESOLUTION = 500;

export function cleanTMPImage() {
  ImageCropPicker.clean().catch(e => {
    handleError(e);
  });
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

async function fetchNFTbyId(id: string, signal?: AbortController['signal']): Promise<APIResponse<NFT>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetNFTById(id), { signal });
    const ret = (await res.json()) as ResponseJSON<NFT>;
    handleResponseCode(res, ret);
    return {
      status: res.status,
      data: ret.data,
      meta: ret.meta,
    };
  } catch (err: any) {
    handleError(err);
    return responseError(err.code);
  }
}

async function fetchNFTbySerial(
  symbol: string,
  serial: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<NFT>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetNFTBySerial(`${symbol}#${serial}`), { signal });
    const ret = (await res.json()) as ResponseJSON<NFT>;
    handleResponseCode(res, ret);
    return {
      status: res.status,
      data: ret.data,
      meta: ret.meta,
    };
  } catch (err: any) {
    handleError(err);
    return responseError(err.code);
  }
}

export async function getNFTbyId(id: string, signal?: AbortController['signal']): Promise<APIResponse<NFT>> {
  return await fetchNFTbyId(id, signal);
}

export async function getNFTbyRouteParam(routeParam: NFTDetailsRoute, signal?: AbortController['signal']) {
  switch (routeParam.mode) {
    case 's':
      const symbol = routeParam.arg.split('#')[0];
      const serial = routeParam.arg.split('#')[1];
      return await fetchNFTbySerial(symbol, serial, signal);
    case 'id':
      return await fetchNFTbyId(routeParam.arg, signal);
    default:
      return await fetchNFTbyId(routeParam.arg, signal);
  }
}
