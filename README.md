# Node-Babylone-Corentin-Aurore 

# Ceci est un Readme par rapport au deploiement Docker du projet avec Traefik

Le projet utilise Docker et Compose pour déployer l'application Node.js et TypeScript en production avec :

- Multi-stage build : Pour l'optimisation de l'image
- Traefik reverse proxy : Qui est la porte d'entrée (HTTP/HTTPS) pour tous les services
- Healthcheck : Permet la surveillance automatique de la santé du conteneur
- Limites de ressources : Gère le CPU et mémoire contrôlées
- Variables d'environnement : Pour la configuration flexible via `.env.production`

# Ce qu'on retrouve dans cette base de projet suivant le TP de la séance 8 

- Image Docker multi-étage optimisée (fait)
- Pas de port applicatif exposé directement en une seule porte d'entrée (fait)
- Variables d'environnement dynamiques dont : PORT et HOST (fait)
- Reverse proxy Traefik pour le routage par hostname (fait)
- Conteneur sécurisé avec : non-root, read-only socket, limites (fait)
- Healthcheck actif (fait)
- Production-ready (fait)

# Prérequis à avoir avant de se lancer 

- Docker Desktop 
- Node.js 26.13.0+ pour le développement local

# Etape de lancement du projet 

1. Cloner le repo github 
2. Tout lancer en une commande : docker compose -f compose.production.yaml up -d --build
3. Attendre 10-15 secondes que Traefik démarre et le healthcheck se valide
4. Accéder à l'url de l'app via ça : http://localhost/
5. Pour voir les différents logs c'est avec : docker compose -f compose.production.yaml logs -f

- NB: pas besoin de `npm install` ou `npm run build` en local parce que Docker gère tout déjà

# Explication du Dockerfile

Le Dockerfile utilise 3 étapes : 

1. `development`
- C'est la Base Node.js pour la dev locale

2. `build`
- Installe toutes les dépendances (dev + prod)
- Compile TypeScript et JavaScript

3. `production` 
- Copie uniquement ce qui est nécessaire du build
- Ajoute `curl` pour le healthcheck
- Installe uniquement les dépendances de production avec `--omit=dev`

# Docker Compose en production 

1. `traefik` service
- Rôle : Reverse proxy reçoit toutes les requêtes HTTP/HTTPS
- Ports : 80 (HTTP) et 443 (HTTPS)
- config : Lit les labels des conteneurs pour router automatiquement
- Ressources limitées : 0.5 CPU et 256 MB RAM
- Let's Encrypt : Configuré pour HTTPS automatique, il n'y a pas de certificats à gérer

2. `node` service
- Build : Multi-stage, target `production`
- Ports : Aucun port exposé directement (Traefik le find via le réseau interne)
- Healthcheck : Test `http://localhost:8000/` toutes les 10s
- Restart : `unless-stopped` redémarre en cas de crash, sauf si arrêt manuel
- Ressources limitées : 0.5 CPU et 512 MB RAM

# Commandes utiles à tester 

# Status des conteneurs
docker compose -f compose.production.yaml ps

# Ressources consommées en temps réel
docker stats

# Santé du healthcheck
docker inspect project | grep -A 10 "Health"

# Logs du node
docker logs project

# Logs de Traefik
docker logs traefik

# Logs en direct (suivi)
docker compose -f compose.production.yaml logs -f project

# Arrêter les services
docker compose -f compose.production.yaml down

# Redémarrer
docker compose -f compose.production.yaml up -d

# Tout reconstruire après changement de code
docker compose -f compose.production.yaml up -d --build

# Supprimer les images et volumes inutilisés
docker system prune -a --volumes

# Ressources Utiles à explorer par curiosité 

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Traefik Documentation](https://doc.traefik.io/)
- [Let's Encrypt](https://letsencrypt.org/)
