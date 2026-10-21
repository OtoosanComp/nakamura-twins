NAKAMURA TWINS STUDIO — STARTER FUNCIONAL (TEXTO)
=================================================

Este paquete prepara una aplicación Cloudflare Pages con una función /api/chat.
No está publicada ni conectada hasta que configures tus cuentas y secretos.

ARCHIVOS
- index.html: interfaz móvil en español para Brave.
- functions/api/chat.js: backend que llama a OpenRouter. La API key no se envía al navegador.
- wrangler.json: configuración de Cloudflare Pages.

REQUISITOS
- Cuenta gratuita de Cloudflare.
- Cuenta de OpenRouter con acceso a modelos gratuitos.
- Para publicar mediante Git: una cuenta de GitHub y un repositorio. El repositorio debe contener estos archivos en su raíz.

PASOS DE PUBLICACIÓN RECOMENDADOS
1. Crea una cuenta en OpenRouter: https://openrouter.ai/
2. Crea una API key desde el panel de OpenRouter. No la pegues en ChatGPT ni en el HTML.
3. Crea una cuenta en Cloudflare: https://dash.cloudflare.com/
4. Sube este proyecto a un repositorio privado de GitHub (sube los archivos y la carpeta functions, no el ZIP como único archivo).
5. En Cloudflare, abre Workers & Pages → Create → Pages → Connect to Git.
6. Selecciona el repositorio. Configura:
   - Framework preset: None
   - Build command: dejar vacío
   - Build output directory: /
7. Cuando el proyecto se haya creado, abre Settings → Variables and Secrets (o la sección equivalente de configuración de Functions).
8. Añade estos secretos:
   - OPENROUTER_API_KEY = tu clave API de OpenRouter
   - APP_ACCESS_CODE = crea una contraseña larga y única para proteger el chat
   - APP_ORIGIN = URL HTTPS exacta de tu app, por ejemplo https://tu-proyecto.pages.dev (configúrala después de la primera publicación)
9. Guarda los cambios y vuelve a desplegar.
10. Abre la URL HTTPS en Brave. En la pestaña Conexión, escribe el APP_ACCESS_CODE (no la clave API). Vuelve a Conversación y prueba.

IMPORTANTE SOBRE SEGURIDAD
- Nunca pongas OPENROUTER_API_KEY dentro de index.html ni en variables públicas VITE_*.
- APP_ACCESS_CODE es una barrera sencilla para una prueba privada, no sustituye autenticación individual ni límites robustos por usuario.
- No compartas la URL ni el código mientras sea un prototipo.
- El código limita el historial a 12 mensajes y el texto a 4000 caracteres por mensaje.
- El modelo OpenRouter gratuito es un enrutador a modelos gratuitos disponibles; la disponibilidad, calidad y restricciones cambian.
- El plan gratuito puede tener límites de uso y disponibilidad. No se garantiza operación 24/7.
- No introduzcas información sensible o secretos en las conversaciones.
- Esta primera versión no incluye login de usuario, base de datos ni memoria sincronizada. El contexto existe solo durante la sesión abierta.
- La conexión con el proveedor envía el texto de conversación a ese proveedor. Revisa las condiciones y privacidad del proveedor antes de usar datos personales.

Si Cloudflare muestra una interfaz distinta, no adivines dónde pegar secretos; consulta la documentación actual de Pages Functions:
https://developers.cloudflare.com/pages/functions/
Secretos de Workers:
https://developers.cloudflare.com/workers/configuration/secrets/
