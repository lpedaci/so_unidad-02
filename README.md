# SO · Unidad 2 — Gestión de almacenamiento

Sitio web educativo interactivo para 5to año de Informática, laboratorio de Sistemas Operativos.  
Desarrollado para ser proyectado en clase y consultado desde dispositivos de los alumnos.

## Contenido

| Sección | Descripción |
|---|---|
| **Particiones** | Diagramas interactivos de disco MBR y GPT. Clic en cada segmento para ver detalles. |
| **Formateo** | Comparativa de los tres tipos: Rápido, Normal/Completo y Bajo nivel. |
| **Sistemas de archivos** | Selector FAT32 / NTFS / exFAT / FAT con tabla semáforo comparativa. |
| **Casos de usuario** | Tarjetas A–F del TP con diagramas de disco completos y respuestas sugeridas. |
| **Guía de clase** | Planificación de 80 minutos con actividades, preguntas disparadoras y tips. |

> Las últimas dos secciones son exclusivas del docente y requieren login.

## Acceso docente

El botón **Docente** en el nav abre un modal de autenticación.  
Las credenciales por defecto son:

```
Usuario:     docente
Contraseña:  docente2025
```

La contraseña puede cambiarse desde el mismo modal. El nuevo hash se guarda en `localStorage` del navegador.

Una vez autenticado, el panel docente permite configurar qué pestañas son visibles para los alumnos.

## Estructura

```
so-unidad2/
├── index.html
└── assets/
    ├── css/
    │   ├── main.css      # estilos base, layout, responsive
    │   └── login.css     # modal de login y panel docente
    └── js/
        ├── nav.js        # navegación y menú hamburger
        ├── login.js      # autenticación (SHA-256) y control de pestañas
        ├── particiones.js
        ├── archivos.js
        ├── usuarios.js
        └── guia.js
```

## Despliegue

Compatible con GitHub Pages. Subir el contenido de la carpeta `so-unidad2/` al repositorio y activar Pages desde la rama correspondiente.

---

**Prof. Pedaci Lourdes** · [LinkedIn](https://www.linkedin.com/in/lourdes-pedaci/)
