import { MAP_ATTRIBUTION } from '$lib/constants'

export const createAttributionFromTags = (tags: [{ key: string; value: string }]) => {
  const providers = tags?.filter((t) => t.key === 'provider')

  const values: string[] = providers?.map((provider) => provider.value)
  if (values && values.length > 0) {
    return values.join(',')
  } else {
    return MAP_ATTRIBUTION
  }
}