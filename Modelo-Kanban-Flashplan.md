# 📌 FlashPlan — Kanban Completo (Issues)

Este documento contiene todos los issues organizados según tu tablero Kanban:

BACKLOG → INICIO → EN PROGRESO → EN PERIODO DE PRUEBA → EN REVISIÓN → ÚLTIMOS DETALLES → TERMINADO

---

# 🟥 BACKLOG

## Issue: Implementar modo oscuro
**Descripción:** Añadir un sistema de tema oscuro con toggle global.  
**Criterios:** Persistencia en localStorage, estilos consistentes.

## Issue: Añadir sistema de amigos / grupos
**Descripción:** Permitir que los usuarios creen grupos y compartan planes.  
**Criterios:** CRUD básico de grupos.

## Issue: Añadir chat dentro de un plan
**Descripción:** Chat en tiempo real para usuarios que participan en un plan.  
**Criterios:** Mensajes en vivo, historial básico.

## Issue: Recomendaciones de planes según ubicación
**Descripción:** Mostrar sugerencias basadas en la ubicación del usuario.  
**Criterios:** API de recomendaciones, filtrado por distancia.

## Issue: Gamificación
**Descripción:** Añadir logros, puntos y rachas.  
**Criterios:** Sistema de niveles y recompensas.

## Issue: Estadísticas del usuario
**Descripción:** Mostrar número de planes creados, completados, etc.  
**Criterios:** Dashboard básico.

---

# 🟦 INICIO

## Issue: Validación completa de formularios
**Descripción:** Añadir validación a login, registro y crear plan.  
**Criterios:** Errores visibles, campos obligatorios.

## Issue: Subida de imagen en crear plan
**Descripción:** Permitir subir foto del plan.  
**Criterios:** Previsualización, validación de tamaño.

## Issue: Selector de ubicación en crear plan
**Descripción:** Añadir mapa o input para seleccionar ubicación.  
**Criterios:** Coordenadas guardadas correctamente.

## Issue: Añadir categorías en crear plan
**Descripción:** Lista de categorías predefinidas.  
**Criterios:** Selección múltiple o simple.

## Issue: Unificar estilos entre login, registro y welcome-page
**Descripción:** Hacer que todas las pantallas tengan el mismo estilo.  
**Criterios:** Tipografías, colores, espaciados.

## Issue: Manejo global de errores
**Descripción:** Crear sistema centralizado para errores de frontend.  
**Criterios:** Toasts o banners de error.

---

# 🟧 EN PROGRESO

## Issue: Corregir rutas del logo en layout
**Descripción:** Asegurar que el logo se carga en todas las páginas.  
**Criterios:** Sin imágenes rotas.

## Issue: Corregir rutas del logo en login
**Descripción:** Actualizar el logo del login con el archivo correcto.  
**Criterios:** Imagen visible en producción.

## Issue: Integrar Google Maps en plan-details-page
**Descripción:** Mostrar mapa con marcador en la ubicación del plan.  
**Criterios:** Mapa interactivo funcionando.

## Issue: Añadir coordenadas GPS al crear plan
**Descripción:** Guardar latitud y longitud al crear un plan.  
**Criterios:** Coordenadas almacenadas en backend.

## Issue: Ajustar welcome-page y complete-profile-page
**Descripción:** Revisar estilos y rutas de imágenes.  
**Criterios:** Pantallas limpias y sin errores.

## Issue: Subir cambios a GitHub y sincronizar con AWS
**Descripción:** Mantener repositorio y servidor actualizados.  
**Criterios:** Build exitoso.

---

# 🟪 EN PERIODO DE PRUEBA

## Issue: Probar login en móvil
**Descripción:** Verificar que funciona en pantallas pequeñas.  
**Criterios:** Sin desbordamientos.

## Issue: Probar registro en móvil
**Descripción:** Validar campos y diseño responsive.  
**Criterios:** Flujo completo sin errores.

## Issue: Probar creación de plan con imagen
**Descripción:** Verificar subida y previsualización.  
**Criterios:** Imagen guardada correctamente.

## Issue: Probar detalles del plan con coordenadas reales
**Descripción:** Verificar que el mapa muestra la ubicación correcta.  
**Criterios:** Marcador en posición exacta.

## Issue: Probar que Google Maps carga correctamente
**Descripción:** Testear API key, carga y zoom.  
**Criterios:** Sin errores en consola.

## Issue: Probar app en móvil
**Descripción:** Revisar navegación completa.  
**Criterios:** Fluidez y estabilidad.

---

# 🟫 EN REVISIÓN

## Issue: Revisar cambios generados por IA en plan-details-page
**Descripción:** Verificar que el código es correcto y limpio.  
**Criterios:** Sin warnings ni errores.

## Issue: Revisar diseño responsive del login
**Descripción:** Ajustar tamaños, márgenes y tipografías.  
**Criterios:** Diseño consistente.

## Issue: Revisar diseño responsive de create-plan-page
**Descripción:** Asegurar que todos los inputs se ven bien.  
**Criterios:** Sin cortes ni solapamientos.

## Issue: Revisar rutas de imágenes
**Descripción:** Confirmar que todas las imágenes cargan.  
**Criterios:** Ninguna imagen rota.

## Issue: Revisar imports duplicados o muertos
**Descripción:** Limpiar código innecesario.  
**Criterios:** Código más ligero.

---

# 🟨 ÚLTIMOS DETALLES

## Issue: Ajustar tamaños del logo
**Descripción:** Hacer que el logo se vea bien en todas las pantallas.  
**Criterios:** Tamaño consistente.

## Issue: Ajustar márgenes y paddings
**Descripción:** Revisar espaciados en login, registro y welcome.  
**Criterios:** Diseño limpio.

## Issue: Revisar textos y traducciones
**Descripción:** Corregir textos y mensajes.  
**Criterios:** Ortografía correcta.

## Issue: Optimizar imágenes
**Descripción:** Comprimir imágenes para producción.  
**Criterios:** Menor peso, misma calidad.

## Issue: Revisar accesibilidad
**Descripción:** Añadir alt, labels y roles.  
**Criterios:** Accesibilidad básica cumplida.

---

# 🟩 TERMINADO

- Restaurar componentes eliminados  
- Regenerar login-page y create-plan-page  
- Subir logos nuevos a GitHub  
- Corregir rutas de imágenes en login  
- Actualizar plan-details-page con mejoras de IA  
- Sincronizar cambios con AWS  
- Build funcionando en AWS  
- PM2 reiniciado correctamente  
- Corregir estructura del repositorio  
- Integración básica de Google Maps funcionando  

