<script setup lang="ts">
import { reactive } from 'vue'
import { audioWaveforms } from './audioWaveforms'

const navLinks = [
  { label: 'Results', href: '#results' },
  { label: 'Demos', href: '#demos' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Controls', href: '#controls' },
  { label: 'Data', href: '#data' },
  { label: 'Training', href: '#training' },
]

const heroStats = [
  { value: '3B', label: 'total parameters' },
  { value: '1.7B', label: 'Qwen3 base LLM' },
  { value: '8.5M', label: 'training examples' },
  { value: '1M', label: 'MIDI and sketch-control pairs' },
]

const contributionCards = [
  {
    title: 'One model for audio understanding and generation',
    detail:
      'UniGAMA unifies audio-to-text understanding, audio reasoning, text-to-audio generation, and text-guided audio editing in a single decoder-only architecture.',
  },
  {
    title: 'Continuous latent audio generation',
    detail:
      'Instead of autoregressing over discrete codec tokens, UniGAMA predicts conditional-flow velocity over DAC-VAE latents, preserving a high-fidelity continuous audio path.',
  },
  {
    title: 'Language-Bridged Refiner',
    detail:
      'The generation pathway preserves pretrained language representations through multilevel hidden-state bridges, token-type adaptive layer normalization, per-head attention gates, and a coarse-to-fine diffusion head.',
  },
  {
    title: 'Task-Aware Transfusion',
    detail:
      'Packed text and audio sequences share one forward pass while combining next-token prediction with conditional flow matching under task-aware attention and diffusion-loss schedules.',
  },
]

const resultRows = [
  {
    group: 'Audio reasoning',
    task: 'MMAU',
    metric: 'Sound / Music / Speech / Avg',
    value: '46.4 / 40.6 / 54.3 / 47.1',
  },
  {
    group: 'Audio reasoning',
    task: 'MMAR',
    metric: 'Accuracy',
    value: '41.6',
  },
  {
    group: 'Text-to-audio',
    task: 'AudioCaps',
    metric: 'FD / KL / IS / CLAP / AES',
    value: '175.63 / 2.72 / 9.30 / 0.38 / 4.02',
  },
  {
    group: 'Captioning',
    task: 'AudioCaps',
    metric: 'METEOR / CIDEr / SPIDEr / FENSE',
    value: '15.1 / 49.2 / 12.2 / 41.1',
  },
  {
    group: 'Captioning',
    task: 'Clotho',
    metric: 'METEOR / CIDEr / SPIDEr / FENSE',
    value: '10.2 / 9.2 / 8.4 / 41.4',
  },
  {
    group: 'Speech',
    task: 'LibriTTS ASR',
    metric: 'WER lower is better',
    value: '13.70',
  },
  {
    group: 'Speech',
    task: 'LibriTTS TTS',
    metric: 'Whisper WER lower is better',
    value: '25.53',
  },
]

const audioDemos = [
  {
    title: 'Audio reconstruction',
    task: 'Audio preservation',
    prompt: 'Reproduce this audio without any changes.',
    comparison: '/audios/reconstruct_gen_left_ref_right.wav',
    clips: [
      { label: 'Input', src: '/audios/reconstruct_input.wav' },
      { label: 'Generated', src: '/audios/reconstruct_gen.wav' },
      { label: 'Reference', src: '/audios/reconstruct_gt.wav' },
    ],
  },
  {
    title: 'Reverse audio editing',
    task: 'Instruction-guided editing',
    prompt: 'Play this audio backwards.',
    comparison: '/audios/play_this_audio_backwards_gen_left_ref_right.wav',
    clips: [
      { label: 'Input', src: '/audios/play_this_audio_backwards_input.wav' },
      { label: 'Generated', src: '/audios/play_this_audio_backwards_gen.wav' },
      { label: 'Reference', src: '/audios/play_this_audio_backwards_gt.wav' },
    ],
  },
  {
    title: 'Tech house drum loop',
    task: 'Sketch-to-drum-loop',
    prompt: 'Tech house drum loop.',
    comparison: '/audios/tech_house_drum_loop_gen_left_ref_right.wav',
    clips: [
      { label: 'Generated', src: '/audios/tech_house_drum_loop_gen.wav' },
      { label: 'Reference', src: '/audios/tech_house_drum_loop_gt.wav' },
    ],
  },
  {
    title: 'Warm pad melody',
    task: 'Sketch-to-instrument',
    prompt: 'Warm pad melody.',
    comparison: '/audios/warm_pad_melody_gen_left_ref_right.wav',
    clips: [
      { label: 'Generated', src: '/audios/warm_pad_melody_gen.wav' },
      { label: 'Reference', src: '/audios/warm_pad_melody_gt.wav' },
    ],
  },
  {
    title: 'MIDI-to-audio example 004',
    task: 'MIDI rendering',
    prompt: 'Render the MIDI performance as an instrument sound.',
    comparison: '/audios/midi2audio_004_gen_left_ref_right.wav',
    clips: [
      { label: 'Generated', src: '/audios/midi2audio_004_gen.wav' },
      { label: 'Reference', src: '/audios/midi2audio_004_gt.wav' },
    ],
  },
  {
    title: 'MIDI-to-audio example 005',
    task: 'MIDI rendering',
    prompt: 'Render the MIDI performance as an instrument sound.',
    comparison: '/audios/midi2audio_005_gen_left_ref_right.wav',
    clips: [
      { label: 'Generated', src: '/audios/midi2audio_005_gen.wav' },
      { label: 'Reference', src: '/audios/midi2audio_005_gt.wav' },
    ],
  },
]

const architectureBlocks = [
  {
    title: 'Audio tokenization',
    detail:
      'Target waveforms are encoded as 48 kHz mono DAC-VAE latents. Understanding tasks use audio features for text prediction; generation tasks supervise latent velocity.',
  },
  {
    title: 'Base language model',
    detail:
      'Qwen3-1.7B-Base provides the shared decoder-only language backbone for prompts, answers, captions, and task instructions.',
  },
  {
    title: 'Latent refiner',
    detail:
      'The Language-Bridged Refiner receives language hidden states and timestep conditioning, then predicts flow-matching velocity for audio spans.',
  },
  {
    title: 'Guided inference',
    detail:
      'Three-branch classifier-free guidance separates text conditioning from source-audio conditioning, while partial noising enables edit-mode generation.',
  },
]

const controlBuckets = [
  {
    title: 'MIDI-to-audio',
    count: '399,996',
    detail:
      'Monophonic MIDI performances are rendered through Vital voices spanning sine, saw, square, triangle, bass, pluck, bell, keys, organ, pad, string, brass, supersaw, and chiptune families.',
  },
  {
    title: 'Sketch-to-instrument',
    count: '400,000',
    detail:
      'Synthetic vocal sketches such as hum, breathy hum, whistle, buzzy voice, and la variants follow MIDI pitch and timing, then condition target instrument renderings.',
  },
  {
    title: 'Sketch-to-drum-loop',
    count: '150,000',
    detail:
      'Beatbox-like controls condition full drum loops built from sample-pack one-shots, with house, techno, hip hop, trap, drum and bass, and afro-inspired templates.',
  },
  {
    title: 'Sketch-to-one-shot',
    count: '50,004',
    detail:
      'Isolated kick, clap, snare, hat, percussion, and effect one-shots teach transient control in addition to full loops and melodic instruments.',
  },
]

const acousticFeatures = [
  'loudness envelope',
  'brightness / spectral centroid',
  'log f0 contour',
  'periodicity',
  'low-frequency rhythmic salience',
  'high-frequency rhythmic salience',
]

const dataStats = [
  { value: '4.54M', label: 'pretraining examples' },
  { value: '3.96M', label: 'SFT examples' },
  { value: '2.5M', label: 'AudioSkills-XL QA examples' },
  { value: '1.7M', label: 'AudioSet examples' },
  { value: '1.34M', label: 'Common Voice examples' },
  { value: '1.25M', label: 'LibriVox examples' },
]

const taskFamilies = [
  'audio question answering',
  'audio captioning',
  'text-to-audio generation',
  'text-guided audio editing',
  'audio preservation',
  'audio inpainting',
  'scene mixing',
  'speech style transfer',
  'MIDI rendering',
  'sketch-conditioned rendering',
]

const trainingStages = [
  {
    title: 'Stage 1: pretraining',
    detail:
      'Train the unified language and latent-generation path on audio-to-text, text-to-audio, ASR, TTS, and language-modeling data with a 2:2:1 T2A:A2T:text mixture.',
  },
  {
    title: 'Stage 2: supervised fine-tuning',
    detail:
      'Mix reasoning, captioning, editing, preservation, inpainting, scene mixing, MIDI rendering, and sketch-conditioned generation using homogeneous microbatches.',
  },
  {
    title: 'Control robustness',
    detail:
      'Augment sketch controls with median filtering, temporal jitter, quantization, control noise, frame dropout, gain jitter, pitch jitter, periodicity jitter, and channel dropout.',
  },
  {
    title: 'Prompt diversity',
    detail:
      'Use Qwen3-0.6B with vLLM to rewrite metadata-derived labels into short 4-12 word prompts while preserving only facts present in the generated metadata.',
  },
]

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.round(seconds - minutes * 60)
  return `${minutes}:${remainder.toString().padStart(2, '0')}`
}

const hasWaveform = (src: string) => src in audioWaveforms
const waveformDuration = (src: string) => audioWaveforms[src]?.duration ?? 0
const waveformPeaks = (src: string) => audioWaveforms[src]?.peaks ?? []
const playbackTimes = reactive<Record<string, number>>({})

const playbackProgress = (src: string) => {
  const duration = waveformDuration(src)
  if (duration <= 0) return 0
  return Math.min(1, Math.max(0, (playbackTimes[src] ?? 0) / duration))
}

const handleTimeUpdate = (src: string, event: Event) => {
  const audio = event.currentTarget as HTMLAudioElement
  playbackTimes[src] = audio.currentTime
}

const handleSeek = (src: string, event: MouseEvent) => {
  const duration = waveformDuration(src)
  if (duration <= 0) return
  const target = event.currentTarget as SVGSVGElement
  const audio = target.parentElement?.querySelector('audio') as HTMLAudioElement | null
  if (!audio) return
  const rect = target.getBoundingClientRect()
  const progress = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
  const time = progress * duration
  audio.currentTime = time
  playbackTimes[src] = time
}
</script>

<template>
  <main class="page-shell">
    <section class="hero-section">
      <div class="hero-sheen"></div>
      <div class="content hero-content">
        <nav class="top-nav" aria-label="Primary navigation">
          <a v-for="link in navLinks" :key="link.href" :href="link.href" class="nav-link">
            {{ link.label }}
          </a>
        </nav>

        <div class="hero-grid">
          <div class="hero-copy-block">
            <img src="/logo.png?v=20260514" alt="UniGAMA logo" width="132" height="146" class="hero-logo">
            <p class="eyebrow">Unified Generative Audio Model Architecture</p>
            <h1>UniGAMA</h1>
            <p class="hero-copy">
              A unified audio-language model for understanding, reasoning, generation, and editing. UniGAMA brings
              audio-to-text reasoning, text-to-audio synthesis, text-guided editing, MIDI rendering, and sketch-to-sound
              control into one continuous-latent decoder-only model.
            </p>
            <div class="hero-actions">
              <a class="button button-primary" href="#demos">Listen to demos</a>
              <a class="button button-secondary" href="#controls">MIDI and sketch controls</a>
            </div>
          </div>

          <figure class="hero-figure">
            <img src="/figures/unigama-venn.png?v=20260514" alt="UniGAMA capability comparison">
          </figure>
        </div>

        <div class="hero-stats" aria-label="UniGAMA summary statistics">
          <div v-for="stat in heroStats" :key="stat.label" class="stat-card stat-card-hero">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section-band section-band-light">
      <div class="content intro-grid">
        <div>
          <p class="section-kicker">Why UniGAMA</p>
          <h2>One audio model that can listen, reason, generate, and edit.</h2>
          <p class="lead-text">
            Audio systems are usually split between understanding models that cannot synthesize audio and generators
            that cannot reason about audio. UniGAMA closes that gap by training a shared language backbone and latent
            audio generator together, using one sequence format and one set of model weights.
          </p>
        </div>
        <div class="feature-grid">
          <article v-for="feature in contributionCards" :key="feature.title" class="info-card">
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.detail }}</p>
          </article>
        </div>
      </div>

      <div class="content">
        <figure class="wide-figure">
          <img src="/figures/unified-comparison.png?v=20260514" alt="Comparison of audio language models and unified audio-language models" loading="lazy">
          <figcaption>
            UniGAMA keeps the continuous-latent generation path while adding language bridges, adaptive normalization,
            attention gates, and task-aware flow matching for reasoning, generation, and editing.
          </figcaption>
        </figure>
      </div>
    </section>

    <section id="results" class="section-band">
      <div class="content">
        <div class="section-heading">
          <p class="section-kicker">Results Snapshot</p>
          <h2>Evaluated across reasoning, generation, captioning, and speech tasks.</h2>
          <p>
            The current paper reports UniGAMA on audio reasoning benchmarks, text-to-audio generation, audio captioning,
            ASR, and TTS. Lower is better for FD, KL, and WER; higher is better for the remaining metrics.
          </p>
        </div>

        <div class="table-wrap">
          <table class="benchmark-table">
            <thead>
              <tr>
                <th>Area</th>
                <th>Task</th>
                <th>Metric</th>
                <th>UniGAMA</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in resultRows" :key="row.group + row.task">
                <td>{{ row.group }}</td>
                <td><strong>{{ row.task }}</strong></td>
                <td>{{ row.metric }}</td>
                <td><strong class="result-value">{{ row.value }}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section id="demos" class="section-band section-band-light">
      <div class="content">
        <div class="section-heading">
          <p class="section-kicker">Audio Demos</p>
          <h2>Representative generations from editing, MIDI rendering, and sketch controls.</h2>
          <p>
            Each card shows the prompt and the available input, generated output, and reference audio. These clips
            illustrate UniGAMA's unified audio path across preservation, editing, MIDI-to-audio, sketch-to-drums, and
            sketch-to-instrument tasks.
          </p>
        </div>

        <div class="demo-grid">
          <article v-for="demo in audioDemos" :key="demo.title" class="demo-card">
            <div class="demo-card-header">
              <span>{{ demo.task }}</span>
              <h3>{{ demo.title }}</h3>
              <p>{{ demo.prompt }}</p>
            </div>

            <div class="clip-stack">
              <div v-for="clip in demo.clips" :key="clip.src" class="clip-row">
                <div class="clip-meta">
                  <strong>{{ clip.label }}</strong>
                  <span v-if="hasWaveform(clip.src)">{{ formatDuration(waveformDuration(clip.src)) }}</span>
                </div>
                <svg
                  v-if="hasWaveform(clip.src)"
                  class="waveform"
                  viewBox="0 0 960 108"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  @click="handleSeek(clip.src, $event)"
                >
                  <rect width="960" height="108" rx="18" class="waveform-bg" />
                  <line x1="0" y1="54" x2="960" y2="54" class="waveform-midline" />
                  <rect
                    v-for="(peak, index) in waveformPeaks(clip.src)"
                    :key="`${clip.src}-${index}`"
                    :x="index * 10 + 1.8"
                    :y="54 - Math.max(1.6, peak * 48)"
                    width="6.4"
                    :height="Math.max(3.2, peak * 96)"
                    rx="3.2"
                    class="waveform-bar"
                  />
                  <rect
                    :width="playbackProgress(clip.src) * 960"
                    height="108"
                    rx="18"
                    class="waveform-progress-fill"
                  />
                  <line
                    :x1="playbackProgress(clip.src) * 960"
                    y1="9"
                    :x2="playbackProgress(clip.src) * 960"
                    y2="99"
                    class="waveform-playhead"
                  />
                </svg>
                <audio
                  :src="clip.src"
                  controls
                  preload="metadata"
                  @timeupdate="handleTimeUpdate(clip.src, $event)"
                  @seeked="handleTimeUpdate(clip.src, $event)"
                  @loadedmetadata="handleTimeUpdate(clip.src, $event)"
                  @ended="handleTimeUpdate(clip.src, $event)"
                ></audio>
              </div>

              <div class="clip-row comparison-row">
                <div class="clip-meta">
                  <strong>Synced comparison</strong>
                  <span>Generated left · Reference right</span>
                </div>
                <svg
                  class="waveform waveform-comparison"
                  viewBox="0 0 960 108"
                  preserveAspectRatio="none"
                  aria-label="Synchronized stereo comparison waveform. Generated audio is in the left channel and reference audio is in the right channel."
                  role="img"
                  @click="handleSeek(demo.comparison, $event)"
                >
                  <rect width="960" height="108" rx="18" class="waveform-bg" />
                  <line x1="0" y1="54" x2="960" y2="54" class="waveform-midline" />
                  <rect
                    v-for="(peak, index) in waveformPeaks(demo.comparison)"
                    :key="`${demo.comparison}-${index}`"
                    :x="index * 10 + 1.8"
                    :y="54 - Math.max(1.6, peak * 48)"
                    width="6.4"
                    :height="Math.max(3.2, peak * 96)"
                    rx="3.2"
                    class="waveform-bar waveform-bar-comparison"
                  />
                  <rect
                    :width="playbackProgress(demo.comparison) * 960"
                    height="108"
                    rx="18"
                    class="waveform-progress-fill"
                  />
                  <line
                    :x1="playbackProgress(demo.comparison) * 960"
                    y1="9"
                    :x2="playbackProgress(demo.comparison) * 960"
                    y2="99"
                    class="waveform-playhead"
                  />
                </svg>
                <audio
                  :src="demo.comparison"
                  controls
                  preload="metadata"
                  @timeupdate="handleTimeUpdate(demo.comparison, $event)"
                  @seeked="handleTimeUpdate(demo.comparison, $event)"
                  @loadedmetadata="handleTimeUpdate(demo.comparison, $event)"
                  @ended="handleTimeUpdate(demo.comparison, $event)"
                ></audio>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="architecture" class="section-band section-band-dark">
      <div class="content">
        <div class="section-heading">
          <p class="section-kicker">Architecture</p>
          <h2>Task-Aware Transfusion over packed text and audio spans.</h2>
          <p>
            UniGAMA combines next-token prediction for text with conditional flow matching for audio latents. A
            task-aware attention mask keeps language causal while allowing audio spans to use bidirectional latent
            context during generation and editing.
          </p>
        </div>

        <figure class="wide-figure dark-figure">
          <img src="/figures/dac-vae.png?v=20260514" alt="UniGAMA architecture overview" loading="lazy">
          <figcaption>
            UniGAMA packs text tokens and DAC-VAE audio latents into a unified sequence, processes them with a shared
            decoder-only backbone, and uses the Language-Bridged Refiner to predict flow-matching velocity for output
            audio spans.
          </figcaption>
        </figure>

        <div class="architecture-grid">
          <article v-for="block in architectureBlocks" :key="block.title" class="dark-card">
            <h3>{{ block.title }}</h3>
            <p>{{ block.detail }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="controls" class="section-band section-band-light">
      <div class="content control-layout">
        <div>
          <p class="section-kicker">Control-Conditioned Extensions</p>
          <h2>MIDI-to-sound and sketch-to-sound are first-class training tasks.</h2>
          <p class="lead-text">
            UniGAMA extends the base understanding/generation model with frame-aligned controls. MIDI controls provide
            symbolic pitch, timing, velocity, and instrument-family signals. Sketch controls provide human-like
            time-varying acoustic cues extracted from humming, beatboxing, tapping, vocal imitation, or degraded target
            audio.
          </p>
          <div class="chip-list feature-chips">
            <span v-for="feature in acousticFeatures" :key="feature">{{ feature }}</span>
          </div>
        </div>
        <article class="task-panel control-note-panel">
          <h3>Frame-aligned control schema</h3>
          <p>
            MIDI and sketch controls are projected into one fixed-width time-control tensor. MIDI occupies the symbolic
            slice, sketch features occupy the acoustic slice, and source flags tell the model which control family is
            active for each training example.
          </p>
          <p>
            This is implementation detail rather than a separate paper figure, so the website keeps it textual.
          </p>
        </article>
      </div>

      <div class="content bucket-grid">
        <article v-for="bucket in controlBuckets" :key="bucket.title" class="bucket-card">
          <span>{{ bucket.count }}</span>
          <h3>{{ bucket.title }}</h3>
          <p>{{ bucket.detail }}</p>
        </article>
      </div>
    </section>

    <section id="data" class="section-band">
      <div class="content data-layout">
        <div>
          <p class="section-kicker">Data Mixture</p>
          <h2>Broad audio tasks plus one million generated control examples.</h2>
          <p class="lead-text">
            The training mixture combines audio reasoning, captioning, speech, text-to-audio, audio editing, and
            control-conditioned rendering. The control-only ratio is 40 percent MIDI-to-audio, 40 percent
            sketch-to-instrument, 15 percent sketch-to-drums, and 5 percent sketch-to-one-shot.
          </p>
          <div class="data-stats">
            <div v-for="stat in dataStats" :key="stat.label" class="stat-card">
              <strong>{{ stat.value }}</strong>
              <span>{{ stat.label }}</span>
            </div>
          </div>
        </div>

        <div class="task-panel">
          <h3>Task families</h3>
          <div class="chip-list">
            <span v-for="task in taskFamilies" :key="task">{{ task }}</span>
          </div>
        </div>
      </div>

      <div class="content">
        <figure class="wide-figure figure-spaced">
          <img src="/figures/inpainting-example.png?v=20260514" alt="Audio inpainting example" loading="lazy">
          <figcaption>Editing tasks use source audio plus text instructions, while generation tasks produce new audio from prompts and optional controls.</figcaption>
        </figure>
      </div>
    </section>

    <section id="training" class="section-band section-band-dark">
      <div class="content training-layout">
        <div>
          <p class="section-kicker">Training Pipeline</p>
          <h2>Joint training with curriculum, robust controls, and prompt augmentation.</h2>
          <p class="lead-text dark-lead">
            UniGAMA uses staged training to stabilize the shared language and audio objectives. Sketch-conditioned
            examples deliberately corrupt controls during training so the model learns to respond to natural human
            recordings instead of only pristine audio-derived features.
          </p>
        </div>
        <div class="timeline">
          <article v-for="(stage, index) in trainingStages" :key="stage.title" class="timeline-item">
            <span>{{ index + 1 }}</span>
            <div>
              <h3>{{ stage.title }}</h3>
              <p>{{ stage.detail }}</p>
            </div>
          </article>
        </div>
      </div>

    </section>

    <footer class="site-footer">
      <div class="content footer-grid">
        <div>
          <img src="/logo.png?v=20260514" alt="" class="footer-logo">
          <strong>UniGAMA</strong>
        </div>
        <p>
          Unified audio-language modeling for understanding, reasoning, generation, editing, MIDI rendering, and
          sketch-conditioned sound synthesis.
        </p>
      </div>
    </footer>
  </main>
</template>

<style scoped>
:global(html) {
  scroll-behavior: smooth;
}

:global(body) {
  margin: 0;
  color: #18120d;
  background: #fff8ec;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

:global(a) {
  color: inherit;
  text-decoration: none;
}

.page-shell {
  min-height: 100vh;
  overflow-x: hidden;
  background:
    radial-gradient(circle at 12% 8%, rgba(255, 196, 87, 0.26), transparent 30rem),
    linear-gradient(180deg, #fff8ec 0%, #fffaf4 46%, #fff2dd 100%);
}

.content {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
}

.hero-section {
  position: relative;
  min-height: 94vh;
  display: flex;
  align-items: center;
  color: #fff8eb;
  background:
    linear-gradient(135deg, rgba(12, 15, 18, 0.98), rgba(44, 32, 20, 0.94) 48%, rgba(128, 73, 22, 0.9)),
    url('/figures/dac-vae.png?v=20260514') center / cover no-repeat;
}

.hero-sheen {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 74% 18%, rgba(255, 210, 110, 0.22), transparent 26rem),
    linear-gradient(90deg, rgba(8, 10, 12, 0.82), rgba(8, 10, 12, 0.34));
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 30px 0 56px;
}

.top-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
  margin-bottom: 48px;
}

.nav-link,
.button {
  display: inline-flex;
  align-items: center;
  min-height: 38px;
  border-radius: 999px;
  font-weight: 800;
}

.nav-link {
  padding: 0 15px;
  border: 1px solid rgba(255, 237, 196, 0.34);
  color: #fff4db;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  font-size: 0.9rem;
}

.nav-link:hover {
  border-color: rgba(255, 204, 93, 0.9);
  background: rgba(255, 255, 255, 0.15);
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.98fr) minmax(320px, 0.78fr);
  gap: 34px;
  align-items: center;
}

.hero-logo {
  width: 132px;
  height: auto;
  margin-bottom: 20px;
  filter: drop-shadow(0 18px 28px rgba(0, 0, 0, 0.35));
}

.eyebrow,
.section-kicker {
  margin: 0 0 14px;
  color: #c87514;
  font-size: 0.78rem;
  font-weight: 950;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero-section .eyebrow,
.section-band-dark .section-kicker {
  color: #ffd171;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  max-width: 840px;
  margin-bottom: 20px;
  font-size: clamp(4rem, 9vw, 8.8rem);
  line-height: 0.9;
  font-weight: 950;
  letter-spacing: -0.07em;
}

h2 {
  color: #1e1610;
  font-size: clamp(2rem, 4.2vw, 4.35rem);
  line-height: 0.98;
  font-weight: 950;
  letter-spacing: -0.045em;
}

h3 {
  color: #26160d;
  font-size: 1.08rem;
  font-weight: 900;
  letter-spacing: -0.01em;
}

.hero-copy {
  max-width: 790px;
  color: #ffe9bf;
  font-size: 1.23rem;
  line-height: 1.72;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.button {
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid transparent;
}

.button-primary {
  color: #271609;
  background: #ffd171;
}

.button-secondary {
  color: #ffe9bf;
  border-color: rgba(255, 237, 196, 0.38);
  background: rgba(255, 255, 255, 0.08);
}

.hero-figure,
.figure-panel,
.wide-figure,
.task-panel {
  margin: 0;
  border: 1px solid rgba(161, 97, 25, 0.18);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.84);
  padding: 14px;
  box-shadow: 0 30px 70px -48px rgba(42, 22, 9, 0.72);
}

.hero-figure {
  background: rgba(255, 247, 233, 0.9);
}

.hero-figure img,
.figure-panel img,
.wide-figure img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 12px;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 34px;
}

.stat-card {
  border: 1px solid rgba(161, 97, 25, 0.16);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.82);
  padding: 18px;
  box-shadow: 0 20px 42px -34px rgba(54, 29, 13, 0.5);
}

.stat-card strong,
.stat-card span {
  display: block;
}

.stat-card strong {
  color: #9f4b07;
  font-size: 1.34rem;
  line-height: 1.1;
}

.stat-card span {
  margin-top: 8px;
  color: #6d421b;
  font-size: 0.93rem;
  line-height: 1.35;
}

.stat-card-hero {
  border-color: rgba(255, 237, 196, 0.28);
  background: rgba(255, 248, 235, 0.12);
  box-shadow: none;
  backdrop-filter: blur(8px);
}

.stat-card-hero strong {
  color: #ffd171;
}

.stat-card-hero span {
  color: rgba(255, 248, 235, 0.86);
}

.section-band {
  padding: 88px 0;
  background: #fffaf4;
}

.section-band-light {
  background:
    radial-gradient(circle at 82% 14%, rgba(255, 203, 95, 0.28), transparent 22rem),
    #fff1da;
}

.section-band-dark {
  color: #fff3de;
  background:
    radial-gradient(circle at 80% 22%, rgba(255, 188, 72, 0.18), transparent 24rem),
    linear-gradient(180deg, #17110d 0%, #2b1a10 100%);
}

.intro-grid,
.control-layout,
.data-layout,
.training-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.12fr);
  gap: 42px;
  align-items: start;
}

.feature-grid,
.architecture-grid,
.data-stats,
.bucket-grid,
.demo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.info-card,
.dark-card,
.bucket-card,
.timeline-item,
.demo-card {
  border-radius: 16px;
  padding: 20px;
}

.info-card,
.bucket-card,
.timeline-item,
.demo-card {
  border: 1px solid rgba(161, 97, 25, 0.16);
  background: rgba(255, 255, 255, 0.74);
}

.info-card p,
.dark-card p,
.bucket-card p,
.timeline-item p {
  margin-bottom: 0;
  color: #6d421b;
  line-height: 1.7;
}

.lead-text,
.section-heading p {
  color: #55371d;
  font-size: 1.05rem;
  line-height: 1.82;
}

.section-heading {
  max-width: 900px;
  margin-bottom: 32px;
}

.wide-figure {
  margin-top: 34px;
  background: #fffdf9;
}

figcaption {
  margin-top: 12px;
  color: #71451d;
  font-size: 0.92rem;
  line-height: 1.55;
}

.table-wrap {
  overflow-x: auto;
  border: 1px solid rgba(161, 97, 25, 0.16);
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 22px 50px -42px rgba(54, 29, 13, 0.5);
}

.benchmark-table {
  width: 100%;
  min-width: 850px;
  border-collapse: collapse;
  font-size: 0.96rem;
}

.benchmark-table th {
  color: #7c3d10;
  background: #fff0ce;
  text-align: left;
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.benchmark-table th,
.benchmark-table td {
  padding: 15px 16px;
  border-bottom: 1px solid rgba(161, 97, 25, 0.12);
  vertical-align: top;
}

.benchmark-table tbody tr:hover {
  background: #fff8ed;
}

.result-value {
  color: #b65d09;
}

.demo-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.demo-card {
  display: grid;
  gap: 18px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 247, 232, 0.78));
  box-shadow: 0 24px 48px -42px rgba(54, 29, 13, 0.62);
}

.demo-card-header span {
  display: inline-flex;
  margin-bottom: 12px;
  color: #a55709;
  font-size: 0.76rem;
  font-weight: 950;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.demo-card-header h3 {
  margin-bottom: 8px;
}

.demo-card-header p {
  margin-bottom: 0;
  color: #6d421b;
  line-height: 1.55;
}

.clip-stack {
  display: grid;
  gap: 15px;
}

.clip-row {
  display: grid;
  gap: 8px;
}

.comparison-row {
  margin-top: 4px;
  border: 1px solid rgba(201, 101, 14, 0.22);
  border-radius: 14px;
  background:
    linear-gradient(135deg, rgba(255, 209, 113, 0.2), rgba(255, 247, 232, 0.72));
  padding: 12px;
}

.clip-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.clip-meta strong {
  color: #3d2412;
  font-size: 0.82rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.clip-meta span {
  color: #9e5a16;
  font-size: 0.78rem;
  font-weight: 850;
}

.waveform {
  display: block;
  width: 100%;
  height: 58px;
  overflow: hidden;
  border-radius: 14px;
  box-shadow: inset 0 0 0 1px rgba(161, 97, 25, 0.1);
  cursor: pointer;
}

.waveform-bg {
  fill: #fff0d2;
}

.waveform-midline {
  stroke: rgba(134, 76, 20, 0.18);
  stroke-width: 1;
}

.waveform-bar {
  fill: #c9650e;
}

.waveform-comparison {
  box-shadow:
    inset 0 0 0 1px rgba(161, 97, 25, 0.12),
    0 12px 22px -20px rgba(54, 29, 13, 0.6);
}

.waveform-bar-comparison {
  fill: #9f4b07;
}

.waveform-progress-fill {
  fill: rgba(255, 209, 113, 0.28);
  pointer-events: none;
}

.waveform-playhead {
  stroke: #20130b;
  stroke-width: 5;
  stroke-linecap: round;
  filter: drop-shadow(0 2px 4px rgba(32, 19, 11, 0.2));
  pointer-events: none;
}

.clip-row audio {
  width: 100%;
  height: 38px;
  border-radius: 999px;
}

.section-band-dark h2,
.section-band-dark h3 {
  color: #fff8ed;
}

.section-band-dark .section-heading p,
.dark-lead {
  color: #efd4ad;
}

.dark-figure {
  border-color: rgba(255, 209, 113, 0.18);
  background: rgba(255, 248, 235, 0.92);
}

.architecture-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 22px;
}

.dark-card {
  border: 1px solid rgba(255, 209, 113, 0.2);
  background: rgba(255, 248, 235, 0.08);
}

.dark-card p {
  color: #eed1a7;
}

.figure-spaced,
.bucket-grid {
  margin-top: 28px;
}

.control-layout {
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.8fr);
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.chip-list span {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  border: 1px solid rgba(195, 116, 20, 0.25);
  border-radius: 999px;
  background: #fff9ee;
  color: #774112;
  padding: 0 11px;
  font-size: 0.9rem;
  font-weight: 800;
}

.feature-chips {
  margin-top: 26px;
}

.bucket-card span {
  display: inline-flex;
  margin-bottom: 14px;
  color: #98500b;
  font-weight: 950;
}

.data-layout {
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.86fr);
}

.data-stats {
  margin-top: 28px;
}

.task-panel {
  padding: 24px;
}

.timeline {
  display: grid;
  gap: 16px;
}

.timeline-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  background: rgba(255, 248, 235, 0.08);
  border-color: rgba(255, 209, 113, 0.2);
}

.timeline-item > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  color: #221207;
  background: #ffd171;
  font-weight: 950;
}

.timeline-item p {
  color: #efd4ad;
}

.site-footer {
  padding: 34px 0;
  color: #f9e6c7;
  background: #130f0c;
}

.footer-grid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.footer-grid > div {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-logo {
  width: 42px;
  height: auto;
}

.footer-grid p {
  max-width: 720px;
  margin-bottom: 0;
  color: #d9bf96;
  line-height: 1.6;
}

@media (max-width: 980px) {
  .hero-section {
    min-height: auto;
  }

  .top-nav {
    justify-content: flex-start;
  }

  .hero-grid,
  .hero-stats,
  .intro-grid,
  .control-layout,
  .data-layout,
  .training-layout {
    grid-template-columns: 1fr;
  }

  .architecture-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .demo-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .content {
    width: min(100% - 24px, 1180px);
  }

  .hero-content {
    padding-top: 20px;
  }

  .top-nav {
    gap: 8px;
    margin-bottom: 34px;
  }

  .nav-link {
    min-height: 34px;
    padding: 0 11px;
    font-size: 0.84rem;
  }

  .hero-logo {
    width: 104px;
  }

  h1 {
    font-size: 4rem;
  }

  .hero-copy {
    font-size: 1.04rem;
  }

  .section-band {
    padding: 58px 0;
  }

  .feature-grid,
  .architecture-grid,
  .data-stats,
  .bucket-grid,
  .demo-grid {
    grid-template-columns: 1fr;
  }

  .stat-card,
  .info-card,
  .dark-card,
  .bucket-card,
  .timeline-item,
  .task-panel,
  .demo-card {
    padding: 16px;
  }

  .footer-grid {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
