#!/usr/bin/env node

// import './bin/abproxy'

import { fork } from 'child_process'
import { resolve } from 'path'

export default function abproxy(variation = 'v1') {
  fork(resolve(__dirname, './bin/abproxy'), [`--variation=${variation}`])
}
