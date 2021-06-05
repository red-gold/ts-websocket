import isBase64 from 'validator/lib/isBase64'

export function checkBase64Decode (data) {
  if (isBase64(data)) {
    // create a buffer
    const buff = Buffer.from(data, 'base64')

    // decode buffer as UTF-8
    return buff.toString('utf-8')
  }
  return data
}
