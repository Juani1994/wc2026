# Proximas funcionalidades y correcciones

## Funcionalidades

- Generar el bracket en formato llaves verticales, teniendo en cada columna R32, R16, QF, SF, F/3rd place, y uniendo con flechas de ronda en ronda pasando el ganador de cada encuentro. Este bracket puede ser una nueva seccion adicional a las que ya existen, pero que ademas al final de la seccion actual de Knockout Stage se genere un boton luego de completar todos los resultados para ir a esa pantalla.

- El boton de compartir ver si ademas se puede generar un iamgen del bracket mencionado en el punto anterior. De esta forma al compartir no es solo un link, sino tambien acompañe ese sharing y genere algo mas visual

- Boton de "How to use": que al presionarlo se levante un paso a paso que haga blur de todo menos la seccion que se esta enseñando, acompañado de un breve texto indicando lo que se tiene que hacer en esa seccion mostrada. Deberia quedar en tanto para EN como ES.

- Boton de Random Results para la fase Knockout. Deberia tener el mismo comportamiento que el boton de Random Results usado en grupos. Quizas convenga ponerlo para cada ronda de la fase eliminatoria: para R32, otro para R16, otro para QF, y asi...

## Correcciones

- Hay que pensar si luego de hacer una simulacion completa y luego volver a editar grupos, vale la pena que toda la zona de knockout la trate de dejar como se configuró. Capaz convenga limpiar todo lo de Knockout si se vuelve a editar al menos un resultado de un grupo [LISTO]

- El número de combinacion aparece en dos lados: en la seccion de Terceros, y en la seccion de Knockout. Yo dejaria solo esa info en la seccion de terceros (hacer que quede igual a la de knockout porque actualmente tiene menos datos), y sacaria la de knockout [LISTO]

- Los criterios de desempate dentro de un grupo cuando dos o mas equipos tienen los mismos puntos no estan siguiendo correctamente el criterio FIFA:

```
The ranking of teams in each group is determined by the points obtained in all group matches. If two or more teams are equal on points, the following criteria are used to determine the ranking:

a. Most points obtained in the group matches played between the teams concerned;
b. Superior goal difference in the group matches played between the teams concerned;
c. Most goals scored in the group matches played between the teams concerned;

If, after having applied criteria a to c, teams still had an equal ranking, criteria a to c are reapplied exclusively to the matches between the teams who are still level to determine their final rankings. If this procedure does not lead to a decision, criteria d to h apply.

d. Superior goal difference in all group matches;
e. Most goals scored in all group matches;
f. Highest team conduct ("fair play") score in all group matches (only one deduction can be applied to a player or team coach/official in a single match):
    - Yellow card: −1 point;
    - Indirect red card (second yellow card): −3 points;
    - Direct red card: −4 points;
    - Yellow card and direct red card: −5 points;
g. Better position in the most recent FIFA Men's World Ranking;
h. Better position in progressively older FIFA Men's World Rankings until teams can be separated.
```

Quizas no se puede hacer lo de las tarjetas (no se pueden cargar tarjetas), pero quizas podemos agregar las reglas de desempate hasta el punto e.

