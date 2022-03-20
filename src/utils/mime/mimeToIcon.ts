import {
  iconMap,
  UNDEFINED_ICON,
} from '../../components/atoms/icon/AppIconComponent';
import mimeMapping from './mimeMapping';

const iconMappings = {
  image: iconMap.fileImage,
  audio: iconMap.fileAudio,
  video: iconMap.fileVideo,
  document: iconMap.fileDocument,
  file: iconMap.file,
  code: iconMap.fileCode,
  archive: iconMap.fileArchive,
  undefined: UNDEFINED_ICON,
};

export default function mimeToIcon(mime: string) {
  return iconMappings[mimeMapping(mime)];
}
