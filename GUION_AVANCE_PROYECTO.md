# Guion para explicar el avance del proyecto y sus funcionalidades

## 1) Apertura (30-45 segundos)

Hola a todos.  
Hoy les voy a presentar el estado actual del proyecto **proyecto-inyectores**, enfocado en dos puntos:

1. **Qué ya está implementado y funcionando**
2. **Qué funcionalidades cubre hoy el sistema de punta a punta**

La solución está construida con **frontend en React + Vite + Tailwind** y **backend en Laravel API con Sanctum**, conectados a una base de datos relacional.

---

## 2) Resumen ejecutivo del avance (45-60 segundos)

Hasta este momento, el proyecto ya tiene operativos los módulos principales del negocio:

- **Autenticación de usuarios** con token
- **Dashboard** con métricas clave
- **Gestión de clientes** (CRUD + búsqueda)
- **Gestión de inventario** (CRUD + control de stock)
- **Gestión de servicios** (CRUD + asociación de productos por servicio)
- **Facturación** con productos y servicios, incluyendo pagos parciales y generación de deuda
- **Historial de facturas**
- **Módulo de deudas**
- **Cierre de caja** con montos en COP, USD y VES
- **Configuraciones** (incluye tasas de cambio)

En otras palabras: ya tenemos un flujo funcional para registrar operaciones reales del taller.

---

## 3) Funcionalidades implementadas por módulo (4-6 minutos)

### 3.1 Autenticación y seguridad

- Login y registro por API.
- Protección de rutas en frontend (si no hay token, redirige a login).
- Endpoints privados protegidos con **Sanctum**.
- Carga de configuraciones al iniciar sesión (por ejemplo tasas de cambio) para usarlas en la facturación.

### 3.2 Dashboard operativo

El panel principal muestra indicadores de operación:

- Clientes nuevos del mes
- Facturas emitidas en el mes
- Total de deuda acumulada
- Conteo y lista de productos en bajo stock
- Últimos clientes registrados
- Facturas recientes
- Top de deudas pendientes

Esto da una visión rápida de ventas, cartera e inventario.

### 3.3 Clientes

- Crear, editar, listar y eliminar clientes.
- Búsqueda por **nombre, cédula o teléfono** con límite configurable.
- Endpoint de compatibilidad para búsqueda rápida usada por la pantalla de facturación.

### 3.4 Inventario (productos)

- CRUD completo de productos.
- Manejo de:
  - nombre y descripción
  - precio
  - stock actual
  - stock mínimo
- Visualización de alerta cuando el inventario está en nivel bajo.

### 3.5 Servicios

- CRUD de servicios (nombre, descripción, precio base).
- Posibilidad de asociar productos a cada servicio con cantidades.
- Al editar un servicio, se pueden sincronizar esos productos asociados.

### 3.6 Facturación (núcleo del sistema)

El flujo actual permite:

1. Buscar y seleccionar cliente
2. Buscar y agregar productos/servicios
3. Definir cantidades
4. Calcular total
5. Registrar pago en distintas monedas (COP, USD, VES) con tasa de referencia
6. Generar la factura en backend en una transacción

Durante la creación de factura, el backend:

- Determina el tipo de factura: **sale**, **service** o **mixed**
- Registra productos y servicios en tablas pivote
- Descuenta inventario de productos consumidos
- Registra el pago
- Si el pago no cubre el total, crea una **deuda** y marca la factura en estado de deuda
- Si se cubre el total, marca la factura como pagada

Este punto ya resuelve la lógica más crítica del negocio.

### 3.7 Historial de facturas

- Visualización de facturas emitidas.
- Resumen rápido (facturado total, pagadas, pendientes).
- Edición/eliminación desde la interfaz.

### 3.8 Deudas

- Consulta de clientes con deuda.
- Total global de cartera.
- Vista resumida para seguimiento comercial y cobranza.

### 3.9 Cierre de caja

- Registro de cierres por fecha.
- Captura de montos por moneda: COP, USD y VES.
- Cálculo de monto final del cierre.
- Edición y consulta histórica de cierres.

### 3.10 Configuraciones

- Configuración por clave/valor (CRUD por key).
- Consulta masiva de configuraciones.
- Endpoint específico de tasas de cambio.
- Base para centralizar parámetros del sistema sin tocar código.

---

## 4) Flujo recomendado para demo en vivo (3-5 minutos)

Para mostrar valor rápidamente:

1. **Login**
2. Entrar al **Dashboard** y mostrar métricas
3. Ir a **Clientes** y crear un cliente
4. Ir a **Inventario** y mostrar stock mínimo
5. Ir a **Servicios** y enseñar servicio con productos asociados
6. Ir a **Facturar**:
   - buscar cliente
   - agregar producto/servicio
   - simular pago parcial
   - emitir factura
7. Abrir **Historial de facturas** para validar registro
8. Abrir **Deudas** para mostrar que se reflejó el saldo pendiente
9. Abrir **Cierre de caja** para mostrar registro diario por moneda

---

## 5) Estado técnico actual (mensaje de madurez)

- Arquitectura separada frontend/backend lista para escalar.
- Validaciones de entrada con **Form Requests** en backend.
- Módulo transaccional de facturación ya operativo.
- Pruebas automáticas de backend iniciadas (por ejemplo, búsqueda de clientes).

---

## 6) Próximos pasos sugeridos (1 minuto)

1. Completar integración total entre facturación y cierre de caja (asociación automática de movimientos).
2. Fortalecer pruebas automatizadas en facturación, inventario y deudas.
3. Mejorar UX del módulo de facturación para hacerlo más guiado y visual.
4. Agregar reportes de cierre por rango de fechas/exportables.

---

## 7) Cierre (20-30 segundos)

En resumen: el proyecto ya cubre los procesos críticos del taller (clientes, inventario, servicios, facturación, deudas y caja) con una base técnica sólida.  
Estamos en una etapa donde el sistema **ya opera funcionalmente** y el siguiente foco es **pulir experiencia, cobertura de pruebas e integración fina de reportes/cierres**.

