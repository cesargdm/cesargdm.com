---
title: Hoy No Circula
description: Una app para el programa de restricción vehicular del Valle de México — un motor de reglas puro compartido entre teléfono y edge, contingencias leídas de los boletines de gobierno y recordatorios que llegan la noche anterior.
date: 2026-07
url: https://hoynocircula.cesargdm.com
highlight:
  logoUrl: 'https://hoynocircula.cesargdm.com/icon.png'
  color: '#FFAD00'
tags: [expo, react-native, cloudflare-workers, trpc, d1]
---

# Hoy No Circula

[Hoy No Circula](https://hoynocircula.cesargdm.com) responde una sola pregunta para quien maneja en el Valle de México: ¿hoy sale mi coche? El programa detrás de esa pregunta no es una regla sino un montón de ellas — el día de la semana según el último dígito de la placa, el programa sabatino según el holograma, un trato aparte para placas foráneas, las exenciones, y una contingencia ambiental que puede reescribir todo eso a media tarde. La app está en la [App Store](https://apps.apple.com/mx/app/hoy-no-circula-mx/id6760785520) y en [Google Play](https://play.google.com/store/apps/details?id=com.cesargdm.hoynocircula), y deja un vehículo gratis.

## Las reglas son el producto

Todo el programa vive en un solo archivo de 448 líneas de funciones puras, sin efectos secundarios, compartido entre la app y el Worker para que nunca puedan contradecirse. Cubre justo lo que otras apps se saltan. El holograma 2 no circula ningún sábado; el holograma 1 descansa el primer y tercer sábado con placa non y el segundo y cuarto con placa par, así que un quinto sábado deja libre a todo holograma 1. Las placas foráneas están restringidas todos los sábados sin importar el holograma, y entre semana, en los días en que su dígito _no_ está restringido, todavía cargan una ventana matutina de 05:00 a 11:00. Las placas de discapacidad y de auto antiguo quedan exentas incluso durante una contingencia, igual que el holograma E — la exención de eléctricos e híbridos que sobrevive a todas las fases.

Esa cobertura salió de leer las reseñas de una estrella de la competencia antes de escribir una línea. Las quejas que se repetían eran alguien que no pudo registrar una placa de discapacidad, otro que no pudo registrar una de auto antiguo, y un calendario que se equivocaba lo suficiente como para necesitar una segunda app que lo corroborara. El motor está respaldado por 137 casos en un solo archivo de pruebas, que es lo primero que se corre cuando cambia una regla.

## Una contingencia llega como boletín de prensa

No hay API de contingencias ambientales. Hay un archivo de boletines de gobierno, así que un cron horario en el Worker lo lee. La página de listados arma sus artículos con llamadas de jQuery `.append()` sobre cadenas de JavaScript escapadas, así que el HTML hay que desescaparlo antes de siquiera poder parsearlo. Cada boletín nuevo lo clasifica `gpt-4o-mini` en una fase — ninguna, preventiva, fase 1, fase 2 — más las fechas a las que aplica.

Las fechas son la parte difícil. Un boletín publicado a las cuatro de la tarde que anuncia "Doble Hoy No Circula para mañana" habla del día siguiente, así que las fechas relativas se resuelven contra la fecha de publicación y nunca contra hoy. Los boletines se procesan del más viejo al más nuevo, para que cuando una activación de la tarde y un levantamiento de la noche tocan el mismo día, gane el último. Y una clasificación fallida se salta sin registrar historial, para que el siguiente ciclo la reintente: una respuesta que no se puede leer significa _sin información_, nunca "se levantó la contingencia". Las fases desconocidas caen de vuelta a las reglas base por la misma razón.

## Un caché que sabe hasta dónde puede ver

Las respuestas se cachean en el edge sobre un horizonte, no sobre un TTL fijo. Una fecha que ya pasó no puede cambiar, así que se sirve como `immutable` por un año. Todo lo que cae dentro de las próximas 72 horas puede voltearse por una contingencia, así que dura cinco minutos. Lo que está más lejos se cachea exactamente hasta que entre a esa ventana de 72 horas — una consulta a tres meses de distancia sirve casi tres meses. Los endpoints de contingencia también duran cinco minutos, pero recortados a los segundos que faltan para la medianoche en la Ciudad de México, para que una respuesta cacheada nunca sobreviva al día de servicio que describe.

## El teléfono no necesita la red

Los vehículos viven en expo-sqlite y el estado de contingencia se cachea local, así que la app funciona sin señal — el Worker es la fuente de verdad, no una dependencia. Una tarea en segundo plano consulta cambios de contingencia cada hora, y las notificaciones se programan localmente con una semana de anticipación en vez de llegar por push.

El recordatorio por defecto suena a las 20:00, y los recordatorios de la tarde describen el día _siguiente_. Es la respuesta directa a una queja sobre otra app: su notificación llegaba a las 7 de la mañana, cuando la restricción llevaba en vigor desde las cinco y el conductor ya iba en el coche. Una restricción que te enteras la noche anterior es una decisión; la que te enteras camino al trabajo es una multa. Los recordatorios de verificación corren sobre la misma maquinaria — cada dígito de placa tiene dos periodos al año, de dos meses cada uno, y el recordatorio respeta una verificación ya registrada dentro del periodo en curso saltando al siguiente.

## Detalles que solo aparecen en la Ciudad de México

Dos trampas de zona horaria moldearon el código. `new Date('YYYY-MM-DD')` es medianoche UTC, que localmente es la noche anterior, así que una verificación registrada el primero del mes quedaría fuera de su propio periodo si la fecha no se parsea como día de calendario local. Y el límite del día de contingencia es el de la Ciudad de México, no el del Worker, así que cada fecha que escribe el cron se resuelve en horario CDMX antes de tocar la base de datos.

El widget de iOS está hecho con expo-widgets, y su DSL de layout no tiene condicionales — así que las familias mediana y grande siempre pintan tres renglones de vehículo y dejan en blanco los que sobran con cadenas vacías. Baja hasta la familia circular de la pantalla de bloqueo, donde la respuesta completa tiene que caber en una palomita y una placa.
