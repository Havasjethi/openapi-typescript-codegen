import { ScanOptions } from "./types";
import { resolve } from "path";
import { readDirectory } from "../utils/fileSystem";

export async function scan_method (o: ScanOptions){
    const controller_path = resolve(o.folders.base_folder, o.folders.controller_folder);
    const results = await readDirectory(controller_path, {encoding: "utf8", withFileTypes: true});

    results.forEach(entity => { /* Todo :: Use havas-parser here to to analyze controller files  */});

}
