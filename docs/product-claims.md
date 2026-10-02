# Evidencia de prestaciones — revisión de copy

Revisado contra el código de la app del propietario, versión 1.7.0, el 2 de octubre de 2026. Sin cambios a productos StoreKit, precios de compra ni paywall.

- `ProProductID.grantsPro` y `ProAccess.isPro` otorgan el mismo acceso para los tres productos.
- `UserPreferences.canCreateTank`, `canLogTank`, `canMutateTask` y `canUseAdvancedTrendRange` permiten un tanque primario gratis, lecturas/tareas y reservan rangos avanzados para Pro.
- `ReefKeeperDataStore` configura todos los almacenes con `cloudKitDatabase: .none`. No se encontró implementación alternativa CKContainer/NSUbiquitous ni sincronización remota del historial. `AppStore.sync()` restaura compras; no sincroniza acuarios. No anunciar iCloud.
- El exportador incluye archivos locales; exportar no equivale a sincronizar ni garantiza restauración.
- Precios de referencia estadounidenses: mensual 4.99, anual 44.99, lifetime 99.99. 12 × 4.99 − 44.99 = 14.89; ahorro aproximado 24.87%. Precio final y moneda dependen de StoreKit/región.
- La app registra pruebas introducidas por el usuario; no mide el agua ni garantiza salud. Eliminadas promesas de salud, tiempo cronometrado y oferta mensual sin fecha verificable.

No se añade instrumentación. No se publican datos privados de negocio.
