'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent } from '../../ui/card'
import { Label } from '../../ui/label'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'
import { Plus, Trash, ArrowUp, ArrowDown, Eye, Palette, TextT, Info } from '@phosphor-icons/react'
import type { HeroStyleValue } from '../types/cms-types'

export type { HeroStyleValue }

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GradientStop {
  color: string    // hex
  opacity: number  // 0–100
  position: number // 0–100
}

export interface GradientConfig {
  direction: string  // CSS gradient direction e.g. "to top" or "135deg"
  stops: GradientStop[]
}

interface BlogHeroStyleEditorProps {
  value: HeroStyleValue
  onChange: (value: HeroStyleValue) => void
  disabled?: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GRADIENT_DIRECTIONS = [
  { label: 'Bottom → Top', value: 'to top' },
  { label: 'Top → Bottom', value: 'to bottom' },
  { label: 'Left → Right', value: 'to right' },
  { label: 'Right → Left', value: 'to left' },
  { label: 'Diagonal ↗', value: 'to top right' },
  { label: 'Diagonal ↖', value: 'to top left' },
  { label: 'Diagonal ↘', value: 'to bottom right' },
  { label: 'Diagonal ↙', value: 'to bottom left' },
]

const SHADOW_PRESETS = [
  { label: 'Default (heavy)', value: 'default', css: '0_4px_8px_rgba(0,0,0,0.9)' },
  { label: 'Light', value: 'light', css: '0_2px_4px_rgba(0,0,0,0.5)' },
  { label: 'Medium', value: 'medium', css: '0_3px_6px_rgba(0,0,0,0.7)' },
  { label: 'None', value: 'none', css: '' },
]

const DEFAULT_GRADIENT: GradientConfig = {
  direction: 'to top',
  stops: [
    { color: '#7c2d12', opacity: 100, position: 0 },
    { color: '#b45309', opacity: 100, position: 50 },
    { color: '#0c4a6e', opacity: 100, position: 100 },
  ],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexWithOpacity(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const a = Math.round((opacity / 100) * 100) / 100
  return `rgba(${r},${g},${b},${a})`
}

export function buildGradientCSS(config: GradientConfig): string {
  const stops = config.stops
    .slice()
    .sort((a, b) => a.position - b.position)
    .map(s => `${hexWithOpacity(s.color, s.opacity)} ${s.position}%`)
    .join(', ')
  return `linear-gradient(${config.direction}, ${stops})`
}

function parseGradientValue(raw: string | null): GradientConfig {
  if (!raw) return DEFAULT_GRADIENT
  try {
    const parsed = JSON.parse(raw)
    if (parsed?.direction && Array.isArray(parsed?.stops)) return parsed as GradientConfig
  } catch {
    // not JSON — ignore
  }
  return DEFAULT_GRADIENT
}

function serializeGradient(config: GradientConfig): string {
  return JSON.stringify(config)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ColorPickerRow({
  label,
  color,
  onChange,
  disabled,
  showReset,
  onReset,
  sublabel,
}: {
  label: string
  color: string
  onChange: (c: string) => void
  disabled?: boolean
  showReset?: boolean
  onReset?: () => void
  sublabel?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <Label className="text-xs font-medium">{label}</Label>
        {sublabel && <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>}
      </div>
      <div className="flex items-center gap-2">
        {showReset && onReset && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            disabled={disabled}
            className="h-7 px-2 text-xs text-muted-foreground"
            title="Reset to default"
          >
            Reset
          </Button>
        )}
        <div className="relative flex items-center gap-1">
          <input
            type="color"
            value={color}
            onChange={e => onChange(e.target.value)}
            disabled={disabled}
            className="w-9 h-9 rounded-md border border-input cursor-pointer p-0.5"
          />
          <Input
            type="text"
            value={color}
            onChange={e => {
              const v = e.target.value
              if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v)
            }}
            disabled={disabled}
            className="w-24 h-9 font-mono text-xs"
            maxLength={7}
          />
        </div>
      </div>
    </div>
  )
}

function GradientStopRow({
  stop,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  disabled,
}: {
  stop: GradientStop
  index: number
  total: number
  onChange: (s: GradientStop) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30">
      <span className="text-xs text-muted-foreground w-4 shrink-0">{index + 1}.</span>
      <input
        type="color"
        value={stop.color}
        onChange={e => onChange({ ...stop, color: e.target.value })}
        disabled={disabled}
        className="w-8 h-8 rounded cursor-pointer border border-input p-0.5 shrink-0"
      />
      <Input
        type="text"
        value={stop.color}
        onChange={e => {
          const v = e.target.value
          if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange({ ...stop, color: v })
        }}
        disabled={disabled}
        className="w-20 h-8 font-mono text-xs shrink-0"
        maxLength={7}
      />
      <div className="flex items-center gap-1 shrink-0">
        <Label className="text-xs text-muted-foreground w-10">Opacity</Label>
        <Input
          type="number"
          value={stop.opacity}
          min={0}
          max={100}
          onChange={e => onChange({ ...stop, opacity: Math.min(100, Math.max(0, +e.target.value)) })}
          disabled={disabled}
          className="w-14 h-8 text-xs"
        />
        <span className="text-xs text-muted-foreground">%</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Label className="text-xs text-muted-foreground w-8">Pos</Label>
        <Input
          type="number"
          value={stop.position}
          min={0}
          max={100}
          onChange={e => onChange({ ...stop, position: Math.min(100, Math.max(0, +e.target.value)) })}
          disabled={disabled}
          className="w-14 h-8 text-xs"
        />
        <span className="text-xs text-muted-foreground">%</span>
      </div>
      <div className="flex gap-1 ml-auto shrink-0">
        <Button type="button" variant="ghost" size="sm" onClick={onMoveUp} disabled={disabled || index === 0} className="h-7 w-7 p-0">
          <ArrowUp size={12} />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onMoveDown} disabled={disabled || index === total - 1} className="h-7 w-7 p-0">
          <ArrowDown size={12} />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove} disabled={disabled || total <= 2} className="h-7 w-7 p-0 text-red-500 hover:text-red-700">
          <Trash size={12} />
        </Button>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BlogHeroStyleEditor({ value, onChange, disabled }: BlogHeroStyleEditorProps) {
  const bgType = value.hero_bg_type ?? 'default'
  const solidColor = value.hero_bg_value && bgType === 'solid' ? value.hero_bg_value : '#1e3a5f'
  const gradientConfig = bgType === 'gradient' ? parseGradientValue(value.hero_bg_value) : DEFAULT_GRADIENT
  const titleColor = value.hero_title_color ?? '#ffffff'
  const shadowValue = value.hero_title_shadow ?? 'default'
  const metaColor = value.hero_meta_color ?? '#fde68a'

  // ── preview CSS ──
  let previewBg = 'linear-gradient(to top, rgba(124,45,18,0.6), rgba(180,83,9,0.3), rgba(12,74,110,0.4))'
  if (bgType === 'solid') {
    previewBg = solidColor
  } else if (bgType === 'gradient') {
    previewBg = buildGradientCSS(gradientConfig)
  }

  const shadowCSS =
    shadowValue === 'none'
      ? 'none'
      : shadowValue === 'default' || !shadowValue
      ? '0 4px 8px rgba(0,0,0,0.9)'
      : SHADOW_PRESETS.find(p => p.value === shadowValue)?.css.replace(/_/g, ' ') ?? shadowValue

  const set = useCallback(
    (partial: Partial<HeroStyleValue>) => onChange({ ...value, ...partial }),
    [value, onChange]
  )

  // ── Gradient helpers ──
  const setGradient = useCallback(
    (cfg: GradientConfig) => {
      set({ hero_bg_value: serializeGradient(cfg), hero_bg_type: 'gradient' })
    },
    [set]
  )

  const addStop = () => {
    if (gradientConfig.stops.length >= 5) return
    const lastPos = Math.min(100, gradientConfig.stops[gradientConfig.stops.length - 1].position + 10)
    setGradient({
      ...gradientConfig,
      stops: [...gradientConfig.stops, { color: '#ffffff', opacity: 80, position: lastPos }],
    })
  }

  const updateStop = (i: number, s: GradientStop) => {
    const stops = gradientConfig.stops.map((orig, idx) => (idx === i ? s : orig))
    setGradient({ ...gradientConfig, stops })
  }

  const removeStop = (i: number) => {
    setGradient({ ...gradientConfig, stops: gradientConfig.stops.filter((_, idx) => idx !== i) })
  }

  const moveStop = (i: number, dir: -1 | 1) => {
    const stops = [...gradientConfig.stops]
    const j = i + dir
    if (j < 0 || j >= stops.length) return
    ;[stops[i], stops[j]] = [stops[j], stops[i]]
    setGradient({ ...gradientConfig, stops })
  }

  return (
    <div className="space-y-6">
      {/* ── Live Preview ── */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Eye size={16} className="text-muted-foreground" />
            <Label className="text-sm font-semibold">Live Preview</Label>
          </div>
          <div
            className="relative rounded-xl overflow-hidden h-28 flex items-center justify-center px-6"
            style={{ background: previewBg }}
          >
            {bgType === 'default' && (
              <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,rgba(255,200,100,0.2)_0px,rgba(255,200,100,0.2)_2px,transparent_2px,transparent_12px)]" />
            )}
            <div className="text-center relative z-10">
              <p
                className="font-bold text-lg leading-tight"
                style={{
                  color: titleColor,
                  textShadow: shadowCSS === 'none' ? 'none' : shadowCSS,
                }}
              >
                Sample Hero Title
              </p>
              <p className="text-sm mt-1" style={{ color: metaColor }}>
                Pandit Ji • 5 min read • March 7, 2026
              </p>
            </div>
          </div>
          {bgType === 'default' && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Info size={12} />
              Default mode uses the animated sunrise background (same as blog listing page).
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── Background ── */}
      <Card>
        <CardContent className="pt-4 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Palette size={16} className="text-muted-foreground" />
            <Label className="text-sm font-semibold">Hero Background</Label>
          </div>

          {/* Type selector */}
          <div className="grid grid-cols-3 gap-2">
            {(['default', 'solid', 'gradient'] as const).map(t => (
              <button
                key={t}
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (t === 'default') set({ hero_bg_type: 'default', hero_bg_value: null })
                  else if (t === 'solid') set({ hero_bg_type: 'solid', hero_bg_value: solidColor })
                  else set({ hero_bg_type: 'gradient', hero_bg_value: serializeGradient(gradientConfig) })
                }}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                  bgType === t
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-muted/40 hover:bg-muted border-input text-muted-foreground'
                }`}
              >
                {t === 'default' ? '🌅 Default' : t === 'solid' ? '🎨 Solid' : '🌈 Gradient'}
              </button>
            ))}
          </div>

          {/* Solid color picker */}
          {bgType === 'solid' && (
            <div className="pt-1">
              <ColorPickerRow
                label="Background Color"
                sublabel="Pick any solid color for the hero background"
                color={solidColor}
                onChange={c => set({ hero_bg_type: 'solid', hero_bg_value: c })}
                disabled={disabled}
              />
            </div>
          )}

          {/* Gradient builder */}
          {bgType === 'gradient' && (
            <div className="space-y-3">
              {/* Direction */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">Gradient Direction</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {GRADIENT_DIRECTIONS.map(d => (
                    <button
                      key={d.value}
                      type="button"
                      disabled={disabled}
                      onClick={() => setGradient({ ...gradientConfig, direction: d.value })}
                      className={`py-1 px-2 rounded text-xs font-medium transition-all border ${
                        gradientConfig.direction === d.value
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted/40 hover:bg-muted border-input text-muted-foreground'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color stops */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Color Stops ({gradientConfig.stops.length}/5)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addStop}
                    disabled={disabled || gradientConfig.stops.length >= 5}
                    className="h-7 gap-1 text-xs"
                  >
                    <Plus size={12} />
                    Add Stop
                  </Button>
                </div>
                <div className="space-y-1.5">
                  {gradientConfig.stops.map((stop, i) => (
                    <GradientStopRow
                      key={i}
                      stop={stop}
                      index={i}
                      total={gradientConfig.stops.length}
                      onChange={s => updateStop(i, s)}
                      onRemove={() => removeStop(i)}
                      onMoveUp={() => moveStop(i, -1)}
                      onMoveDown={() => moveStop(i, 1)}
                      disabled={disabled}
                    />
                  ))}
                </div>
              </div>

              {/* Gradient preview bar */}
              <div
                className="h-8 rounded-lg border"
                style={{ background: buildGradientCSS({ ...gradientConfig, direction: 'to right' }) }}
                title="Gradient preview (shown left→right for clarity)"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Title Text Styling ── */}
      <Card>
        <CardContent className="pt-4 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <TextT size={16} className="text-muted-foreground" />
            <Label className="text-sm font-semibold">Title Text Styling</Label>
          </div>

          <ColorPickerRow
            label="Title Color"
            sublabel="Color of the hero title text"
            color={titleColor}
            onChange={c => set({ hero_title_color: c })}
            disabled={disabled}
            showReset
            onReset={() => set({ hero_title_color: null })}
          />

          {/* Shadow presets */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Title Shadow</Label>
            <div className="grid grid-cols-4 gap-1.5">
              {SHADOW_PRESETS.map(p => (
                <button
                  key={p.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => set({ hero_title_shadow: p.value })}
                  className={`py-1.5 px-2 rounded text-xs font-medium transition-all border ${
                    shadowValue === p.value || (p.value === 'default' && (shadowValue === 'default' || !shadowValue))
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted/40 hover:bg-muted border-input text-muted-foreground'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Meta Text Styling ── */}
      <Card>
        <CardContent className="pt-4 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <TextT size={16} className="text-muted-foreground" weight="light" />
            <Label className="text-sm font-semibold">Meta Text Styling</Label>
            <Badge variant="outline" className="text-xs">Author · Date · Reading Time</Badge>
          </div>

          <ColorPickerRow
            label="Meta Text Color"
            sublabel="Color of author name, date and reading time"
            color={metaColor}
            onChange={c => set({ hero_meta_color: c })}
            disabled={disabled}
            showReset
            onReset={() => set({ hero_meta_color: null })}
          />
        </CardContent>
      </Card>
    </div>
  )
}
