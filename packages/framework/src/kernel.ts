import type { AppConfig, ApiErrorResponse } from './types.ts';
import http from 'node:http'
import { Router } from './router.ts';

// La fonction le renvoie rien car elle agit direct sur la response
const sendJSON = (res: http.ServerResponse, status: number, body: unknown, headers: Record<string, string> = {}): void => {
    if (res.headersSent) { // SI la réponse est déjà partie, on sort
        return;
    }
    
    const bodyInJSON = JSON.stringify(body); // convertir l'objet (le body) en string format JSON.

    const bodyLenght = Buffer.byteLength(bodyInJSON); // pas .lenght directement car certains caractères font + de 1 octet et ça lenght ne le voit pas. la réponse serait alors coupée. 

    res.writeHead(status, {"content-length": bodyLenght, "content-type": "application/json", ...headers }) // envoyer les en-tetes. ...headers copie chaque entrée de headers.
    
    res.end(bodyInJSON) // envoyer le body
}

export interface Kernel {
    start: () => Promise<void>; // fonction pour démarrer le serveur (renvoie une promesse)
    stop: () => Promise<void>; // fonction pour arreter le serveur (renvoie une promesse)
};

export const createKernel = (config: AppConfig): Kernel => { // créer l'objet Kernel
    let server: http.Server | undefined; // variable qui va stocker le serveur (accessible par le startServ mais aussi le stopServ)

    const startServ = async () => {
        server = http.createServer((req, res) => {

            const method = req.method ?? "GET"; // si req.method n'existe pas alors on lui donne "GET" par défaut
            const url = req.url ?? "/"; // si req.url est n'existe pas alors on lui donne "/" par défaut
            const parsedURL = new URL(url, "http://localhost");

            const endpoint = Router.search(method, parsedURL.pathname);
            
            // SI LA ROUTE RECHERCHEE N'EXISTE PAS
            // ON RENVOIE UNE ERREUR 404 ROUTE NOT FOUND
            if (endpoint === undefined) {
                const errorResponse: ApiErrorResponse = {"error": {
                    status: 404,
                    message: "Route not found",
                    code: "NOT_FOUND"
                }};
                sendJSON(res, errorResponse.error.status, errorResponse) // on envoie le status puis l'error en entière. 
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Hello from Babylone, Corentin and Aurora!');
        });

        await new Promise<void>((resolve, reject) => {
            server?.once('error', (error) => {
                reject(error)
            });
            server?.listen(config.port, config.host, () => {
                resolve();
                console.log(`listening on http://${config.host}:${config.port}`);
            });

        });
    };
    const stopServ = async () => {

        await new Promise<void>((resolve) => {
            server?.close(() => {
                resolve();
                console.log("Server gracefully shutdown");
            });
        })


    };

    return {
        start: startServ,
        stop: stopServ,
    }
};