# Selfie

## Contributori

- Artur Peshko, artur.peshko@studio.unibo.it

## Implementazione

- Client:

Il framework usato è React per semplicità d'uso, enorme librerie di componenti disponibili, oltre ad avere una
sintassi molto simile all'HTML utile per il design grafico usando [daisyUI](https://daisyui.com)

Per il calendario, ho usato [React Big Calendar](https://github.com/jquense/react-big-calendar) che ha un'interfaccia
simile ad altri software come Google Calendar e Outlook

L'applicazione è interamente scritta in Typescript per facilitare il refactoring del codice, ove necessario, e per
assicurarmi che tutti i dati siano del tipo giusto per evitare futili errori abbastanza comuni in Javascript

L'interfaccia di comunicazione con il server avviene attraverso la "libreria" `net` all'interno del codice in modo da
avere tutte le funzionalità presenti nel server con una singola implementazione disponibile, poi, ovunque nel codice

- Server:

Il codice del server è diviso in moduli: `models`, `routes` e `services`

`services` contiene la logica per la connessione al database

`models` contiene tutti gli schema per le collection di mongodb

Infine, `routes` contiene tutti gli handler per le richieste del client, con l'aggiunta di `routes.ts` che implementa un
serve statico dei file del frontend

Tutti gli handler presenti sotto `user` richiedono un token nei parametri, quello è necessario per collegare un id di un
utente con l'utente stesso e hanno una scadenza di 30 giorni, ovvero dopo 30 giorni non sono più validi

## Deploy

Per effettuare il deploy, prima è necessario eseguire questo comando sia dentro `client` che `server`:

```shell
npm i
```

Dopodiché, bisogna andare nella cartella `client` e fare:

```shell
npm run build
```

Infine, andare nella cartella `server` ed eseguire:

```shell
npm run build
```

Il sito sarà presente nella cartella `server/build` e, per avviarlo, basta eseguire:

```shell
node server.js
```