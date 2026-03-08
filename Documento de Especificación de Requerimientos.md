# **Documento de Especificación de Requerimientos**

## **Plataforma Web FOCCA-FOCDE**

**Versión:** 1.0  
 **Fecha:** Marzo 2026  
 **Cliente:** FOCCA-FOCDE  
 **Tipo de proyecto:** Plataforma web institucional con área privada para asociaciones

---

# **1\. Introducción**

## **1.1 Propósito del documento**

Este documento describe los requerimientos funcionales y técnicos para el desarrollo de la plataforma web **FOCCA-FOCDE**, una federación ornitológica cultural y deportiva.

El objetivo es definir de forma clara:

* La estructura del sitio web

* Las funcionalidades públicas y privadas

* La arquitectura tecnológica

* Los requisitos técnicos y de seguridad

Este documento servirá como base para el diseño, desarrollo y mantenimiento de la plataforma.

---

# **2\. Descripción general del sistema**

La plataforma FOCCA-FOCDE será una **web institucional responsive** que incluirá:

1. **Sección pública informativa**

2. **Área privada para asociaciones**

3. **Sistema de subida de documentos para petición de anillas**

4. **Panel para gestión de documentos**

El sistema permitirá que cada asociación tenga **credenciales propias** para subir documentos que posteriormente serán revisados y descargados por la administración.

---

# **3\. Objetivos del sistema**

Los principales objetivos del sistema son:

* Crear una web oficial para **FOCCA-FOCDE**

* Centralizar información institucional

* Facilitar el acceso a normativa y documentos

* Permitir a las asociaciones **solicitar anillas mediante subida de documentos**

* Gestionar usuarios mediante autenticación segura

* Proporcionar una interfaz moderna, responsive y fácil de usar

---

# **4\. Tecnologías del sistema**

## **4.1 Frontend**

* **Framework:** React

* **Lenguaje:** JavaScript

* **Diseño responsive:** CSS / Tailwind o similar

* **Consumo de API:** REST

## **4.2 Backend**

* **Tecnología:** .NET (ASP.NET Core Web API)

* **Funciones principales:**

  * Gestión de lógica de negocio

  * Gestión de documentos

  * Comunicación con base de datos

  * Seguridad y validación

## **4.3 Base de datos**

* **Sistema:** Supabase

* **Funciones:**

  * Base de datos PostgreSQL

  * Autenticación de usuarios

  * Almacenamiento de documentos

  * Gestión de asociaciones

## **4.4 Almacenamiento de archivos**

* Supabase Storage

* Archivos permitidos:

  * PDF

  * DOC

  * DOCX

---

# **5\. Estructura del sitio web**

La web tendrá los siguientes apartados principales:

## **5.1 FOCCA-FOCDE**

Página principal del sitio.

Contenido:

* Información general

* Presentación de la federación

* Imagen institucional

* Acceso rápido a secciones principales

* Noticias destacadas

---

## **5.2 Quiénes Somos**

Información institucional de la federación.

Contenido:

* Historia

* Objetivos

* Misión

* Actividad de la federación

---

## **5.3 Junta Directiva**

Listado de miembros de la junta directiva.

Información:

* Nombre

* Cargo

* Asociación

* Foto (opcional)

---

## **5.4 Asociaciones FOCCA-FOCDE**

Listado de asociaciones afiliadas.

Información:

* Nombre de la asociación

* Provincia

* Información de contacto

---

## **5.5 Normativa FOCCA-FOCDE**

Repositorio de documentos normativos.

Ejemplos:

* Estatutos

* Reglamentos

* Normativa de concursos

* Normativa de jueces

Los documentos estarán disponibles para descarga.

---

## **5.6 Impresos FOCCA-FOCDE**

Sección para descargar formularios oficiales.

Ejemplos:

* Solicitud de anillas

* Formularios administrativos

* Inscripciones

Formato:

* PDF descargable

---

## **5.7 Jueces FOCDE**

Esta sección **no tendrá contenido propio**, sino que al acceder redirigirá al apartado de jueces de la web de la federación original.

Redirección a la página correspondiente de **Federación Ornitológica Cultural Deportiva Española**.

Ejemplo de comportamiento:

* Usuario hace clic en **Jueces FOCDE**

* El sistema abre la página de jueces en la web oficial de FOCDE.

---

## **5.8 Concursos**

Información sobre concursos organizados.

Contenido:

* Listado de concursos

* Fechas

* Bases

* Documentos descargables

---

## **5.9 Noticias**

Sección de noticias relacionadas con la federación.

Cada noticia tendrá:

* Título

* Fecha

* Imagen

* Contenido

---

## **5.10 Galería**

Galería multimedia.

Contenido:

* Fotografías de concursos

* Eventos

* Actividades

Formato:

* Galería visual con imágenes

---

## **5.11 Enlaces**

Lista de enlaces externos relevantes.

Ejemplos:

* Federaciones

* Asociaciones

* Recursos ornitológicos

---

## **5.12 Contacto**

Formulario de contacto.

Campos:

* Nombre

* Email

* Asunto

* Mensaje

El formulario enviará el mensaje al correo oficial de FOCCA-FOCDE.

---

# **6\. Área privada**

## **6.1 Acceso privado**

La plataforma incluirá una zona privada accesible mediante:

* Usuario

* Contraseña

Autenticación gestionada mediante **Supabase Auth**.

---

## **6.2 Acceso por asociación**

Cada asociación tendrá:

* Usuario propio

* Contraseña propia

Las asociaciones solo podrán ver **sus propios documentos**.

---

## **6.3 Funcionalidad principal: Petición de anillas**

Dentro del área privada existirá un módulo para **subir documentos de solicitud de anillas**.

### **Flujo del proceso**

1. La asociación accede a su cuenta.

2. Accede al apartado **Petición de anillas**.

3. Suben el documento correspondiente.

4. El documento se guarda en Supabase.

5. El administrador puede descargar el documento.

---

## **6.4 Subida de documentos**

Características:

* Subida de archivos PDF o DOC

* Registro de fecha de subida

* Asociación vinculada al documento

* Posibilidad de descargar el documento

---

## **6.5 Panel de administración**

El administrador podrá:

* Ver documentos subidos

* Descargar documentos

* Ver asociaciones

* Gestionar usuarios

---

# **7\. Requisitos funcionales**

| ID | Requisito |
| ----- | ----- |
| RF01 | El sistema debe mostrar información institucional de FOCCA-FOCDE |
| RF02 | El sistema debe permitir visualizar asociaciones |
| RF03 | El sistema debe permitir descargar normativa |
| RF04 | El sistema debe permitir descargar impresos |
| RF05 | El sistema debe mostrar noticias |
| RF06 | El sistema debe mostrar galería de imágenes |
| RF07 | El sistema debe permitir acceso privado |
| RF08 | Cada asociación debe tener su propio usuario |
| RF09 | Las asociaciones deben poder subir documentos |
| RF10 | El administrador debe poder descargar los documentos |

---

# **8\. Requisitos no funcionales**

## **8.1 Responsive**

La web debe ser **totalmente responsive**, compatible con:

* Ordenadores

* Tablets

* Móviles

---

## **8.2 Seguridad**

* Autenticación segura

* Control de acceso por usuario

* Validación de archivos

---

## **8.3 Rendimiento**

La web debe cargar en menos de **3 segundos** en condiciones normales.

---

## **8.4 Compatibilidad**

Compatible con:

* Chrome

* Firefox

* Edge

* Safari

---

# **9\. Arquitectura del sistema**

Arquitectura basada en **cliente-servidor**.

Estructura:

Frontend (React)  
 ↓  
 API REST (.NET)  
 ↓  
 Supabase (Base de datos \+ autenticación \+ storage)

---

# **10\. Modelo de datos básico**

## **Tabla asociaciones**

Campos:

* id

* nombre

* provincia

* email

* usuario

---

## **Tabla usuarios**

Campos:

* id

* email

* password

* asociacion\_id

* rol

---

## **Tabla documentos**

Campos:

* id

* asociacion\_id

* nombre\_archivo

* fecha\_subida

* url\_archivo

---

# **11\. Diseño UI**

El diseño debe ser:

* Moderno

* Claro

* Fácil de usar

* Responsive

* Adaptado a identidad FOCCA-FOCDE

---

# **12\. Futuras mejoras**

Posibles mejoras futuras:

* Inscripción online a concursos

* Panel completo de gestión

* Gestión de jueces

* Sistema de pagos

* Calendario de eventos

