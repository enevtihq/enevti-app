import * as fastq from 'fastq';
import type { queueAsPromised } from 'fastq';
import {
  directPayLikeBase,
  DirectPayLikeBaseProps,
} from 'enevti-app/store/middleware/thunk/payment/utils/directPayLikeBase';
import { handleError } from 'enevti-app/utils/error/handle';

const queue: queueAsPromised<DirectPayLikeBaseProps> = fastq.promise(directPayLikeBase, 1);

export async function addDirectPayLikeJob(arg: DirectPayLikeBaseProps) {
  await queue.push(arg).catch(err => handleError(err));
}
