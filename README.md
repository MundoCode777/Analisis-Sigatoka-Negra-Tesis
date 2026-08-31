# 🍃 BanaVision

## Sistema Web y Móvil para la Detección de Sigatoka Negra en Hojas de Banano mediante Inteligencia Artificial
---

## 📖 Descripción

BanaVision es una aplicación web y móvil desarrollada para apoyar la detección temprana de la Sigatoka Negra en cultivos de banano mediante técnicas de Inteligencia Artificial.

El sistema permite analizar imágenes de hojas de banano para identificar la presencia de la enfermedad y determinar su estado de afectación. Además, incorpora un módulo de seguimiento agronómico que recomienda métodos de intervención humana según la etapa detectada.

---

## 🎯 Objetivo

Desarrollar una aplicación web y móvil capaz de detectar la Sigatoka Negra en hojas de banano utilizando Inteligencia Artificial, proporcionando recomendaciones de tratamiento, seguimiento del estado de la planta y material audiovisual de apoyo para los productores.

---

# 🚀 Funcionalidades Principales

## 👤 Módulo de Usuarios

- Registro de usuarios.
- Inicio de sesión.
- Gestión de perfiles.
- Control de roles.
- Administración de usuarios.

---

## 🔬 Módulo de Detección de Sigatoka Negra

Permite identificar la enfermedad mediante el análisis de imágenes.

### Funcionalidades

- Captura de imágenes desde cámara.
- Carga de imágenes desde galería.
- Procesamiento de imágenes.
- Clasificación mediante Inteligencia Artificial.
- Determinación del estado de la enfermedad.
- Visualización de resultados.
- Registro de detecciones.

### Resultado generado

El sistema mostrará:

- Estado detectado.
- Nivel de confianza.
- Fecha y hora.
- Historial de detección.
- Recomendación de tratamiento.

---

## 🌿 Módulo de Recomendación y Seguimiento

Después de la detección, el sistema recomendará un tratamiento según el estado de la hoja.

### Etapas 1 a 3

Cuando la hoja se encuentre en los estados iniciales:

- Estado 1
- Estado 2
- Estado 3

El sistema recomendará:

### ✂️ Método de Cirugía de la Hoja

Consiste en eliminar únicamente la parte afectada de la hoja para evitar la propagación de la enfermedad y conservar la mayor cantidad posible de tejido sano.

Además, el sistema mostrará:

- Video explicativo.
- Procedimiento paso a paso.
- Recomendaciones técnicas.

---

### Etapas 4 a 6

Cuando la enfermedad presente un nivel más avanzado:

- Estado 4
- Estado 5
- Estado 6

El sistema recomendará:

### 🍂 Método de Deshoje

Consiste en la eliminación parcial o total de hojas afectadas para reducir la propagación de la enfermedad dentro del cultivo.

Además, el sistema mostrará:

- Video explicativo.
- Procedimiento paso a paso.
- Recomendaciones técnicas.

---

## 📈 Seguimiento de la Planta

Permite monitorear la evolución de la hoja después de aplicar el tratamiento.

### Información registrada

- Fecha de aplicación.
- Responsable.
- Método utilizado.
- Estado de la planta.
- Observaciones.
- Evidencia fotográfica.

### Estados de seguimiento

- Severo
- Crítico
- Moderado
- Mejorando
- Recuperado

---

## 📍 Módulo de Geolocalización

Permite:

- Registrar lotes.
- Asociar detecciones a una ubicación.
- Visualizar la ubicación en mapa.
- Consultar historial por lote.

---

## 📊 Módulo de Reportes

Permite generar:

- Reportes de detecciones.
- Reportes de tratamientos.
- Reportes de seguimiento.
- Historial de actividades.
- Estadísticas del cultivo.

---

# 🧠 Inteligencia Artificial

La aplicación utiliza modelos de Deep Learning para analizar imágenes de hojas de banano y determinar el estado de afectación por Sigatoka Negra.

### Flujo del sistema

```text
Captura de Imagen
        ↓
Procesamiento
        ↓
Modelo de IA
        ↓
Clasificación
        ↓
Estado Detectado
        ↓
Recomendación
        ↓
Video Explicativo
        ↓
Seguimiento
        ↓
Reporte
```

---

# 🏗 Arquitectura

## Frontend

- React
- JavaScript
- HTML5
- CSS3

## Backend

- Node.js
- Express.js

## Inteligencia Artificial

- Python
- TensorFlow
- Keras
- OpenCV

## Base de Datos

- MongoDB Atlas

---

# 📂 Estructura del Proyecto

```text
BananaCare
│
├── frontend
│
├── backend
│
├── ia
│
├── uploads
│
├── videos
│   ├── cirugia-hoja.mp4
│   └── deshoje.mp4
│
└── README.md
```

---

# 🎥 Material Educativo

El sistema incorpora videos educativos para apoyar al productor en la aplicación correcta de los tratamientos recomendados.

### Video de Cirugía de Hoja

Disponible cuando la detección corresponde a:

- Estado 1
- Estado 2
- Estado 3

### Video de Deshoje

Disponible cuando la detección corresponde a:

- Estado 4
- Estado 5
- Estado 6

---

# 👨‍💻 Autor

Luis Andrés Rodríguez Valle

Universidad Agraria del Ecuador

Ingeniería en Ciencias de la Computación

+593 979 379 332

---

# 🎓 Proyecto de Titulación

Aplicación Web y Móvil para la Detección de Sigatoka Negra en Hojas de Banano mediante Inteligencia Artificial 