// Editar aquí para mejorar la precisión del Asistente IA sin tocar el handler.

// Prompt para el segundo turno cuando la usuaria marca un patrón como incorrecto
// y explica qué falla. Se envía junto con el patrón anterior como historial de
// conversación, para que Claude corrija justo eso en vez de repetir el mismo error.
export const promptCorreccion = (correccion, idioma) => idioma === 'en' ? `The pattern above is not correct. Here's what's wrong, in the requester's own words:

"${correccion}"

Fix this specific problem. Re-apply the construction rules and the stitch-count verification from your instructions above before answering. Reply again with the COMPLETE corrected pattern, in the exact same format as before (no explanation of what changed, no comments outside the pattern itself).` : `El patrón de arriba no es correcto. Esto es lo que falla, en palabras de quien lo pidió:

"${correccion}"

Corrige ese problema concreto. Vuelve a aplicar las reglas de construcción y la verificación de conteo de puntos de tus instrucciones anteriores antes de responder. Responde de nuevo con el patrón COMPLETO ya corregido, en el mismo formato exacto que antes (sin explicar qué has cambiado, sin comentarios fuera del propio patrón).`

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

2. If a reference photo is attached, remember it only shows one visible side of the object — do not assume the object has fewer or more pieces than what's visible in that single frame. Reason about the COMPLETE 3D piece (what's behind, on the sides, at the base) using the typical construction for that kind of object, not only what is literally visible in the frame.

3. Stitch-count verification (do this mentally before answering, don't show the scratch work unless useful):
   - Flat spiral circle: round 1 = 6 sc in a magic ring; each following round adds 6 stitches (round 2 = 12, round 3 = 18, round 4 = 24...) until the target diameter, then straight rounds with no increases.
   - Amigurumi sphere: symmetric increases up to the equator (same as the flat circle), then mirrored symmetric decreases to close.
   - Spiral oval: round 1 = base chain + increases at both ends (a fixed pattern, not arbitrary).
   - Every round must state the total stitch count at the end in parentheses, and that number must be mathematically consistent with the increases/decreases described in that same round.
   - If you find a count doesn't add up while reviewing, fix it before answering — never deliver a pattern with inconsistent counts.

4. Use standard English crochet terms and abbreviations (sc, dc, sl st, inc, dec, ch, magic ring) consistently throughout the pattern.

5. Writing style for the instructions: don't just list bare "Round N: [stitches]" lines. Whenever there's a relevant structural change (starting the handles, starting the closing decreases, switching color or stitch, moving from increases to straight rounds), add a short one-sentence explanation of what's happening and why, the way a well-written published pattern does (e.g. "Round 20. The base increases end here — from now on work straight rounds to build the height of the bag's body"). Rounds that repeat identically can be grouped in one line instead of listed one by one (e.g. "Rounds 21–40: work straight, no increases, 60 sts each round").` : `
REGLAS DE CONSTRUCCIÓN (aplícalas siempre, antes de escribir ninguna vuelta):

1. Antes de generar las instrucciones, decide y declara el MÉTODO DE CONSTRUCCIÓN de la pieza completa:
   - ¿Una sola pieza continua en espiral (sin cerrar vuelta, sin cadeneta de subida)? Típico en amigurumis, bolsos redondos/cilíndricos, gorros.
   - ¿Vueltas cerradas (con punto de unión y cadeneta de subida)? Típico en motivos planos, mandalas, granny squares.
   - ¿Varias piezas tejidas por separado y luego cosidas/unidas (paneles, laterales, base)? Típico en bolsos rectangulares, prendas con mangas, muñecos con partes separadas.
   NO asumas por defecto que hay "caras" o "paneles" separados: solo divide en piezas si la forma real del objeto lo requiere (un bolso rectangular necesita frente+espalda+base, pero un bolso cilíndrico u ovalado normalmente se teje en una sola espiral continua de la base a la boca).

2. Si se adjunta una foto de referencia, ten en cuenta que la foto solo muestra una cara visible del objeto — no asumas que tiene menos o más piezas de las que se ven en ese encuadre. Razona sobre la PIEZA COMPLETA en 3D (qué hay detrás, en los laterales, en la base) usando la construcción típica de ese tipo de objeto, no solo lo que se ve literalmente en la imagen.

3. Verificación de conteo de puntos (hazlo mentalmente antes de responder, sin mostrar el cálculo salvo que aporte):
   - Círculo plano en espiral: vuelta 1 = 6 pb en anillo mágico; cada vuelta siguiente suma 6 puntos (vuelta 2 = 12, vuelta 3 = 18, vuelta 4 = 24...) hasta el diámetro deseado, luego vueltas rectas sin aumentar.
   - Esfera amigurumi: aumentos simétricos hasta el ecuador (igual que el círculo plano) y luego disminuciones simétricas en espejo para cerrar.
   - Óvalo en espiral: vuelta 1 = cadena base + aumentos en ambos extremos (patrón fijo, no arbitrario).
   - Cada vuelta debe indicar el total de puntos al final entre paréntesis, y ese número debe ser matemáticamente coherente con los aumentos/disminuciones descritos en esa misma vuelta.
   - Si al revisar detectas que un conteo no cuadra, corrígelo antes de responder — nunca entregues un patrón con conteos inconsistentes.

4. Usa terminología y abreviaturas estándar de crochet en español (pb, pa, pv, aum, dism, cad, anillo mágico) de forma consistente en todo el patrón.

5. Estilo de redacción de las instrucciones: no te limites a listar "Vuelta N: [puntos]" en seco. Cuando haya un cambio estructural relevante (empezar las asas, empezar las disminuciones de cierre, cambiar de color o de punto, pasar de aumentar a tejer recto), añade una frase breve explicando qué pasa y por qué, como hace un patrón profesional bien escrito (ej: "Vuelta 20. Aquí terminan los aumentos de la base — a partir de ahora se teje recto para dar altura al cuerpo del bolso"). Las vueltas que se repiten igual pueden agruparse en una sola línea en vez de listarlas una a una (ej: "Vueltas 21 a 40: teje recto sin aumentar, 60 puntos por vuelta").
`

export const tecnicasAvanzadas = (idioma) => idioma === 'en' ? `
ADVANCED TECHNIQUES (from reference crochet manuals — apply whichever fits the project):

A. Deciding the construction of a complex 3D object:
   - RIGIDITY criterion: if the object must hold a rigid shape (boxes, cases, hard bases), use separate flat panels worked back-and-forth (not spiral), designed to hold an internal stiffener (cardboard, interfacing), then sewn together. If the object is soft/flexible (amigurumi, soft-bodied bags), prefer the continuous spiral instead.
   - SIZE/POSITION criterion: large, central parts of a figure (torso+neck+head, or legs that merge into the body) tend to be worked as a single continuous piece to avoid structural seams; small, peripheral parts (ears, horns, tail, fins, hanging arms) are almost always worked separately and sewn on at the end.
   - TUBE alternative for cylindrical bags/backpacks: instead of a circular base with increases and then a straight-walled body, it's equally valid to work a tube of CONSTANT circumference (no increase rounds at all) from start to finish, and resolve the final volume in the finishing step: flat-seaming the bottom shut, folding and sewing the corners inward, or sewing on a ready-made base (cardboard, rattan, leather). Handles on this kind of bag are usually not crocheted at all — they're ribbon or leather straps sewn on afterward, not a chain loop left in a round.
   - For large spheres or color-segment effects: instead of a single spiral of increases, it's valid to work several identical curved panels back-and-forth, sew them side by side, and close each pole with a separate circular cap (concentric increases) sewn on at the end.
   - For ovals/elongated shapes: an alternative to one continuous increase-plateau-decrease progression is sewing together two caps of different sizes (a small "top" and a large "bottom", each worked and finished separately).
   - Compound silhouette: a single spiral piece can chain together several sections of increases, straight rounds, and decreases (e.g. head → narrower neck → wider chest) without closing or switching pieces — don't assume every change in width needs a new piece.

B. Finishing and closing:
   - Never dictate decreases below roughly 6-8 total stitches — it isn't practically workable. To close the final hole, run the yarn through the outer loop of the remaining stitches and pull tight (a "drawstring" close) instead of continuing to decrease.
   - Invisible decrease (picking up only the front loop of the two stitches before joining them) gives a cleaner finish than a regular decrease.
   - Working 1-2 rounds through the back loop only creates a "hinge" or crease: use it to transition from a flat base to a vertical wall (baskets, bags) or to fake a joint (elbow, knee) without a seam.
   - To fuse two tube-shaped pieces into one (e.g. two legs becoming a body): work each tube separately, then on the round where both end, join them with a stitch connecting the last stitch of one to the first of the other, and continue the next round as a single larger circle — this avoids sewing legs to the body separately.

C. Joined motifs (granny squares, African flower, and similar):
   - The starting chain for a closed round depends on the next stitch: 1 for slip stitch, 2 for single crochet, 3 for half-double or double crochet, 4 for treble. That chain counts as the round's first stitch, and the round closes with a slip stitch into its top.
   - To join motifs: "join-as-you-go" (replacing chain stitches from the stitch diagram with single crochets worked into the neighboring piece's space during the last round) or joining after all pieces are finished (sewing, or slip-stitch/single-crochet seams).
   - Clean color change: work the last stitch of the old color leaving the final yarn-over in the new color (the join hides inside the stitch). For strong contrasts, cut and weave in color-matched tails.
   - Curvature rule for rounded surfaces made of motifs: motifs with fewer sides/petals (pentagons) must always be surrounded by motifs with more sides (hexagons), never two "pentagons" adjacent — same principle as a soccer ball. This is NOT a reason to split a continuous-spiral amigurumi into panels; it only applies to deliberately paneled/motif-joined constructions.

D. Extended terminology (tolerate these synonyms if the user uses them):
   - UK/US equivalence (one position apart): US "sc" = UK "dc"; US "hdc" = UK "htr"; US "dc" = UK "tr"; US "tr" = UK "dtr".
   - Pattern notation: asterisks (*...*) mark a section to repeat; parentheses (...) group a repeat count or the total stitch count at the end of a round; brackets [...] nest information inside a parenthesis.

E. Assembly and planning:
   - Insert safety eyes BEFORE fully stuffing the head (once closed and stuffed, the backing can no longer be attached).
   - Stuff progressively while closing the piece, not all at the end — it's much harder to push stuffing through an already-closed small gap.
   - Give the position of details (eyes, spots, accessories) as round-and-stitch-count references ("between round 9 and 10, count 9 stitches from the first eye"), never as vague visual descriptions like "in the center of the face".
   - In projects with many pieces, name them by function+location+quantity (e.g. "Ears (×2)", "Side panel (×2)") — it works as a materials checklist for whoever is crocheting.
` : `
TÉCNICAS AVANZADAS (extraídas de manuales de crochet de referencia — aplica la que encaje con el proyecto):

A. Cómo decidir la construcción de un objeto 3D complejo:
   - Criterio de RIGIDEZ: si el objeto necesita mantener una forma rígida sin doblarse (maletas, cajas, bases duras), usa piezas planas independientes tejidas en ida y vuelta (no en espiral), pensadas para llevar un refuerzo interno (cartón, entretela), y cóselas entre sí. Si el objeto es flexible/blando (amigurumis, bolsos de tela suave), prioriza la espiral continua.
   - Criterio TAMAÑO/POSICIÓN: las partes grandes y centrales de una figura (torso+cabeza+cuello, o piernas que se integran en el cuerpo) tienden a tejerse como una única pieza continua para evitar costuras estructurales; las partes pequeñas y periféricas (orejas, cuernos, cola, aletas, brazos colgantes) casi siempre se tejen aparte y se cosen al final.
   - Alternativa de TUBO para bolsos/mochilas cilíndricos: en vez de tejer una base circular con aumentos y luego subir la pared, es igual de válido tejer un tubo de circunferencia CONSTANTE (sin ninguna vuelta de aumento) de principio a fin, y resolver el volumen final en el acabado: cerrando el fondo con costura plana, doblando y cosiendo las esquinas hacia dentro, o cosiendo una base ya hecha (cartón, rafia, cuero). Las asas en bolsos de este tipo casi nunca se tejen: suelen ser cintas o correas cosidas después, no cadenetas al aire dejadas en una vuelta.
   - Para esferas grandes o efectos de gajos de color: en vez de una sola espiral de aumentos, es válido tejer varios paneles curvos idénticos en ida y vuelta, coserlos lado a lado, y cerrar cada polo con un casquete circular aparte (aumentos concéntricos) cosido al final.
   - Para óvalos/formas alargadas: una alternativa a una única progresión de aumento-meseta-disminución es coser dos casquetes de tamaño distinto (una "tapa" pequeña y una "base" grande, cada una tejida y rematada por separado).
   - Silueta compuesta: una misma pieza en espiral puede combinar varios tramos de aumento, tramos rectos y tramos de disminución encadenados (ej. cabeza → cuello más estrecho → torso más ancho) sin cerrar ni cambiar de pieza — no asumas que cada cambio de anchura necesita una pieza nueva.

B. Remate y cierre:
   - Nunca dictes disminuciones por debajo de ~6-8 puntos totales: no es tejible en la práctica. Para cerrar el hueco final, pasa la hebra por el lazo exterior de los puntos restantes y tira (cierre "de bolsita"), en vez de seguir disminuyendo.
   - La disminución invisible (tomar solo la hebra delantera de los dos puntos antes de juntarlos) da un remate más limpio que la disminución normal.
   - Tejer 1-2 vueltas tomando solo la hebra trasera crea una "bisagra" o pliegue marcado: úsalo para pasar de una base plana a una pared vertical (cestas, bolsos) o para simular una articulación (codo, rodilla) sin costura.
   - Para fusionar dos piezas tubulares en una sola (ej. dos piernas que se convierten en un cuerpo): teje cada tubo por separado y, en la vuelta donde ambas terminan, únelas con un punto que conecte el último punto de una con el primero de la otra, continuando la vuelta siguiente como un solo círculo más grande — evita coser piernas al cuerpo por separado.

C. Motivos unidos (granny square, flor africana, y similares):
   - La cadeneta de subida al empezar cada vuelta cerrada depende del punto siguiente: 1 para punto raso, 2 para punto bajo, 3 para punto medio alto o punto alto, 4 para punto alto doble. Esa cadeneta cuenta como el primer punto de la vuelta, y la vuelta se cierra con un punto raso en su parte alta.
   - Para unir motivos: "sobre la marcha" (join-as-you-go, sustituyendo cadenetas del diagrama por puntos bajos tejidos en el espacio de la pieza vecina durante la última vuelta) o después de terminar todas las piezas (cosido o unión con punto raso/bajo).
   - Cambio de color limpio: teje el último punto del color viejo dejando el remate final con el color nuevo (el empalme queda oculto dentro del punto). Para contrastes fuertes, corta y remata color con color.
   - Regla de curvatura para superficies redondeadas hechas de motivos: los motivos con menos lados/pétalos (pentágonos) deben quedar siempre rodeados de motivos con más lados (hexágonos), nunca dos "pentágonos" adyacentes — mismo principio que un balón de fútbol. Esto NO es una razón para dividir en piezas un amigurumi que se teje en espiral continua; aplica solo a construcciones deliberadas por motivos unidos.

D. Terminología ampliada (tolera estos sinónimos si el usuario los usa):
   - Punto bajo = "medio punto" (LatAm) = "m.p."; punto alto = "vareta" = "v."; punto raso = "punto enano" = "p. enano".
   - Equivalencia UK/US (desfase de una posición): el "sc" americano = "dc" británico; "hdc" US = "htr" UK; "dc" US = "tr" UK; "tr" US = "dtr" UK.
   - Notación de patrones: los asteriscos (*...*) marcan un tramo a repetir; los paréntesis (...) agrupan una repetición o el conteo total de puntos al final de la vuelta; los corchetes [...] anidan información dentro de un paréntesis.

E. Ensamblaje y planificación:
   - Coloca los ojos de seguridad ANTES de rellenar del todo la cabeza (una vez cerrada y rellena es imposible fijar el respaldo).
   - Rellena progresivamente mientras vas cerrando la pieza, no todo al final — es más difícil meter relleno por un hueco pequeño ya cerrado.
   - Da las posiciones de detalles (ojos, manchas, accesorios) como referencias de vuelta y conteo de puntos ("entre la vuelta 9 y 10, cuenta 9 puntos desde el primer ojo"), nunca como descripciones vagas tipo "en el centro de la cara".
   - En proyectos con muchas piezas, nómbralas por función+ubicación+cantidad (ej. "Orejas (×2)", "Panel lateral (×2)") — funciona como lista de materiales/checklist para quien teje.
`

