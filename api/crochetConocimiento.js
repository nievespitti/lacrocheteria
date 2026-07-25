// Editar aquí para mejorar la precisión del Asistente IA sin tocar el handler.

// Prompt para el segundo turno cuando la usuaria marca un patrón como incorrecto
// y explica qué falla. Se envía junto con el patrón anterior como historial de
// conversación, para que Claude corrija justo eso en vez de repetir el mismo error.
export const promptCorreccion = (correccion, idioma) => idioma === 'en' ? `The pattern above is not correct. Here's what's wrong, in the requester's own words:

"${correccion}"

Fix this specific problem. Re-apply the construction rules and the stitch-count verification from your instructions above before answering. Reply again with the COMPLETE corrected pattern, in the exact same format as before (no explanation of what changed, no comments outside the pattern itself).` : `El patrón de arriba no es correcto. Esto es lo que falla, en palabras de quien lo pidió:

"${correccion}"

Corrige ese problema concreto. Vuelve a aplicar las reglas de construcción y la verificación de conteo de puntos de tus instrucciones anteriores antes de responder. Responde de nuevo con el patrón COMPLETO ya corregido, en el mismo formato exacto que antes (sin explicar qué has cambiado, sin comentarios fuera del propio patrón).`

// Prompt del reintento automático server-side cuando verificarConteo() detecta
// vueltas con conteos que no cuadran matemáticamente (ver más abajo). Distinto
// de promptCorreccion: aquí no hay feedback de una usuaria, es un autochequeo.
export const promptVerificacion = (sospechosas, idioma) => {
  const lista = sospechosas.map((s) => (idioma === 'en' ? `Round ${s.vuelta}` : `Vuelta ${s.vuelta}`)).join(', ')
  return idioma === 'en'
    ? `Before finalizing, double-check the stitch count in these rounds — they don't look mathematically consistent with the increases/decreases described: ${lista}. Recompute them carefully and reply again with the COMPLETE corrected pattern, in the exact same format as before (no explanation of what changed, no comments outside the pattern itself).`
    : `Antes de terminar, revisa el conteo de puntos de estas vueltas — no parecen matemáticamente coherentes con los aumentos/disminuciones que describen: ${lista}. Recalcúlalas con cuidado y responde de nuevo con el patrón COMPLETO ya corregido, en el mismo formato exacto que antes (sin explicar qué has cambiado, sin comentarios fuera del propio patrón).`
}

// Patrones reales y comprobados. Añadir aquí para que la IA los use como referencia
// de formato, rigor en el conteo y lógica de construcción (no los copia, los usa para calibrar).
// `categoria` son palabras clave (separadas por guion) para elegir el ejemplo más relevante
// según lo que pida la usuaria — ej: 'bolso-espiral', 'amigurumi-esfera', 'granny-square'.
export const PATRONES_REFERENCIA = [
  // {
  //   categoria: 'bolso-espiral-cilindrico',
  //   titulo: 'Bolso redondo en espiral',
  //   texto: `## Bolso redondo en espiral\n...(patrón completo verificado)...`,
  // },
  {
    categoria: 'amigurumi-conejo-conejito-oso-osito-peluche-muñeco-muneco-animalito',
    titulo: 'Amigurumi animal básico: cabeza, cuerpo, brazos, piernas y orejas',
    texto: `## Amigurumi animal básico (cabeza, cuerpo, brazos, piernas, orejas)

**Dificultad:** Principiante-intermedio
**Método de construcción:** cada pieza se teje por separado, en espiral continua (sin cerrar vuelta), con marcador de punto en el primer punto de cada vuelta. Las piezas se rellenan y se cosen entre sí al terminar.

## Materiales

- Hilo de algodón o mezcla, grosor medio
- Gancho 2,5-3,5 mm según el hilo
- Ojos de seguridad
- Relleno de fibra siliconada
- Aguja lanera, marcadores de punto, tijeras

## Abreviaturas

- am: anillo mágico
- pb: punto bajo
- aum: aumento (2 pb en el mismo punto)
- dism: disminución (2 pb juntos, invisible si es posible)
- cad: cadeneta

## Instrucciones

### Cabeza (esfera)

**Vuelta 1:** 8 pb en am (8 puntos)
**Vuelta 2:** 8 aum (16 puntos)
**Vuelta 3:** (1 pb, 1 aum) x8 (24 puntos)
**Vuelta 4:** (2 pb, 1 aum) x8 (32 puntos)
**Vuelta 5:** (3 pb, 1 aum) x8 (40 puntos)
**Vueltas 6-12:** teje recto sin aumentar, 40 pb cada vuelta (7 vueltas). Coloca los ojos de seguridad entre las vueltas 8 y 9, centrados y separados según el tamaño de cara deseado — antes de rellenar del todo, porque una vez cerrada la pieza ya no se puede fijar el respaldo del ojo.
**Vuelta 13:** (3 pb, 1 dism) x8 (32 puntos)
**Vuelta 14:** (2 pb, 1 dism) x8 (24 puntos)
**Vuelta 15:** (1 pb, 1 dism) x8 (16 puntos)
**Vuelta 16:** 8 dism (8 puntos)

Rellena bien antes de cerrar del todo. Remata pasando la hebra por los puntos restantes y tirando (cierre de bolsita), dejando hebra larga para coser al cuerpo.

### Cuerpo

**Vuelta 1:** 8 pb en am (8 puntos)
**Vuelta 2:** 8 aum (16 puntos)
**Vuelta 3:** (1 pb, 1 aum) x8 (24 puntos)
**Vuelta 4:** (1 pb, 1 aum) x12 (36 puntos)
**Vueltas 5-12:** teje recto, 36 pb cada vuelta (8 vueltas).
**Vuelta 13:** (1 pb, 1 dism) x12 (24 puntos)
**Vuelta 14:** teje recto, 24 pb.

Rellena progresivamente mientras tejes, no todo al final — es mucho más difícil meter relleno por un hueco pequeño ya cerrado. Cierra dejando hebra larga para coser la cabeza.

### Brazos (x2)

**Vuelta 1:** 6 pb en am (6 puntos)
**Vuelta 2:** 6 aum (12 puntos)
**Vueltas 3-8:** teje recto, 12 pb cada vuelta (6 vueltas).
**Vuelta 9:** (1 pb, 1 dism) x4 (8 puntos)

Relleno mínimo, solo en la base, para que caigan blandos. Deja hebra larga para coser a la altura de los hombros.

### Piernas (x2)

**Vuelta 1:** 6 pb en am (6 puntos)
**Vuelta 2:** 6 aum (12 puntos)
**Vueltas 3 en adelante:** teje recto, 12 pb cada vuelta, hasta la altura deseada.

Relleno ligero, deja hebra larga. Cose las dos piernas separadas en la base del cuerpo para que la pieza pueda sentarse.

### Orejas (x2)

**Vuelta 1:** 8 pb en am (8 puntos)
**Vuelta 2:** 8 aum (16 puntos)
**Vuelta 3:** (3 pb, 1 aum) x4 (20 puntos)
**Vueltas 4-9:** teje recto, 20 pb cada vuelta (6 vueltas).
**Vuelta 10:** (3 pb, 1 dism) x4 (16 puntos)
**Vuelta 11:** teje recto, 16 pb.

Sin relleno o relleno mínimo en la base, para que caigan con naturalidad. Cóselas en la parte superior de la cabeza, ligeramente inclinadas hacia atrás.

## Acabado

1. Cose la cabeza centrada y firme al cuerpo.
2. Cose los brazos a la altura de los hombros.
3. Cose las piernas separadas en la base, para que la pieza se pueda sentar.
4. Cose las orejas en la parte superior, inclinadas hacia atrás.
5. Borda la cara (naricita, boca) con hilo fino en un color de contraste.

## Consejos

- Usa alfileres para probar la posición de ojos y orejas antes de coser definitivamente.
- Cada vuelta recta debe mantener el mismo conteo que la anterior: si no cuadra, revisa antes de seguir tejiendo.`,
  },
  {
    categoria: 'koala',
    titulo: 'Amigurumi koala: piernas fusionadas en el cuerpo desde un óvalo en espiral',
    texto: `## Amigurumi koala (piernas fusionadas en un cuerpo continuo)

**Dificultad:** Intermedio
**Método de construcción:** se empieza por las patitas y se sube hacia el cuerpo tejiendo todo en una sola pieza continua. Las patas se tejen por separado como óvalos en espiral y luego se fusionan en una única vuelta mediante un puente de cadeneta (ver técnica de "fusión de piezas tubulares" en las técnicas avanzadas). Cabeza y patas también parten de un óvalo en espiral. Orejas y brazos se tejen aparte y se cosen al final.

## Materiales

- Hilo de algodón o mezcla algodón/acrílico, grosor medio (aprox. 300 m / 100 g): gris para el cuerpo, un color a elección para el overol
- Gancho 2,5 mm
- Ojos de seguridad 9 mm
- Hilo fino aparte para bordar la cara
- Relleno de fibra siliconada, aguja lanera, marcadores de punto, tijeras

## Abreviaturas

- am: anillo mágico
- pb: punto bajo
- cad: cadeneta
- aum: aumento (2 pb en el mismo punto)
- dism: disminución invisible (2 pb juntos)
- aum triple: 3 pb en el mismo punto (se usa en los extremos del óvalo inicial)

## Instrucciones

### Pata derecha (óvalo en espiral)

**Vuelta 1:** 7 cad, 5 pb, 1 aum triple, 4 pb, 1 aum (14 puntos)
**Vuelta 2:** 1 aum, 4 pb, (1 aum) x3, 4 pb, (1 aum) x2 (20 puntos)
**Vuelta 3:** 1 pb, 1 aum, 4 pb, (1 pb, 1 aum) x3, 4 pb, (1 pb, 1 aum) x2 (26 puntos)
**Vuelta 4:** teje recto, 26 pb.
**Vuelta 5:** 9 pb, 1 dism, 1 pb, 1 dism, 10 pb, 1 dism (23 puntos)
**Vuelta 6:** 9 pb, 2 dism, 8 pb, 1 dism (20 puntos)
**Vuelta 7:** 1 dism, 7 pb, 1 dism, 9 pb (18 puntos)
**Vuelta 8:** 8 pb, 1 dism, 6 pb, 1 dism (16 puntos)
**Vuelta 9:** teje recto, 16 pb.
**Vuelta 10:** 7 pb, (1 aum) x2, 7 pb (18 puntos)

Deja esta pata en espera. Teje la pata izquierda igual, de la vuelta 1 a la 10. Rellena las dos patas.

### Unión de las patas en el cuerpo

**Vuelta 11:** al terminar la vuelta 10 de la pata izquierda, teje 5 cadenas y únelas con un punto bajo al primer punto de la vuelta 10 de la pata derecha (ese punto pasa a ser el nuevo inicio de vuelta). Continúa tejiendo alrededor de las dos patas más el puente de cadenetas — pierna derecha completa, 5 pb sobre las cadenas, pierna izquierda completa, 5 pb sobre el otro lado de las cadenas — con algunos aumentos repartidos para abrir el cuerpo, hasta llegar a (50 puntos)
**Vueltas 12-13:** teje recto, 50 pb cada vuelta.
**Vuelta 14:** 9 pb, 1 aum, (1 pb, 1 aum) x2, 20 pb, 1 aum, (1 pb, 1 aum) x2, 11 pb (56 puntos)
**Vuelta 15:** teje recto, 56 pb.
**Vuelta 16:** 11 pb, 1 aum, (1 pb, 1 aum) x2, 23 pb, 1 aum, (1 pb, 1 aum) x2, 12 pb (62 puntos)
**Vueltas 17-18:** teje recto, 62 pb cada vuelta.
**Vuelta 19:** 7 pb, (1 pb, 1 dism) x5, 16 pb, (1 pb, 1 dism) x5, 9 pb (52 puntos)
**Vuelta 20:** 7 pb, (1 pb, 1 dism) x3, 17 pb, (1 pb, 1 dism) x3, 10 pb (46 puntos)
**Vuelta 21:** teje recto, 46 pb.
**Vuelta 22:** 1 dism, 19 pb, 1 dism, 23 pb (44 puntos)
**Vuelta 23:** (9 pb, 1 dism) x4 (40 puntos)
**Vuelta 24:** (2 pb, 1 dism) x10 (30 puntos)
**Vuelta 25:** teje recto, 30 pb.

Remata dejando hebra larga para coser la cabeza.

### Cabeza (óvalo en espiral)

**Vuelta 1:** 12 cad, 10 pb, 1 aum triple, 9 pb, 1 aum (24 puntos)
**Vuelta 2:** 1 aum, 9 pb, (1 aum) x3, 9 pb, (1 aum) x2 (30 puntos)
**Vuelta 3:** 1 pb, 1 aum, 9 pb, (1 pb, 1 aum) x3, 9 pb, (1 pb, 1 aum) x2 (36 puntos)
**Vuelta 4:** 2 pb, 1 aum, 9 pb, (2 pb, 1 aum) x3, 9 pb, (2 pb, 1 aum) x2 (42 puntos)
**Vuelta 5:** 3 pb, 1 aum, 9 pb, (3 pb, 1 aum) x3, 9 pb, (3 pb, 1 aum) x2 (48 puntos)
**Vuelta 6:** 4 pb, 1 aum, 9 pb, (4 pb, 1 aum) x3, 9 pb, (4 pb, 1 aum) x2 (54 puntos)
**Vuelta 7:** 5 pb, 1 aum, 9 pb, (5 pb, 1 aum) x3, 9 pb, (5 pb, 1 aum) x2 (60 puntos)
**Vuelta 8:** 6 pb, 1 aum, 9 pb, (6 pb, 1 aum) x3, 9 pb, (6 pb, 1 aum) x2 (66 puntos)
**Vuelta 9:** teje recto, 66 pb.
**Vueltas 10-18:** teje recto, 66 pb cada vuelta (9 vueltas).
**Vuelta 19:** 6 pb, 1 dism, 9 pb, (6 pb, 1 dism) x3, 9 pb, (6 pb, 1 dism) x2 (60 puntos)
**Vuelta 20:** 5 pb, 1 dism, 9 pb, (5 pb, 1 dism) x3, 9 pb, (5 pb, 1 dism) x2 (54 puntos)

Coloca los ojos de seguridad entre las vueltas 13 y 14, con 12 puntos de separación entre ellos.

**Vuelta 21:** 4 pb, 1 dism, 9 pb, (4 pb, 1 dism) x3, 9 pb, (4 pb, 1 dism) x2 (48 puntos)
**Vuelta 22:** 3 pb, 1 dism, 9 pb, (3 pb, 1 dism) x3, 9 pb, (3 pb, 1 dism) x2 (42 puntos)

Empieza a rellenar poco a poco a partir de aquí, mientras sigues tejiendo.

**Vuelta 23:** teje recto, 42 pb.
**Vuelta 24:** (5 pb, 1 dism) x6 (36 puntos)
**Vuelta 25:** (4 pb, 1 dism) x6 (30 puntos)
**Vuelta 26:** (3 pb, 1 dism) x6 (24 puntos)
**Vuelta 27:** (2 pb, 1 dism) x6 (18 puntos)
**Vuelta 28:** (1 pb, 1 dism) x6 (12 puntos)

Remata dejando hebra larga. Pasa la hebra de forma envolvente por los 12 puntos que quedan y tira para cerrar el hueco.

### Orejas (x2, anillo mágico)

**Vuelta 1:** 7 pb en am (7 puntos)
**Vuelta 2:** 7 aum (14 puntos)
**Vuelta 3:** (1 pb, 1 aum) x7 (21 puntos)
**Vuelta 4:** (2 pb, 1 aum) x7 (28 puntos)
**Vuelta 5:** (3 pb, 1 aum) x7 (35 puntos)
**Vuelta 6:** (4 pb, 1 aum) x7 (42 puntos)
**Vuelta 7:** (5 pb, 1 aum) x7 (49 puntos)
**Vueltas 8-13:** teje recto, 49 pb cada vuelta (6 vueltas).
**Vuelta 14:** (5 pb, 1 dism) x7 (42 puntos)
**Vuelta 15:** (4 pb, 1 dism) x7 (35 puntos)
**Vuelta 16:** (3 pb, 1 dism) x7 (28 puntos)
**Vuelta 17:** dobla la pieza por la mitad y ciérrala en plano con 14 pb.

Relleno opcional (mínimo o ninguno). Cose las orejas a la cabeza a la altura de la vuelta 6, contando desde la coronilla hacia abajo.

### Brazos (x2, anillo mágico)

**Vuelta 1:** 6 pb en am (6 puntos)
**Vuelta 2:** 6 aum (12 puntos)
**Vuelta 3:** (1 pb, 1 aum) x6 (18 puntos)
**Vueltas 4-5:** teje recto, 18 pb cada vuelta.
**Vuelta 6:** (1 pb, 1 dism) x6 (12 puntos)
**Vueltas 7-12:** teje recto, 12 pb cada vuelta.

Cierra en plano con punto bajo y cose los brazos al cuerpo.

### Nariz (tejida en hileras, ida y vuelta)

**Fila 1:** 8 cad, 7 pb sobre las cadenas (7 puntos)
**Filas 2-4:** 1 cad de subida, 7 pb.

Bordea las 4 caras del rectángulo resultante con punto bajo y añade 1-2 vueltas más de punto bajo alrededor para dar grosor. Rellena ligeramente y cose a la cabeza, centrada entre los ojos.

### Overol (opcional, punto alto)

Teje una cadena base que rodee la cintura del koala y únela en redondo con punto raso. Trabaja 3 vueltas de punto alto (2 cadenetas de subida en cada vuelta). Divide el trabajo por la mitad para separar las dos perneras y teje cada una por separado, 3 vueltas más de punto alto. Para los tirantes, une el hilo en la parte trasera central y teje una cadeneta larga; vuelve sobre ella en medio punto alto y cose cada tirante a la parte delantera.

## Acabado

1. Cose la cabeza a la parte superior del cuerpo.
2. Cose las orejas a la altura de la vuelta 6 de la cabeza.
3. Cose los brazos a ambos lados del cuerpo.
4. Cose la nariz centrada entre los ojos.
5. Borda cejas y boca con hilo fino oscuro; añade una línea clara bajo los ojos y unos flecos en la coronilla para simular el pelo.

## Consejos

- Verifica que las dos patas tengan exactamente el mismo conteo antes de fusionarlas en la vuelta 11 — cualquier diferencia se arrastra al resto del cuerpo.
- Rellena las patas antes de la fusión: después de unirlas es mucho más difícil acceder a su interior.`,
  },
]

function elegirReferencia(descripcion, materiales) {
  if (PATRONES_REFERENCIA.length === 0) return null
  const texto = `${descripcion} ${materiales}`.toLowerCase()
  return PATRONES_REFERENCIA.find((p) =>
    p.categoria.split('-').some((palabra) => texto.includes(palabra))
  ) || null
}

export const bloqueReferencia = (descripcion, materiales, idioma) => {
  const ref = elegirReferencia(descripcion, materiales)
  if (!ref) return ''
  return idioma === 'en'
    ? `\nVERIFIED REFERENCE PATTERN — "${ref.titulo}" (use it to calibrate format, stitch-count rigor and construction logic; do not copy it, adapt the logic to the new project):\n\n${ref.texto}\n`
    : `\nPATRÓN DE REFERENCIA VERIFICADO — "${ref.titulo}" (úsalo para calibrar formato, rigor en el conteo y lógica de construcción; no lo copies, adapta la lógica al nuevo proyecto):\n\n${ref.texto}\n`
}

export const reglasConstruccion = (idioma) => idioma === 'en' ? `
CONSTRUCTION RULES (apply before writing a single round):

1. Before generating instructions, decide and state the CONSTRUCTION METHOD of the whole piece:
   - A single continuous spiral (no join, no turning chain)? Typical of amigurumi, round/cylindrical bags, hats.
   - Closed rounds (with a joining slip stitch and starting chain)? Typical of flat motifs, mandalas, granny squares.
   - Several separate pieces sewn/joined together (panels, sides, base)? Typical of rectangular bags, garments with sleeves, dolls with separate limbs.
   Do NOT default to splitting the piece into "faces" or "panels": only split into pieces if the actual shape of the object requires it (a rectangular bag needs front+back+base, but a cylindrical or oval bag is normally worked as a single continuous spiral from base to opening).

2. If a reference photo is attached, remember it only shows one visible side of the object — do not assume the object has fewer or more pieces than what's visible in that single frame. Reason about the COMPLETE 3D piece (what's behind, on the sides, at the base) using the typical construction for that kind of object, not only what is literally visible in the frame. If more than one reference photo is attached, they show different angles/details of the SAME object — combine all of them to infer the complete 3D shape instead of reasoning from a single frame.

3. Stitch-count verification (do this mentally before answering, don't show the scratch work unless useful):
   - Flat spiral circle: round 1 = 6 sc in a magic ring; each following round adds 6 stitches (round 2 = 12, round 3 = 18, round 4 = 24...) until the target diameter, then straight rounds with no increases.
   - Amigurumi sphere: symmetric increases up to the equator (same as the flat circle), then mirrored symmetric decreases to close.
   - Spiral oval: round 1 = base chain + increases at both ends (a fixed pattern, not arbitrary).
   - Every round must state the total stitch count at the end in parentheses, and that number must be mathematically consistent with the increases/decreases described in that same round.
   - If you find a count doesn't add up while reviewing, fix it before answering — never deliver a pattern with inconsistent counts.

4. Use standard English crochet terms and abbreviations (sc, dc, sl st, inc, dec, ch, magic ring) consistently throughout the pattern.

5. Writing style for the instructions: don't just list bare "Round N: [stitches]" lines. Whenever there's a relevant structural change (starting the handles, starting the closing decreases, switching color or stitch, moving from increases to straight rounds), add a short one-sentence explanation of what's happening and why, the way a well-written published pattern does (e.g. "Round 20. The base increases end here — from now on work straight rounds to build the height of the bag's body"). Rounds that repeat identically can be grouped in one line instead of listed one by one (e.g. "Rounds 21–40: work straight, no increases, 60 sts each round").

6. If the yarn weight, hook size or final size isn't specified, choose reasonable values for that type of project and state them explicitly on one line at the start of "## Materials" (e.g. "Assuming medium-weight yarn (~4mm) and a 4mm hook since none was specified — adjust the stitch count if your gauge differs"). Don't add this line if the requester already gave that information.` : `
REGLAS DE CONSTRUCCIÓN (aplícalas siempre, antes de escribir ninguna vuelta):

1. Antes de generar las instrucciones, decide y declara el MÉTODO DE CONSTRUCCIÓN de la pieza completa:
   - ¿Una sola pieza continua en espiral (sin cerrar vuelta, sin cadeneta de subida)? Típico en amigurumis, bolsos redondos/cilíndricos, gorros.
   - ¿Vueltas cerradas (con punto de unión y cadeneta de subida)? Típico en motivos planos, mandalas, granny squares.
   - ¿Varias piezas tejidas por separado y luego cosidas/unidas (paneles, laterales, base)? Típico en bolsos rectangulares, prendas con mangas, muñecos con partes separadas.
   NO asumas por defecto que hay "caras" o "paneles" separados: solo divide en piezas si la forma real del objeto lo requiere (un bolso rectangular necesita frente+espalda+base, pero un bolso cilíndrico u ovalado normalmente se teje en una sola espiral continua de la base a la boca).

2. Si se adjunta una foto de referencia, ten en cuenta que la foto solo muestra una cara visible del objeto — no asumas que tiene menos o más piezas de las que se ven en ese encuadre. Razona sobre la PIEZA COMPLETA en 3D (qué hay detrás, en los laterales, en la base) usando la construcción típica de ese tipo de objeto, no solo lo que se ve literalmente en la imagen. Si se adjunta más de una foto de referencia, todas muestran ángulos/detalles distintos del MISMO objeto — combínalas para inferir la forma completa en 3D en vez de razonar desde un único encuadre.

3. Verificación de conteo de puntos (hazlo mentalmente antes de responder, sin mostrar el cálculo salvo que aporte):
   - Círculo plano en espiral: vuelta 1 = 6 pb en anillo mágico; cada vuelta siguiente suma 6 puntos (vuelta 2 = 12, vuelta 3 = 18, vuelta 4 = 24...) hasta el diámetro deseado, luego vueltas rectas sin aumentar.
   - Esfera amigurumi: aumentos simétricos hasta el ecuador (igual que el círculo plano) y luego disminuciones simétricas en espejo para cerrar.
   - Óvalo en espiral: vuelta 1 = cadena base + aumentos en ambos extremos (patrón fijo, no arbitrario).
   - Cada vuelta debe indicar el total de puntos al final entre paréntesis, y ese número debe ser matemáticamente coherente con los aumentos/disminuciones descritos en esa misma vuelta.
   - Si al revisar detectas que un conteo no cuadra, corrígelo antes de responder — nunca entregues un patrón con conteos inconsistentes.

4. Usa terminología y abreviaturas estándar de crochet en español (pb, pa, pv, aum, dism, cad, anillo mágico) de forma consistente en todo el patrón.

5. Estilo de redacción de las instrucciones: no te limites a listar "Vuelta N: [puntos]" en seco. Cuando haya un cambio estructural relevante (empezar las asas, empezar las disminuciones de cierre, cambiar de color o de punto, pasar de aumentar a tejer recto), añade una frase breve explicando qué pasa y por qué, como hace un patrón profesional bien escrito (ej: "Vuelta 20. Aquí terminan los aumentos de la base — a partir de ahora se teje recto para dar altura al cuerpo del bolso"). Las vueltas que se repiten igual pueden agruparse en una sola línea en vez de listarlas una a una (ej: "Vueltas 21 a 40: teje recto sin aumentar, 60 puntos por vuelta").

6. Si no se especifica el grosor de hilo, el tamaño de gancho o la medida final, elige valores razonables para ese tipo de proyecto y decláralos explícitamente en una línea al principio de "## Materiales" (ej. "Se asume hilo de peso medio (~4 mm) y gancho de 4 mm porque no se especificó — ajusta el conteo si tu calibre difiere"). No añadas esta línea si la usuaria ya dio esos datos.
`

// Técnica avanzada troceada en secciones etiquetadas por categoría, para no mandar
// siempre el bloque completo a Claude (ver bloqueTecnicas más abajo). `siempre: true`
// = sección corta/general que aplica casi a cualquier proyecto; el resto solo se
// incluye si la descripción/materiales contienen alguna de sus palabras clave.
const SECCIONES_TECNICA = [
  {
    id: 'A',
    categorias: ['rigid', 'bols', 'mochil', 'maleta', 'caja', 'esfera', 'ovalo', 'óvalo', 'panel', 'cesta'],
    en: `A. Deciding the construction of a complex 3D object:
   - RIGIDITY criterion: if the object must hold a rigid shape (boxes, cases, hard bases), use separate flat panels worked back-and-forth (not spiral), designed to hold an internal stiffener (cardboard, interfacing), then sewn together. If the object is soft/flexible (amigurumi, soft-bodied bags), prefer the continuous spiral instead.
   - SIZE/POSITION criterion: large, central parts of a figure (torso+neck+head, or legs that merge into the body) tend to be worked as a single continuous piece to avoid structural seams; small, peripheral parts (ears, horns, tail, fins, hanging arms) are almost always worked separately and sewn on at the end.
   - TUBE alternative for cylindrical bags/backpacks: instead of a circular base with increases and then a straight-walled body, it's equally valid to work a tube of CONSTANT circumference (no increase rounds at all) from start to finish, and resolve the final volume in the finishing step: flat-seaming the bottom shut, folding and sewing the corners inward, or sewing on a ready-made base (cardboard, rattan, leather). Handles on this kind of bag are usually not crocheted at all — they're ribbon or leather straps sewn on afterward, not a chain loop left in a round.
   - For large spheres or color-segment effects: instead of a single spiral of increases, it's valid to work several identical curved panels back-and-forth, sew them side by side, and close each pole with a separate circular cap (concentric increases) sewn on at the end.
   - For ovals/elongated shapes: an alternative to one continuous increase-plateau-decrease progression is sewing together two caps of different sizes (a small "top" and a large "bottom", each worked and finished separately).
   - Compound silhouette: a single spiral piece can chain together several sections of increases, straight rounds, and decreases (e.g. head → narrower neck → wider chest) without closing or switching pieces — don't assume every change in width needs a new piece.`,
    es: `A. Cómo decidir la construcción de un objeto 3D complejo:
   - Criterio de RIGIDEZ: si el objeto necesita mantener una forma rígida sin doblarse (maletas, cajas, bases duras), usa piezas planas independientes tejidas en ida y vuelta (no en espiral), pensadas para llevar un refuerzo interno (cartón, entretela), y cóselas entre sí. Si el objeto es flexible/blando (amigurumis, bolsos de tela suave), prioriza la espiral continua.
   - Criterio TAMAÑO/POSICIÓN: las partes grandes y centrales de una figura (torso+cabeza+cuello, o piernas que se integran en el cuerpo) tienden a tejerse como una única pieza continua para evitar costuras estructurales; las partes pequeñas y periféricas (orejas, cuernos, cola, aletas, brazos colgantes) casi siempre se tejen aparte y se cosen al final.
   - Alternativa de TUBO para bolsos/mochilas cilíndricos: en vez de tejer una base circular con aumentos y luego subir la pared, es igual de válido tejer un tubo de circunferencia CONSTANTE (sin ninguna vuelta de aumento) de principio a fin, y resolver el volumen final en el acabado: cerrando el fondo con costura plana, doblando y cosiendo las esquinas hacia dentro, o cosiendo una base ya hecha (cartón, rafia, cuero). Las asas en bolsos de este tipo casi nunca se tejen: suelen ser cintas o correas cosidas después, no cadenetas al aire dejadas en una vuelta.
   - Para esferas grandes o efectos de gajos de color: en vez de una sola espiral de aumentos, es válido tejer varios paneles curvos idénticos en ida y vuelta, coserlos lado a lado, y cerrar cada polo con un casquete circular aparte (aumentos concéntricos) cosido al final.
   - Para óvalos/formas alargadas: una alternativa a una única progresión de aumento-meseta-disminución es coser dos casquetes de tamaño distinto (una "tapa" pequeña y una "base" grande, cada una tejida y rematada por separado).
   - Silueta compuesta: una misma pieza en espiral puede combinar varios tramos de aumento, tramos rectos y tramos de disminución encadenados (ej. cabeza → cuello más estrecho → torso más ancho) sin cerrar ni cambiar de pieza — no asumas que cada cambio de anchura necesita una pieza nueva.`,
  },
  {
    id: 'B',
    siempre: true,
    en: `B. Finishing and closing:
   - Never dictate decreases below roughly 6-8 total stitches — it isn't practically workable. To close the final hole, run the yarn through the outer loop of the remaining stitches and pull tight (a "drawstring" close) instead of continuing to decrease.
   - Invisible decrease (picking up only the front loop of the two stitches before joining them) gives a cleaner finish than a regular decrease.
   - Working 1-2 rounds through the back loop only creates a "hinge" or crease: use it to transition from a flat base to a vertical wall (baskets, bags) or to fake a joint (elbow, knee) without a seam.
   - To fuse two tube-shaped pieces into one (e.g. two legs becoming a body): work each tube separately, then on the round where both end, join them with a stitch connecting the last stitch of one to the first of the other, and continue the next round as a single larger circle — this avoids sewing legs to the body separately.`,
    es: `B. Remate y cierre:
   - Nunca dictes disminuciones por debajo de ~6-8 puntos totales: no es tejible en la práctica. Para cerrar el hueco final, pasa la hebra por el lazo exterior de los puntos restantes y tira (cierre "de bolsita"), en vez de seguir disminuyendo.
   - La disminución invisible (tomar solo la hebra delantera de los dos puntos antes de juntarlos) da un remate más limpio que la disminución normal.
   - Tejer 1-2 vueltas tomando solo la hebra trasera crea una "bisagra" o pliegue marcado: úsalo para pasar de una base plana a una pared vertical (cestas, bolsos) o para simular una articulación (codo, rodilla) sin costura.
   - Para fusionar dos piezas tubulares en una sola (ej. dos piernas que se convierten en un cuerpo): teje cada tubo por separado y, en la vuelta donde ambas terminan, únelas con un punto que conecte el último punto de una con el primero de la otra, continuando la vuelta siguiente como un solo círculo más grande — evita coser piernas al cuerpo por separado.`,
  },
  {
    id: 'C',
    categorias: ['granny', 'motivo', 'mandala', 'flor african', 'hexagon', 'hexágon', 'pentagon', 'pentágon', 'cuadrado', 'manta'],
    en: `C. Joined motifs (granny squares, African flower, and similar):
   - The starting chain for a closed round depends on the next stitch: 1 for slip stitch, 2 for single crochet, 3 for half-double or double crochet, 4 for treble. That chain counts as the round's first stitch, and the round closes with a slip stitch into its top.
   - To join motifs: "join-as-you-go" (replacing chain stitches from the stitch diagram with single crochets worked into the neighboring piece's space during the last round) or joining after all pieces are finished (sewing, or slip-stitch/single-crochet seams).
   - Clean color change: work the last stitch of the old color leaving the final yarn-over in the new color (the join hides inside the stitch). For strong contrasts, cut and weave in color-matched tails.
   - Curvature rule for rounded surfaces made of motifs: motifs with fewer sides/petals (pentagons) must always be surrounded by motifs with more sides (hexagons), never two "pentagons" adjacent — same principle as a soccer ball. This is NOT a reason to split a continuous-spiral amigurumi into panels; it only applies to deliberately paneled/motif-joined constructions.`,
    es: `C. Motivos unidos (granny square, flor africana, y similares):
   - La cadeneta de subida al empezar cada vuelta cerrada depende del punto siguiente: 1 para punto raso, 2 para punto bajo, 3 para punto medio alto o punto alto, 4 para punto alto doble. Esa cadeneta cuenta como el primer punto de la vuelta, y la vuelta se cierra con un punto raso en su parte alta.
   - Para unir motivos: "sobre la marcha" (join-as-you-go, sustituyendo cadenetas del diagrama por puntos bajos tejidos en el espacio de la pieza vecina durante la última vuelta) o después de terminar todas las piezas (cosido o unión con punto raso/bajo).
   - Cambio de color limpio: teje el último punto del color viejo dejando el remate final con el color nuevo (el empalme queda oculto dentro del punto). Para contrastes fuertes, corta y remata color con color.
   - Regla de curvatura para superficies redondeadas hechas de motivos: los motivos con menos lados/pétalos (pentágonos) deben quedar siempre rodeados de motivos con más lados (hexágonos), nunca dos "pentágonos" adyacentes — mismo principio que un balón de fútbol. Esto NO es una razón para dividir en piezas un amigurumi que se teje en espiral continua; aplica solo a construcciones deliberadas por motivos unidos.`,
  },
  {
    id: 'D',
    siempre: true,
    en: `D. Extended terminology (tolerate these synonyms if the user uses them):
   - UK/US equivalence (one position apart): US "sc" = UK "dc"; US "hdc" = UK "htr"; US "dc" = UK "tr"; US "tr" = UK "dtr".
   - Pattern notation: asterisks (*...*) mark a section to repeat; parentheses (...) group a repeat count or the total stitch count at the end of a round; brackets [...] nest information inside a parenthesis.`,
    es: `D. Terminología ampliada (tolera estos sinónimos si el usuario los usa):
   - Punto bajo = "medio punto" (LatAm) = "m.p."; punto alto = "vareta" = "v."; punto raso = "punto enano" = "p. enano".
   - Equivalencia UK/US (desfase de una posición): el "sc" americano = "dc" británico; "hdc" US = "htr" UK; "dc" US = "tr" UK; "tr" US = "dtr" UK.
   - Notación de patrones: los asteriscos (*...*) marcan un tramo a repetir; los paréntesis (...) agrupan una repetición o el conteo total de puntos al final de la vuelta; los corchetes [...] anidan información dentro de un paréntesis.`,
  },
  {
    id: 'E',
    siempre: true,
    en: `E. Assembly and planning:
   - Insert safety eyes BEFORE fully stuffing the head (once closed and stuffed, the backing can no longer be attached).
   - Stuff progressively while closing the piece, not all at the end — it's much harder to push stuffing through an already-closed small gap.
   - Give the position of details (eyes, spots, accessories) as round-and-stitch-count references ("between round 9 and 10, count 9 stitches from the first eye"), never as vague visual descriptions like "in the center of the face".
   - In projects with many pieces, name them by function+location+quantity (e.g. "Ears (×2)", "Side panel (×2)") — it works as a materials checklist for whoever is crocheting.`,
    es: `E. Ensamblaje y planificación:
   - Coloca los ojos de seguridad ANTES de rellenar del todo la cabeza (una vez cerrada y rellena es imposible fijar el respaldo).
   - Rellena progresivamente mientras vas cerrando la pieza, no todo al final — es más difícil meter relleno por un hueco pequeño ya cerrado.
   - Da las posiciones de detalles (ojos, manchas, accesorios) como referencias de vuelta y conteo de puntos ("entre la vuelta 9 y 10, cuenta 9 puntos desde el primer ojo"), nunca como descripciones vagas tipo "en el centro de la cara".
   - En proyectos con muchas piezas, nómbralas por función+ubicación+cantidad (ej. "Orejas (×2)", "Panel lateral (×2)") — funciona como lista de materiales/checklist para quien teje.`,
  },
  {
    id: 'F',
    categorias: ['recicl', 'trapillo', 'bols', 'mochil', 'cremallera', 'zipper', 'furoshiki', 'chaleco', 'vest'],
    en: `F. Recycling techniques and bag finishing:
   - Tapestry vs. intarsia colorwork is a design decision, not just a technique choice: in tapestry, every color is carried hidden inside every stitch throughout the round (thicker fabric, uniform repeating pattern); in intarsia, each color thread is picked up only where the motif needs it and left hanging on the wrong side until its next use, cut and woven in per color block — use intarsia for large isolated color blocks or to keep a multicolor surface lighter, tapestry for patterns repeated across the whole surface.
   - Two slip-stitch seam types give different structural results: an "overlapped" seam (pieces stacked on top of each other, stitched through both layers) gives a thick, strong join, ideal for structural bag panels; a "flat" seam (pieces placed edge to edge, alternating one stitch into each piece's edge) leaves a decorative braid visible on the right side and suits visible seams that need to lie flat (garment panels, blanket squares).
   - A separate strip to house a zipper: instead of sewing a zipper directly to the main pieces' edge, crochet two narrow rectangular strips, sew the zipper between them first, then join those already-closed strips to the front/back panels with an overlapped slip-stitch seam — isolates the zipper-sewing step and keeps that seam hidden from the panel's right side.
   - Hardware crocheted directly into the stitches: D-rings, wide metal rings or other reinforcements are hooked directly inside a group of stitches (work several stitches catching both the yarn and the ring together) so the hardware is structurally anchored in the fabric instead of sewn on afterward — used both to anchor straps on a flat panel and to crochet a large ring into the last increase round of a circle, giving rigidity and shape to a round side panel (e.g. saddle bags).
   - Boxed corners: to give volume to a bag worked as a flat piece, after sewing the side seams, fold each bottom corner into a triangle and sew it flat at a fixed distance from the tip — turns a flat rectangular bag into one with a base and depth without a separate gusset panel.
   - A drawstring channel from a folded edge trim: crochet an extra plain trim at the opening and fold it over on itself (double layer), sewing the fold closed with slip stitch while leaving the short ends open — creates a closed tunnel for a cord, instead of opening eyelets in the main fabric.
   - "Furoshiki" flat-to-volume conversion without gusset seams: a single flat rectangular piece becomes a 3D bag not through seams or boxed corners, but by crocheting a channel at each short edge and threading a metal ring or cord through it; pulling the ring tight gathers the flat edge into the bag's opening/closure.
   - A reinforcing round worked in reverse: turning the piece so the right side faces in and working one extra round in the opposite direction to the rest of the piece (followed by a slip-stitch round) produces a firmer, less stretchy edge — an alternative to simply switching to a smaller hook when an edge or brim comes out too loose.
   - A vest built from flat pieces without a raglan sleeve: work the body as a single wide piece back-and-forth from the hem to the armholes, then split it into three sections (left front, back, right front) worked in parallel with matched decreases at each armhole and again at each shoulder, finally closing the shoulders with slip stitch — a flat, seam-based alternative to a raglan armhole shaped with continuous increases/decreases.
   - An "adjustment round" for resizing a circular spiral piece: instead of recalculating the whole increase sequence to change size, identify one specific increase round as the "adjustment point" and add or remove stitches only there, also adding or subtracting 1-2 plain rounds before finishing — lets you resize without touching the rest of the pattern.`,
    es: `F. Técnicas de reciclaje y acabado de bolsos:
   - Tapestry vs. intarsia como decisión de diseño, no solo de ejecución: en tapestry, todos los hilos se transportan ocultos dentro de cada punto durante toda la labor (tejido más grueso, patrón repetitivo uniforme); en intarsia, cada hilo de color se recoge solo cuando el motivo lo necesita y se deja colgando por el revés hasta su próximo uso, cortándose y rematándose por bloque de color — usa intarsia para bloques de color grandes y aislados o para aligerar una superficie multicolor, tapestry para patrones repetidos en toda la superficie.
   - Dos tipos de costura con punto raso dan resultados estructurales distintos: la costura "superpuesta" (piezas montadas una sobre otra, cosidas atravesando ambas capas) da una unión gruesa y resistente, ideal para paneles estructurales de bolsos; la costura "plana" (piezas una junto a otra, alternando un punto en el borde de cada una) deja una trenza decorativa vista por el anverso y es mejor para uniones visibles que deben quedar lisas (paneles de prendas, cuadrados de mantas).
   - Panel independiente para alojar la cremallera: en vez de coser la cremallera directamente al borde de las piezas principales, teje dos tiras rectangulares estrechas, cose la cremallera entre ambas primero, y luego une esas tiras ya cerradas a los paneles delantero/trasero con costura superpuesta de punto raso — aísla el cosido de la cremallera del resto de la labor y mantiene esa costura oculta desde el anverso del panel.
   - Herrajes tejidos dentro del propio punto: aros en D, aros metálicos anchos u otros refuerzos se enganchan directamente dentro de un grupo de puntos (se teje varios puntos recogiendo a la vez el hilo y el aro) para que el herraje quede anclado estructuralmente en la labor en vez de coserse después; se usa tanto para anclar correas en un panel plano como para tejer un aro grande dentro de la última vuelta de aumentos de un círculo, dando rigidez y forma a un panel lateral redondo (p. ej. alforjas).
   - Esquinas en caja ("boxing"): para dar volumen a un bolso tejido como pieza plana, tras coser los laterales se dobla cada esquina inferior formando un triángulo y se cose plana a una distancia fija de la punta — convierte un bolso rectangular plano en uno con base y profundidad sin necesitar un panel lateral (fuelle) aparte.
   - Jareta por doblez de un ribete tejido: teje un ribete liso adicional en la boca de la labor y dóblalo sobre sí mismo (doble capa) cosiendo el pliegue con punto raso, dejando los extremos cortos abiertos — crea un túnel cerrado para pasar un cordón, en vez de abrir ojales en el tejido principal.
   - Bolso "furoshiki" de plano a volumen sin costuras de fuelle: una única pieza rectangular plana se convierte en un bolso tridimensional no mediante costuras ni esquinas en caja, sino tejiendo un canal/jareta en cada borde corto y pasando por él un aro metálico o un cordón; al tensar el aro, el borde plano se frunce y forma la boca/cierre del bolso.
   - Vuelta de refuerzo tejida en sentido inverso: da la vuelta a la pieza para que el anverso quede hacia dentro y teje una vuelta extra en la dirección contraria a la del resto de la labor (seguida de una vuelta de punto raso) para un borde más firme y menos elástico — alternativa a simplemente cambiar a un ganchillo más pequeño cuando un borde o visera queda demasiado suelto.
   - Chaleco construido en piezas planas sin manga raglán: teje el cuerpo como una sola pieza ancha en ida y vuelta desde el bajo hasta las sisas, y a partir de ahí divídelo en tres secciones (delantera izquierda, espalda, delantera derecha) tejidas en paralelo con disminuciones emparejadas en cada sisa y de nuevo en cada hombro, cerrando finalmente los hombros con punto raso — una alternativa plana y basada en costuras a la sisa moldeada con aumentos/disminuciones continuos.
   - Punto de "talla ajustable" en una pieza circular en espiral: en vez de recalcular toda la secuencia de aumentos para cambiar el tamaño, identifica una vuelta concreta de aumento como "punto de ajuste" y añade o quita puntos solo ahí, sumando o restando además 1-2 vueltas lisas antes de rematar — permite ajustar el tamaño sin tocar el resto del patrón.`,
  },
  {
    id: 'G',
    categorias: ['amigurumi', 'muñeco', 'muneco', 'animal', 'peluche', 'doll'],
    en: `G. Amigurumi finishing and detail techniques:
   - Sewn-on fur/fringe as a surface technique: for manes, furry tails or fur textures, cut fixed-length strands and knot one strand into each stitch of the area to be covered with the hook, leaving a fur-free margin of rounds around the face/eyes and on the round that will be sewn to the body; trim with scissors to even the strands at the end. Distinct from stuffing or embroidery.
   - Surface embroidery for thin, repeated markings (stripes, eyebrows, whiskers, X-shaped dots): instead of knitting them in with color changes, embroider them afterward with a separate strand and yarn needle, giving the position as round + stitch count. Reserve worked-in color changes for large, solid areas (legs, snout, wide sweater stripes).
   - A bow/bowtie from a pinched tube: crochet a small flat tube (base chain joined in the round, a few rounds) and cinch it at the center by wrapping a separate strand around it and knotting it, so it gathers into a bow shape before sewing it on — instead of crocheting a bow shape directly.
   - Growing a new shape from a mid-piece round of another part: to add a dome, crest or shell on top of an already-worked piece without sewing on a separate piece, insert the hook only into the front loop of one specific round (not the last one) and work the new rounds directly from those picked-up stitches upward — the new shape "grows" from the base instead of being sewn on top.
   - Extra anchor points beyond the main seam: a second anchor point separate from the base seam changes the result — also sewing the top/back of a head keeps it from wobbling or spinning on its base; also sewing the tip of an ear (not just its base) makes it fold/droop instead of standing rigid.
   - A curled tail or strip from stitch overcrowding: chain a short base and work far more stitches into it than would normally fit flat; with no room to lie flat, the strip curls into a spiral — used for pig tails or decorative curls, with no special stitch involved.
   - Garments integrated as color blocks instead of sewn-on pieces: a sweater, pants or overalls can be achieved by changing color at specific rounds of the body/leg tube itself (wherever the collar, cuff or waistband should fall), instead of crocheting a separate garment. Decide in advance which round starts and ends each color so the edge lands at the right height and symmetry.
   - A chain bridge when fusing two tubes into one: when joining two tube-shaped pieces (legs) into a continuous body, instead of connecting the last stitch of one directly to the first stitch of the other, work a short chain (2-4 stitches) between them before working the round that encircles both tubes plus that chain. Gives ease at the crotch/underarm and avoids a tight gap.
   - Narrowing the waist after fusing pieces: after joining two tubes into a single body round, you can shape a waist by working a few rounds with two fixed, symmetric decrease points (e.g. center-front and center-back) before returning to straight rounds — gives the torso a silhouette instead of a uniform cylinder.
   - A ruffle from a line of picked-up stitches: to add a ruffle (skirt hem, collar, cuff) around a tube, insert the hook into the front loop of one full round and work 1-2 new rounds with a very strong increase (double or more stitches per picked-up stitch); the fabric gathers into a ruffle — more rounds and a stronger increase give more volume.
   - Glued felt patches as an alternative to knitting or embroidering markings: for large, irregular markings (animal print, spots) that are hard to crochet cleanly with intarsia or hand-embroider, cut the shapes from felt and glue them onto the finished piece with a hot glue gun (or sew them on if it needs to withstand washing) — faster and cleaner on large non-structural surface areas.`,
    es: `G. Acabados y detalles de amigurumi:
   - Pelo/pelusa cosida como técnica de superficie: para melenas, colas peludas o texturas de pelo, corta hebras de longitud fija y anuda una hebra en cada punto de la zona a cubrir con el ganchillo, dejando sin pelo un margen de vueltas alrededor de la cara/ojos y en la vuelta que se coserá al cuerpo; recorta con tijeras para igualar las hebras al terminar. Distinta del relleno o del bordado.
   - Bordado de superficie para marcas finas y repetidas (rayas, cejas, bigotes, puntitos en forma de aspa): en vez de tejerlas con cambios de color, bórdalas después con una hebra aparte y aguja lanera, dando la posición como vuelta+conteo de puntos. Reserva el cambio de color integrado (tejido) para zonas grandes y sólidas (patas, hocico, rayas anchas de un jersey).
   - Lazo/pajarita a partir de un tubo pellizcado: teje un pequeño tubo plano (cadena base unida en redondo, unas pocas vueltas) y cíñelo por el centro envolviendo una hebra aparte y anudándola, para que se frunza en forma de pajarita antes de coserlo — en vez de tejer directamente una forma de lazo.
   - Hacer crecer una forma nueva desde una vuelta intermedia de otra pieza: para añadir una cúpula, cresta o caparazón sobre una pieza ya tejida sin coser una pieza aparte, introduce el ganchillo solo en la hebra delantera de una vuelta concreta (no la última) y teje las vueltas nuevas directamente desde esos puntos recogidos hacia arriba — la nueva forma "brota" de la base en vez de coserse encima.
   - Puntos de anclaje extra más allá de la costura principal: un segundo punto de anclaje separado de la costura de base cambia el resultado — coser también la zona alta/nuca de una cabeza evita que "baile" o gire sobre su base; coser también la punta de una oreja (no solo su base) hace que caiga/doble en vez de quedar rígida.
   - Cola o tira rizada por exceso de puntos: monta una cadena corta y teje muchos más puntos de los que "caben" con normalidad en ella; al no tener sitio para quedar plana, la tira se riza en espiral — sirve para colas de cerdito o rizos decorativos, sin ningún punto especial.
   - Prendas integradas por bloques de color en vez de piezas cosidas: un jersey, pantalón o peto puede lograrse cambiando de color en vueltas concretas del propio tubo del cuerpo/piernas (donde debería caer el cuello, el puño o la cinturilla), en vez de tejer una prenda aparte. Decide de antemano en qué vuelta empieza y termina cada color para que el borde quede a la altura y simetría correctas.
   - Puente de cadeneta al fusionar dos tubos en uno: al unir dos piezas tubulares (piernas) en un cuerpo continuo, en vez de conectar el último punto de una directamente con el primero de la otra, teje una cadeneta corta (2-4 puntos) entre ambas antes de tejer la vuelta que rodea los dos tubos + esa cadeneta. Da holgura a la entrepierna/axila y evita un hueco tirante.
   - Estrechar la cintura tras fusionar piezas: después de unir dos tubos en una sola vuelta de cuerpo, se puede dar forma de cintura tejiendo unas vueltas con dos puntos de disminución simétricos fijos (p. ej. centro-delantero y centro-trasero) antes de pasar a tejer recto — da un torso con silueta en vez de un cilindro uniforme.
   - Volante o frunce a partir de una línea de puntos recogidos: para añadir un volante (bajo de falda, cuello, puño) alrededor de un tubo, introduce el ganchillo en la hebra delantera de una vuelta completa y teje 1-2 vueltas nuevas con un aumento muy fuerte (duplicar o más puntos por cada punto recogido); la tela se frunce en volante — cuantas más vueltas y mayor el aumento, más volumen.
   - Parches de fieltro pegados como alternativa a tejer o bordar manchas: para manchas grandes e irregulares (animal print, lunares) difíciles de tejer limpiamente a intarsia o bordar a mano, recorta las formas en fieltro y pégalas a la pieza terminada con pistola de silicona (o cóselas si necesita aguantar lavados) — más rápido y limpio en superficies grandes sin función estructural.`,
  },
  {
    id: 'H',
    categorias: ['jersey', 'sueter', 'suéter', 'sweater', 'chaleco', 'top', 'prenda', 'vest', 'garment', 'camiseta'],
    en: `H. Alternative textures and seamless construction:
   - A flat "knit-look" texture worked in rows (not in the round): to mimic two-needle knitting texture with a hook while working turned rows (not a continuous spiral), it's not enough to repeat the same stitch insertion every round — you must alternate two different insertion variants on consecutive rows (one that picks up the previous row's stitch one way, the next row the other way), because a stitch has three usable parts (front, back and top loop) and only alternating which ones are used each row keeps the knit-like texture consistent when the work is turned; using the same insertion every time only works when working in a closed round, not flat rows.
   - A leveling slip-stitch transition row: when turning the work between a texture row and the next, you can work a full row of slip stitches through the front loop with the same stitch count the following row will need — it acts as a "leveling" row that aligns the stitch count and sets up the pickup before resuming the textured stitch, instead of moving directly from one fancy-stitch row to another.
   - A seamless garment worked side-to-side: instead of crocheting front, back and side panels separately to sew together, a vest/top can be built as a single continuous strip that starts at one front's edge, works in long rows covering the front shoulder, decreases to open the armhole, continues straight across the back, increases symmetrically to close the second armhole, and finishes by working back down to the other front's neckline — the whole garment is defined by one sequence of increases/decreases along one direction of travel, with no seams joining separate pieces.
   - A raised cable appliqué integrated with an auxiliary knitting needle: to create raised cable-like texture directly on a crochet piece (instead of crocheting the cable separately and sewing it on), a double-pointed knitting needle can be used as an auxiliary tool to hold stitches on standby while continuing to work with the hook, the way two-needle cable knitting does — integrating the raised texture into the piece's own growth instead of applying it afterward.
   - A reversible double-strand panel with a stabilized edge: when working a flat panel with two strands held together (for body/warmth) and alternating back-loop-only rows to mark a rib-like texture, keep the first and last stitch of every row worked through both strands normally (not back-loop-only) — that small "normal" edge keeps the border from curling while the center develops the texture.
   - A direction-specific gauge swatch: before scaling a new fancy stitch to a garment, work a swatch in the round first (to confirm the stitch pattern is correct) and then a separate swatch worked flat/turned — a stitch that looks perfect worked in a continuous round may not reproduce identically once the work is turned, so the swatch must also validate the intended working direction for the final garment, not just the stitch itself.`,
    es: `H. Texturas alternativas y construcción sin costuras:
   - Punto "efecto tricot" tejido en plano (no en redondo): para imitar la textura de punto de dos agujas con ganchillo trabajando en vueltas giradas (no en espiral continua), no basta con repetir el mismo punto en cada vuelta — hay que alternar dos variantes de inserción distintas en vueltas consecutivas (una que toma la puntada de la vuelta anterior de una forma, y la siguiente vuelta de otra), porque una puntada tiene tres partes utilizables (cuerpo, espalda y cabeza) y solo alternando cuáles se usan en cada vuelta se mantiene la continuidad visual del entramado al girar la labor; si se usa siempre la misma inserción, el efecto "tricot" solo funciona tejiendo en redondo cerrado, no en plano.
   - Vuelta de transición en punto raso a hebra delantera: al girar la labor entre una vuelta de textura y la siguiente, se puede tejer una vuelta completa de puntos rasos por la hebra delantera con el mismo número de puntos que llevará la vuelta siguiente — sirve como vuelta "niveladora" que alinea el conteo y prepara el enganche antes de retomar el punto de textura, en vez de pasar directamente de una vuelta de fantasía a otra.
   - Prenda sin costuras laterales tejida "de lado a lado": en vez de tejer delantero, espalda y laterales como piezas separadas para coser, se puede construir un chaleco/top como una única franja continua que empieza en el borde de un delantero, avanza en vueltas largas cubriendo el hombro delantero, se disminuye para abrir la sisa, continúa recto por la espalda, se aumenta simétricamente para cerrar la segunda sisa y termina bajando hasta el escote del otro delantero — toda la prenda queda definida por una sola secuencia de aumentos/disminuciones a lo largo de una dirección de avance, sin costuras de unión entre piezas.
   - Aplique en relieve integrado con aguja auxiliar de punto: para crear texturas en relieve tipo trenza directamente sobre una pieza de ganchillo (en vez de tejer la trenza aparte y coserla después), se puede usar una aguja de doble punta (de las de "dos agujas") como herramienta auxiliar para sostener puntos en espera mientras se sigue avanzando con el ganchillo, tal y como se hace con las trenzas a dos agujas — integrando el relieve en el mismo crecimiento de la pieza en vez de como aplicación posterior.
   - Panel reversible a doble hebra con borde estabilizado: al trabajar un panel recto con dos hebras sostenidas juntas (para dar cuerpo/calidez) y alternar vueltas por la hebra trasera para marcar textura tipo canalé, mantén los primeros y últimos puntos de cada vuelta tejidos por las dos hebras (normal, no solo trasera) — ese pequeño borde "normal" evita que el canto se ondule o se curve, mientras el cuerpo central desarrolla el relieve.
   - Muestra específica de "compatibilidad de giro": antes de escalar un punto de fantasía nuevo a una prenda, teje una muestra en redondo primero (para confirmar que el entramado es correcto) y después una muestra en plano/girada por separado — un punto que se ve perfecto en redondo continuo puede no reproducirse igual al girar la labor, así que la muestra debe validar también la dirección de tejido prevista para la prenda final, no solo el punto en sí.`,
  },
  {
    id: 'I',
    categorias: ['pixel', 'píxel', 'filet', 'letra', 'texto', 'mensaje', 'logo', 'imagen'],
    en: `I. Filet/pixel crochet and material selection:
   - Pixel-grid ("filet"/mesh) crochet: to render images or text in pixels, crochet a grid of identical squares combining chain and double crochet. Each square is either "open" (dc, ch 1, skip 1, dc — leaves a mesh gap) or "filled/pixel" (work a double crochet into each of the three stitches the square spans, sharing posts with neighboring squares, instead of separate stitches). The base chain and turning chain are calculated in multiples of 3 (plus edge stitches), and the image effect comes from alternating open/filled squares per the design.
   - Proportion correction when designing a pixel pattern: filet crochet squares aren't perfect squares — each stitch comes out wider than it is tall — so a design drawn on an ordinary grid (paper or software) will come out "squashed" compared to the original drawing. Before charting the design, crochet a small swatch (about 20x20 squares) in the chosen yarn to measure that stitch's real width:height ratio, and stretch the design grid's squares by that ratio so the finished piece matches the intended proportions.
   - An invisible mid-row yarn join (distinct from a decorative color change): when a skein runs out mid-row, you can work with the new yarn while weaving its loose tail into the wrong side of the fabric for 5-10 cm before dropping the old yarn, so the join is invisible; a faster alternative: tie the two yarns with a tight square knot on the wrong side (leaving or trimming the tails) and keep working.
   - Building buttonholes and strap openings: to open a gap (for a button or strap) within a piece worked in rows, measure the needed width, replace that many stitches with a chain of the same count (skipping the equivalent stitches in the row), and on the next row close and reinforce the gap by working one single crochet into each chain stitch.
   - Seam-type selection by use: backstitch seams for low-wear seams (cushion covers); whipstitch seams for high-wear seams; for inserting zippers, sew with whipstitch through each crochet stitch (or by machine).
   - Slip stitch as a neutral edge reinforcement: used to reinforce edges and create trims without adding to the piece's size — a size-neutral edge finish, distinct from a decorative increase.
   - Yarn selection by end use: natural fibers (cotton, wool, silk, bamboo, linen, hemp) for pieces in contact with skin; thicker, sturdier yarns (rope, t-shirt yarn) for home decor; medium-weight yarn for bags and cushions; doubling the yarn (holding two strands together) for added durability.
   - Yarn twist selection: tightly spun yarn for high-wear pieces (gives clean stitch definition and holds up over time); loosely plied yarn for a softer hand, but with the risk of the hook splitting between the plies and forming small unwanted knots in the fabric — extra care is needed when working with this type of yarn.
   - Hook selection by yarn/grip: small hooks for jewelry and precision pixel patterns; plastic or metal hooks (not wood) for t-shirt yarn and bulky materials; a "pencil" grip for fine yarn (light touch) versus a "knife" grip for t-shirt yarn/heavy yarns (more force).`,
    es: `I. Crochet píxel/filet y selección de materiales:
   - Cuadrícula de crochet píxel (técnica de "punto de red"/filet): para renderizar imágenes o texto en píxeles, teje una cuadrícula de cuadrados idénticos combinando cadeneta y punto alto. Cada cuadrado es "vacío" (1 p.a., 1 cadeneta, saltar 1, 1 p.a. — deja un hueco de malla) o "relleno/píxel" (se trabaja punto alto en cada uno de los tres puntos que abarca el cuadrado, compartiendo los pilares con los cuadrados vecinos, en vez de tejer puntos sueltos). La cadeneta base y la de vuelta se calculan en múltiplos de 3 (más los puntos de borde), y el efecto de imagen se logra alternando cuadrados vacíos/rellenos según el diseño.
   - Corrección de proporción al diseñar un patrón píxel: los cuadrados de crochet píxel no son cuadrados perfectos — cada punto sale más ancho que alto — así que un diseño dibujado sobre cuadrícula normal (papel o software) saldrá tejido más "achatado" que el dibujo original. Antes de trazar el diseño, teje una muestra pequeña (unos 20x20 cuadrados) con el hilo elegido para medir la proporción ancho:alto real de ese punto, y ensancha los cuadrados de la cuadrícula de diseño en esa proporción para que el resultado tejido coincida con las proporciones pretendidas.
   - Empalme invisible de hilo a mitad de vuelta: cuando se acaba una madeja a mitad de fila, se puede tejer con el hilo nuevo llevando su cabo suelto entretejido por el revés de la labor durante 5-10 cm antes de soltar el hilo viejo, de modo que el empalme queda invisible; alternativa más rápida: anudar los dos hilos con un nudo cuadrado bien apretado en el revés (dejando o cortando los cabos) y seguir tejiendo.
   - Construcción de ojales y aberturas para asas: para abrir un hueco (botón o asa) dentro de una pieza tejida en filas, mide el ancho necesario, sustituye esos puntos por una cadeneta de ese mismo número (saltando los puntos equivalentes de la fila), y en la vuelta siguiente cierra y refuerza el hueco tejiendo un punto bajo en cada punto de esa cadeneta.
   - Criterio de selección de costura según uso: costura con pespunte para costuras de bajo desgaste (fundas de cojín); costura con punto de tallo/whipstitch para costuras sometidas a mucho desgaste; para insertar cremalleras, coser con punto de tallo pasando la aguja por cada punto de crochet (o a máquina).
   - Punto raso como refuerzo de borde: se usa para reforzar cantos y crear ribetes sin aumentar el tamaño de la pieza — un remate de borde neutro en tamaño, distinto de un aumento decorativo.
   - Criterio de selección de hilo según destino de la pieza: fibras naturales (algodón, lana, seda, bambú, lino, cáñamo) para piezas en contacto con la piel; hilos más gruesos y resistentes (cuerda, trapillo) para decoración de hogar; hilo de peso medio para bolsos y cojines; se puede doblar el hilo (dos hebras juntas) para mayor durabilidad.
   - Criterio de torsión del hilo: hilo firmemente hilado para piezas de mucho desgaste (da líneas de punto limpias y no se deteriora); hilo de hebras más sueltas para un tacto más suave, pero con el riesgo de que el ganchillo se cuele entre las hebras y forme pequeños nudos no deseados en la labor — hay que tener más cuidado al tejer con ese tipo de hilo.
   - Selección de ganchillo según hilo/postura: ganchillos pequeños para joyería y patrones píxel de precisión; ganchillos de plástico o metal (no madera) para trapillo y materiales gruesos; posición de "lápiz" en la sujeción del ganchillo para hilo fino (toque ligero) frente a posición de "cuchillo" para trapillo/hilos pesados (más fuerza).`,
  },
]

// Elige solo las secciones de tecnicasAvanzadas relevantes para este proyecto en
// concreto (por palabras clave en descripcion/materiales), en vez de mandar las 9
// secciones completas en cada request — menos ruido para el modelo y menos coste.
export function bloqueTecnicas(descripcion, materiales, idioma) {
  const texto = `${descripcion} ${materiales}`.toLowerCase()
  const siempre = SECCIONES_TECNICA.filter((s) => s.siempre)
  const especificas = SECCIONES_TECNICA.filter(
    (s) => !s.siempre && s.categorias.some((palabra) => texto.includes(palabra))
  )
  // si la descripción no da pistas de categoría, añade A (criterios de construcción 3D)
  // como fallback razonable en vez de quedarnos solo con las genéricas
  const elegidas = especificas.length > 0
    ? [...especificas, ...siempre]
    : [SECCIONES_TECNICA.find((s) => s.id === 'A'), ...siempre]

  const cabecera = idioma === 'en'
    ? '\nADVANCED TECHNIQUES (from reference crochet manuals — apply whichever fits the project):\n\n'
    : '\nTÉCNICAS AVANZADAS (extraídas de manuales de crochet de referencia — aplica la que encaje con el proyecto):\n\n'

  return cabecera + elegidas.map((s) => (idioma === 'en' ? s.en : s.es)).join('\n\n') + '\n'
}

// ── Verificación de conteo de puntos ────────────────────────────────────────
// Comprobación de código (no de IA) sobre el texto que devuelve Claude: extrae
// el conteo declarado al final de cada vuelta y, cuando la vuelta usa la notación
// estructurada "[..., aum] xN", recalcula el conteo esperado. Para el resto de
// vueltas (prosa libre) aplica solo una heurística barata de coherencia con las
// palabras "aumento"/"disminución". No es un motor de cálculo de crochet completo:
// es un filtro para pillar los errores más obvios antes de que lleguen a la usuaria.

const PALABRAS_AUMENTO = /\baum\w*|\bincrease\w*|\binc\b/i
const PALABRAS_DISMINUCION = /\bdism\w*|\bdecrease\w*|\bdec\b/i
// "sin aumentar"/"no increase" no cuenta como evidencia de un aumento real —
// se quitan esas frases negadas antes de buscar las palabras clave.
const NEGACION_CAMBIO = /\b(sin|no|without|not)\s+\w*(aum|inc|dism|dec)\w*/gi

function quitarNegaciones(texto) {
  return texto.replace(NEGACION_CAMBIO, '')
}

function extraerConteoDeclarado(cuerpoVuelta) {
  const m = cuerpoVuelta.match(/\((\d+)\s*(?:puntos?|stitches?|sts?)\)/i)
  return m ? parseInt(m[1], 10) : null
}

// Suma los puntos de salida de un corchete tipo "[5 pb, aum]": puntos "planos"
// (numero + abreviatura) + 2 por cada aumento explícito + 1 por cada disminución.
function contarPuntosDelCorchete(contenido) {
  let total = 0
  const puntosPlanos = contenido.match(/(\d+)\s*(?:pb|pa|pmp|mp|pv|sc|dc|hdc|tr|ch|cad)/gi) || []
  puntosPlanos.forEach((tok) => { total += parseInt(tok, 10) })
  const aumentos = (contenido.match(/\baum\w*|\binc\b|\bincrease\w*/gi) || []).length
  const disminuciones = (contenido.match(/\bdism\w*|\bdec\b|\bdecrease\w*/gi) || []).length
  total += aumentos * 2 + disminuciones * 1
  return total
}

function conteoEsperadoDesdeCorchete(cuerpoVuelta) {
  const m = cuerpoVuelta.match(/\[([^\]]+)\]\s*x\s*(\d+)/i)
  if (!m) return null
  const puntosPorRepeticion = contarPuntosDelCorchete(m[1])
  if (puntosPorRepeticion === 0) return null
  return puntosPorRepeticion * parseInt(m[2], 10)
}

// Devuelve la lista de vueltas cuyo conteo declarado no parece coherente
// (vacía si todo cuadra). idioma decide si busca "Vuelta N:" o "Round N:".
export function verificarConteo(textoPatron, idioma) {
  if (!textoPatron) return []
  const etiqueta = idioma === 'en' ? 'Round' : 'Vuelta'
  const regex = new RegExp(`\\*\\*${etiqueta} (\\d+):\\*\\*([\\s\\S]*?)(?=\\*\\*${etiqueta} \\d+:\\*\\*|\\n##|$)`, 'g')
  const sospechosas = []
  let conteoAnterior = null
  let match

  while ((match = regex.exec(textoPatron)) !== null) {
    const numero = match[1]
    const cuerpo = match[2]
    // "Vuelta 1" siempre marca el inicio de una pieza nueva (cabeza, brazos...):
    // no arrastres el conteo de la pieza anterior a través de ese reinicio.
    if (numero === '1') conteoAnterior = null
    const declarado = extraerConteoDeclarado(cuerpo)
    if (declarado === null) { conteoAnterior = null; continue }

    const esperado = conteoEsperadoDesdeCorchete(cuerpo)
    if (esperado !== null) {
      if (esperado !== declarado) sospechosas.push({ vuelta: numero, declarado, esperado })
    } else if (conteoAnterior !== null && declarado !== conteoAnterior) {
      const subio = declarado > conteoAnterior
      const cuerpoSinNegaciones = quitarNegaciones(cuerpo)
      const tieneAumento = PALABRAS_AUMENTO.test(cuerpoSinNegaciones)
      const tieneDisminucion = PALABRAS_DISMINUCION.test(cuerpoSinNegaciones)
      if (subio && !tieneAumento) sospechosas.push({ vuelta: numero, declarado, anterior: conteoAnterior, motivo: 'sube-sin-aumento' })
      if (!subio && !tieneDisminucion) sospechosas.push({ vuelta: numero, declarado, anterior: conteoAnterior, motivo: 'baja-sin-disminucion' })
    }
    conteoAnterior = declarado
  }

  return sospechosas
}
