import { useState, useRef, useCallback } from 'react'
import './Disenador.css'

const CELL = 36

// ─── Símbolos CYC estándar organizados por categoría ─────────────────────────
const STITCH_CATEGORIES = [
  {
    id: 'base',
    label: 'Base',
    stitches: [
      { id: 'ch',   label: 'Cadeneta',              abbr: 'CH' },
      { id: 'sl',   label: 'Punto deslizado',        abbr: 'SL' },
      { id: 'sc',   label: 'Punto bajo',             abbr: 'PB' },
      { id: 'hdc',  label: 'Medio punto alto',       abbr: 'MPA' },
      { id: 'dc',   label: 'Punto alto',             abbr: 'PA' },
      { id: 'tr',   label: 'Punto alto doble',       abbr: 'PAD' },
      { id: 'dtr',  label: 'Punto alto triple',      abbr: 'PAT' },
      { id: 'trtr', label: 'Punto alto cuádruple',   abbr: 'PAC' },
    ],
  },
  {
    id: 'aug',
    label: 'Aumentos',
    stitches: [
      { id: '2sc1', label: '2 PB en 1 punto',        abbr: '2PB' },
      { id: '3sc1', label: '3 PB en 1 punto',        abbr: '3PB' },
      { id: '2dc1', label: '2 PA en 1 punto',        abbr: '2PA' },
      { id: '3dc1', label: '3 PA en 1 punto',        abbr: '3PA' },
    ],
  },
  {
    id: 'dec',
    label: 'Disminuciones',
    stitches: [
      { id: 'sc2tog', label: 'Disminución PB (2 jun.)',  abbr: 'PB2' },
      { id: 'sc3tog', label: 'Disminución PB (3 jun.)',  abbr: 'PB3' },
      { id: 'dc2tog', label: 'Disminución PA (2 jun.)',  abbr: 'PA2' },
      { id: 'dc3tog', label: 'Disminución PA (3 jun.)',  abbr: 'PA3' },
    ],
  },
  {
    id: 'special',
    label: 'Especiales',
    stitches: [
      { id: 'magic',  label: 'Anillo mágico',         abbr: 'AM' },
      { id: 'picot',  label: 'Picot (3 cad.)',         abbr: 'PIC' },
      { id: 'join',   label: 'Unir vuelta',            abbr: 'UNI' },
      { id: 'fasten', label: 'Rematar',                abbr: 'REM' },
    ],
  },
  {
    id: 'relief',
    label: 'Relieve',
    stitches: [
      { id: 'fpdc', label: 'PA relieve delantero',    abbr: 'RPD' },
      { id: 'bpdc', label: 'PA relieve trasero',      abbr: 'RPT' },
      { id: 'fptr', label: 'PAD relieve delantero',   abbr: 'RDD' },
      { id: 'bptr', label: 'PAD relieve trasero',     abbr: 'RDT' },
    ],
  },
  {
    id: 'loop',
    label: 'Lazada',
    stitches: [
      { id: 'flo',  label: 'Solo lazada delantera',   abbr: 'FLO' },
      { id: 'blo',  label: 'Solo lazada trasera',     abbr: 'BLO' },
    ],
  },
  {
    id: 'texture',
    label: 'Textura',
    stitches: [
      { id: 'bobble',  label: 'Bobble',               abbr: 'BOB' },
      { id: 'puff',    label: 'Puff stitch',          abbr: 'PUF' },
      { id: 'popcorn', label: 'Palomita',             abbr: 'PAL' },
      { id: 'cluster', label: 'Racimo',               abbr: 'RAC' },
    ],
  },
  {
    id: 'compound',
    label: 'Compuestos',
    stitches: [
      { id: 'shell',   label: 'Concha (5 PA)',         abbr: 'CON' },
      { id: 'vstitch', label: 'Punto V',               abbr: 'PV' },
      { id: 'crossdc', label: 'PA cruzado',            abbr: 'PAX' },
    ],
  },
]

const ALL_STITCHES = STITCH_CATEGORIES.flatMap(c => c.stitches)

const COLORS = [
  '#C4764A', '#6B7F5E', '#E8A87C', '#8B6F8C',
  '#4A7FA5', '#D4A5A5', '#5C4033', '#F5F0EB',
]

function makeGrid(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ stitch: null, color: '#C4764A' }))
  )
}

// ─── Símbolo SVG por punto ────────────────────────────────────────────────────
function StitchSymbol({ stitch, color: s, size = 20 }) {
  const w  = 1.8
  const cx = size / 2
  const cy = size / 2

  // Barra horizontal auxiliar (indicador de lazada) a altura y
  const bar = (y, width = 0.4) => (
    <line
      x1={size * (0.5 - width / 2)} y1={y}
      x2={size * (0.5 + width / 2)} y2={y}
      stroke={s} strokeWidth={1.3} strokeLinecap="round"
    />
  )
  // Línea horizontal de base (fondo del punto)
  const base = (x1 = 0.18, x2 = 0.82) => (
    <line x1={size*x1} y1={size*0.85} x2={size*x2} y2={size*0.85} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
  )

  switch (stitch) {

    /* ── PUNTOS BASE ── */
    case 'ch':
      return <ellipse cx={cx} cy={cy} rx={size*0.38} ry={size*0.25} fill="none" stroke={s} strokeWidth={w} />

    case 'sl':
      return <circle cx={cx} cy={cy} r={size*0.2} fill={s} />

    case 'sc':
      return <>
        <line x1={cx} y1={size*0.15} x2={cx} y2={size*0.85} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.2} y1={cy} x2={size*0.8} y2={cy} stroke={s} strokeWidth={w} strokeLinecap="round" />
      </>

    case 'hdc':
      return <>
        <line x1={cx} y1={size*0.18} x2={cx} y2={size*0.85} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.2} y1={size*0.18} x2={size*0.8} y2={size*0.18} stroke={s} strokeWidth={w} strokeLinecap="round" />
        {bar(size*0.52)}
      </>

    case 'dc':
      return <>
        <line x1={cx} y1={size*0.15} x2={cx} y2={size*0.85} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.2} y1={size*0.15} x2={size*0.8} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        {bar(size*0.44)}
      </>

    case 'tr':
      return <>
        <line x1={cx} y1={size*0.12} x2={cx} y2={size*0.85} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.2} y1={size*0.12} x2={size*0.8} y2={size*0.12} stroke={s} strokeWidth={w} strokeLinecap="round" />
        {bar(size*0.37)}
        {bar(size*0.52)}
      </>

    case 'dtr':
      return <>
        <line x1={cx} y1={size*0.1} x2={cx} y2={size*0.88} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.2} y1={size*0.1} x2={size*0.8} y2={size*0.1} stroke={s} strokeWidth={w} strokeLinecap="round" />
        {bar(size*0.3)}
        {bar(size*0.44)}
        {bar(size*0.58)}
      </>

    case 'trtr':
      return <>
        <line x1={cx} y1={size*0.08} x2={cx} y2={size*0.9} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.2} y1={size*0.08} x2={size*0.8} y2={size*0.08} stroke={s} strokeWidth={w} strokeLinecap="round" />
        {bar(size*0.26)}
        {bar(size*0.38)}
        {bar(size*0.50)}
        {bar(size*0.62)}
      </>

    /* ── AUMENTOS ── */
    case '2sc1':
      return <>
        <line x1={cx} y1={size*0.85} x2={size*0.3} y2={size*0.2} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={cx} y1={size*0.85} x2={size*0.7} y2={size*0.2} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.2} y1={size*0.2} x2={size*0.42} y2={size*0.2} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.58} y1={size*0.2} x2={size*0.8} y2={size*0.2} stroke={s} strokeWidth={w} strokeLinecap="round" />
        {base(0.4, 0.6)}
      </>

    case '3sc1':
      return <>
        <line x1={cx} y1={size*0.85} x2={size*0.15} y2={size*0.2} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={cx} y1={size*0.85} x2={cx} y2={size*0.2} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={cx} y1={size*0.85} x2={size*0.85} y2={size*0.2} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.06} y1={size*0.2} x2={size*0.28} y2={size*0.2} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.38} y1={size*0.2} x2={size*0.62} y2={size*0.2} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.72} y1={size*0.2} x2={size*0.94} y2={size*0.2} stroke={s} strokeWidth={w} strokeLinecap="round" />
        {base(0.4, 0.6)}
      </>

    case '2dc1':
      return <>
        <line x1={cx} y1={size*0.85} x2={size*0.3} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={cx} y1={size*0.85} x2={size*0.7} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.18} y1={size*0.15} x2={size*0.42} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.58} y1={size*0.15} x2={size*0.82} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.22} y1={size*0.46} x2={size*0.37} y2={size*0.46} stroke={s} strokeWidth={1.2} strokeLinecap="round" />
        <line x1={size*0.63} y1={size*0.46} x2={size*0.78} y2={size*0.46} stroke={s} strokeWidth={1.2} strokeLinecap="round" />
        {base(0.4, 0.6)}
      </>

    case '3dc1':
      return <>
        <line x1={cx} y1={size*0.85} x2={size*0.15} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={cx} y1={size*0.85} x2={cx} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={cx} y1={size*0.85} x2={size*0.85} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.06} y1={size*0.15} x2={size*0.28} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.38} y1={size*0.15} x2={size*0.62} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.72} y1={size*0.15} x2={size*0.94} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.08} y1={size*0.46} x2={size*0.22} y2={size*0.46} stroke={s} strokeWidth={1.2} strokeLinecap="round" />
        <line x1={size*0.38} y1={size*0.46} x2={size*0.62} y2={size*0.46} stroke={s} strokeWidth={1.2} strokeLinecap="round" />
        <line x1={size*0.78} y1={size*0.46} x2={size*0.92} y2={size*0.46} stroke={s} strokeWidth={1.2} strokeLinecap="round" />
        {base(0.38, 0.62)}
      </>

    /* ── DISMINUCIONES ── */
    case 'sc2tog':
      return <>
        <line x1={size*0.3} y1={size*0.85} x2={cx} y2={size*0.2} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.7} y1={size*0.85} x2={cx} y2={size*0.2} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.12} y1={size*0.85} x2={size*0.4} y2={size*0.85} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
        <line x1={size*0.6} y1={size*0.85} x2={size*0.88} y2={size*0.85} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
      </>

    case 'sc3tog':
      return <>
        <line x1={size*0.15} y1={size*0.85} x2={cx} y2={size*0.18} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={cx} y1={size*0.85} x2={cx} y2={size*0.18} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.85} y1={size*0.85} x2={cx} y2={size*0.18} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.06} y1={size*0.85} x2={size*0.28} y2={size*0.85} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
        <line x1={size*0.4} y1={size*0.85} x2={size*0.6} y2={size*0.85} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
        <line x1={size*0.72} y1={size*0.85} x2={size*0.94} y2={size*0.85} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
      </>

    case 'dc2tog':
      return <>
        <line x1={size*0.28} y1={size*0.85} x2={cx} y2={size*0.18} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.72} y1={size*0.85} x2={cx} y2={size*0.18} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.1} y1={size*0.85} x2={size*0.38} y2={size*0.85} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
        <line x1={size*0.62} y1={size*0.85} x2={size*0.9} y2={size*0.85} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
        <line x1={size*0.18} y1={size*0.52} x2={size*0.32} y2={size*0.52} stroke={s} strokeWidth={1.1} strokeLinecap="round" />
        <line x1={size*0.68} y1={size*0.52} x2={size*0.82} y2={size*0.52} stroke={s} strokeWidth={1.1} strokeLinecap="round" />
      </>

    case 'dc3tog':
      return <>
        <line x1={size*0.14} y1={size*0.85} x2={cx} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={cx} y1={size*0.85} x2={cx} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.86} y1={size*0.85} x2={cx} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.05} y1={size*0.85} x2={size*0.27} y2={size*0.85} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
        <line x1={size*0.39} y1={size*0.85} x2={size*0.61} y2={size*0.85} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
        <line x1={size*0.73} y1={size*0.85} x2={size*0.95} y2={size*0.85} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
        <line x1={size*0.06} y1={size*0.52} x2={size*0.2} y2={size*0.52} stroke={s} strokeWidth={1.1} strokeLinecap="round" />
        <line x1={size*0.38} y1={size*0.52} x2={size*0.62} y2={size*0.52} stroke={s} strokeWidth={1.1} strokeLinecap="round" />
        <line x1={size*0.8} y1={size*0.52} x2={size*0.94} y2={size*0.52} stroke={s} strokeWidth={1.1} strokeLinecap="round" />
      </>

    /* ── ESPECIALES ── */
    case 'magic':
      return <>
        <circle cx={cx} cy={cy} r={size*0.32} fill="none" stroke={s} strokeWidth={w} strokeDasharray="3 2" />
        <circle cx={cx} cy={cy} r={size*0.08} fill={s} />
      </>

    case 'picot':
      return <>
        <path
          d={`M ${size*0.35} ${size*0.72} Q ${size*0.32} ${size*0.25} ${cx} ${size*0.18} Q ${size*0.68} ${size*0.25} ${size*0.65} ${size*0.72}`}
          fill="none" stroke={s} strokeWidth={w} strokeLinecap="round"
        />
        <line x1={size*0.28} y1={size*0.72} x2={size*0.72} y2={size*0.72} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={cx} y1={size*0.72} x2={cx} y2={size*0.88} stroke={s} strokeWidth={w} strokeLinecap="round" />
      </>

    case 'join':
      return <>
        <circle cx={cx} cy={size*0.38} r={size*0.28} fill="none" stroke={s} strokeWidth={w} />
        <circle cx={cx} cy={size*0.38} r={size*0.1} fill={s} />
        <line x1={cx} y1={size*0.66} x2={cx} y2={size*0.88} stroke={s} strokeWidth={w} strokeLinecap="round" />
      </>

    case 'fasten':
      return <>
        <line x1={size*0.2} y1={size*0.35} x2={size*0.8} y2={size*0.35} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.2} y1={size*0.5} x2={size*0.8} y2={size*0.5} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.2} y1={size*0.65} x2={size*0.8} y2={size*0.65} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.35} y1={size*0.2} x2={size*0.65} y2={size*0.8} stroke={s} strokeWidth={1.8} strokeLinecap="round" />
        <line x1={size*0.65} y1={size*0.2} x2={size*0.35} y2={size*0.8} stroke={s} strokeWidth={1.8} strokeLinecap="round" />
      </>

    /* ── EN RELIEVE ── */
    case 'fpdc':
      return <>
        <line x1={cx} y1={size*0.15} x2={cx} y2={size*0.85} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.2} y1={size*0.15} x2={size*0.8} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        {bar(size*0.42)}
        <path d={`M ${cx} ${size*0.6} Q ${size*0.12} ${size*0.65} ${size*0.18} ${size*0.8}`}
          fill="none" stroke={s} strokeWidth={1.4} strokeLinecap="round" />
      </>

    case 'bpdc':
      return <>
        <line x1={cx} y1={size*0.15} x2={cx} y2={size*0.85} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.2} y1={size*0.15} x2={size*0.8} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        {bar(size*0.42)}
        <path d={`M ${cx} ${size*0.6} Q ${size*0.88} ${size*0.65} ${size*0.82} ${size*0.8}`}
          fill="none" stroke={s} strokeWidth={1.4} strokeLinecap="round" />
      </>

    case 'fptr':
      return <>
        <line x1={cx} y1={size*0.12} x2={cx} y2={size*0.85} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.2} y1={size*0.12} x2={size*0.8} y2={size*0.12} stroke={s} strokeWidth={w} strokeLinecap="round" />
        {bar(size*0.35)}
        {bar(size*0.49)}
        <path d={`M ${cx} ${size*0.62} Q ${size*0.12} ${size*0.67} ${size*0.18} ${size*0.82}`}
          fill="none" stroke={s} strokeWidth={1.4} strokeLinecap="round" />
      </>

    case 'bptr':
      return <>
        <line x1={cx} y1={size*0.12} x2={cx} y2={size*0.85} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.2} y1={size*0.12} x2={size*0.8} y2={size*0.12} stroke={s} strokeWidth={w} strokeLinecap="round" />
        {bar(size*0.35)}
        {bar(size*0.49)}
        <path d={`M ${cx} ${size*0.62} Q ${size*0.88} ${size*0.67} ${size*0.82} ${size*0.82}`}
          fill="none" stroke={s} strokeWidth={1.4} strokeLinecap="round" />
      </>

    /* ── LAZADA ── */
    case 'flo':
      return <>
        <line x1={cx} y1={size*0.18} x2={cx} y2={size*0.75} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.22} y1={size*0.46} x2={size*0.78} y2={size*0.46} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.22} y1={size*0.82} x2={size*0.78} y2={size*0.82} stroke={s} strokeWidth={1.5} strokeLinecap="round" />
      </>

    case 'blo':
      return <>
        <line x1={cx} y1={size*0.18} x2={cx} y2={size*0.72} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.22} y1={size*0.44} x2={size*0.78} y2={size*0.44} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.22} y1={size*0.79} x2={size*0.78} y2={size*0.79} stroke={s} strokeWidth={1.5} strokeLinecap="round" />
        <line x1={size*0.22} y1={size*0.88} x2={size*0.78} y2={size*0.88} stroke={s} strokeWidth={1.5} strokeLinecap="round" />
      </>

    /* ── TEXTURA ── */
    case 'bobble':
      return <>
        <path
          d={`M ${cx} ${size*0.84} Q ${size*0.14} ${size*0.72} ${size*0.18} ${size*0.44} Q ${cx} ${size*0.1} ${size*0.82} ${size*0.44} Q ${size*0.86} ${size*0.72} ${cx} ${size*0.84}`}
          fill={s + '35'} stroke={s} strokeWidth={w}
        />
        <line x1={cx} y1={size*0.84} x2={cx} y2={size*0.93} stroke={s} strokeWidth={w} strokeLinecap="round" />
      </>

    case 'puff':
      return <>
        <ellipse cx={cx} cy={size*0.46} rx={size*0.33} ry={size*0.3} fill={s + '35'} stroke={s} strokeWidth={w} />
        <line x1={size*0.35} y1={size*0.46} x2={size*0.65} y2={size*0.46} stroke={s} strokeWidth={1.2} strokeLinecap="round" />
        <line x1={size*0.3} y1={size*0.54} x2={size*0.7} y2={size*0.54} stroke={s} strokeWidth={1.2} strokeLinecap="round" />
        <line x1={cx} y1={size*0.76} x2={cx} y2={size*0.9} stroke={s} strokeWidth={w} strokeLinecap="round" />
      </>

    case 'popcorn':
      return <>
        <circle cx={cx} cy={size*0.43} r={size*0.3} fill={s + '35'} stroke={s} strokeWidth={w} />
        <line x1={size*0.35} y1={size*0.28} x2={size*0.38} y2={size*0.18} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
        <line x1={cx} y1={size*0.24} x2={cx} y2={size*0.14} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
        <line x1={size*0.65} y1={size*0.28} x2={size*0.62} y2={size*0.18} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
        <line x1={cx} y1={size*0.73} x2={cx} y2={size*0.9} stroke={s} strokeWidth={w} strokeLinecap="round" />
      </>

    case 'cluster':
      return <>
        <line x1={size*0.2} y1={size*0.85} x2={cx} y2={size*0.2} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={cx} y1={size*0.85} x2={cx} y2={size*0.2} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.8} y1={size*0.85} x2={cx} y2={size*0.2} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.18} y1={size*0.15} x2={size*0.82} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.12} y1={size*0.85} x2={size*0.35} y2={size*0.85} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
        <line x1={size*0.4} y1={size*0.85} x2={size*0.6} y2={size*0.85} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
        <line x1={size*0.65} y1={size*0.85} x2={size*0.88} y2={size*0.85} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
        <line x1={size*0.14} y1={size*0.52} x2={size*0.26} y2={size*0.52} stroke={s} strokeWidth={1.1} strokeLinecap="round" />
        <line x1={size*0.38} y1={size*0.52} x2={size*0.62} y2={size*0.52} stroke={s} strokeWidth={1.1} strokeLinecap="round" />
        <line x1={size*0.74} y1={size*0.52} x2={size*0.86} y2={size*0.52} stroke={s} strokeWidth={1.1} strokeLinecap="round" />
      </>

    /* ── COMPUESTOS ── */
    case 'shell':
      return <>
        <line x1={cx} y1={size*0.9} x2={size*0.12} y2={size*0.18} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
        <line x1={cx} y1={size*0.9} x2={size*0.3} y2={size*0.12} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
        <line x1={cx} y1={size*0.9} x2={cx} y2={size*0.1} stroke={s} strokeWidth={1.5} strokeLinecap="round" />
        <line x1={cx} y1={size*0.9} x2={size*0.7} y2={size*0.12} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
        <line x1={cx} y1={size*0.9} x2={size*0.88} y2={size*0.18} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
        <path d={`M ${size*0.1} ${size*0.2} Q ${cx} ${size*0.04} ${size*0.9} ${size*0.2}`}
          fill="none" stroke={s} strokeWidth={1.3} />
        <line x1={size*0.4} y1={size*0.9} x2={size*0.6} y2={size*0.9} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
      </>

    case 'vstitch':
      return <>
        <line x1={cx} y1={size*0.88} x2={size*0.22} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={cx} y1={size*0.88} x2={size*0.78} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.1} y1={size*0.15} x2={size*0.36} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.64} y1={size*0.15} x2={size*0.9} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.14} y1={size*0.46} x2={size*0.3} y2={size*0.46} stroke={s} strokeWidth={1.2} strokeLinecap="round" />
        <line x1={size*0.7} y1={size*0.46} x2={size*0.86} y2={size*0.46} stroke={s} strokeWidth={1.2} strokeLinecap="round" />
        {base(0.38, 0.62)}
      </>

    case 'crossdc':
      return <>
        <line x1={size*0.15} y1={size*0.88} x2={size*0.82} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.85} y1={size*0.88} x2={size*0.18} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.06} y1={size*0.15} x2={size*0.3} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.7} y1={size*0.15} x2={size*0.94} y2={size*0.15} stroke={s} strokeWidth={w} strokeLinecap="round" />
        <line x1={size*0.08} y1={size*0.88} x2={size*0.28} y2={size*0.88} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
        <line x1={size*0.72} y1={size*0.88} x2={size*0.92} y2={size*0.88} stroke={s} strokeWidth={1.3} strokeLinecap="round" />
      </>

    default:
      return null
  }
}

function EraseIcon({ active }) {
  const c = active ? '#fff' : '#999'
  return <>
    <line x1="4" y1="4" x2="16" y2="16" stroke={c} strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="4" x2="4" y2="16" stroke={c} strokeWidth="2" strokeLinecap="round" />
  </>
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Disenador() {
  const [rows, setRows] = useState(15)
  const [cols, setCols] = useState(20)
  const [grid, setGrid] = useState(() => makeGrid(15, 20))
  const [selectedStitch, setSelectedStitch] = useState('sc')
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [activeCategory, setActiveCategory] = useState('base')
  const [painting, setPainting] = useState(false)
  const [bgImage, setBgImage] = useState(null)
  const [bgOpacity, setBgOpacity] = useState(0.3)
  const [showLegend, setShowLegend] = useState(false)
  const svgRef = useRef(null)
  const fileInputRef = useRef(null)
  const jsonInputRef = useRef(null)

  const paint = useCallback((r, c) => {
    setGrid(prev => {
      const next = prev.map(row => row.map(cell => ({ ...cell })))
      next[r][c] = selectedStitch === 'erase'
        ? { stitch: null, color: selectedColor }
        : { stitch: selectedStitch, color: selectedColor }
      return next
    })
  }, [selectedStitch, selectedColor])

  const handleResize = (newRows, newCols) => {
    const r = Math.max(5, Math.min(40, newRows))
    const c = Math.max(5, Math.min(50, newCols))
    setRows(r)
    setCols(c)
    setGrid(makeGrid(r, c))
  }

  const exportPNG = () => {
    const svg = svgRef.current
    if (!svg) return
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = cols * CELL + 1
      canvas.height = rows * CELL + 1
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#F2EBE1'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      const link = document.createElement('a')
      link.download = 'patron-crochet.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = url
  }

  const saveJSON = () => {
    const data = JSON.stringify({ rows, cols, grid }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const link = document.createElement('a')
    link.download = 'patron-crochet.json'
    link.href = URL.createObjectURL(blob)
    link.click()
  }

  const loadJSON = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (data.rows && data.cols && data.grid) {
          setRows(data.rows)
          setCols(data.cols)
          setGrid(data.grid)
        }
      } catch {
        alert('El archivo no es un patrón válido.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const loadBgImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setBgImage(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const svgWidth  = cols * CELL + 1
  const svgHeight = rows * CELL + 1
  const stitchCount = grid.flat().filter(c => c.stitch !== null).length
  const currentCategory = STITCH_CATEGORIES.find(c => c.id === activeCategory)

  return (
    <div className="disenador">
      <div className="disenador__header">
        <h1>Diseñador de Patrones</h1>
        <p>Símbolos estándar CYC · Crea tu diagrama punto a punto</p>
      </div>

      <div className="disenador__layout">
        <aside className="disenador__sidebar">

          {/* Paleta de puntos con tabs de categoría */}
          <div className="panel">
            <h3 className="panel__title">Puntos CYC</h3>
            <div className="cat-tabs">
              {STITCH_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`cat-tab${activeCategory === cat.id ? ' cat-tab--active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="stitch-palette">
              {currentCategory.stitches.map(s => (
                <button
                  key={s.id}
                  className={`stitch-btn${selectedStitch === s.id ? ' stitch-btn--active' : ''}`}
                  onClick={() => setSelectedStitch(s.id)}
                  title={s.label}
                >
                  <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                    <StitchSymbol stitch={s.id} color={selectedStitch === s.id ? '#fff' : '#C4764A'} size={20} />
                  </svg>
                  <span className="stitch-btn__abbr">{s.abbr}</span>
                  <span className="stitch-btn__label">{s.label}</span>
                </button>
              ))}
              <button
                className={`stitch-btn stitch-btn--erase${selectedStitch === 'erase' ? ' stitch-btn--active' : ''}`}
                onClick={() => setSelectedStitch('erase')}
                title="Borrar"
              >
                <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                  <EraseIcon active={selectedStitch === 'erase'} />
                </svg>
                <span className="stitch-btn__abbr">✕</span>
                <span className="stitch-btn__label">Borrar</span>
              </button>
            </div>
          </div>

          {/* Color de hilo */}
          <div className="panel">
            <h3 className="panel__title">Color de hilo</h3>
            <div className="color-palette">
              {COLORS.map(c => (
                <button
                  key={c}
                  className={`color-btn${selectedColor === c ? ' color-btn--active' : ''}`}
                  style={{ background: c }}
                  onClick={() => setSelectedColor(c)}
                  aria-label={`Color ${c}`}
                />
              ))}
              <input
                type="color"
                className="color-custom"
                value={selectedColor}
                onChange={e => setSelectedColor(e.target.value)}
                title="Color personalizado"
              />
            </div>
            <div className="color-preview">
              <span style={{ background: selectedColor }} className="color-preview__dot" />
              <span className="color-preview__hex">{selectedColor}</span>
            </div>
          </div>

          {/* Tamaño */}
          <div className="panel">
            <h3 className="panel__title">Tamaño de la cuadrícula</h3>
            <div className="grid-size">
              <label>Filas
                <input type="number" min="5" max="40" value={rows}
                  onChange={e => handleResize(Number(e.target.value), cols)} />
              </label>
              <label>Columnas
                <input type="number" min="5" max="50" value={cols}
                  onChange={e => handleResize(rows, Number(e.target.value))} />
              </label>
            </div>
            <p className="grid-info">{rows} × {cols} · {stitchCount} punto{stitchCount !== 1 ? 's' : ''}</p>
          </div>

          {/* Archivo */}
          <div className="panel">
            <h3 className="panel__title">Archivo</h3>
            <button className="action-btn action-btn--primary" onClick={exportPNG}>↓ Exportar PNG</button>
            <button className="action-btn" onClick={saveJSON}>↓ Guardar patrón (.json)</button>
            <button className="action-btn" onClick={() => jsonInputRef.current.click()}>↑ Cargar patrón (.json)</button>
            <input ref={jsonInputRef} type="file" accept=".json" className="file-hidden" onChange={loadJSON} />
            <button className="action-btn action-btn--danger"
              onClick={() => { if (window.confirm('¿Limpiar toda la cuadrícula?')) setGrid(makeGrid(rows, cols)) }}>
              Limpiar todo
            </button>
          </div>

          {/* Imagen de referencia */}
          <div className="panel">
            <h3 className="panel__title">Imagen de referencia</h3>
            <p className="panel__hint">Sube una foto para calcar el patrón encima</p>
            <button className="action-btn" onClick={() => fileInputRef.current.click()}>↑ Subir imagen</button>
            <input ref={fileInputRef} type="file" accept="image/*" className="file-hidden" onChange={loadBgImage} />
            {bgImage && (
              <>
                <div className="opacity-row">
                  <label className="opacity-label">Opacidad</label>
                  <input type="range" min="0.05" max="0.9" step="0.05" value={bgOpacity}
                    onChange={e => setBgOpacity(Number(e.target.value))} className="opacity-slider" />
                  <span className="opacity-value">{Math.round(bgOpacity * 100)}%</span>
                </div>
                <button className="action-btn" onClick={() => setBgImage(null)}>✕ Quitar imagen</button>
              </>
            )}
          </div>

          {/* Leyenda desplegable */}
          <div className="panel">
            <button className="legend-toggle" onClick={() => setShowLegend(v => !v)}>
              {showLegend ? '▲' : '▼'} Leyenda completa ({ALL_STITCHES.length} puntos)
            </button>
            {showLegend && (
              <div className="legend-list">
                {STITCH_CATEGORIES.map(cat => (
                  <div key={cat.id}>
                    <p className="legend-cat">{cat.label}</p>
                    {cat.stitches.map(s => (
                      <div key={s.id} className="legend-item">
                        <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                          <StitchSymbol stitch={s.id} color="#C4764A" size={20} />
                        </svg>
                        <span className="legend-abbr">{s.abbr}</span>
                        <span className="legend-label">{s.label}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Cuadrícula SVG */}
        <div className="disenador__canvas-wrap">
          <div className="canvas-hint">Haz clic o arrastra para dibujar · Punto activo: <strong>{selectedStitch}</strong></div>
          <div className="canvas-scroll">
            <svg
              ref={svgRef}
              width={svgWidth}
              height={svgHeight}
              className="stitch-grid"
              onMouseLeave={() => setPainting(false)}
            >
              <rect width={svgWidth} height={svgHeight} fill="#F9F5F1" />

              {bgImage && (
                <image href={bgImage} x={0} y={0} width={svgWidth} height={svgHeight}
                  opacity={bgOpacity} preserveAspectRatio="xMidYMid meet" />
              )}

              {Array.from({ length: rows + 1 }, (_, i) => (
                <line key={`h${i}`} x1={0} y1={i * CELL} x2={svgWidth} y2={i * CELL}
                  stroke="#D8CBBF" strokeWidth={i % 5 === 0 ? 1 : 0.5} />
              ))}
              {Array.from({ length: cols + 1 }, (_, j) => (
                <line key={`v${j}`} x1={j * CELL} y1={0} x2={j * CELL} y2={svgHeight}
                  stroke="#D8CBBF" strokeWidth={j % 5 === 0 ? 1 : 0.5} />
              ))}

              {grid.map((row, r) =>
                row.map((cell, c) => (
                  <g
                    key={`${r}-${c}`}
                    transform={`translate(${c * CELL}, ${r * CELL})`}
                    onMouseDown={() => { setPainting(true); paint(r, c) }}
                    onMouseEnter={() => { if (painting) paint(r, c) }}
                    onMouseUp={() => setPainting(false)}
                    style={{ cursor: 'crosshair' }}
                  >
                    <rect width={CELL} height={CELL} fill={cell.stitch ? cell.color + '28' : 'transparent'} />
                    {cell.stitch && (
                      <svg x={CELL * 0.08} y={CELL * 0.08} width={CELL * 0.84} height={CELL * 0.84} viewBox="0 0 20 20">
                        <StitchSymbol stitch={cell.stitch} color={cell.color} size={20} />
                      </svg>
                    )}
                  </g>
                ))
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
