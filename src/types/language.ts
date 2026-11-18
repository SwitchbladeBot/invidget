import { LanguageCode } from 'iso-639-1'
import strings from '../const/strings.json';

export type Locale = {
  header: string
  header_hub: string
  online: string
  members: string
  button: string
}

export function getLocaleStrings(lang: LanguageCode) {
  return (strings as Record<LanguageCode, Locale>)[lang] || strings.en;
}