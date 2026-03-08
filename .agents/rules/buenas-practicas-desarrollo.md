---
trigger: always_on
---

# **Reglas y Buenas Prácticas de Desarrollo Web**

## **Proyecto FOCCA-FOCDE**

**Uso interno para Antigravity**

Versión: 1.0  
 Fecha: Marzo 2026

---

# **1\. Objetivo del documento**

Este documento define las **reglas, estándares y buenas prácticas** que el sistema de generación de código **Antigravity** debe seguir durante el desarrollo del proyecto web **FOCCA-FOCDE**.

Los objetivos son:

* Mantener **consistencia en el código**

* Garantizar **seguridad**

* Facilitar **mantenimiento**

* Asegurar **calidad del software**

* Mantener **arquitectura clara y escalable**

Todas las implementaciones deben respetar estas reglas.

---

# **2\. Tecnologías obligatorias**

El proyecto deberá utilizar las siguientes tecnologías.

## **Frontend**

* React

* JavaScript o TypeScript

* CSS moderno (preferiblemente Tailwind o CSS Modules)

* Arquitectura basada en componentes

* Consumo de API REST

---

## **Backend**

* .NET (ASP.NET Core Web API)

* Arquitectura en capas

* Controladores REST

* Validación de datos

---

## **Base de datos y autenticación**

* Supabase

* PostgreSQL

* Supabase Auth

* Supabase Storage para archivos

---

# **3\. Arquitectura del proyecto**

El proyecto deberá seguir una arquitectura clara y escalable.

## **Frontend**

Estructura recomendada:

src  
├── components  
├── pages  
├── services  
├── hooks  
├── contexts  
├── utils  
├── styles  
└── assets

Descripción:

components → Componentes reutilizables  
 pages → Páginas principales  
 services → Comunicación con APIs  
 hooks → Hooks personalizados  
 contexts → Gestión de estado global  
 utils → Funciones auxiliares

---

## **Backend (.NET)**

Estructura recomendada:

/Controllers  
/Services  
/Repositories  
/Models  
/DTOs  
/Middleware  
/Utils

Descripción:

Controllers → Endpoints API  
 Services → Lógica de negocio  
 Repositories → Acceso a datos  
 Models → Entidades de base de datos  
 DTOs → Objetos de transferencia de datos

---

# **4\. Convenciones de código**

## **Nombres de archivos**

Frontend:

PascalCase para componentes  
camelCase para utilidades

Ejemplos:

Navbar.jsx  
LoginPage.jsx  
uploadService.js

Backend:

PascalCase para clases  
camelCase para variables

Ejemplo:

DocumentController.cs  
AssociationService.cs  
---

## **Nombres de variables**

Deben ser:

* descriptivos

* claros

* en español

Ejemplos correctos:

usuarioId  
asociacionId  
subidaDocumentos

Evitar:

x  
data1  
testVar  
---

# **5\. Buenas prácticas de React**

Antigravity deberá seguir las siguientes reglas.

## **Componentes pequeños**

Los componentes deben ser **reutilizables y simples**.

Evitar componentes de más de **500 líneas**.

---

## **Separación de lógica y UI**

La lógica debe separarse usando:

* hooks

* services

Ejemplo:

components/  
services/  
hooks/  
---

## **Manejo de estado**

Preferencias:

1. useState

2. useContext

3. React Query (si se usa)

Evitar estados globales innecesarios.

---

## **Peticiones API**

Todas las peticiones deben centralizarse en:

/services/api.js

No hacer llamadas API directamente dentro de componentes grandes.

---

# **6\. Buenas prácticas de .NET**

## **Controladores ligeros**

Los controladores deben contener solo:

* recepción de datos

* validación

* llamada a servicios

La lógica de negocio debe ir en **Services**.

---

## **Uso de DTOs**

Nunca exponer directamente las entidades de base de datos.

Utilizar DTOs para:

* respuestas API

* peticiones

---

## **Manejo de errores**

Usar middleware global para manejar errores.

Nunca devolver errores sin control.

---

# **7\. Seguridad**

El sistema debe cumplir las siguientes reglas.

---

## **Autenticación**

Debe utilizarse **Supabase Auth**.

Reglas:

* tokens seguros

* sesiones controladas

* logout correcto

---

## **Control de acceso**

Los usuarios solo pueden acceder a:

* sus datos

* su asociación

* sus documentos

---

## **Validación de archivos**

Los archivos subidos deben validarse.

Tipos permitidos:

PDF  
DOC  
DOCX

Tamaño máximo recomendado:

10MB  
---

## **Sanitización**

Todos los inputs deben validarse para evitar:

* XSS

* SQL Injection

* Uploads maliciosos

---

# **8\. Manejo de documentos**

Los documentos de **petición de anillas** deben seguir estas reglas.

---

## **Subida**

Los archivos se guardarán en:

Supabase Storage  
---

## **Metadatos**

Cada documento debe registrar:

* asociación

* fecha de subida

* nombre del archivo

* url del archivo

---

## **Acceso**

Solo podrán acceder:

* la asociación que subió el archivo

* el administrador

---

# **9\. Responsive Design**

La web debe ser completamente responsive.

Se deben soportar:

* escritorio

* tablet

* móvil

---

## **Breakpoints recomendados**

Mobile: \< 768px  
Tablet: 768px – 1024px  
Desktop: \> 1024px  
---

# **10\. Accesibilidad**

La web debe cumplir buenas prácticas básicas de accesibilidad.

Reglas:

* usar etiquetas HTML correctas

* imágenes con alt

* botones accesibles

* contraste adecuado

---

# **11\. Optimización**

Buenas prácticas obligatorias.

---

## **Frontend**

* Lazy loading de páginas

* Optimización de imágenes

* Minimizar renders innecesarios

---

## **Backend**

* endpoints eficientes

* consultas optimizadas

* paginación cuando sea necesario

---

# **12\. Control de versiones**

El proyecto debe gestionarse mediante **Git**.

Reglas de commits:

Formato recomendado:

feat: add document upload  
fix: correct login validation  
refactor: improve document service  
---

# **13\. Pruebas**

Se recomienda implementar pruebas para:

Frontend:

* componentes críticos

* formularios

Backend:

* endpoints

* servicios

---

# **14\. Documentación**

El código debe incluir comentarios claros cuando sea necesario.

También se debe mantener:

* README del proyecto

* documentación de API

---

# **15\. Reglas para Antigravity**

Antigravity debe cumplir las siguientes reglas:

1. Generar código limpio y modular

2. No mezclar lógica de negocio con UI

3. No duplicar código

4. Usar componentes reutilizables

5. Mantener consistencia en nombres

6. Validar inputs siempre

7. Usar arquitectura por capas en backend

8. Usar servicios para comunicación con APIs

9. Implementar responsive design

10. Priorizar seguridad y mantenimiento

---

# **16\. Escalabilidad**

El sistema debe diseñarse pensando en futuras ampliaciones:

* gestión de concursos

* panel administrativo completo

* sistema de inscripciones

* gestión de jueces

