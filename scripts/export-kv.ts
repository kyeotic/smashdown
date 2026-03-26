/**
 * Export all Deno KV data to a JSON file compatible with `wrangler kv bulk put`.
 *
 * For remote Deno Deploy KV, set DENO_KV_ACCESS_TOKEN and pass the database URL:
 *   DENO_KV_ACCESS_TOKEN=<token> deno run -A --unstable-kv scripts/export-kv.ts https://api.deno.com/databases/<db-id>/connect
 *
 * For local KV, run without args:
 *   deno run -A --unstable-kv scripts/export-kv.ts
 *
 * Then import into Cloudflare KV:
 *   npx wrangler kv bulk put --binding SMASHDOWN_KV --remote kv-export.json
 */

const PREFIXES = ['USERS', 'EX_ID', 'PLAYERS', 'TOURNAMENTS'] as const

interface KvExportEntry {
  key: string
  value: string
}

const kvUrl = Deno.args[0] ?? Deno.env.get('KV_TARGET_URL')
if (kvUrl) {
  console.log(`Connecting to remote KV: ${kvUrl}`)
} else {
  console.log('Opening local KV (default path)')
}

const kv = await Deno.openKv(kvUrl)
const output: KvExportEntry[] = []

for (const prefix of PREFIXES) {
  const before = output.length
  const iter = kv.list({ prefix: [prefix] })
  for await (const entry of iter) {
    const key = (entry.key as string[]).join(':')
    const value = JSON.stringify(entry.value)
    output.push({ key, value })
    console.log(`  ${key}`)
  }
  console.log(`[${prefix}] exported ${output.length - before} entries`)
}

await Deno.writeTextFile('kv-export.json', JSON.stringify(output, null, 2))
console.log(`\nWrote ${output.length} total entries to kv-export.json`)

kv.close()
