import { Moment } from 'enevti-app/types/core/chain/moment';
import { APIResponse } from 'enevti-app/types/core/service/api';
import { apiFetch } from 'enevti-app/utils/app/network';
import { urlGetMomentById } from 'enevti-app/utils/constant/URLCreator';
import { getMyAddress } from './persona';

async function fetchMomentById(id: string, signal?: AbortController['signal']): Promise<APIResponse<Moment>> {
  const myAddress = await getMyAddress();
  return await apiFetch<Moment>(urlGetMomentById(id, myAddress), signal);
}

export async function getMomentById(id: string, signal?: AbortController['signal']): Promise<APIResponse<Moment>> {
  return await fetchMomentById(id, signal);
}