
export class ImportBuilder {

    /** Will be problematic later on! string-> string[] required; + adding default export */
    protected imports: {
        name: string,
        alias?: string
        file_path: string,
    }[] = [];

    protected included_names = new Map();

    static create (): ImportBuilder {
        return new ImportBuilder();
    }

    public get_imports (): ImportBuilder['imports'] {
        return this.imports;
    }

    /**
     * Returns the imported name
     * @param name
     * @param file_path
     * @param suffix
     */
    add_import (name: string, file_path: string, suffix: string): string {
        const base: ImportBuilder['imports'][0] = {
            name,
            file_path,
        };

        if (!this.included_names.has(name)) {
            this.included_names.set(base.name, undefined);
        } else if (this.included_names.has(name) && !this.included_names.has(name+suffix)) {
            base.alias = name+suffix;
            this.included_names.set(base.alias, undefined);
        } else {
            // console.log(name+suffix, this);
            throw new Error('Unable to create alias ( Already used )');
        }


        this.imports.push(base);
        return base.alias ?? base.name;
    }
}
