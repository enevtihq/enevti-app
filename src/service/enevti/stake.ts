import { StakePoolData } from '../../types/service/enevti/stake';
import { sleep } from './dummy';

export async function getStakePoolCompleteData(
  address: string,
): Promise<StakePoolData | undefined> {
  console.log(address);

  await sleep(5000);

  return {
    staker: [
      {
        persona: {
          photo: '',
          address: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
          username: 'aldhosutra',
        },
        rank: 1,
        stake: '250300000000',
        portion: 0.2134,
      },
      {
        persona: {
          photo: 'Qmb3jKA6Vn1azR6aSMnT6geGMkg818uBkfSHNg8ui1a9dy',
          address: 'lsk9w9qc6vs4d3qyqh322n69pebc2fdvsy4xsg5c9',
          username: 'bayuwahyuadi',
        },
        rank: 2,
        stake: '20300000000',
        portion: 0.234,
      },
      {
        persona: {
          photo: '',
          address: 'lsk3kocke8xfya6p83cenoxqzx268kyztmfcag92z',
          username: '',
        },
        rank: 3,
        stake: '5300000000',
        portion: 0.14,
      },
    ],
  };
}
