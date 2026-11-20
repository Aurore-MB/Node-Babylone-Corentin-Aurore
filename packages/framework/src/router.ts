import type { Controller } from './types.ts';

const routes = new Map<string, Controller>(); // map qui va contenir les routes définies dans l'app

const buildKey = (method: string, path: string): string => `${method} ${path}`; // associe la méthode et le chemin pour former une Key pour les routes


// ajoute une route dans la map 'routes' avec la clé formée par sa méthode et son chemin
const addRoute = (method: string, path: string, controller: Controller): void => {
    
    const key = buildKey(method, path); // crée la key dans la map sous le format : "GET route/path"

    // erreur si une route essaye d'etre ajoutée deux fois
    if (routes.has(key)) {
        throw new Error(`Route already declared: ${key}`);
    }

  routes.set(key, controller);
};


// la fonction renvoit le Controller associé à la key dans la Map 'routes'. Ou il renvoit undefined si aucune route  n'est associée à cette clée.
const getController = (method: string, path: string): Controller | undefined => { 
    const key = buildKey(method, path);

    return routes.get(key); // cherche le Controller associé à la key dans la Map
};


// fonction pour vider la map de routes. C'est pour les tests car chaque test doit etre indépendant.
const clearRoutes = (): void => { 
    routes.clear();
}

// les 4 méthodes que l'app peut appeler :
// .clear --> Vide la Map de Routes 
// .search --> récupère un Controller à partir d'une méthode et d'une route
// .get --> ajoute une Route de method GET
// .post --> ajoute une Route de method POST
export const Router = {
    clear: clearRoutes,
    search: getController,
    get: (path: string, controller: Controller): void => addRoute('GET', path, controller),
    post: (path: string, controller: Controller): void => addRoute('POST', path, controller)
};