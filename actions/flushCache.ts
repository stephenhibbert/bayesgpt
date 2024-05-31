// app/actions/flushCache.ts

'use server';

import { kv } from '@vercel/kv';

export async function flushCache() {
  console.log("Flushing cache...");

  // Prefix to identify cached keys
  const prefix = 'probability:';
  
  // Scan for keys with the given prefix
  const keys = await kv.keys(`${prefix}*`);
  
  // Delete each key
  for (const key of keys) {
    await kv.del(key);
  }
  
  console.log("Cache flushed.");
}