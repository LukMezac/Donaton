📦 Proyecto Donaton - Evaluación Parcial 2Este repositorio contiene la solución para la implementación de componentes Frontend y Backend basada en una arquitectura de microservicios y el patrón BFF (Backend For Frontend).

🌳 1. Estrategia de Branching (Plan de Trabajo)Para este proyecto se implementó una estrategia de branching organizada para favorecer la colaboración y el control de versiones.  main: Rama protegida que contiene el código estable y listo para producción.  develop: Rama principal de desarrollo donde se integran las funcionalidades terminadas.  feature/: Ramas temporales para tareas específicas (ej. feature/factory-pattern, feature/bff-setup).  Nota sobre Gestión de Conflictos: Los conflictos se resolvieron localmente en las ramas feature mediante la sincronización con develop antes de realizar el Pull Request final a la rama main, asegurando que esta nunca perdiera su estabilidad.

🏗️ 2. Arquitectura y RepositoriosLa solución utiliza arquetipos Maven para el backend y Next.js para el frontend, asegurando escalabilidad.  Frontend: donaton (Next.js con componentes empaquetados).  BFF: ms-bff (Spring Boot - Orquestador de servicios).  Microservicios:ms-donaciones: Implementa patrón Factory para tipos de donaciones.  ms-necesidades: Gestión de requerimientos de usuarios.  ms-logistica: Control de envíos y distribución.  

🛠️ 3. Instrucciones de Ejecución (Frontend)Para garantizar el correcto funcionamiento de los componentes frontend, siga estos pasos:  Requisitos PreviosNode.js: v18+.  npm: v9+.  InstalaciónDebido a una restricción de dependencias entre react-leaflet y la versión de React utilizada, es obligatorio instalar mediante:  Bashnpm install --legacy-peer-deps

EjecuciónBashnpm run dev

Acceso local: http://localhost:3000.  

🧪 4. Pruebas y CalidadPruebas Unitarias: Se incluyeron tests en los microservicios backend para validar la lógica del patrón Factory y los servicios CRUD.  Código Limpio: Se aplicaron principios de responsabilidad única en los controladores del BFF y microservicios.  
