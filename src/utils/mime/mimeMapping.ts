const typeMapping = {
  image: /^image\//,
  audio: /^audio\//,
  video: /^video\//,
  document: [
    'application/pdf',
    /ms-?word/,
    'application/vnd.oasis.opendocument.text',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml',
    /ms-?excel/,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.spreadsheetml',
    'application/vnd.oasis.opendocument.spreadsheet',
    /ms-?powerpoint/,
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.presentationml',
    'application/vnd.oasis.opendocument.presentation',
  ],
  file: 'text/plain',
  code: ['text/html', 'text/javascript', 'application/json'],
  archive: [
    /^application\/x-(g?tar|xz|compress|bzip2|g?zip)$/,
    /^application\/x-(7z|rar|zip)-compressed$/,
    /^application\/(zip|gzip|tar)$/,
  ],
};

function match(
  mime: string,
  cond: string | (RegExp | string)[] | RegExp | undefined,
): boolean {
  if (Array.isArray(cond)) {
    for (let i = 0; i < cond.length; i++) {
      if (match(mime, cond[i])) {
        return true;
      }
    }
    return false;
  } else if (cond instanceof RegExp) {
    return cond.test(mime);
  } else if (cond === undefined) {
    return true;
  } else {
    return mime === cond;
  }
}

export default function mimeMapping(
  mime: string,
): keyof typeof typeMapping | 'undefined' {
  for (const [type, condition] of Object.entries(typeMapping)) {
    if (match(mime, condition)) {
      return type as keyof typeof typeMapping;
    }
  }
  return 'undefined';
}
