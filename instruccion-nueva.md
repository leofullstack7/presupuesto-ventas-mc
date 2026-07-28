# Instrucción para Cursor: Exportar / Importar respaldo de datos (JSON)

Quiero agregar funcionalidad de **respaldo local** al proyecto de presupuesto de ventas: un botón para
exportar todo el estado de datos capturados a un archivo `.json` descargable, y un botón para volver a
importarlo. Esto es independiente del mecanismo de persistencia actual (localStorage, API, IndexedDB,
lo que sea que estés usando) — es una copia de seguridad manual que el usuario controla.

## 1. Primero, investiga la estructura actual antes de escribir nada

- Busca dónde vive el estado global/compartido de la app (Context, store de Zustand/Redux, hooks
  custom tipo `useBudgetState`, etc.).
- Identifica **todas** las piezas de estado que representan datos capturados por el usuario (no los
  datos base/semilla del presupuesto). En la versión anterior (un solo archivo `.jsx`) estas eran:
  - `overrides` — cantidades presupuestadas editadas por línea/mes
  - `priceOverrides` — precios editados por línea/mes
  - `real` — cantidad real vendida por línea/mes
  - `realIngresosOverride` — ingresos reales editados directamente por línea/mes
  - `sales` — registro venta a venta (línea/mes → lista de ventas individuales)
  - `unitReal` — ventas reales genéricas por unidad estratégica
  - `unitSales` — registro venta a venta por unidad estratégica
  - `kpis` — indicadores del embudo comercial (prospectos, citas, visitas, propuestas, ventas) por unidad
  - `vendedores` — lista de vendedores con sus metas y avance por indicador
- Si migraste esto a otro modelo de datos (ej. tablas normalizadas, otro nombre de campos), usa los
  nombres reales de tu proyecto — el objetivo es que el JSON exportado contenga el equivalente completo
  de estos datos, no que copies los nombres literalmente si ya cambiaron.

## 2. Función "Exportar datos"

Crea una función (ubícala donde tenga sentido en tu arquitectura: un hook `useBackup`, un servicio
`backupService.ts`, o junto al store) que:

1. Reúna en un solo objeto **todas** las piezas de estado capturado listadas arriba (con los nombres
   que correspondan en tu proyecto actual).
2. Le agregue un campo `exportedAt` con la fecha/hora ISO actual y, si es útil, un campo `version` para
   poder validar compatibilidad al importar en el futuro.
3. Convierta ese objeto a JSON (`JSON.stringify(payload, null, 2)`).
4. Dispare la descarga en el navegador usando `Blob` + `URL.createObjectURL` + un `<a>` temporal con
   `download`, con nombre de archivo tipo:
   `presupuesto-manizales-comparte-backup-YYYY-MM-DD.json`
5. Revoque el object URL después de disparar la descarga (`URL.revokeObjectURL`).
6. Muestre una confirmación visual breve (toast/notificación) tipo "Respaldo descargado".

## 3. Función "Importar datos"

1. Un `<input type="file" accept="application/json">` oculto, disparado por un botón visible
   ("⬆️ Importar datos"), usando un `ref` para simular el click.
2. Al seleccionar archivo: leerlo con `FileReader.readAsText`, hacer `JSON.parse` dentro de un
   `try/catch`.
3. Si el parseo falla o el objeto no tiene la forma esperada, mostrar un mensaje de error claro
   ("El archivo no es un respaldo válido") y no tocar el estado actual.
4. Si es válido, restaurar cada pieza de estado con los valores del archivo (usando `|| valorPorDefecto`
   para cualquier campo que falte, por compatibilidad con respaldos antiguos), y **persistirlo** con el
   mecanismo real del proyecto (llamar a la función/API/mutación que ya exista para guardar cambios,
   no solo actualizar el estado en memoria).
5. Limpiar el `value` del input file después de procesar, para poder re-importar el mismo archivo si
   hace falta.
6. Mostrar confirmación ("Respaldo importado correctamente").

## 4. UI

- Colocar ambos botones lado a lado, en la misma zona donde está el botón "Restaurar cifras originales"
  (pie del sidebar / panel de configuración), con estilo consistente al resto de botones secundarios de
  la app (mismo componente Button si existe uno reutilizable).
- Iconos sugeridos: ⬇️ Exportar datos / ⬆️ Importar datos.
- Deben verse bien tanto en desktop como en el layout responsive/mobile si el proyecto lo maneja.

## 5. Consideraciones

- No asumas que el storage es `window.storage` (eso era específico del entorno anterior de Claude.ai
  Artifacts). Usa el mecanismo de persistencia real de este proyecto (API/backend si ya existe,
  localStorage si aún no, etc.).
- Si el proyecto ya tiene un backend con base de datos, considera si "Importar" debe sobrescribir todo
  o hacer merge — por ahora, sobrescritura completa está bien, pero coméntalo en el código con un TODO
  si crees que en producción debería ser distinto (por ejemplo, pedir confirmación antes de sobrescribir).
- Si hay TypeScript, define un tipo/interfaz `BackupPayload` con la forma del JSON exportado, para que
  el import esté tipado y no se rompa silenciosamente si cambia la forma de los datos en el futuro.
