#!/usr/bin/env node

'use strict';

import { program } from 'commander';
import { FromSpec } from "./commands/from_spec";
import { generation } from "./commands/generation";
import { resolve } from "path";

interface AppInterface {
    generate: (options: any) => Promise<void>,
    scan: (options: any) => Promise<void>
}

export const getOpenApi = (): AppInterface => require(resolve(__dirname, '../dist/index.js'));

program
    .name('OpenApi')
    .usage('<command> [options]')
    .addCommand(generation)
    .addCommand(FromSpec)
    .parse(process.argv);

