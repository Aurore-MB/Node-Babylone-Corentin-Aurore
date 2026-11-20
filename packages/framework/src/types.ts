import type { IncomingMessage, ServerResponse } from 'node:http';

/**
 * Contexte reçu par un contrôleur et un middleware 
 */
export interface Context {
    // Infos de la requête HTTP
    readonly method: string; 
    readonly url: URL; 
    readonly path: string; 
    readonly headers: Record<string, string | string[] | undefined>;

    // Paramètres extraits par le routeur et le parser
    readonly params: Record<string, string>;
    readonly query: URLSearchParams;
    readonly body: unknown;

    readonly routeName?: string; // log du middleware 
    readonly apiVersion: string; // adapter le format de la réponse selon la version de l'API, si aucune version n'est précisée dans la route, le framework applique la version par défaut dans config
    user?: { 
        id: string; 
        role: string; 
    };

    readonly config: AppConfig;
    readonly db: DatabaseClient;
    readonly ip: string;

    // Réponse en cours de construction (utile pour les middlewares au retour)
    response?: Response;

    // Accès aux objets bruts Node.js si besoin (ex: streaming de fichiers ou SSE)
    readonly rawReq: IncomingMessage;    
    readonly rawRes: ServerResponse;
}

export interface AppConfig {
    readonly host: string;
    readonly port: number;
    readonly databaseUrl: string;
    readonly jwtSecret: string;
    readonly jwtExpiresIn: string | number;
    readonly passwordHashCost: number;
    readonly corsEnabled: boolean;
    readonly corsOrigins: readonly string[];
    readonly uploadDir: string;
    readonly maxUploadSize: number;
    readonly allowedMimeTypes: readonly string[];
    readonly securityHeaders: Readonly<Record<string, string>>;
    readonly rateLimitMax: number;
    readonly rateLimitWindowMs: number;
    readonly defaultApiVersion: string;
}

// TODO: définir les méthodes de la base de données (ex: table, transaction, etc.)
export interface DatabaseClient {
    // table<T extends Record<string, unknown>>(tableName: string): QueryBuilder<T>;
    // transaction<T>(callback: (trx: DatabaseClient) => Promise<T>): Promise<T>;
}

/**
 * réponse qu'un contrôleur renvoie : un statut et un corps.
 */
export interface Response {
    readonly status: number;
    readonly body: unknown;
    readonly headers: Record<string, string>;
    readonly format: string;
}

export type ResponseSerializer = (body: unknown) => string | Buffer | NodeJS.ReadableStream;

/**
 * fonctions partagées par les middlewares et les contrôleurs pour construire la réponse HTTP
 */
export type NextFunction = () => Promise<void>;

export type MiddlewareFn = (ctx: Context, next: NextFunction) => Promise<void> | void;

export type Controller = (context: Context) => Response | Promise<Response>;

/**
 * Format d'erreur unique 
 */
export interface ApiErrorDetail { 
    readonly field?: string; 
    readonly message: string; 
    readonly code?: string; 
} 
    
export interface ApiErrorResponse {
    readonly error: { 
        readonly status: number; 
        readonly message: string; 
        readonly code: string; // Ex: 'VALIDATION_ERROR', 'NOT_FOUND', 'UNAUTHORIZED' 
        readonly details?: ApiErrorDetail[]; 
    }; 
}
