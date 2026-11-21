import type { AppConfig } from './types.ts';
import type { Server } from 'node:http'

export interface Kernel {
    start: () => Promise<void>; // fonction pour démarrer le serveur (renvoie une promesse)
    stop: () => Promise<void>; // fonction pour arreter le serveur (renvoie une promesse)
};

export const createKernel = (config: AppConfig): Kernel => {
    let server: Server | undefined; // variable qui va stocker le serveur (accessible par le startServ mais aussi le stopServ)

    const startServ = async () => {
        // TODO
    };
    const stopServ = async () => {
        // TODO
    };

    return {
        start: startServ,
        stop: stopServ,
    }
};