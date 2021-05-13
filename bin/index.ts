#!/usr/bin/env node

'use strict';

import {program} from 'commander';
import { FromSpec } from "./commands/from_spec";
import { generation } from "./commands/generation";

program
    .name('OpenApi')
    .usage('<command> [options]')
    .addCommand(generation)
    .addCommand(FromSpec)
    .parse(process.argv);

