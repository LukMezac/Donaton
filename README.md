# Frontend Donaton - Plataforma de Ayuda Humanitaria

Este repositorio contiene la interfaz de usuario de la plataforma **Donaton**, desarrollada con **Next.js** y estructurada bajo estándares de componentes modulares y reutilizables para garantizar una solución técnica alineada con las necesidades del cliente.

## 🛠️ Tecnologías y Estándares

*   **⚛️ Next.js 15+**: Framework de React utilizado para el renderizado del lado del servidor (SSR) y generación de sitios estáticos, optimizando el rendimiento de la plataforma.
*   **📦 NPM Packaging**: Los componentes core de la interfaz han sido empaquetados siguiendo el estándar NPM, cumpliendo con el requisito de generar componentes frontend de tipo NPM para asegurar su portabilidad.
*   **🎨 Tailwind CSS**: Framework utilizado para un diseño responsivo, mantenible y una implementación visual ágil.
*   **🟦 TypeScript**: Implementado para asegurar la integridad de los datos y reducir errores en tiempo de ejecución en toda la aplicación.

## 📦 Componentes NPM

Siguiendo los requisitos de la **Evaluación Parcial N°2**, este proyecto utiliza y distribuye el paquete:

*   **🧩 donaton-ui-components-1.0.0.tgz**: Un paquete local empaquetado que contiene elementos esenciales de la UI (botones, alertas, barras de navegación), permitiendo una identidad visual coherente y facilitando la colaboración en equipo.

## 📂 Estructura de Rutas Principales

La aplicación utiliza el **App Router** de Next.js para organizar las funcionalidades clave:

*   **🔑 /login**: Interfaz de acceso seguro para voluntarios y administradores.
*   **📝 /registro**: Formulario de inscripción para nuevos colaboradores y donantes.
*   **🆘 /necesidades**: Vista dedicada al registro y visualización de requerimientos críticos de ayuda.
*   **🚚 /logistica**: Panel de control para la gestión de envíos y seguimiento de estados de distribución.
*   **⚙️ /admin**: Panel de administración centralizada para la gestión de la plataforma.

## 🚀 Instalación y Desarrollo

Sigue estos pasos para configurar el entorno local:

1.  **📦 Instalar dependencias**:
    ```bash
    npm install
    ```

2.  **⚙️ Configuración de variables de entorno**:
    Crea un archivo `.env.local` en la raíz del proyecto y apunta a la dirección de tu **BFF (Backend For Frontend)**[cite: 3]:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8080
    ```

3.  **▶️ Ejecutar en modo desarrollo**:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:3000`.

## 🧪 Pruebas y Calidad

El proyecto implementa buenas prácticas de desarrollo enfocadas en la mantenibilidad y calidad del código:

*   **🧩 Component Pattern**: Separación estricta entre componentes de presentación y lógica de negocio para facilitar las pruebas unitarias.
*   **🧹 Clean Code**: Uso de nomenclatura clara, código limpio y una estructura de carpetas organizada (e.g., `src`, `public`, `componentes`) según lo solicitado en el formato del entregable.
*   **🔱 Estrategia de Branching**: El desarrollo frontend sigue el plan de branching del equipo (GitFlow) para gestionar versiones y resolver conflictos de manera eficiente.

---
