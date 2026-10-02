# Routing propuesto; no desplegado

El build genera HTML completo, metadatos por ruta y 404.html. El Worker conserva los endpoints API, redirige HTTP a HTTPS y barras finales (308, conserva query), sirve rutas publicadas y responde 404 para desconocidas. La configuración versionada propone ejecutar Worker antes de assets, sin fallback SPA ni redirecciones HTML implícitas. GET y HEAD tienen pruebas. No se han aplicado reglas ni desplegado a Cloudflare.

Revisar en staging antes de fusionar: navegación, refresh, Atrás/Adelante, GET/HEAD, URLs desconocidas, query, sitemap/robots y ambas APIs. El tráfico pasa ahora por el Worker: revisar impacto operativo. Mantener HTTPS en el edge; no activar reglas de producción desde este PR. El contenido inicial reduce dependencia de JS; no garantiza indexación. No se prometen FAQ rich results.
