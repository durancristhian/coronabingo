# UI-04: datos, compartir y exportar desde la sala

Status: wontfix

Work status: resolved

Type: task

## Resultado

Este ticket se retira del backlog Playwright. Sus comportamientos se pueden verificar con pruebas más chicas y deterministas.

## Candidatos para pruebas más chicas

- nombre y URL de sala;
- orden y distintivo de quien dirige;
- texto enviado al portapapeles;
- URLs de WhatsApp y Telegram;
- configuración y contenido generado para el `.xls`;
- nombre del archivo descargado.

La descarga real del navegador aporta poca señal adicional porque la exportación está oculta detrás de siete activaciones del título y el riesgo principal está en los datos generados.

## Comments

### 2026-09-26

El dueño pidió retirar de Playwright los casos que reemplazan unit tests. Se conserva el ticket como registro, con estado `wontfix`, en vez de borrar su historia.
