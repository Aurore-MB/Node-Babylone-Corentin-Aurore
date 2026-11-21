import type { AppConfig } from './types.ts';
import http from 'node:http'

export interface Kernel {
    start: () => Promise<void>; // fonction pour démarrer le serveur (renvoie une promesse)
    stop: () => Promise<void>; // fonction pour arreter le serveur (renvoie une promesse)
};

export const createKernel = (config: AppConfig): Kernel => { // créer l'objet Kernel
    let server: http.Server | undefined; // variable qui va stocker le serveur (accessible par le startServ mais aussi le stopServ)

    const startServ = async () => { // une nouvelle variable locale constant pour etre sur qu'il n'est jamais undefined
        const serverCreated = http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Hello from Babylone, Corentin and Aurora!');
        });

        server = serverCreated // on envoie quand meme le szerveur contenu dans la variable locale vers la varibale visible ausis par le stopServ

        await new Promise<void>((resolve) => {
            serverCreated.listen(config.port, config.host, () => {
                resolve();
                console.log(`listening on http://${config.host}:${config.port}`);
            });

        });
    };
    const stopServ = async () => {
        // TODO
    };

    return {
        start: startServ,
        stop: stopServ,
    }
};