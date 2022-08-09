import { SocialRaffleGenesisConfig } from 'enevti-app/types/core/chain/config/SocialRaffleGenesisConfig';
import { APIResponse } from 'enevti-app/types/core/service/api';
import { urlGetConfigSocialRaffle } from 'enevti-app/utils/constant/URLCreator';
import { apiFetch } from 'enevti-app/utils/network';

async function fetchConfigSocialRaffle(
  signal?: AbortController['signal'],
): Promise<APIResponse<SocialRaffleGenesisConfig['socialRaffle']>> {
  return await apiFetch<SocialRaffleGenesisConfig['socialRaffle']>(urlGetConfigSocialRaffle(), signal);
}

export async function getConfigSocialRaffle(
  signal?: AbortController['signal'],
): Promise<APIResponse<SocialRaffleGenesisConfig['socialRaffle']>> {
  return await fetchConfigSocialRaffle(signal);
}
