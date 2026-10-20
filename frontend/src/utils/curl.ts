import type { ApiEndpoint } from '../domain/types';

/** Builds an illustrative curl example. `$MAVRY_API` is a placeholder, not a real host. */
export function buildCurl(e: ApiEndpoint): string {
  let out = `curl -X ${e.method} "$MAVRY_API${e.path}" \\\n  -H "Authorization: Bearer $MAVRY_TOKEN"`;
  if (e.requestBody) {
    const fields = e.requestBody.map((f) => `"${f.name}": …`).join(', ');
    out += ` \\\n  -H "Content-Type: application/json" \\\n  -d '{ ${fields} }'`;
  }
  return out;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
