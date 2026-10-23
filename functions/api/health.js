import { json } from '../_lib.js';

export async function onRequestGet() {
  return json({
    ok: true,
    service: 'iep-builder',
    version: '0.1.0',
    time: new Date().toISOString()
  });
}
