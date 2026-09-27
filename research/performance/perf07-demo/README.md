# Demo visual de PERF-07

Prototipo descartable para comparar el GIF original con el candidato WebP lossless de 256 × 256 y 50 fps.

Desde la raíz del repositorio:

```sh
open research/performance/perf07-demo/index.html
```

La página funciona sin instalar dependencias ni iniciar la aplicación. Carga el GIF original y el WebP elegido directamente desde `public/background-cells/`, sin duplicar los assets dentro de la demo.

Revisar el ciclo completo, los bordes transparentes y los tamaños de 64 y 80 px. El botón "Reiniciar animaciones" vuelve a cargar ambas versiones para compararlas desde el comienzo.

Como control técnico, Chrome 154 decodificó los 180 cuadros de ambos archivos sin encontrar diferencias de alpha ni de píxeles visibles. El usuario también aprobó visualmente la variante WebP lossless de 50 fps antes de implementarla.
