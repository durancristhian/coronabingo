# Coronabingo

Bingo online para jugar con amigos y familia. Crea una sala, comparte el enlace y juega con tus cartones desde el celular o la computadora, sin registrarte.

**[Jugar en coronabingo.com.ar](https://coronabingo.com.ar)**

Disponible en español e inglés. Hecho con Next.js, React y Firebase.

## Desarrollo local

Usa las versiones de Node.js y npm indicadas en [`.nvmrc`](.nvmrc) y [`package.json`](package.json).

```bash
nvm install
nvm use
npm ci
```

Copia [`.env.template`](.env.template) a `.env` si todavía no existe y completa la configuración de tu proyecto de Firebase con Firestore. No publiques ese archivo.

```bash
npm run dev
```

Abre [localhost:3000](http://localhost:3000).

La [guía de desarrollo](docs/development.md) incluye configuración, pruebas y detalles técnicos. Para contribuir, consulta [AGENTS.md](AGENTS.md). La documentación interna está en inglés.

## Licencia

[MIT](LICENSE).
