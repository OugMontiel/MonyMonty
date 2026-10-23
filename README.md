# Bienvenido a MonyMonty 🌟

¿Alguna vez has sentido que tus finanzas personales son un misterio indescifrable? MonyMonty está aquí para cambiar eso. Somos una
plataforma innovadora que transforma la gestión financiera en una experiencia empoderadora y accesible para todos.

Inspirados por la falta de educación financiera en muchas familias, nuestro objetivo es equiparte con las herramientas y conocimientos
necesarios para alcanzar una salud financiera óptima. Con MonyMonty, no solo gestionas tu dinero, sino que también construyes un futuro más
seguro y próspero.

## ¿Por Qué MonyMonty?

En un mundo donde la educación financiera es una asignatura pendiente, MonyMonty se presenta como la solución integral que necesitas.
Nuestra plataforma te ofrece:

- **Educación Financiera**: Aprende a tomar decisiones informadas con técnicas y métodos que mejoran tus habilidades financieras.
- **Control Total**: Lleva un registro detallado de tus transacciones, establece metas y controla tus inversiones con nuestro sistema
  intuitivo.
- **Asesoramiento Personalizado**: Conéctate con mentores y expertos financieros que te guiarán en cada paso del camino.

## Únete a Nuestra Comunidad

Con MonyMonty, estamos construyendo una comunidad comprometida en capacitar a las personas para alcanzar una salud financiera óptima. ¡Nos
encantaría que te unas a nosotros y comiences a tomar el control de tu futuro financiero hoy mismo!

## Conéctate con Nosotros

Para obtener más información sobre el proyecto, visita nuestras redes sociales y mantente al tanto de las últimas novedades:

<p align="left">

</p>

## Conéctate con el creador

<p align="left"> 
    <a href="https://discord.com/users/Oug#6073" target="_blank" rel="noreferrer">
        <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/discord.svg" width="32" height="32" />
    </a>
    <a href="https://www.github.com/OugMontiel" target="_blank" rel="noreferrer">
        <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/github.svg" width="32" height="32" />
    </a>
    <a href="http://www.instagram.com/oug_montiel/" target="_blank" rel="noreferrer">
        <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/instagram.svg" width="32" height="32" />
    </a>
    <a href="https://www.linkedin.com/in/diego-alejandro-montiel-florez-data-science/" target="_blank" rel="noreferrer">
        <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/linkedin.svg" width="32" height="32" />
    </a>
</p>

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

## Desarrollo: tokens del sistema de diseño

Los colores, la tipografía, los espacios, las formas, el movimiento y las sombras salen del paquete
[`@ougmontiel/monymonty-tokens`](https://github.com/OugMontiel/MonyMontyUI) (repo MonyMontyUI), que se publica en GitHub Packages.
`src/main.js` carga sus variables CSS en `:root` y `src/assets/mm/mm.css` les da los nombres cortos que usa la interfaz
(`--brand`, `--surface`, `--space-4`…). Para cambiar un valor se edita el paquete, no `mm.css`.

Para instalar hace falta un token de GitHub (classic) con permiso `read:packages`:

```bash
export NODE_AUTH_TOKEN=ghp_xxx   # PowerShell: $env:NODE_AUTH_TOKEN = "ghp_xxx"
npm install
```

El `.npmrc` del proyecto ya apunta el scope `@ougmontiel` a GitHub Packages. Para construir la imagen de Docker el token se pasa como
secreto de build: `docker compose build` lo toma de la variable `NODE_AUTH_TOKEN`.
