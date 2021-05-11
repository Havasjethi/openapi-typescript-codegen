import type { Model } from './Model';
import type { Service } from './Service';


export interface Client {
    version: string;
    server: string;
    models: Model[];
    services: Service[];
    controllers?: Controller[];
}

export interface Controller extends Service {
    path: string;
}
