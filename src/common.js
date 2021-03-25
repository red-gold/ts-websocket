import { appConfig } from './appConfig'

/**
 * Get URI
 * @param {string} url
 * @returns URI
 */
export const getPrettyURLf = (url) => {
  return `${appConfig.gateway}${appConfig.baseRoute}${url}`
}
