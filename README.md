# Document Analyzer

Document Analyzer es una herramienta que permite subir documentos y extraer información relevante mediante el uso de Ollama en local. Diseñado para simplificar el análisis de documentos mediante conversaciones inteligentes.

<video width="600" controls>
  <source src="doc/demostracion.mp4" type="video/mp4">
  Tu navegador no soporta la reproducción de videos.
</video>

## Características

- Interacción en tiempo real con Ollama para preguntas detalladas sobre el contenido del documento.
- Integración fluida con documentos PDF para una recuperación eficiente de información.
- Operación local con Ollama, garantizando privacidad y seguridad de datos.

## Prerrequisitos

- Node.js (versión 16.14 o superior).
- pnpm (versión compatible con Node.js 16).
- Ollama con algún modelo 

## Instalación

1. Clona el repositorio:
``` bash
git clone https://github.com/tuusuario/OllamaDocAnalyzer.git cd OllamaDocAnalyzer
```

2. Instala las dependencias:
``` bash
pnpm install
```

3. Ejecuta Ollama con el modelo que prefieras. En mi caso usaré phi3
``` bash
ollama run phi3
```

## Contribuciones

Las contribuciones de código, mejoras y reportes de errores son bienvenidas. Por favor, abre un issue para discutir cambios o nuevas características.