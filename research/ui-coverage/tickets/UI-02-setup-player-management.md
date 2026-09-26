# UI-02: gestión de personas en la preparación

Status: needs-triage

Work status: open

Type: task

## Objetivo

Cubrir las reglas de alta, baja, selección de quien dirige y límite de capacidad sin convertir el test en otra partida completa.

## Alcance

- Nombre vacío y repetido.
- Alta hasta el máximo permitido.
- Baja de una persona común y de quien dirige.
- Habilitación de `Jugar` sólo con dos personas y quien dirige seleccionado.
- Orden y actualización en tiempo real de la lista.
- Dos pestañas de preparación editando la misma sala.

## Criterios de aceptación

- [ ] Cada regla prueba tanto el control deshabilitado como el resultado al corregir la entrada.
- [ ] Eliminar a quien dirige limpia el rol y bloquea el inicio de la partida.
- [ ] El máximo proviene del comportamiento visible, sin fijar en el test una constante duplicada si puede evitarse.
- [ ] La prueba concurrente deja explícito qué estado debe ganar o combinarse.
- [ ] Los casos reutilizan una sala preparada en el emulador y no repiten el recorrido completo de creación.
