# MEMORY.md — Diario de Estudio
Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no
aporte.

## Estado actual
- v1 funcionando: registrar sesiones (fecha, tema, minutos), racha actual y lista de
sesiones.
- Mejor racha mostrada bajo la racha actual (`calcularMejorRacha` en `app.js`).
- Datos en localStorage.
- `.gitignore` creado: ignora archivos de SO, editores, logs, `.env` y
`.claude/settings.local.json`. No hay `node_modules`/`dist` porque no hay npm ni build.

## Decisiones (y por qué)
- Sin backend ni dependencias: cualquiera debe poder abrirlo con doble clic.
- Fecha editable en el formulario: permite registrar días pasados y ver la racha crecer.
- La mejor racha se calcula cada vez y no se guarda: no puede desincronizarse de las
sesiones y no cambia el formato de los datos.

## Aprendizajes y errores a evitar
- CLAUDE.md describía una clave (`diario-estudio-sesiones`) y unos campos que el código no
usaba. Se corrigió: comprobar la documentación contra el código.

## Próximos pasos
- (vacío por ahora)
