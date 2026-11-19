// === [파텍 필립 5270P 스타일 Web Audio API 미닛 리피터 엔진] ===
  let repeaterAudioCtx = null;
  let repeaterTimers = [];
  let repeaterMasterGains = [];
  let repeaterToastTimer = null;
  let isRepeaterPlaying = false;

  function getRepeaterAudioContext() {
    if (!repeaterAudioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) repeaterAudioCtx = new AudioCtx();
    }
    if (repeaterAudioCtx && repeaterAudioCtx.state === 'suspended') {
      repeaterAudioCtx.resume().catch(() => {});
    }
    return repeaterAudioCtx;
  }

  /**
   * 단일 공(Gong) 타종 합성 (Patek Philippe 5270P Classic Gong)
   * @param {'low' | 'high'} type - 저음 공(시) / 고음 공(분)
   */
  function strikeClassicGong(type = 'low') {
    const ctx = getRepeaterAudioContext();
    const now = ctx.currentTime;
    const baseFreq = type === 'low' ? 523.25 : 783.99; // C5(저음 공) / G5(고음 공)

    // 클래식 공 특유의 비정수 배음 비율 [주파수 배수, 초기 게인, 잔향 감쇠 시간(초)]
    const partials = [
      [1.000, 0.38, 1.90],
      [2.756, 0.18, 1.10],
      [5.404, 0.08, 0.55],
      [8.933, 0.03, 0.25]
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.85, now);
    masterGain.connect(ctx.destination);
    repeaterMasterGains.push(masterGain);

    partials.forEach(([ratio, amp, decay]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * ratio, now);

      // 해머 타격 순간의 빠른 어택(3ms) 후 지수적 잔향 감쇠
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(amp, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + decay + 0.05);
    });

    // 해머가 공을 때리는 미세한 금속성 클릭 트랜지언트
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(type === 'low' ? 2100 : 2900, now);
    clickGain.gain.setValueAtTime(0.06, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

    clickOsc.connect(clickGain);
    clickGain.connect(masterGain);
    clickOsc.start(now);
    clickOsc.stop(now + 0.025);

    // 서브다이얼 해머 타격 시각 펄스 연동
    const subdialEl = document.getElementById("subdialWrap");
    if (subdialEl) {
      subdialEl.classList.remove("strike-pulse");
      void subdialEl.offsetWidth;
      subdialEl.classList.add("strike-pulse");
      setTimeout(() => subdialEl.classList.remove("strike-pulse"), 140);
    }
  }

  /**
   * 진행 중인 미닛 리피터 타종 즉시 중단
   */
  function stopMinuteRepeater() {
    repeaterTimers.forEach((id) => clearTimeout(id));
    repeaterTimers = [];
    if (repeaterAudioCtx) {
      const now = repeaterAudioCtx.currentTime;
      repeaterMasterGains.forEach((g) => {
        try {
          g.gain.cancelScheduledValues(now);
          g.gain.setTargetAtTime(0.0001, now, 0.015);
        } catch (e) {}
      });
    }
    repeaterMasterGains = [];
    isRepeaterPlaying = false;
    const clockEl = document.getElementById("topClockWidget");
    if (clockEl) clockEl.classList.remove("chiming");
  }

  /**
   * 현재 시각 기반 미닛 리피터 실행 (시 -> 15분 쿼터 -> 잔여 분)
   * @param {boolean} isSoundOn - 상단 소리 ON/OFF 상태
   */
  function triggerMinuteRepeater(isSoundOn = !AudioFX.isMuted) {
    // 이미 타종 중이면 재클릭 시 중단
    if (isRepeaterPlaying) {
      stopMinuteRepeater();
      return { status: 'stopped' };
    }

    if (!isSoundOn) {
      return { status: 'muted' };
    }

    const now = new Date();
    const hours = (now.getHours() % 12) || 12;
    const mins = now.getMinutes();
    const quarters = Math.floor(mins / 15);
    const remMins = mins % 15;

    isRepeaterPlaying = true;
    const clockEl = document.getElementById("topClockWidget");
    if (clockEl) clockEl.classList.add("chiming");

    let cursorMs = 0;

    // 1) 시(Hours): 저음 공
    for (let i = 0; i < hours; i++) {
      const t = setTimeout(() => strikeClassicGong('low'), cursorMs);
      repeaterTimers.push(t);
      cursorMs += 480;
    }

    if (quarters > 0 || remMins > 0) {
      cursorMs += 260;
    }

    // 2) 15분(Quarters): 고음 + 저음 이중 공 ('딩-동')
    for (let q = 0; q < quarters; q++) {
      const tHigh = setTimeout(() => strikeClassicGong('high'), cursorMs);
      const tLow = setTimeout(() => strikeClassicGong('low'), cursorMs + 185);
      repeaterTimers.push(tHigh, tLow);
      cursorMs += 680;
    }

    if (quarters > 0 && remMins > 0) {
      cursorMs += 220;
    }

    // 3) 잔여 분(Minutes): 고음 공
    for (let m = 0; m < remMins; m++) {
      const t = setTimeout(() => strikeClassicGong('high'), cursorMs);
      repeaterTimers.push(t);
      cursorMs += 420;
    }

    // 타종 종료 후 상태 초기화
    const endTimer = setTimeout(() => {
      isRepeaterPlaying = false;
      repeaterTimers = [];
      repeaterMasterGains = [];
      if (clockEl) clockEl.classList.remove("chiming");
      const toastEl = document.getElementById("repeaterToast");
      if (toastEl) toastEl.classList.remove("visible");
    }, cursorMs + 1200);
    repeaterTimers.push(endTimer);

    return { status: 'playing', hours, quarters, remMins, mins };
  }

  // 🔊 Hamann 300 빈티지 기계식 계산기 Web Audio API 합성 엔진
  const AudioFX = {
    ctx: null,
    noiseBuffer: null,
    buffers: null,
    _lastClickMs: 0,
    _lastReleaseMs: 0,
    isMuted: localStorage.getItem('dispenser_muted') === 'true',

    init() {
      if (!this.ctx) {
        this.ctx = getRepeaterAudioContext();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (this.ctx && !this.noiseBuffer) {
        const sr = this.ctx.sampleRate;
        const buf = this.ctx.createBuffer(1, Math.floor(sr * 0.4), sr);
        const data = buf.getChannelData(0);
        let seed = 0x13579BDF;
        for (let i = 0; i < data.length; i++) {
          seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
          const white = (seed / 0xFFFFFFFF) * 2 - 1;
          const envBoost = i < sr * 0.008 ? 1.35 : 1.0;
          data[i] = Math.max(-1, Math.min(1, white * envBoost));
        }
        this.noiseBuffer = buf;
      }
      if (this.ctx && !this.buffers) {
        this._buildPrebakedBuffers();
      }
    },

    // 메인 스레드 지연이나 필터 공명 사각지대 없이 매 클릭 100% 동일한 어택과 볼륨을 보장하는 사전 합성 버퍼 생성
    _buildPrebakedBuffers() {
      const sr = this.ctx.sampleRate;
      let seed = 0x2468ACE1;
      const nextWhite = () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return (seed / 0xFFFFFFFF) * 2 - 1;
      };

      // 2차 대역통과 필터 헬퍼 (오프라인 배열 필터링)
      const applyBandpass = (input, f0, q) => {
        const out = new Float32Array(input.length);
        const w0 = (2 * Math.PI * f0) / sr;
        const alpha = Math.sin(w0) / (2 * q);
        const b0 = alpha, b1 = 0, b2 = -alpha;
        const a0 = 1 + alpha, a1 = -2 * Math.cos(w0), a2 = 1 - alpha;
        let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
        for (let i = 0; i < input.length; i++) {
          const x0 = input[i];
          const y0 = (b0 * x0 + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
          out[i] = y0;
          x2 = x1; x1 = x0; y2 = y1; y1 = y0;
        }
        return out;
      };

      // 1) '찰-칵!' 2단 기계식 걸쇠 스냅 버퍼 (85ms)
      const clickLen = Math.floor(sr * 0.085);
      const clickBuf = this.ctx.createBuffer(1, clickLen, sr);
      const clickData = clickBuf.getChannelData(0);
      const rawNoise = new Float32Array(clickLen);
      for (let i = 0; i < clickLen; i++) rawNoise[i] = nextWhite();
      const noiseStage1 = applyBandpass(rawNoise, 3050, 3.0);
      const noiseStage2 = applyBandpass(rawNoise, 2150, 5.8);

      const gapIdx = Math.floor(sr * 0.036); // 36ms 간격 ('찰-' -> '-칵!')
      let phasePin1 = 0, phasePingA = 0, phasePingB = 0, phaseRes = 0, phaseThud = 0;

      for (let i = 0; i < clickLen; i++) {
        const t = i / sr;
        let sample = 0;

        // [1단계: 0 ~ 14ms] '찰-' 금속 판스프링 마찰 + 핀 배음
        if (t < 0.015) {
          const attack1 = Math.min(1, t / 0.0008);
          const envNoise1 = attack1 * Math.exp(-t / 0.0038);
          const envPin1 = attack1 * Math.exp(-t / 0.0028);
          const freqPin1 = 3100 * Math.pow(1900 / 3100, Math.min(1, t / 0.010));
          phasePin1 += (2 * Math.PI * freqPin1) / sr;
          const triPin1 = (2 / Math.PI) * Math.asin(Math.sin(phasePin1));
          sample += noiseStage1[i] * envNoise1 * 1.45 + triPin1 * envPin1 * 0.34;
        }

        // [2단계: 36ms ~ 80ms] '-칵!' 강철 걸쇠 맞물림 + 비조화 금속 배음 + 하우징 공명 + 바디 타격
        if (i >= gapIdx) {
          const t2 = (i - gapIdx) / sr;
          const attack2 = Math.min(1, t2 / 0.0006);
          const envNoise2 = attack2 * Math.exp(-t2 / 0.0032);
          const envPingA = attack2 * Math.exp(-t2 / 0.0042);
          const envPingB = attack2 * Math.exp(-t2 / 0.0030);
          const envRes = attack2 * Math.exp(-t2 / 0.0068);
          const envThud = attack2 * Math.exp(-t2 / 0.0062);

          const freqPingA = 1580 * Math.pow(1420 / 1580, Math.min(1, t2 / 0.014));
          const freqPingB = 3720 * Math.pow(3350 / 3720, Math.min(1, t2 / 0.011));
          const freqRes = 490 * Math.pow(410 / 490, Math.min(1, t2 / 0.020));
          const freqThud = 185 * Math.pow(65 / 185, Math.min(1, t2 / 0.018));

          phasePingA += (2 * Math.PI * freqPingA) / sr;
          phasePingB += (2 * Math.PI * freqPingB) / sr;
          phaseRes += (2 * Math.PI * freqRes) / sr;
          phaseThud += (2 * Math.PI * freqThud) / sr;

          const triA = (2 / Math.PI) * Math.asin(Math.sin(phasePingA));
          const sqB = Math.sin(phasePingB) >= 0 ? 1 : -1;
          const triRes = (2 / Math.PI) * Math.asin(Math.sin(phaseRes));
          const triThud = (2 / Math.PI) * Math.asin(Math.sin(phaseThud));

          sample +=
            noiseStage2[i] * envNoise2 * 2.1 +
            triA * envPingA * 0.28 +
            sqB * envPingB * 0.11 +
            triRes * envRes * 0.32 +
            triThud * envThud * 0.58;
        }
        clickData[i] = sample;
      }
      this._normalizeBuffer(clickData, 0.88);

      // 2) '착' 버튼 릴리즈 스프링 복원음 버퍼 (30ms)
      const relLen = Math.floor(sr * 0.030);
      const relBuf = this.ctx.createBuffer(1, relLen, sr);
      const relData = relBuf.getChannelData(0);
      const relNoise = applyBandpass(rawNoise.subarray(0, relLen), 2900, 5.2);
      let phaseRelPing = 0, phaseRelThud = 0;
      for (let i = 0; i < relLen; i++) {
        const t = i / sr;
        const attack = Math.min(1, t / 0.0006);
        const envN = attack * Math.exp(-t / 0.0026);
        const envP = attack * Math.exp(-t / 0.0028);
        const envT = attack * Math.exp(-t / 0.0034);
        const fP = 2920 * Math.pow(2150 / 2920, Math.min(1, t / 0.009));
        const fT = 260 * Math.pow(145 / 260, Math.min(1, t / 0.010));
        phaseRelPing += (2 * Math.PI * fP) / sr;
        phaseRelThud += (2 * Math.PI * fT) / sr;
        const triP = (2 / Math.PI) * Math.asin(Math.sin(phaseRelPing));
        const triT = (2 / Math.PI) * Math.asin(Math.sin(phaseRelThud));
        relData[i] = relNoise[i] * envN * 1.6 + triP * envP * 0.24 + triT * envT * 0.36;
      }
      this._normalizeBuffer(relData, 0.36);

      // 3) 휠 조작 핀휠 코그 래칫 '드르륵/찰칵' 버퍼 (45ms)
      const tickLen = Math.floor(sr * 0.045);
      const tickBuf = this.ctx.createBuffer(1, tickLen, sr);
      const tickData = tickBuf.getChannelData(0);
      const tickNoise1 = applyBandpass(rawNoise.subarray(0, tickLen), 2400, 5.4);
      const tickNoise2 = applyBandpass(rawNoise.subarray(0, tickLen), 3450, 5.8);
      const tickGap = Math.floor(sr * 0.021);
      let pCog1 = 0, pCogThud = 0, pCog2 = 0;
      for (let i = 0; i < tickLen; i++) {
        const t = i / sr;
        const att1 = Math.min(1, t / 0.0006);
        const envN1 = att1 * Math.exp(-t / 0.0025);
        const envP1 = att1 * Math.exp(-t / 0.0028);
        const envT1 = att1 * Math.exp(-t / 0.0040);
        const fP1 = 2750 * Math.pow(1500 / 2750, Math.min(1, t / 0.009));
        const fT1 = 330 * Math.pow(95 / 330, Math.min(1, t / 0.013));
        pCog1 += (2 * Math.PI * fP1) / sr;
        pCogThud += (2 * Math.PI * fT1) / sr;
        let s =
          tickNoise1[i] * envN1 * 1.8 +
          ((2 / Math.PI) * Math.asin(Math.sin(pCog1))) * envP1 * 0.28 +
          ((2 / Math.PI) * Math.asin(Math.sin(pCogThud))) * envT1 * 0.45;
        if (i >= tickGap) {
          const t2 = (i - tickGap) / sr;
          const att2 = Math.min(1, t2 / 0.0005);
          const envN2 = att2 * Math.exp(-t2 / 0.0022);
          const envP2 = att2 * Math.exp(-t2 / 0.0024);
          const fP2 = 3400 * Math.pow(2100 / 3400, Math.min(1, t2 / 0.007));
          pCog2 += (2 * Math.PI * fP2) / sr;
          s += tickNoise2[i] * envN2 * 1.25 + ((2 / Math.PI) * Math.asin(Math.sin(pCog2))) * envP2 * 0.20;
        }
        tickData[i] = s;
      }
      this._normalizeBuffer(tickData, 0.76);

      this.buffers = {
        keyClick: clickBuf,
        keyRelease: relBuf,
        tick: tickBuf
      };
    },

    _normalizeBuffer(data, targetPeak = 0.85) {
      let maxAbs = 0;
      for (let i = 0; i < data.length; i++) {
        const a = Math.abs(data[i]);
        if (a > maxAbs) maxAbs = a;
      }
      if (maxAbs > 0) {
        const scale = targetPeak / maxAbs;
        for (let i = 0; i < data.length; i++) {
          data[i] *= scale;
        }
      }
    },

    _playBuffer(bufKey, playbackRate = 1.0, gainVal = 1.0, delaySec = 0) {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx || !this.buffers || !this.buffers[bufKey]) return;

      const playNow = () => {
        if (!this.ctx || this.isMuted) return;
        const src = this.ctx.createBufferSource();
        src.buffer = this.buffers[bufKey];
        src.playbackRate.value = playbackRate;

        const gain = this.ctx.createGain();
        gain.gain.value = gainVal;

        src.connect(gain);
        gain.connect(this.ctx.destination);
        if (delaySec > 0) {
          src.start(this.ctx.currentTime + delaySec);
        } else {
          src.start(0);
        }
      };

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().then(playNow).catch(() => {});
      } else {
        playNow();
      }
    },

    // 극초단파(4~12ms) Highpass + Bandpass 직렬 필터를 거친 건조하고 날카로운 금속 걸쇠/기어 임펄스
    _strikeNoise(delaySec, durationSec, filterFreq, qVal, peakGain, hpFreq = 900) {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx || !this.noiseBuffer) return;

      const schedule = () => {
        if (!this.ctx || !this.noiseBuffer || this.isMuted) return;
        const t = this.ctx.currentTime + 0.004 + delaySec;
        const dur = Math.min(0.016, Math.max(0.004, durationSec));

        const src = this.ctx.createBufferSource();
        src.buffer = this.noiseBuffer;

        const hp = this.ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.setValueAtTime(hpFreq, t);

        const bp = this.ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.setValueAtTime(filterFreq, t);
        bp.Q.setValueAtTime(qVal, t);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(peakGain, t + 0.0012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        src.connect(hp);
        hp.connect(bp);
        bp.connect(gain);
        gain.connect(this.ctx.destination);
        src.start(t, 0, dur + 0.006);
      };

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().then(schedule).catch(() => {});
      } else {
        schedule();
      }
    },

    // 주철 하우징/케이스 단단한 섀시 노크음 (12~28ms 짧은 임펄스)
    _bodyThud(delaySec, freqStart, freqEnd, durationSec, peakGain, oscType = 'triangle') {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const schedule = () => {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime + 0.004 + delaySec;
        const dur = Math.min(0.036, Math.max(0.010, durationSec));

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = oscType;
        osc.frequency.setValueAtTime(freqStart, t);
        osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 40), t + dur);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(peakGain, t + 0.0015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + dur + 0.006);
      };

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().then(schedule).catch(() => {});
      } else {
        schedule();
      }
    },

    // 비조화 금속 배음(Inharmonic Metallic Ping) 및 하우징 공간 공명 합성기
    _metalPing(delaySec, freqStart, freqEnd, durationSec, peakGain, oscType = 'triangle') {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const schedule = () => {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime + 0.004 + delaySec;
        const dur = Math.min(0.032, Math.max(0.006, durationSec));

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = oscType;
        osc.frequency.setValueAtTime(freqStart, t);
        if (freqEnd && freqEnd !== freqStart) {
          osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 60), t + dur);
        }

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(peakGain, t + 0.0008);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + dur + 0.005);
      };

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().then(schedule).catch(() => {});
      } else {
        schedule();
      }
    },

    // 1) 일반 버튼 클릭음 (1958년식 핀휠 계산기 2단 금속 걸쇠 스냅 '찰-칵!')
    keyClick(variant = 'default') {
      if (this.isMuted) return;
      const nowMs = performance.now();
      if (nowMs - this._lastClickMs < 14) return;
      this._lastClickMs = nowMs;

      const pitchVar = 0.96 + Math.random() * 0.08;
      const toneScale = variant === 'bright' ? 1.10 : 1.0;
      this._playBuffer('keyClick', pitchVar * toneScale, 0.95, 0);
    },

    // 1-b) 버튼을 뗄 때 미세 스프링 복원 스냅음 ('착')
    keyRelease(variant = 'default') {
      if (this.isMuted) return;
      const nowMs = performance.now();
      if (nowMs - this._lastReleaseMs < 20) return;
      this._lastReleaseMs = nowMs;

      const sinceClickMs = nowMs - this._lastClickMs;
      const delaySec = sinceClickMs < 52 ? (52 - sinceClickMs) / 1000 : 0;
      const pitchVar = 0.96 + Math.random() * 0.08;
      const toneScale = variant === 'bright' ? 1.08 : 1.0;
      this._playBuffer('keyRelease', pitchVar * toneScale, 0.85, delaySec);
    },

    // 기존 버튼 클릭 시 호출하던 AudioFX.drip()을 2단 금속 걸쇠 스냅으로 매핑
    drip(variant = 'default') {
      this.keyClick(variant);
    },

    // 2) 산미·고소함·바디감·원산지 휠 조작음 (핀휠 코그 판스프링 래칫 '드르륵/찰칵')
    tick(step = 3) {
      if (this.isMuted) return;
      const stepScale = 0.90 + Math.min(8, Math.max(0, step)) * 0.035;
      const pitchVar = 0.98 + Math.random() * 0.04;
      this._playBuffer('tick', stepScale * pitchVar, 0.90, 0);
    },

    // 3) 레버 당김 초기 클러치 장전음 ('철-커-덩!')
    lever() {
      if (this.isMuted) return;
      this._bodyThud(0, 165, 52, 0.026, 0.34, 'sawtooth');
      this._strikeNoise(0, 0.010, 1450, 2.4, 0.42, 700);
      this._strikeNoise(0.020, 0.009, 2500, 3.0, 0.34, 1100);
      this._strikeNoise(0.042, 0.011, 3300, 3.4, 0.28, 1400);
      this._bodyThud(0.042, 230, 74, 0.020, 0.24, 'triangle');
    },

    // 4) Hamann 300 기어 회전 1스텝 타격음 (계산 중 '차르르르' 건조한 기어 이빨 소리)
    gearTooth(stepIdx = 0) {
      if (this.isMuted) return;
      const jitter = (stepIdx % 4) * 160;
      this._strikeNoise(0, 0.005, 2900 + jitter, 4.2, 0.26, 1300);
      this._bodyThud(0, 360 + (stepIdx % 2) * 55, 115, 0.010, 0.12, 'triangle');
    },

    // 5) 각 휠 컬럼 계산 확정 시 캐리지 이동 타격음 ('철-컥-탁!')
    carriageShift(isFinal = false) {
      if (this.isMuted) return;
      this._strikeNoise(0, 0.009, isFinal ? 1850 : 2300, 2.8, 0.44, 900);
      this._bodyThud(0, isFinal ? 175 : 220, 58, isFinal ? 0.028 : 0.020, 0.32, 'sawtooth');
      this._strikeNoise(0.020, 0.008, isFinal ? 3100 : 3500, 3.6, 0.32, 1400);
      if (isFinal) {
        this._strikeNoise(0.042, 0.010, 3850, 3.8, 0.28, 1700);
        this._bodyThud(0.042, 250, 78, 0.022, 0.22, 'triangle');
      }
    },

    stamp() {
      if (this.isMuted) return;
      this._bodyThud(0, 145, 42, 0.032, 0.42, 'sawtooth');
      this._strikeNoise(0, 0.011, 1350, 2.4, 0.40, 600);
      this._strikeNoise(0.022, 0.007, 2600, 3.2, 0.24, 1200);
    },

    printer() {
      if (this.isMuted) return;
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          this.gearTooth(i);
          if (i === 5) this.carriageShift(true);
        }, i * 55);
      }
    },

    // 크래프트 박스 절취선 개봉 종이 뜯김 효과음 ('드르륵/촤르륵!')
    paperTear() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx || !this.noiseBuffer) return;

      const schedule = () => {
        if (!this.ctx || !this.noiseBuffer || this.isMuted) return;
        const t = this.ctx.currentTime + 0.005;
        const dur = 0.28;

        const src = this.ctx.createBufferSource();
        src.buffer = this.noiseBuffer;

        const bp = this.ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.setValueAtTime(1400, t);
        bp.frequency.exponentialRampToValueAtTime(3200, t + dur);
        bp.Q.setValueAtTime(1.8, t);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.32, t + 0.025);
        // 절취선 칼선을 따라 뜯기는 미세 진동
        for (let step = 1; step <= 6; step++) {
          const st = t + step * 0.038;
          gain.gain.linearRampToValueAtTime(step % 2 === 0 ? 0.30 : 0.16, st);
        }
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        src.connect(bp);
        bp.connect(gain);
        gain.connect(this.ctx.destination);
        src.start(t, 0, dur + 0.02);
      };

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().then(schedule).catch(() => {});
      } else {
        schedule();
      }
    },

    stopMinuteRepeater() {
      stopMinuteRepeater();
    },
    playMinuteRepeater() {
      return triggerMinuteRepeater(!this.isMuted);
    },
    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.isMuted) {
        stopMinuteRepeater();
        const toastEl = document.getElementById("repeaterToast");
        if (toastEl) toastEl.classList.remove("visible");
      }
      localStorage.setItem('dispenser_muted', this.isMuted);
      return this.isMuted;
    }
  };

  // 포인터/키보드 입력 즉시 AudioContext를 깨워 첫 클릭이나 대기 후 클릭 시에도 소리가 누락되지 않도록 보장
  window.addEventListener("pointerdown", () => AudioFX.init(), { passive: true });
  window.addEventListener("keydown", () => AudioFX.init(), { passive: true });

  // 🌐 Schema v3.1 브랜드 설정 상수(Block 0 최종 확정 시 1곳만 교체) & 다국어(ko / en / ja) + 상세 모드 상태 관리
  const CTA_BRAND_CONFIG = {
    projectName: "Coffee Taste Archive - SCA 120종 스페셜",
    shortCode: "CTA",
    defaultLang: "ko"
  };
  const SUPPORTED_LANGS = ["ko", "en", "ja"];
  const LANG_BTN_LABELS = { ko: "🌐 KR", en: "🌐 EN", ja: "🌐 JP" };
  let currentLang = localStorage.getItem("cta_lang") || CTA_BRAND_CONFIG.defaultLang;
  if (!SUPPORTED_LANGS.includes(currentLang)) currentLang = "ko";
  let detailProfileMode = localStorage.getItem("cta_detail_mode") === "detailed" ? "detailed" : "simple";
  let currentOpenModalCoffeeId = null;

  function tUI(key) {
    const dict = (typeof UI_I18N !== "undefined" && UI_I18N[currentLang]) ? UI_I18N[currentLang] : (typeof UI_I18N !== "undefined" ? UI_I18N.ko : {});
    if (dict && dict[key] !== undefined) return dict[key];
    return (typeof UI_I18N !== "undefined" && UI_I18N.ko && UI_I18N.ko[key] !== undefined) ? UI_I18N.ko[key] : key;
  }

  function getLocalizedBean(item, lang = currentLang) {
    if (!item) return null;
    const loc = (item.i18n && item.i18n[lang]) ? item.i18n[lang] : (item.i18n?.ko || {});
    const roastMeta = (typeof COFFEE_TAXONOMY !== "undefined" && COFFEE_TAXONOMY.roast[item.roast]) || null;
    const bodyMeta = (typeof COFFEE_TAXONOMY !== "undefined" && COFFEE_TAXONOMY.bodyAnalogy[item.bodyDots]) || null;
    return {
      raw: item,
      id: item.id,
      no: item.no,
      name: loc.name || item.name,
      subName: loc.subName || item.eng,
      originBadge: loc.originBadge || item.origin,
      region: loc.region || item.region,
      headline: loc.headline || item.headline,
      sourDesc: loc.sourDesc || item.sourDesc,
      nuttyDesc: loc.nuttyDesc || item.nuttyDesc,
      bodyDesc: loc.bodyDesc || (bodyMeta ? bodyMeta.full[lang] : item.bodyDesc),
      bodyShort: bodyMeta ? bodyMeta.short[lang] : "밸런스",
      sweetDesc: loc.sweetDesc || item.sweetDesc || "균형 잡힌 단맛",
      guide: loc.guide || item.guide,
      roastShort: roastMeta ? roastMeta[lang] : item.roast,
      brewText: loc.brewText || item.brewOverride || "90~91°C · 20g / 300ml",
      dialingNote: loc.dialingNote || (item.dialingNote && (item.dialingNote[lang] || item.dialingNote.ko)) || "",
      traceability: item.traceability || null
    };
  }

  // 🔐 XSS 방어용 HTML 이스케이프 & URL 검증 & 검색어 하이라이트 헬퍼
  function escapeHtml(str) {
    if (typeof CasperEngine !== "undefined" && typeof CasperEngine.escapeHtml === "function") {
      return CasperEngine.escapeHtml(str);
    }
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function sanitizeUrl(url) {
    if (!url) return "#";
    const s = String(url).trim();
    return /^https?:\/\//i.test(s) ? s : "#";
  }

  function highlightSearchText(rawText, rawQuery) {
    const text = rawText === null || rawText === undefined ? "" : String(rawText);
    const q = (rawQuery || "").trim();
    if (!q || !text) return escapeHtml(text);

    // 순수 초성 검색어는 원문 부분 문자열 하이라이트 대신 안전 이스케이프만 수행
    const compact = q.replace(/\s+/g, "");
    if (/^[ㄱ-ㅎ]+$/.test(compact)) {
      return escapeHtml(text);
    }

    const tokens = Array.from(new Set(
      q.split(/\s+/).map(t => t.trim()).filter(t => t.length >= 1)
    )).sort((a, b) => b.length - a.length);
    if (tokens.length === 0) return escapeHtml(text);

    const lowerText = text.toLowerCase();
    const ranges = [];
    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i].toLowerCase();
      if (!tok) continue;
      let pos = 0;
      while (pos < lowerText.length) {
        const idx = lowerText.indexOf(tok, pos);
        if (idx === -1) break;
        ranges.push([idx, idx + tok.length]);
        pos = idx + tok.length;
      }
    }
    if (ranges.length === 0) return escapeHtml(text);

    ranges.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
    const merged = [ranges[0]];
    for (let i = 1; i < ranges.length; i++) {
      const prev = merged[merged.length - 1];
      const cur = ranges[i];
      if (cur[0] <= prev[1]) {
        prev[1] = Math.max(prev[1], cur[1]);
      } else {
        merged.push(cur);
      }
    }

    let out = "";
    let cursor = 0;
    for (let i = 0; i < merged.length; i++) {
      const [start, end] = merged[i];
      if (start > cursor) {
        out += escapeHtml(text.slice(cursor, start));
      }
      out += `<mark class="search-highlight">${escapeHtml(text.slice(start, end))}</mark>`;
      cursor = end;
    }
    if (cursor < text.length) {
      out += escapeHtml(text.slice(cursor));
    }
    return out;
  }

  // 🔊 소리 ON/OFF 버튼 UI 제어
  const soundToggleBtn = document.getElementById("soundToggleBtn");
  const langToggleBtn = document.getElementById("langToggleBtn");
  function updateSoundBtnUI() {
    if (!soundToggleBtn) return;
    if (AudioFX.isMuted) {
      soundToggleBtn.textContent = tUI("soundOff");
      soundToggleBtn.classList.add("muted");
    } else {
      soundToggleBtn.textContent = tUI("soundOn");
      soundToggleBtn.classList.remove("muted");
    }
  }
  updateSoundBtnUI();

  // 헬퍼: 모달/서랍 UI 토글 (실제 열림/닫힘 상태 변화가 있을 때만 body overflow 변경)
  function toggleUI(targetEl, overlayEl, isOpen) {
    let changed = false;
    if (targetEl && targetEl.classList.contains("open") !== Boolean(isOpen)) {
      targetEl.classList.toggle("open", isOpen);
      changed = true;
    }
    if (overlayEl && overlayEl.classList.contains("open") !== Boolean(isOpen)) {
      overlayEl.classList.toggle("open", isOpen);
      changed = true;
    }
    if (changed) {
      const anyModalOpen = document.querySelector(".detail-modal-overlay.open, .origin-drawer.open, .printer-modal-overlay.open, .disclaimer-modal-overlay.open, .ticket-preview-overlay.open");
      document.body.style.overflow = anyModalOpen ? "hidden" : "";
    }
  }

  // 📦 최초 접속 크래프트 박스 패키지 & 절취선 개봉(Unboxing) 제어
  const disclaimerOverlay = document.getElementById("disclaimerOverlay");
  const closeDisclaimerBtn = document.getElementById("closeDisclaimerBtn");
  const disclaimerConfirmText = document.getElementById("disclaimerConfirmText");
  const noShowToday = document.getElementById("noShowToday");
  let isUnboxingDisclaimer = false;

  const DETAIL_MODE_STORAGE_KEY = "cta_detail_mode";
  const TUTORIAL_DONE_STORAGE_KEY = "cta_tutorial_done";

  function hasSavedDetailMode() {
    try {
      const saved = localStorage.getItem(DETAIL_MODE_STORAGE_KEY);
      return saved === "simple" || saved === "detailed";
    } catch (e) {
      return false;
    }
  }

  function isTutorialDone() {
    try {
      return localStorage.getItem(TUTORIAL_DONE_STORAGE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function triggerPostUnboxingFlow() {
    if (!hasSavedDetailMode()) {
      openOnboardingModeModal();
    } else if (!isTutorialDone()) {
      startInteractiveTutorial(0);
    }
  }

  function initDisclaimerNotice() {
    const hideUntil = localStorage.getItem("dispenser_hide_disclaimer");
    const now = new Date().getTime();
    if (!hideUntil || now > parseInt(hideUntil, 10)) {
      disclaimerOverlay.classList.remove("is-tearing", "is-splitting");
      toggleUI(disclaimerOverlay, null, true);
    } else {
      triggerPostUnboxingFlow();
    }
  }

  function runDisclaimerUnboxing() {
    if (isUnboxingDisclaimer || !disclaimerOverlay.classList.contains("open")) return;
    isUnboxingDisclaimer = true;

    if (noShowToday && noShowToday.checked) {
      const expires = new Date().getTime() + (24 * 60 * 60 * 1000);
      localStorage.setItem("dispenser_hide_disclaimer", expires.toString());
    }

    AudioFX.paperTear();
    disclaimerOverlay.classList.add("is-tearing");

    setTimeout(() => {
      disclaimerOverlay.classList.add("is-splitting");
      scheduleCardScrollFocus();
    }, 390);

    setTimeout(() => {
      toggleUI(disclaimerOverlay, null, false);
      disclaimerOverlay.classList.remove("is-tearing", "is-splitting");
      isUnboxingDisclaimer = false;
      scheduleCardScrollFocus();
      triggerPostUnboxingFlow();
    }, 940);
  }

  document.addEventListener("DOMContentLoaded", initDisclaimerNotice);

  // Casper™ V1 초성 추출 위임
  function getChosung(str) {
    if (typeof CasperEngine !== "undefined" && typeof CasperEngine.getChosung === "function") {
      return CasperEngine.getChosung(str);
    }
    return "";
  }

  // LocalStorage 마셔본 원두 및 최초 시음 날짜 영구 보존 관리 (dispenser_tasted_records + 기존 Set 자동 마이그레이션)
  function formatLocalStampDate(dateObj = new Date()) {
    const yy = String(dateObj.getFullYear()).slice(-2);
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    return `${yy}.${mm}.${dd}`;
  }
  function loadTastedRecords() {
    let records = {};
    try {
      const raw = JSON.parse(localStorage.getItem('dispenser_tasted_records') || '{}');
      if (raw && typeof raw === 'object' && !Array.isArray(raw)) records = raw;
    } catch (e) { records = {}; }
    let migrated = false;
    try {
      const legacyIds = JSON.parse(localStorage.getItem('dispenser_tasted_set') || '[]');
      if (Array.isArray(legacyIds)) {
        const nowIso = new Date().toISOString();
        const nowDisp = formatLocalStampDate(new Date());
        legacyIds.forEach(id => {
          if (id && !records[id]) {
            records[id] = { tastedAt: nowIso, displayDate: nowDisp, migrated: true };
            migrated = true;
          }
        });
      }
    } catch (e) {}
    if (migrated) {
      try { localStorage.setItem('dispenser_tasted_records', JSON.stringify(records)); } catch (e) {}
    }
    return records;
  }
  let tastedRecords = loadTastedRecords();
  let tastedSet = new Set(Object.keys(tastedRecords));
  function saveTastedSet() {
    try {
      localStorage.setItem('dispenser_tasted_records', JSON.stringify(tastedRecords));
      localStorage.setItem('dispenser_tasted_set', JSON.stringify(Array.from(tastedSet)));
    } catch (e) {}
  }
  function getTastedStampDate(coffeeId) {
    const rec = tastedRecords[coffeeId];
    if (rec && rec.displayDate) return rec.displayDate;
    if (rec && rec.tastedAt) {
      const parsed = new Date(rec.tastedAt);
      if (!isNaN(parsed.getTime())) return formatLocalStampDate(parsed);
    }
    return formatLocalStampDate(new Date());
  }

  // 📌 Task 2-1: 단일 필터 상태 머신 (filterState)
  const filterState = {
    mode: 'ALL',        // 'ALL' (전체 60종) | 'SEARCH' (검색 필터) | 'DISPENSER' (디스펜서 조합)
    query: '',          // 현재 검색 키워드
    appliedWheel: null, // 마지막으로 레버를 당겨 확정된 { sour, nutty, body }
    isWheelDirty: false // 휠/랜덤 조작 후 아직 레버를 당기지 않은 프리뷰 상태
  };

  const appContainer = document.getElementById("appContainer");
  const resultsContainer = document.getElementById("resultsContainer");
  const resultsHeader = document.getElementById("resultsHeader");
  const coffeeList = document.getElementById("coffeeList");
  const resultCount = document.getElementById("resultCount");
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const clearBtn = clearSearchBtn;
  const searchJumpBadge = document.getElementById("searchJumpBadge");
  const logoBtn = document.getElementById("logoBtn");
  const resetAllBtn = document.getElementById("resetAllBtn");
  const filterTastedBtn = document.getElementById("filterTastedBtn");
  const homeResetBtn = document.getElementById("homeResetBtn");

  function updateTastedFilterBtn() {
    if (!filterTastedBtn) return;
    filterTastedBtn.textContent = `${tUI("tastedBtn")} (${tastedSet.size})`;
    filterTastedBtn.classList.toggle("active", filterState.mode === "TASTED");
  }

  const openDrawerBtn = document.getElementById("openDrawerBtn");
  const closeDrawerBtn = document.getElementById("closeDrawerBtn");
  const originDrawer = document.getElementById("originDrawer");
  const originOverlay = document.getElementById("originOverlay");
  const originCardsContainer = document.getElementById("originCardsContainer");

  const termGuideBackdrop = document.getElementById("termGuideBackdrop");
  const termGuideKicker = document.getElementById("termGuideKicker");
  const termGuideTitle = document.getElementById("termGuideTitle");
  const termGuideContextBox = document.getElementById("termGuideContextBox");
  const termGuideBody = document.getElementById("termGuideBody");
  const closeTermGuideBtn = document.getElementById("closeTermGuideBtn");

  const COFFEE_TERM_GUIDES = {
    roast_naming: {
      kicker: "ROAST & NAMING FORMULA",
      title: "배전도 5단계 & 커피 이름 읽는 법",
      getContext: (item) => {
        if (!item) return "";
        const countryKor = (item.origin || "").replace(/^[^\s]+\s*/, "");
        const regionTxt = item.region || "세부 산지";
        const descMap = {
          "Light": "꽃향기와 과일 산미가 가장 화사한 약배전",
          "Light-Medium": "산뜻한 산미와 은은한 단맛의 약중배전",
          "Medium": "산미·단맛·고소함이 균형 잡힌 중배전",
          "Medium-Dark": "다크 초콜릿과 구운 견과류 풍미의 중강배전",
          "Dark": "신맛 없이 묵직하고 스모키한 강배전"
        };
        return `<strong>🔥 ${escapeHtml(formatRoastShort(item.roast))}</strong> (${escapeHtml(descMap[item.roast] || "표준 로스팅")})<br><strong>이름 해부:</strong> <span style="color:var(--accent);">[${escapeHtml(countryKor)}]</span> · [${escapeHtml(regionTxt)}] · [${escapeHtml(item.varietal)}] · [${escapeHtml(item.process)}]`;
      },
      body: `
        <p><strong>1. 배전도 (Roasting 5단계):</strong> 생두를 볶는 정도에 따라 맛의 방향이 결정됩니다.</p>
        <ul>
          <li><strong>약배전 (Light):</strong> 꽃향·과일 산미 극대화, 쓴맛 없음</li>
          <li><strong>약중배전 (Light-Medium):</strong> 산뜻한 과일 산미 + 은은한 단맛</li>
          <li><strong>중배전 (Medium):</strong> 산미·단맛·고소함의 황금 밸런스</li>
          <li><strong>중강배전 (Medium-Dark):</strong> 다크 초콜릿·구운 견과 풍미</li>
          <li><strong>강배전 (Dark):</strong> 신맛 제로, 묵직하고 스모키한 쓴맛</li>
        </ul>
        <p style="margin-top:4px;"><strong>2. 긴 이름 공식:</strong></p>
        <div class="formula-tag-wrap">
          <span class="formula-tag">1. 나라</span> +
          <span class="formula-tag">2. 지역·농장</span> +
          <span class="formula-tag">3. 품종</span> +
          <span class="formula-tag">4. 가공 방식</span>
        </div>
      `
    },
    taste_all: {
      kicker: "CUPPING TASTE PROFILE",
      title: "4대 테이스팅 맛 기준 & SCA CVA 가이드",
      getContext: (item) => {
        if (!item) return "";
        const sweetTxt = item.sweetDots != null ? ` · 🍯 단맛 ${item.sweetDots}단계` : "";
        return `현재 원두 요약: <strong>🍋 산미 ${item.sourDots} · 🥜 고소 ${item.nuttyDots} · ⚖️ 바디 ${item.bodyDots}${sweetTxt}</strong>`;
      },
      body: `
        <ul>
          <li><strong>🍋 산미 (Acidity · 상큼함):</strong> 식초의 신맛이 아니라 사과·자몽·베리 같은 상큼한 과즙미 (1단계 무산미 ~ 5단계 과즙 폭발).</li>
          <li><strong>🥜 고소함 (Nutty &amp; Cocoa):</strong> 구운 아몬드·헤이즐넛·보리차·초콜릿처럼 편안하고 구수한 풍미 (1단계 꽃·차 중심 ~ 5단계 진한 넛츠).</li>
          <li><strong>⚖️ 바디감 (Body · 입안 무게감):</strong> 삼킬 때 느껴지는 국물의 밀도 — <code>1단계</code> 생수·허브티 → <code>2단계</code> 사과주스 → <code>3단계</code> 보리차·저지방우유 → <code>4단계</code> 일반우유·핫초코 → <code>5단계</code> 생크림.</li>
          <li><strong>🍯 달콤함 (Sweetness · 자연 단맛):</strong> 잘 익은 체리 과당과 로스팅 캐러멜화로 생기는 꿀·과일청 같은 자연스러운 단맛 여운.</li>
        </ul>
        <div style="margin-top:10px; padding:9px 10px; background:#F8F4EE; border:1px solid #D8C7B5; border-radius:6px; font-size:0.75rem; line-height:1.46;">
          <strong>🌐 SCA CVA (Coffee Value Assessment) 3대 평가 축:</strong><br>
          • <strong>기술적 평가 (Descriptive):</strong> 산미·단맛·바디감 강도(1~5단계)와 향미 속성을 주관 없이 객관적 수치로 묘사합니다.<br>
          • <strong>정서적 평가 (Affective):</strong> 음용자의 기호도와 맛의 조화로움(균형감·여운)을 평가합니다.<br>
          • <strong>외재적 속성 (Extrinsic):</strong> 원산지·생산자 추적성(Traceability), 품종, 가공 방식 등 신뢰성과 환경·사회적 가치를 종합합니다.
        </div>
      `
    },
    spec_all: {
      kicker: "ORIGIN & BREWING SPEC",
      title: "원두 스펙 & 맞춤 추출 가이드",
      getContext: (item) => {
        if (!item) return "";
        const br = item.brewOverride || getBrewRecipe(item.roast);
        return `현재 원두: <strong>${escapeHtml(item.varietal)}</strong> · <strong>${escapeHtml(item.process)}</strong>${item.physicalGrade ? ` (${escapeHtml(item.physicalGrade)})` : ""}<br>권장 추출: <strong>💧 ${escapeHtml(br)}</strong>`;
      },
      body: `
        <ul>
          <li><strong>🌱 품종 &amp; WCR 4대 혈통:</strong> <code>티피카</code>(맑은 실크 밸런스), <code>버본</code>(둥근 초콜릿·과실 단맛), <code>에티오피아 토착종</code>(자스민·열대과일), <code>교배·희귀종</code>(고바디 및 천연 저카페인).</li>
          <li><strong>☀️ 가공 &amp; 등급:</strong> <code>워시드</code>(맑고 개운) · <code>내추럴</code>(진한 과일잼) · <code>허니</code>(매끄러운 꿀단맛) · <code>무산소/특수</code>(열대과일·요거트). 등급: <code>G1</code>(무결점), <code>AA/Supremo</code>(대립두), <code>SHB/SHG</code>(고산지 경질두).</li>
          <li><strong>⛰️ 재배 고도 &amp; 외재적 속성:</strong> 1,400~2,200m+ 고산지일수록 일교차가 커서 조직이 조밀하며, SCA CVA 기준 투명한 생산자·산지 이력(Extrinsic Value)을 보증합니다.</li>
          <li><strong>💧 맞춤 추출 수온 &amp; 다이얼링:</strong> 기본 <code>20g / 300ml (1:15)</code> 기준 약배전은 <code>92~93°C</code>로 화사하게, 강배전·특수발효·디카페인은 과추출 방지를 위해 <code>88~89°C</code>로 낮춰 추출합니다.</li>
        </ul>
      `
    },
    specialty: {
      kicker: "SCA MASTER ARCHIVE",
      title: "스페셜티 커피 (Specialty Coffee)",
      getContext: () => `현재 아카이브에는 SCA·WCR 국제 표준 기준을 적용한 <strong>총 ${coffeeData.length}종</strong>의 스페셜티 원두가 수록되어 있습니다.`,
      body: `
        <p>쉽게 말해 <strong>'족보와 성적표가 확실한 일등품 커피'</strong>입니다.</p>
        <ul>
          <li><strong>SCA 특상 등급 &amp; CVA:</strong> 국제스페셜티커피협회(SCA) 커핑 평가 100점 만점 중 <strong>80점 이상</strong>을 받은 상위 10% 원두로, SCA CVA(기술적 Descriptive / 정서적 Affective / 외재적 Extrinsic) 표준에 따라 가치를 입체적으로 측정합니다.</li>
          <li><strong>결점두 기준:</strong> 생두 350g당 1차 결점두(완전 결함) 0개, 2차 결점두 5개 이하의 엄격한 선별을 거칩니다.</li>
          <li><strong>투명한 외재적 이력:</strong> 생산 국가, 세부 산지(Region), 품종, 가공 방식, 농장·생산자 이력이 투명하게 추적되며 본연의 과일·꽃·초콜릿 향미를 지닙니다.</li>
        </ul>
      `
    },
    naming: {
      kicker: "COFFEE NAMING FORMULA",
      title: "커피 긴 이름 읽는 법",
      getContext: (item) => {
        if (!item) return "";
        const countryKor = (item.origin || "").replace(/^[^\s]+\s*/, "");
        const regionTxt = item.region || "세부 산지";
        return `현재 원두 해부: <strong>${escapeHtml(item.name)}</strong><br><span style="color:var(--accent); font-weight:800;">[${escapeHtml(countryKor)}]</span> · <span style="font-weight:700;">[${escapeHtml(regionTxt)}]</span> · <span style="font-weight:700;">[${escapeHtml(item.varietal)}]</span> · <span style="font-weight:700;">[${escapeHtml(item.process)}]</span>`;
      },
      body: `
        <p>스페셜티 커피 이름은 사람 이름처럼 <strong>태어난 곳과 말린 방식</strong>을 순서대로 적은 공식입니다.</p>
        <div class="formula-tag-wrap">
          <span class="formula-tag">1. 나라</span> +
          <span class="formula-tag">2. 자란 동네</span> +
          <span class="formula-tag">3. 나무 품종</span> +
          <span class="formula-tag">4. 말린 방법</span>
        </div>
        <p style="font-size:0.78rem; color:var(--ink);">👉 <strong>예시:</strong> <em>에티오피아 아바야 게이샤 내추럴</em><br>"에티오피아 아바야 마을에서 게이샤 나무 열매를 햇볕에 통째로 말려 달콤한 복숭아 맛이 나는 원두!"</p>
      `
    },
    roast: {
      kicker: "ROASTING LEVEL",
      title: "배전도 (로스팅 5단계)",
      getContext: (item) => {
        if (!item) return "";
        const descMap = {
          "Light": "꽃향기와 과일 산미가 가장 화사하고 쓴맛이 거의 없는 약배전입니다.",
          "Light-Medium": "산뜻한 과일 산미와 은은한 단맛이 균형을 이루는 약중배전입니다.",
          "Medium": "산미·단맛·고소함이 황금 밸런스를 이루는 표준 중배전입니다.",
          "Medium-Dark": "신맛이 줄고 다크 초콜릿과 구운 견과류 풍미가 깊어진 중강배전입니다.",
          "Dark": "신맛 없이 스모키하고 묵직한 다크 초콜릿·쓴맛이 강조된 강배전입니다."
        };
        return `현재 원두: <strong>🔥 ${escapeHtml(formatRoastShort(item.roast))}</strong> — ${escapeHtml(descMap[item.roast] || "균형 잡힌 로스팅 단계입니다.")}`;
      },
      body: `
        <p>생두에 열을 가해 볶는 정도에 따라 신맛·단맛·쓴맛의 비중이 결정됩니다.</p>
        <ul>
          <li><strong>약배전 (Light):</strong> 꽃향기와 과일 산미가 가장 화사하고 쓴맛이 없음</li>
          <li><strong>약중배전 (Light-Medium):</strong> 산뜻한 과일 산미와 은은한 단맛의 조화</li>
          <li><strong>중배전 (Medium):</strong> 산미·단맛·고소함이 황금 밸런스를 이루는 표준 단계</li>
          <li><strong>중강배전 (Medium-Dark):</strong> 신맛이 줄고 다크 초콜릿과 구운 견과류 풍미가 깊어짐</li>
          <li><strong>강배전 (Dark):</strong> 신맛 없이 스모키하고 묵직한 다크 초콜릿·쓴맛 강조</li>
        </ul>
      `
    },
    sour: {
      kicker: "TASTE AXIS 01 · ACIDITY",
      title: "산미 (Acidity · 상큼함)",
      getContext: (item) => item ? `현재 원두 산미: <strong>🍋 ${item.sourDots}단계 (${escapeHtml(item.sourDesc)})</strong>` : "",
      body: `
        <p>커피의 산미는 식초처럼 찌푸려지는 쉰 맛이 아니라, 사과·오렌지·자몽·베리 같은 <strong>과일의 상큼하고 싱그러운 과즙미</strong>를 뜻합니다.</p>
        <ul>
          <li><strong>1단계:</strong> 신맛 거의 없음 (고소·쌉쌀함 중심)</li>
          <li><strong>2단계:</strong> 자극 없이 은은하고 부드러운 과실 감칠맛</li>
          <li><strong>3단계:</strong> 상큼함과 고소함이 조화로운 중간 산미</li>
          <li><strong>4단계:</strong> 자몽·복숭아·베리 과즙이 선명하게 살아남</li>
          <li><strong>5단계:</strong> 시트러스·열대과일의 짜릿한 과즙 산미 폭발</li>
        </ul>
      `
    },
    nutty: {
      kicker: "TASTE AXIS 02 · NUTTY & COCOA",
      title: "고소함 (Nutty & Cocoa · 너티함)",
      getContext: (item) => item ? `현재 원두 고소함: <strong>🥜 ${item.nuttyDots}단계 (${escapeHtml(item.nuttyDesc)})</strong>` : "",
      body: `
        <p>구운 아몬드, 헤이즐넛, 땅콩, 보리차, 밀크/다크 초콜릿처럼 <strong>입안을 편안하고 구수하게 감싸는 풍미</strong>입니다.</p>
        <ul>
          <li><strong>1단계:</strong> 고소함 대신 화사한 꽃·허브·과일차 향미 중심</li>
          <li><strong>2단계:</strong> 뒷맛에 은은하게 감도는 부드러운 견과 여운</li>
          <li><strong>3단계:</strong> 과일향과 고소함이 균형 있게 어우러짐</li>
          <li><strong>4단계:</strong> 구운 아몬드·밀크초콜릿 같은 든든한 고소함</li>
          <li><strong>5단계:</strong> 볶은 땅콩·보리차·진한 다크 카카오의 극강 고소함</li>
        </ul>
      `
    },
    body: {
      kicker: "TASTE AXIS 03 · BODY WEIGHT",
      title: "바디감 (Body · 입안의 무게감)",
      getContext: (item) => item ? `현재 원두 바디감: <strong>⚖️ ${escapeHtml(item.bodyDesc)}</strong>` : "",
      body: `
        <p>신맛·단맛이 아니라, 커피를 삼킬 때 혀에 느껴지는 <strong>'국물의 두께감과 밀도'</strong>입니다.</p>
        <ul>
          <li><strong>1단계 (생수 · 맑은 허브티):</strong> 물처럼 가볍고 깔끔하게 쑥 넘어감</li>
          <li><strong>2단계 (사과주스 · 레몬티):</strong> 산뜻하고 매끄러운 과즙 느낌</li>
          <li><strong>3단계 (보리차 · 저지방 우유):</strong> 누구나 편안하게 즐기는 중간 두께</li>
          <li><strong>4단계 (일반 우유 · 핫초코):</strong> 입안이 도톰하고 든든하게 채워짐</li>
          <li><strong>5단계 (생크림 · 진한 시럽):</strong> 혀를 묵직하게 코팅하는 중량감</li>
        </ul>
      `
    },
    sweet: {
      kicker: "TASTE AXIS 04 · SWEETNESS",
      title: "달콤함 (Sweetness · 자연 단맛)",
      getContext: (item) => item && item.sweetDots != null ? `현재 원두 단맛: <strong>🍯 ${item.sweetDots}단계 (${escapeHtml(item.sweetDesc || "균형 잡힌 단맛")})</strong>` : "",
      body: `
        <p>설탕이나 시럽을 첨가한 단맛이 아니라, 잘 익은 커피 체리의 과당과 로스팅 중 <strong>캐러멜화(Caramelization)</strong>로 만들어지는 아카시아 꿀·과일청·초콜릿 같은 자연 단맛과 여운입니다.</p>
        <ul>
          <li><strong>1~2단계:</strong> 담백하고 드라이하며 깔끔하게 떨어지는 여운</li>
          <li><strong>3단계:</strong> 은은하게 뒷받침하는 균형 잡힌 자연 단맛</li>
          <li><strong>4~5단계:</strong> 꿀·과일잼·초콜릿 시럽처럼 혀끝에 오래 남는 풍부한 단맛</li>
        </ul>
      `
    },
    varietal: {
      kicker: "VARIETAL & WCR LINEAGE",
      title: "품종 & 유전 계보 (Varietal & Lineage)",
      getContext: (item) => item ? `현재 원두: <strong>🌱 ${escapeHtml(item.varietal)}</strong>${item.lineage ? ` (${escapeHtml(item.lineage)})` : ""}` : "",
      body: `
        <p>사과에 부사·아오리가 있듯 커피나무도 품종과 유전 계보에 따라 맛의 DNA가 다릅니다.</p>
        <ul>
          <li><strong>티피카 (Typica) 계열:</strong> 맑고 깨끗한 단맛과 실크 같은 밸런스 (블루마운틴, 코나 등)</li>
          <li><strong>버본 (Bourbon) 계열:</strong> 둥글고 풍부한 단맛과 초콜릿·과실미 (카투라, SL28, 파카스 등)</li>
          <li><strong>에티오피아 토착종 (Landrace):</strong> 자스민 꽃향기와 폭발적인 열대과일·시트러스 (게이샤, 치로소, 우시우시 등)</li>
          <li><strong>교배종 &amp; 희귀종:</strong> 병충해에 강하고 바디가 묵직한 품종(카스티요, 카티모르) 및 천연 저카페인 희귀종(로리나, 유제니오이데스)</li>
        </ul>
      `
    },
    process: {
      kicker: "PROCESS & PHYSICAL GRADE",
      title: "가공 방식 & 생두 등급",
      getContext: (item) => item ? `현재 원두: <strong>☀️ ${escapeHtml(item.process)}</strong>${item.physicalGrade ? ` · 등급: <strong>${escapeHtml(item.physicalGrade)}</strong>` : ""}` : "",
      body: `
        <p>수확한 커피 열매의 껍질을 어떻게 벗기고 말렸는지에 따라 향미와 질감이 크게 달라집니다.</p>
        <table class="process-table">
          <thead><tr><th>가공 방식</th><th>특징</th><th>대표 맛</th></tr></thead>
          <tbody>
            <tr><td><strong>워시드</strong></td><td>물로 과육 세척 후 건조</td><td>홍차처럼 맑고 개운한 맛</td></tr>
            <tr><td><strong>내추럴</strong></td><td>열매 통째로 햇볕 건조</td><td>딸기잼·와인처럼 진한 단맛</td></tr>
            <tr><td><strong>허니</strong></td><td>점액질(단물)을 남겨 건조</td><td>꿀물처럼 매끄러운 단맛</td></tr>
            <tr><td><strong>무산소/특수</strong></td><td>밀폐·온도발효 / 오크숙성</td><td>열대과일·요거트·위스키 풍미</td></tr>
          </tbody>
        </table>
        <p style="font-size:0.76rem; margin-top:4px;"><strong>생두 등급:</strong> <code>G1</code>(결점두 최소 최상급), <code>AA/Supremo</code>(크기가 큰 대립두), <code>SHB/SHG</code>(해발 1,350m+ 고산지 단단한 원두)</p>
      `
    },
    altitude: {
      kicker: "ALTITUDE & TERROIR",
      title: "재배 고도 & 산지 (Altitude & Terroir)",
      getContext: (item) => {
        if (!item) return "";
        const alt = (item.altitude && item.altitude !== "Blend" && item.altitude !== "Various") ? item.altitude : "산지별 상이 (Blend)";
        return `현재 원두: <strong>⛰️ ${item.region ? escapeHtml(item.region) + " · " : ""}${escapeHtml(alt)}</strong>`;
      },
      body: `
        <p>일반적으로 <strong>해발 1,400m ~ 2,200m 이상의 고산 지대</strong>일수록 낮과 밤의 일교차가 큽니다.</p>
        <ul>
          <li><strong>느린 성숙:</strong> 서늘한 밤 기온 덕분에 커피 열매가 천천히 익으면서 당분과 유기산을 가득 축적합니다.</li>
          <li><strong>높은 밀도:</strong> 조직이 단단하고 조밀하게 자라 로스팅 시 복합적인 과일 산미와 응축된 단맛이 풍부하게 발현됩니다.</li>
        </ul>
      `
    },
    recipe: {
      kicker: "BREWING TEMP & RATIO",
      title: "추천 추출 레시피 (Brew Recipe)",
      getContext: (item) => {
        if (!item) return "";
        const br = item.brewOverride || getBrewRecipe(item.roast);
        const warn = item.brewTempWarning ? `<br><span style="font-size:0.74rem; color:var(--ink-sub); font-weight:600;">🌡️ ${escapeHtml(item.brewTempWarning[currentLang] || item.brewTempWarning.ko)}</span>` : "";
        return `현재 원두 권장 레시피: <strong>💧 ${escapeHtml(br)}</strong>${warn}`;
      },
      body: `
        <p>표준 핸드드립 기본 비율은 <strong>원두 20g : 물 300ml (1:15)</strong>입니다. 배전도와 가공법에 따라 물 온도를 조절하세요.</p>
        <ul>
          <li><strong>약배전 (92~93°C):</strong> 원두 조직이 단단해 높은 수온으로 화사한 꽃·과일 향을 충분히 추출</li>
          <li><strong>중배전 (90~91°C):</strong> 단맛과 고소함의 밸런스가 가장 좋은 표준 수온</li>
          <li><strong>강배전·특수발효·디카페인 (88~89°C):</strong> 성분이 빠르게 우러나므로 과추출(쓴맛·탄맛)을 막기 위해 수온을 낮춰 추출</li>
        </ul>
      `
    },
    brew_methods: {
      kicker: "BREWING METHOD FLAVOR GUIDE",
      title: "추출 방식에 따른 맛 변화 상세 안내",
      getContext: (item) => item ? `현재 원두(<strong>${escapeHtml(item.name)}</strong>)도 어떤 도구로 내리느냐에 따라 산미·바디감·단맛 인상이 크게 달라집니다.` : "같은 원두라도 추출 도구와 압력·필터에 따라 향미와 질감이 달라집니다.",
      body: `
        <table class="process-table">
          <thead><tr><th>추출 방식</th><th>맛·질감 변화</th><th>추천 원두</th></tr></thead>
          <tbody>
            <tr><td><strong>핸드드립 (종이 필터)</strong></td><td>기름기를 걸러내 <strong>가장 맑고 산미·꽃향</strong>이 선명함 (본 아카이브 기준)</td><td>약·중배전 싱글오리진, 게이샤, 워시드</td></tr>
            <tr><td><strong>에스프레소 (고압)</strong></td><td>9기압 추출로 <strong>바디감·단맛·산미가 3~4배 응축</strong>되고 묵직함 증가</td><td>중·중강배전, 브라질·과테말라, 하우스 블렌드</td></tr>
            <tr><td><strong>콜드브루 (저온 침출)</strong></td><td>열 추출이 없어 <strong>날카로운 산미·쓴맛 감소</strong>, 초콜릿·와이니 단맛 강조</td><td>내추럴·허니·특수발효·다크 로스트</td></tr>
            <tr><td><strong>프렌치프레스 / 모카포트</strong></td><td>금속 필터로 커피 오일이 남아 <strong>묵직하고 진득한 바디감(+1단계)</strong></td><td>인도네시아 만델링, 고소한 견과류 원두</td></tr>
          </tbody>
        </table>
        <p style="font-size:0.76rem; margin-top:6px;">💡 <strong>아이스 급랭 드립 팁:</strong> 얼음 120g + 뜨거운 물 180ml(원두 22g)로 내리면 화사한 과일 산미와 향이 그대로 잠깁니다.</p>
      `
    },
    origin: {
      kicker: "TASTE AXIS 04 · ORIGIN & THEME",
      title: "원산지 & 특별 테마 (Origin Wheel)",
      getContext: (item) => {
        if (item) {
          const regionTxt = item.region ? ` · ${item.region}` : "";
          return `현재 원두 산지: <strong>${escapeHtml(item.origin)}${escapeHtml(regionTxt)}</strong>`;
        }
        const opt = ORIGIN_WHEEL_OPTIONS[wheelState.origin] || ORIGIN_WHEEL_OPTIONS[0];
        return `현재 휠 선택: <strong>${escapeHtml(opt.label)} (${escapeHtml(opt.kor)})</strong> — 4번째 휠을 돌려 특정 나라 또는 테마만 모아볼 수 있습니다.`;
      },
      body: `
        <p>디스펜서 4번째 휠은 <strong>27개 커피 생산국</strong>과 <strong>3대 스페셜 테마</strong>를 빠르게 걸러주는 필터입니다.</p>
        <ul>
          <li><strong>ALL (전체):</strong> 120종 마스터 DB 전체에서 취향 조합 검색</li>
          <li><strong>27개 국가 코드:</strong> 에티오피아(ETH), 콜롬비아(COL), 케냐(KEN), 예멘(YEM) 등 국가별 테루아 필터</li>
          <li><strong>🧪 FER (특수발효):</strong> 무산소·열충격·카보닉·코지 등 발효 공법 로트</li>
          <li><strong>✨ FLV (가향/인퓨즈):</strong> 천연 가향·과일 인퓨즈드·오크 배럴 에이지드</li>
          <li><strong>☕ BLD (블렌드):</strong> 밸런스가 완벽한 하우스 시그니처 블렌드</li>
        </ul>
      `
    },
    beginner_basics: {
      kicker: "HAND DRIP BEGINNER GUIDE",
      title: "카페 입문자 10초 기초 개념 요약",
      getContext: () => `처음 스페셜티 핸드드립을 접하시나요? 아래 4가지 개념만 알면 메뉴판 읽기가 훨씬 쉬워집니다.`,
      body: `
        <ul>
          <li><strong>☕ 핸드드립(브루잉) vs 아메리카노:</strong> 고압으로 빠르게 짜내는 에스프레소(아메리카노)와 달리, 종이 필터에 물줄기를 천천히 부어 내리는 핸드드립은 원두의 쓴맛·기름기는 걸러내고 <strong>원두 본연의 꽃향기·과일산미·초콜릿 단맛을 맑은 차(Tea)처럼 즐기는 방식</strong>입니다.</li>
          <li><strong>🌍 싱글오리진(Single Origin) vs 블렌드(Blend):</strong> 여러 나라 원두를 섞어 늘 일정한 맛을 내는 ‘하우스 블렌드’와 달리, <strong>단 한 나라의 특정 지역·농장 원두만 100% 사용해 그 땅의 개성(테루아)을 그대로 맛보는 커피</strong>가 ‘싱글오리진’입니다.</li>
          <li><strong>🏅 스페셜티 커피(Specialty Coffee):</strong> 국제 스페셜티 커피 협회(SCA) 기준 <strong>100점 만점에 80점 이상</strong>을 받은 상위 10% 특등급 원두로, 농장·품종·가공 족보가 투명하고 설탕 없이도 자연적인 단맛과 향미가 뛰어납니다.</li>
          <li><strong>🏷️ 카페 메뉴판 읽는 공식:</strong> <code>[나라] + [지역] + [품종] + [가공방식]</code> 순서만 알면 처음 보는 긴 이름도 맛을 바로 예측할 수 있습니다.</li>
        </ul>
      `
    },
    version_log: {
      kicker: "RELEASE NOTES & CHANGELOG",
      title: "Coffee Taste Archive 버전 기록",
      getContext: () => {
        const label = (typeof APP_VERSION_INFO !== "undefined" && APP_VERSION_INFO.displayLabel) ? APP_VERSION_INFO.displayLabel : "CTA v2.5.0 (α2)";
        const eng = (typeof APP_VERSION_INFO !== "undefined") ? APP_VERSION_INFO.engineName : "Casper™ V1";
        const schemaVer = (typeof APP_VERSION_INFO !== "undefined" && APP_VERSION_INFO.schemaVersion) ? APP_VERSION_INFO.schemaVersion : "v3.2";
        const dt = (typeof APP_VERSION_INFO !== "undefined") ? APP_VERSION_INFO.updatedAt : "2026-11-19";
        return `현재 빌드: <strong>${escapeHtml(label)}</strong> (${escapeHtml(dt)})<br>검색 엔진: <strong>${escapeHtml(eng)}</strong><br>스키마 버전: <strong>${escapeHtml(schemaVer)}</strong><br>수록 원두: <strong>SCA ${coffeeData.length}종 스페셜</strong>`;
      },
      body: () => {
        if (typeof APP_VERSION_INFO === "undefined" || !Array.isArray(APP_VERSION_INFO.history)) {
          return "<p>버전 기록을 불러올 수 없습니다.</p>";
        }
        return `<ul style="list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:10px;">` +
          APP_VERSION_INFO.history.map((h, i) => {
            const stg = h.stage ? ` (${h.stage})` : "";
            const schemaTag = h.schemaVersion ? ` · Schema ${h.schemaVersion}` : "";
            return `
              <li style="padding-bottom:9px; border-bottom:1px dashed rgba(92,80,70,0.18);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px; gap:6px;">
                  <strong style="color:${i === 0 ? 'var(--accent)' : 'var(--ink)'}; font-size:0.82rem;">CTA v${escapeHtml(h.version)}${escapeHtml(stg)}${escapeHtml(schemaTag)} ${i === 0 ? '· LATEST' : ''}</strong>
                  <span style="font-size:0.7rem; color:var(--ink-sub); font-family:monospace;">${escapeHtml(h.date)}</span>
                </div>
                <div style="font-size:0.79rem; color:var(--ink); line-height:1.48;">${escapeHtml(h.summary)}</div>
              </li>
            `;
          }).join("") +
          `</ul>`;
      }
    }
  };

  let lastTermHelpTrigger = null;
  function openTermGuide(termKey, coffeeId = null, triggerEl = null) {
    const def = COFFEE_TERM_GUIDES[termKey];
    if (!def || !termGuideBackdrop) return;
    const item = coffeeId ? coffeeData.find(c => c.id === coffeeId) : null;

    if (lastTermHelpTrigger) lastTermHelpTrigger.classList.remove("is-active");
    lastTermHelpTrigger = triggerEl || null;
    if (lastTermHelpTrigger) lastTermHelpTrigger.classList.add("is-active");

    if (termGuideKicker) termGuideKicker.textContent = def.kicker;
    if (termGuideTitle) termGuideTitle.textContent = def.title;

    const ctxHtml = typeof def.getContext === "function" ? def.getContext(item) : "";
    if (termGuideContextBox) {
      if (ctxHtml) {
        termGuideContextBox.innerHTML = ctxHtml;
        termGuideContextBox.classList.add("visible");
      } else {
        termGuideContextBox.innerHTML = "";
        termGuideContextBox.classList.remove("visible");
      }
    }
    if (termGuideBody) {
      termGuideBody.innerHTML = typeof def.body === "function" ? def.body(item) : def.body;
    }
    termGuideBackdrop.classList.add("open");
  }

  function closeTermGuide() {
    if (termGuideBackdrop) termGuideBackdrop.classList.remove("open");
    if (lastTermHelpTrigger) {
      lastTermHelpTrigger.classList.remove("is-active");
      lastTermHelpTrigger = null;
    }
  }

  if (termGuideBackdrop) {
    termGuideBackdrop.addEventListener("click", (e) => {
      if (e.target === termGuideBackdrop) closeTermGuide();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && termGuideBackdrop && termGuideBackdrop.classList.contains("open")) {
      closeTermGuide();
    }
  });

  const topClockWidget = document.getElementById("topClockWidget");
  const topClockText = document.getElementById("topClockText");
  const subdialWrap = document.getElementById("subdialWrap");
  const repeaterToast = document.getElementById("repeaterToast");
  const clockDigitEls = topClockText ? topClockText.querySelectorAll(".clock-d") : [];
  const secSubdialHand = document.getElementById("secSubdialHand");
  let lastClockStr = "";

  function showRepeaterToast(message, autoHideMs = 0) {
    if (!repeaterToast) return;
    if (repeaterToastTimer) {
      clearTimeout(repeaterToastTimer);
      repeaterToastTimer = null;
    }
    repeaterToast.textContent = message;
    repeaterToast.classList.add("visible");
    if (autoHideMs > 0) {
      repeaterToastTimer = setTimeout(() => {
        repeaterToast.classList.remove("visible");
        repeaterToastTimer = null;
      }, autoHideMs);
    }
  }

  function handleClockRepeaterClick() {
    const isSoundEnabled = !AudioFX.isMuted;
    const res = triggerMinuteRepeater(isSoundEnabled);
    if (res.status === "playing") {
      showRepeaterToast("🔔 5270P 미닛 리피터 타종 중");
    } else if (res.status === "stopped") {
      showRepeaterToast("🔕 미닛 리피터 타종을 중단했습니다.", 1800);
    } else if (res.status === "muted") {
      showRepeaterToast("🔇 소리가 꺼져 있습니다. 상단 '소리 ON'을 켜주세요.", 2200);
    }
  }

  if (topClockWidget) {
    topClockWidget.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClockRepeaterClick();
      }
    });
  }

  function updateTopClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    const ms = now.getMilliseconds();
    const timeDigits = hh + mm + ss;

    if (timeDigits !== lastClockStr && clockDigitEls.length === 6) {
      lastClockStr = timeDigits;
      for (let i = 0; i < 6; i++) {
        clockDigitEls[i].textContent = timeDigits[i];
      }
    }
    if (secSubdialHand) {
      // 부드러운 기계식 스위프(또는 정교한 초침 회전) 각도 계산
      const deg = (now.getSeconds() + ms / 1000) * 6;
      secSubdialHand.setAttribute("transform", `rotate(${deg.toFixed(1)} 50 50)`);
    }
  }
  updateTopClock();
  setInterval(updateTopClock, 100);

  // 스크롤 시 버튼 상단 숨김 센서
  window.addEventListener("scroll", () => {
    if (window.scrollY > 25) {
      soundToggleBtn.classList.add("slide-left");
      openDrawerBtn.classList.add("slide-left");
      if (langToggleBtn) langToggleBtn.classList.add("slide-left");
      if (topClockWidget) topClockWidget.classList.add("slide-up");
    } else {
      soundToggleBtn.classList.remove("slide-left");
      openDrawerBtn.classList.remove("slide-left");
      if (langToggleBtn) langToggleBtn.classList.remove("slide-left");
      if (topClockWidget) topClockWidget.classList.remove("slide-up");
    }
  });

  function renderOriginCards() {
    originCardsContainer.innerHTML = "";
    const filterTagLabel = currentLang === "en" ? "Filter 👉" : (currentLang === "ja" ? "絞り込み 👉" : "모아보기 👉");
    const flavorPrefix = currentLang === "en" ? "Notes: " : (currentLang === "ja" ? "代表風味: " : "대표 맛: ");
    originData.forEach(item => {
      const locOrigin = (item.i18n && item.i18n[currentLang]) || item.i18n?.ko || item;
      const locCountry = locOrigin.country || item.country;
      const locFlavor = locOrigin.flavor || item.flavor;
      const locDesc = locOrigin.desc || item.desc;
      const card = document.createElement("div");
      card.className = "origin-info-card";
      card.setAttribute("data-action", "select-origin-card");
      card.setAttribute("data-origin-query", item.query);
      card.setAttribute("data-origin-label", locCountry);
      card.innerHTML = `
        <div class="origin-card-head">
          <div class="origin-country-name">${escapeHtml(item.flag)} ${escapeHtml(locCountry)}</div>
          <span class="origin-filter-tag">${escapeHtml(filterTagLabel)}</span>
        </div>
        <div class="origin-card-flavor">${escapeHtml(flavorPrefix)}${escapeHtml(locFlavor)}</div>
        <div class="origin-card-desc">${escapeHtml(locDesc)}</div>
      `;
      originCardsContainer.appendChild(card);
    });
  }
  const renderOriginDrawerCards = renderOriginCards;

  // 📌 레트로 원두 디스펜서 (조작 휠 + 레버) 메커니즘 (Casper™ V1 위임)
  const leverWidget = document.getElementById("leverWidget");
  const leverTrigger = document.getElementById("leverTrigger");
  const beanDropZone = document.getElementById("beanDropZone");
  const wheelRandomBtn = document.getElementById("wheelRandomBtn");
  const randomWheelBtn = wheelRandomBtn;
  const dispenserMatchInfo = document.getElementById("dispenserMatchInfo");
  const exactBadge = document.getElementById("exactBadge");
  const closeBadge = document.getElementById("closeBadge");
  const searchOverrideBadge = document.getElementById("searchOverrideBadge");
  let isLeverPulling = false;
  let isThumbwheelsInitialized = false;

  const dispenserVersionBtn = document.getElementById("dispenserVersionBtn");
  if (dispenserVersionBtn && typeof APP_VERSION_INFO !== "undefined") {
    dispenserVersionBtn.textContent = APP_VERSION_INFO.displayLabel || `CTA v${APP_VERSION_INFO.version}`;
  }
  if (resetAllBtn) {
    resetAllBtn.textContent = `전체 ${coffeeData.length}종`;
  }

  const wheelState = {
    sour: 2,
    nutty: 4,
    body: 3,
    origin: 0
  };

  const DRUM_ID_MAP = { sour: "drumSour", nutty: "drumNutty", body: "drumBody", origin: "drumOrigin" };
  const VAL_BADGE_ID_MAP = { sour: "valSour", nutty: "valNutty", body: "valBody", origin: "valOrigin" };

  function getMatchingCoffees(s = wheelState, n, b, o) {
    if (typeof CasperEngine !== "undefined" && typeof CasperEngine.getMatchingCoffees === "function") {
      return CasperEngine.getMatchingCoffees(s, n, b, o, coffeeData);
    }
    return { list: [], exactCount: 0, closeCount: 0, isExact: false };
  }

  // Task 2-3: 레버 하단 배지 갱신 및 검색 모드 활성 시 충돌 방지
  function updateMatchBadges() {
    if (leverWidget) {
      leverWidget.classList.toggle("is-search-override", filterState.mode === "SEARCH");
    }
    if (filterState.mode === "SEARCH") {
      if (exactBadge) exactBadge.style.display = "none";
      if (closeBadge) closeBadge.style.display = "none";
      if (searchOverrideBadge) searchOverrideBadge.style.display = "inline-block";
      return;
    }
    if (searchOverrideBadge) searchOverrideBadge.style.display = "none";
    const { list, exactCount, closeCount, isExact } = getMatchingCoffees(wheelState);
    if (isExact) {
      if (exactBadge) {
        if (currentLang === "en") {
          exactBadge.innerHTML = closeCount > 0 ? `🎯 ${exactCount} Exact + ✨ ${closeCount}` : `🎯 ${exactCount} Exact`;
        } else if (currentLang === "ja") {
          exactBadge.innerHTML = closeCount > 0 ? `🎯 一致 ${exactCount} + ✨ ${closeCount}種` : `🎯 一致 ${exactCount}種`;
        } else {
          exactBadge.innerHTML = closeCount > 0 ? `🎯 일치 ${exactCount} + ✨ ${closeCount}종` : `🎯 일치 ${exactCount}종`;
        }
        exactBadge.style.display = "inline-block";
      }
      if (closeBadge) closeBadge.style.display = "none";
    } else {
      if (closeBadge) {
        if (currentLang === "en") {
          closeBadge.innerHTML = `✨ ${list.length} Close`;
        } else if (currentLang === "ja") {
          closeBadge.innerHTML = `✨ 近似 ${list.length}種`;
        } else {
          closeBadge.innerHTML = `✨ 근접 ${list.length}종`;
        }
        closeBadge.style.display = "inline-block";
      }
      if (exactBadge) exactBadge.style.display = "none";
    }
  }
  const updateDispenserMatchUI = updateMatchBadges;

  // Task 2-4: 휠 조작 또는 랜덤 조합 클릭 시 검색어 자동 초기화 & 레버 .needs-pull 활성화
  function markWheelInteracted() {
    const hadSearch = Boolean(searchInput.value.trim()) || filterState.mode === "SEARCH";
    if (hadSearch) {
      searchInput.value = "";
      filterState.query = "";
      if (clearSearchBtn) clearSearchBtn.style.display = "none";
      if (searchJumpBadge) searchJumpBadge.style.display = "none";
      if (coreCategoriesSection) coreCategoriesSection.classList.remove("open");
      filterState.mode = filterState.appliedWheel ? "DISPENSER" : "ALL";
      renderResults();
    }
    filterState.isWheelDirty = true;
    if (leverTrigger) leverTrigger.classList.add("needs-pull");
    updateMatchBadges();
  }

  function updateWheelVisual(type, val, playSound = false, isUserAction = isThumbwheelsInitialized) {
    const maxVal = type === "origin" ? ORIGIN_WHEEL_OPTIONS.length - 1 : 5;
    const clamped = Math.max(0, Math.min(maxVal, Math.round(val)));
    wheelState[type] = clamped;

    const drum = document.getElementById(DRUM_ID_MAP[type]);
    const slot = document.querySelector(`.wheel-slot[data-wheel="${type}"]`);
    const badge = document.getElementById(VAL_BADGE_ID_MAP[type]);
    const barIdMap = { sour: "barSour", nutty: "barNutty", body: "barBody", origin: "barOrigin" };
    const barEl = document.getElementById(barIdMap[type]);
    const neutralColor = "rgba(110, 98, 88, 0.3)";
    const stageColorMap = {
      sour: [neutralColor, "#FACC15", "#F59E0B", "#EA580C", "#DC2626", "#991B1B"],
      nutty: [neutralColor, "#D8B894", "#B68452", "#8A5628", "#5A3214", "#2C1508"],
      body: [neutralColor, "rgba(180, 214, 238, 0.32)", "rgba(142, 172, 194, 0.55)", "#7A8690", "#495057", "#212529"]
    };
    if (barEl) {
      barEl.style.backgroundColor = type === "origin"
        ? neutralColor
        : (stageColorMap[type]?.[clamped] || neutralColor);
    }

    if (drum) {
      const idx = clamped;
      const slotInnerH = (slot && slot.clientHeight) ? slot.clientHeight : 80;
      const padTop = parseFloat(window.getComputedStyle(drum).paddingTop) || 40;
      const translateY = (slotInnerH / 2) - padTop - 11 - (idx * 22);
      drum.style.transform = `translateY(${translateY}px)`;

      const nums = drum.querySelectorAll(".wheel-num");
      nums.forEach(numEl => {
        const v = parseInt(numEl.getAttribute("data-val"), 10);
        const diff = Math.abs(v - clamped);
        numEl.classList.remove("active", "near", "far");
        if (diff === 0) numEl.classList.add("active");
        else if (diff === 1) numEl.classList.add("near");
        else numEl.classList.add("far");

        if (type !== "origin" && numEl.classList.contains("is-any")) {
          numEl.textContent = clamped === 0 ? "ANY" : "-";
        }
      });
    }

    if (slot) {
      slot.setAttribute("aria-valuenow", String(clamped));
    }

    const CALLOUT_ID_MAP = { sour: "calloutSour", nutty: "calloutNutty", body: "calloutBody", origin: "calloutOrigin" };
    const calloutEl = document.getElementById(CALLOUT_ID_MAP[type]);
    let displayValueText = "";
    if (type === "origin") {
      const opt = ORIGIN_WHEEL_OPTIONS[clamped] || ORIGIN_WHEEL_OPTIONS[0];
      if (opt.key === "ALL") {
        displayValueText = tUI("allOriginLabel");
      } else {
        displayValueText = (typeof ORIGIN_I18N_MAP !== "undefined" && ORIGIN_I18N_MAP[opt.code]?.[currentLang]) || opt.kor;
      }
    } else if (clamped === 0) {
      displayValueText = tUI("anyLabel");
    } else {
      displayValueText = currentLang === "en" ? `${tUI("stageUnit")}${clamped}` : `${clamped}${tUI("stageUnit")}`;
    }

    if (badge) {
      badge.textContent = `• ${displayValueText}`;
    }
    if (calloutEl) {
      calloutEl.textContent = displayValueText;
    }

    if (playSound) {
      AudioFX.tick(clamped);
    }

    if (isUserAction) {
      markWheelInteracted();
    } else {
      updateMatchBadges();
    }
  }

  function initThumbwheels() {
    const drumOriginEl = document.getElementById("drumOrigin");
    const slotOriginEl = document.querySelector('.wheel-slot[data-wheel="origin"]');
    if (drumOriginEl) {
      drumOriginEl.innerHTML = ORIGIN_WHEEL_OPTIONS.map((opt, idx) =>
        `<div class="wheel-num is-origin ${idx === 0 ? 'is-any' : ''}" data-val="${idx}">${escapeHtml(opt.label)}</div>`
      ).join("");
    }
    if (slotOriginEl) {
      slotOriginEl.setAttribute("aria-valuemax", String(ORIGIN_WHEEL_OPTIONS.length - 1));
    }

    const slots = document.querySelectorAll(".wheel-slot");
    slots.forEach(slot => {
      const type = slot.getAttribute("data-wheel");
      const drum = document.getElementById(DRUM_ID_MAP[type]);

      // 초기 렌더링
      updateWheelVisual(type, wheelState[type], false, false);

      // 마우스 휠 스크롤 조작
      slot.addEventListener("wheel", (e) => {
        e.preventDefault();
        const dir = e.deltaY > 0 ? 1 : -1;
        updateWheelVisual(type, wheelState[type] + dir, true, true);
      }, { passive: false });

      // 키보드 방향키 조작
      slot.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          updateWheelVisual(type, wheelState[type] - 1, true, true);
        } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          e.preventDefault();
          updateWheelVisual(type, wheelState[type] + 1, true, true);
        }
      });

      // Task 3-2: 드래그/스와이프 및 상·하단 탭(Tap/Click) 시 단계 1씩 즉시 증감 보장 (모바일 터치 스크롤 간섭 방어 포함)
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let startVal = wheelState[type];
      let moved = false;
      let soundPlayedDuringDrag = false;
      let downNumEl = null;
      let pointerCaptured = false;
      const unitEl = slot.closest(".thumbwheel-unit");
      let calloutHideTimer = null;
      const showWheelCallout = () => {
        if (!unitEl) return;
        if (calloutHideTimer) { clearTimeout(calloutHideTimer); calloutHideTimer = null; }
        unitEl.classList.add("is-touching");
      };
      const scheduleHideWheelCallout = (delayMs = 460) => {
        if (!unitEl) return;
        if (calloutHideTimer) clearTimeout(calloutHideTimer);
        calloutHideTimer = setTimeout(() => {
          unitEl.classList.remove("is-touching");
          calloutHideTimer = null;
        }, delayMs);
      };

      slot.addEventListener("pointerdown", (e) => {
        isDragging = true;
        moved = false;
        soundPlayedDuringDrag = false;
        pointerCaptured = false;
        startX = e.clientX;
        startY = e.clientY;
        startVal = wheelState[type];
        downNumEl = e.target.closest(".wheel-num");
        showWheelCallout();
        if (e.pointerType !== "touch") {
          if (drum) drum.classList.add("dragging");
          if (slot.setPointerCapture) {
            try {
              slot.setPointerCapture(e.pointerId);
              pointerCaptured = true;
            } catch (err) {}
          }
        }
      });

      slot.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        if (e.pointerType === "touch" && (performance.now() - lastWindowScrollMs) < 180) {
          isDragging = false;
          if (drum) drum.classList.remove("dragging");
          scheduleHideWheelCallout(120);
          return;
        }
        const dx = Math.abs(e.clientX - startX);
        const dy = e.clientY - startY;
        if (e.pointerType === "touch" && !pointerCaptured) {
          if (dx > Math.abs(dy) && dx > 8) {
            isDragging = false;
            scheduleHideWheelCallout(120);
            return;
          }
          if (Math.abs(dy) >= 10) {
            if (drum) drum.classList.add("dragging");
            if (slot.setPointerCapture) {
              try {
                slot.setPointerCapture(e.pointerId);
                pointerCaptured = true;
              } catch (err) {}
            }
          }
        }
        if (Math.abs(dy) >= 12) moved = true;
        const stepDelta = Math.round(-dy / 18);
        const maxVal = type === "origin" ? ORIGIN_WHEEL_OPTIONS.length - 1 : 5;
        const targetVal = Math.max(0, Math.min(maxVal, startVal + stepDelta));
        if (targetVal !== wheelState[type]) {
          soundPlayedDuringDrag = true;
          showWheelCallout();
          updateWheelVisual(type, targetVal, true, true);
        }
      });

      const endDrag = (e) => {
        if (!isDragging) return;
        isDragging = false;
        if (drum) drum.classList.remove("dragging");
        scheduleHideWheelCallout(520);
        if (e.pointerType === "touch" && (isTouchMoved || (performance.now() - lastWindowScrollMs) < 180 || (performance.now() - touchStartTime) >= 220) && !soundPlayedDuringDrag) {
          return;
        }

        if (!moved) {
          // 상단(이전 숫자) 또는 하단(다음 숫자) 탭/클릭 판별
          const targetNum = downNumEl || e.target.closest(".wheel-num");
          if (targetNum) {
            const clickedVal = parseInt(targetNum.getAttribute("data-val"), 10);
            if (!isNaN(clickedVal) && clickedVal !== wheelState[type]) {
              updateWheelVisual(type, clickedVal, true, true);
              return;
            }
          }
          const rect = slot.getBoundingClientRect();
          const clickY = e.clientY - rect.top;
          if (clickY < rect.height / 2) {
            updateWheelVisual(type, wheelState[type] - 1, true, true);
          } else {
            updateWheelVisual(type, wheelState[type] + 1, true, true);
          }
        } else if (!soundPlayedDuringDrag) {
          const dy = e.clientY - startY;
          const dir = dy < 0 ? 1 : -1;
          updateWheelVisual(type, wheelState[type] + dir, true, true);
        }
      };

      slot.addEventListener("pointerup", endDrag);
      slot.addEventListener("pointercancel", () => {
        isDragging = false;
        pointerCaptured = false;
        if (drum) drum.classList.remove("dragging");
        scheduleHideWheelCallout(120);
      });
    });

    isThumbwheelsInitialized = true;
    window.addEventListener("resize", () => {
      ["sour", "nutty", "body", "origin"].forEach(t => updateWheelVisual(t, wheelState[t], false, false));
    });
  }

  initThumbwheels();

  function smoothScrollToElement(el, duration = 280) {
    if (!el) return;
    const startY = window.scrollY || window.pageYOffset;
    const targetRect = el.getBoundingClientRect();
    const targetY = Math.max(0, startY + targetRect.top - 16);
    const diff = targetY - startY;
    if (Math.abs(diff) < 2) return;
    let startTime = null;
    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    function step(ts) {
      if (startTime === null) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(1, elapsed / duration);
      window.scrollTo(0, startY + diff * easeInOutCubic(progress));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  function triggerRandomWheelDial() {
    const sample = coffeeData[Math.floor(Math.random() * coffeeData.length)];
    updateWheelVisual("sour", sample.sourDots, false, false);
    updateWheelVisual("nutty", sample.nuttyDots, false, false);
    updateWheelVisual("body", sample.bodyDots, false, false);
    updateWheelVisual("origin", 0, false, false);
    markWheelInteracted();
  }

  function pullDispenserLever() {
    if (isLeverPulling) return;
    isLeverPulling = true;

    const targetCombo = {
      sour: wheelState.sour,
      nutty: wheelState.nutty,
      body: wheelState.body,
      origin: wheelState.origin
    };

    const deckEl = document.querySelector(".dispenser-deck");
    const slotSour = document.querySelector('.wheel-slot[data-wheel="sour"]');
    const slotNutty = document.querySelector('.wheel-slot[data-wheel="nutty"]');
    const slotBody = document.querySelector('.wheel-slot[data-wheel="body"]');
    const slotOrigin = document.querySelector('.wheel-slot[data-wheel="origin"]');
    const slots = [
      { key: "sour", el: slotSour, target: targetCombo.sour, lockTick: 3 },
      { key: "nutty", el: slotNutty, target: targetCombo.nutty, lockTick: 6 },
      { key: "body", el: slotBody, target: targetCombo.body, lockTick: 9 },
      { key: "origin", el: slotOrigin, target: targetCombo.origin, lockTick: 12 }
    ];

    // 1) 레버 당김 & 클러치 결합 사운드
    AudioFX.lever();
    leverTrigger.classList.add("pulled");
    leverTrigger.classList.remove("needs-pull");
    if (deckEl) deckEl.classList.add("is-calculating");

    // 원두 입자 연출 병행
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const bean = document.createElement("div");
        bean.className = "dropping-bean";
        bean.innerText = "🫘";
        bean.style.left = (25 + Math.random() * 65) + "%";
        bean.style.animationDuration = (0.55 + Math.random() * 0.35) + "s";
        beanDropZone.appendChild(bean);
        setTimeout(() => bean.remove(), 900);
      }, i * 70);
    }

    // 2) Hamann 300 계산 사이클 (총 12틱, 75ms 간격 = 900ms 동안 4축 순차 확정)
    let tickCount = 0;
    slots.forEach(s => {
      if (s.el) s.el.classList.remove("carriage-active", "register-locked");
    });
    if (slotSour) slotSour.classList.add("carriage-active");

    const calcInterval = setInterval(() => {
      tickCount++;
      AudioFX.gearTooth(tickCount);

      slots.forEach((s, idx) => {
        if (tickCount < s.lockTick) {
          const mod = s.key === "origin" ? ORIGIN_WHEEL_OPTIONS.length : 6;
          const cycleVal = (targetCombo[s.key] + tickCount + idx) % mod;
          updateWheelVisual(s.key, cycleVal, false, false);
        } else if (tickCount === s.lockTick) {
          updateWheelVisual(s.key, s.target, false, false);
          AudioFX.carriageShift(idx === slots.length - 1);

          if (s.el) {
            s.el.classList.remove("carriage-active");
            s.el.classList.add("register-locked");
          }
          if (idx + 1 < slots.length && slots[idx + 1].el) {
            slots[idx + 1].el.classList.add("carriage-active");
          }
        }
      });

      if (tickCount >= 12) {
        clearInterval(calcInterval);
        if (deckEl) deckEl.classList.remove("is-calculating");
        leverTrigger.classList.remove("pulled");

        setTimeout(() => {
          slots.forEach(s => {
            if (s.el) s.el.classList.remove("carriage-active", "register-locked");
          });
          isLeverPulling = false;

          stopAudio();
          searchInput.value = "";
          if (clearSearchBtn) clearSearchBtn.style.display = "none";
          if (searchJumpBadge) searchJumpBadge.style.display = "none";
          if (coreCategoriesSection) coreCategoriesSection.classList.remove("open");

          filterState.mode = "DISPENSER";
          filterState.query = "";
          filterState.appliedWheel = { ...targetCombo };
          filterState.isWheelDirty = false;
          updateMatchBadges();

          appContainer.classList.add("searched");
          resultsContainer.classList.add("visible");

          const { list, exactCount, closeCount, isExact } = getMatchingCoffees(filterState.appliedWheel);
          const exactPart = list.slice(0, exactCount).sort(() => Math.random() - 0.5);
          const closePart = list.slice(exactCount);
          const orderedList = [...exactPart, ...closePart];
          const aw = filterState.appliedWheel;
          const sourTxt = aw.sour === 0 ? "무관" : aw.sour;
          const nuttyTxt = aw.nutty === 0 ? "무관" : aw.nutty;
          const bodyTxt = aw.body === 0 ? "무관" : aw.body;
          const originOpt = ORIGIN_WHEEL_OPTIONS[aw.origin] || ORIGIN_WHEEL_OPTIONS[0];
          const originTxt = aw.origin > 0 ? `·원산지 ${originOpt.kor}` : "";
          let customHeader = "";
          if (exactCount > 0 && closeCount > 0) {
            const mixedFn = tUI("dispenserMixedTitle");
            customHeader = typeof mixedFn === "function" ? mixedFn(orderedList.length, exactCount, closeCount) : `🎰 맞춤 큐레이션 <strong>${orderedList.length}</strong>종`;
          } else if (isExact) {
            const exactFn = tUI("dispenserExactTitle");
            customHeader = typeof exactFn === "function" ? exactFn(orderedList.length) : `🎰 조합 일치 카드 <strong>${orderedList.length}</strong>종`;
          } else {
            const closeFn = tUI("dispenserCloseTitle");
            customHeader = typeof closeFn === "function" ? closeFn(orderedList.length) : `✨ 근접 추천 카드 <strong>${orderedList.length}</strong>종`;
          }

          renderCompactCards(orderedList, customHeader);
          setTimeout(() => {
            smoothScrollToElement(resultsHeader, 540);
          }, 260);
        }, 180);
      }
    }, 75);
  }

  // 📌 영수증 프린터 모달 제어 및 SVG 바코드
  const printerModalOverlay = document.getElementById("printerModalOverlay");
  const receiptPaper = document.getElementById("receiptPaper");
  const closePrinterBtn = document.getElementById("closePrinterBtn");
  const openModalFromRcpBtn = document.getElementById("openModalFromRcpBtn");
  let currentPrintedCoffee = null;

  // 원두 고유의 키(seed)를 바탕으로 지정된 SVG 또는 Canvas 요소에 일관된 고유 바코드를 생성하는 함수
  function generateBarcodeSvg(seed = "DISPENSER", svgId = "barcodeSvg") {
    const el = document.getElementById(svgId);
    if (!el) return;

    let hash = 2166136261;
    for (let i = 0; i < seed.length; i++) {
      hash ^= seed.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    function pseudoRandom() {
      hash ^= hash << 13;
      hash ^= hash >>> 17;
      hash ^= hash << 5;
      return ((hash >>> 0) % 1000) / 1000;
    }

    const bars = [];
    let x = 0;
    for (let i = 0; i < 48; i++) {
      const r1 = pseudoRandom();
      const r2 = pseudoRandom();
      const width = r1 > 0.6 ? 4 : 2;
      bars.push({ x, width });
      x += width + (r2 > 0.5 ? 2 : 1);
    }
    const totalW = Math.max(180, x);

    if (el.tagName && el.tagName.toLowerCase() === "canvas") {
      const dpr = 2;
      el.width = totalW * dpr;
      el.height = 36 * dpr;
      el.style.width = "220px";
      el.style.height = "36px";
      const ctx = el.getContext("2d");
      ctx.clearRect(0, 0, el.width, el.height);
      ctx.fillStyle = "#FFFDF9";
      ctx.fillRect(0, 0, el.width, el.height);
      ctx.fillStyle = "#1A1412";
      bars.forEach(b => {
        ctx.fillRect(b.x * dpr, 0, b.width * dpr, 34 * dpr);
      });
      return;
    }

    el.innerHTML = "";
    bars.forEach(b => {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", b.x);
      rect.setAttribute("y", 0);
      rect.setAttribute("width", b.width);
      rect.setAttribute("height", 32);
      rect.setAttribute("fill", "#1A1412");
      el.appendChild(rect);
    });
    el.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    el.setAttribute("viewBox", `0 0 ${totalW} 32`);
  }

  function drawTicketSawtoothCanvas(canvasId = "modalSawtoothCanvas") {
    const cvs = document.getElementById(canvasId);
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    const w = cvs.width;
    const h = cvs.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#ECE3D8";
    ctx.fillRect(0, 0, w, h);

    const teeth = 28;
    const step = w / teeth;
    ctx.fillStyle = "#FFFDF9";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let i = 0; i < teeth; i++) {
      const xMid = (i + 0.5) * step;
      const xEnd = (i + 1) * step;
      ctx.lineTo(xMid, h - 2);
      ctx.lineTo(xEnd, 0);
    }
    ctx.closePath();
    ctx.fill();
  }

  function triggerReceiptPrinter(item, isExact = true) {
    currentPrintedCoffee = item;
    stopAudio();

    document.getElementById("rcpNo").innerText = item.no;
    document.getElementById("rcpName").innerText = item.name;
    document.getElementById("rcpEng").innerText = item.eng;
    document.getElementById("rcpHeadline").innerText = `"${item.headline}"`;
    document.getElementById("rcpOrigin").innerText = item.origin;
    document.getElementById("rcpProcess").innerText = item.process;
    const tasteComboEl = document.getElementById("rcpTasteCombo");
    if (tasteComboEl) {
      const matchTag = isExact ? "🎯일치" : "✨근접";
      tasteComboEl.innerText = `산미${item.sourDots}·고소${item.nuttyDots}·바디${item.bodyDots} (${matchTag})`;
    }
    document.getElementById("rcpBody").innerText = item.bodyDesc.split(' ')[0];

    const today = new Date();
    document.getElementById("rcpDate").innerText = `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`;

    generateBarcodeSvg(item.id || item.no || item.name, "barcodeSvg");

    toggleUI(printerModalOverlay, null, true);
    receiptPaper.classList.remove("printing");
    void receiptPaper.offsetWidth;
    receiptPaper.classList.add("printing");
    AudioFX.printer();
  }

  const printBtn = document.getElementById("printBtn");
  const saveShareBtn = document.getElementById("saveShareBtn");
  const shareRcpBtn = document.getElementById("shareRcpBtn");

  // 카카오톡·네이버·인스타 등 인앱 브라우저 감지 및 티켓 이미지 저장 미리보기 모달 제어
  const ticketImagePreviewOverlay = document.getElementById("ticketImagePreviewOverlay");
  const ticketPreviewImg = document.getElementById("ticketPreviewImg");
  const ticketPreviewShareBtn = document.getElementById("ticketPreviewShareBtn");
  const ticketPreviewExtBtn = document.getElementById("ticketPreviewExtBtn");
  const closeTicketPreviewBtn = document.getElementById("closeTicketPreviewBtn");
  const ticketPreviewCloseBtn2 = document.getElementById("ticketPreviewCloseBtn2");
  let latestTicketBlob = null;

  function isInAppBrowserEnv() {
    const ua = navigator.userAgent || "";
    return /KAKAOTALK|NAVER|Instagram|FBAN|FBAV|Line|DaumApps|Twitter|Snapchat|wv\)/i.test(ua);
  }
  function isKakaoTalkBrowser() {
    return /KAKAOTALK/i.test(navigator.userAgent || "");
  }
  function closeTicketImagePreview() {
    toggleUI(ticketImagePreviewOverlay, null, false);
  }
  function openTicketImagePreview(dataUrl, blob) {
    latestTicketBlob = blob || null;
    if (ticketPreviewImg) ticketPreviewImg.src = dataUrl;
    if (ticketPreviewShareBtn) {
      let canShareImg = false;
      if (blob && typeof File !== "undefined" && navigator.canShare) {
        try {
          const testFile = new File([blob], "coffee_taste_ticket.png", { type: "image/png" });
          canShareImg = navigator.canShare({ files: [testFile] });
        } catch (e) { canShareImg = false; }
      }
      ticketPreviewShareBtn.style.display = canShareImg ? "inline-flex" : "none";
    }
    if (ticketPreviewExtBtn) {
      ticketPreviewExtBtn.style.display = isKakaoTalkBrowser() ? "inline-flex" : "none";
    }
    toggleUI(ticketImagePreviewOverlay, null, true);
  }

  if (ticketImagePreviewOverlay) {
    ticketImagePreviewOverlay.addEventListener("click", (e) => {
      if (e.target === ticketImagePreviewOverlay) closeTicketImagePreview();
    });
  }
  function shareTicketPreviewBlob() {
    if (!latestTicketBlob || !navigator.share) return;
    try {
      const file = new File([latestTicketBlob], "coffee_taste_ticket.png", { type: "image/png" });
      navigator.share({ files: [file] }).catch(() => {});
    } catch (e) {}
  }
  function openTicketExternalBrowser() {
    const targetUrl = encodeURIComponent(window.location.href);
    window.location.href = `kakaotalk://web/openExternal?url=${targetUrl}`;
  }

  // 공통 티켓 이미지 캡처/저장/공유 함수 (카카오톡 인앱 브라우저 '지원하지 않는 형식' 원천 방지)
  function captureAndSaveTicket(targetEl, btnEl, bgColor = "#ECE3D8", mode = "download") {
    if (!targetEl || !btnEl) return;
    const originalBtnText = btnEl.innerHTML;
    btnEl.innerHTML = mode === "share" ? "⏳ 공유 준비..." : "⏳ 저장 중...";

    const originalAnim = targetEl.style.animation;
    targetEl.style.animation = "none";

    const triggerDirectDownload = (rgbCanvas, blob) => {
      const dataUrl = rgbCanvas.toDataURL("image/png");
      if (isInAppBrowserEnv()) {
        openTicketImagePreview(dataUrl, blob);
        return;
      }
      const fileName = "coffee_taste_ticket.png";
      const link = document.createElement("a");
      link.download = fileName;
      link.style.display = "none";
      if (blob) {
        const blobUrl = URL.createObjectURL(blob);
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          link.remove();
          URL.revokeObjectURL(blobUrl);
        }, 15000);
      } else {
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => link.remove(), 2000);
      }
    };

    html2canvas(targetEl, {
      scale: 2,
      backgroundColor: bgColor,
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: -window.scrollY
    }).then(rawCanvas => {
      targetEl.style.animation = originalAnim;
      btnEl.innerHTML = originalBtnText;

      // 알파 채널(투명도)로 인한 모바일/갤러리 '지원하지 않는 형식' 오류를 방지하기 위해 불투명 RGB 캔버스로 합성
      const rgbCanvas = document.createElement("canvas");
      rgbCanvas.width = rawCanvas.width;
      rgbCanvas.height = rawCanvas.height;
      const rgbCtx = rgbCanvas.getContext("2d", { alpha: false });
      rgbCtx.fillStyle = bgColor || "#ECE3D8";
      rgbCtx.fillRect(0, 0, rgbCanvas.width, rgbCanvas.height);
      rgbCtx.drawImage(rawCanvas, 0, 0);
      const dataUrl = rgbCanvas.toDataURL("image/png");

      rgbCanvas.toBlob(blob => {
        if (!blob) {
          if (isInAppBrowserEnv()) {
            openTicketImagePreview(dataUrl, null);
          } else {
            triggerDirectDownload(rgbCanvas, null);
          }
          return;
        }
        if (mode === "share") {
          try {
            const file = new File([blob], "coffee_taste_ticket.png", { type: "image/png" });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              navigator.share({ files: [file] }).catch(err => {
                if (err && err.name !== "AbortError") {
                  openTicketImagePreview(dataUrl, blob);
                }
              });
              return;
            }
          } catch (e) {}
          if (isInAppBrowserEnv()) {
            openTicketImagePreview(dataUrl, blob);
            return;
          }
        }
        if (isInAppBrowserEnv()) {
          openTicketImagePreview(dataUrl, blob);
          return;
        }
        triggerDirectDownload(rgbCanvas, blob);
      }, "image/png", 1.0);
    }).catch(err => {
      targetEl.style.animation = originalAnim;
      btnEl.innerHTML = originalBtnText;
      console.error("영수증 이미지 캡처 실패:", err);
      alert("이미지 저장 중 오류가 발생했습니다.");
    });
  }

  // 상세 모달 제어 (Task 6: 상세 프로필 + 영수증 티켓 단일 모달 통합)
  const detailModalOverlay = document.getElementById("detailModalOverlay");
  const detailModalContent = document.getElementById("detailModalContent");
  let activeAudioBtn = null;

  function renderDots(count, type = '') {
    let colorClass = type;
    if (type === 'sour') {
      if (count <= 2) colorClass = 'sour-low';
      else if (count === 3) colorClass = 'sour-mid';
      else colorClass = 'sour-high';
    }
    return Array.from({length: 5}, (_, i) => `<div class="dot ${i < count ? 'filled ' + colorClass : ''}"></div>`).join('');
  }

  function formatRoastText(roast) {
    switch (roast) {
      case 'Light': return '약배전 (Light / 시나몬)';
      case 'Light-Medium': return '약중배전 (Light-Medium / 미디엄)';
      case 'Medium': return '중배전 (Medium / 하이·시티)';
      case 'Medium-Dark': return '중강배전 (Medium-Dark / 풀시티)';
      case 'Dark': return '강배전 (Dark / 프렌치·이탈리안)';
      default: return roast;
    }
  }

  function formatRoastShort(roast) {
    switch (roast) {
      case 'Light': return '약배전 (Light)';
      case 'Light-Medium': return '약중배전';
      case 'Medium': return '중배전 (Medium)';
      case 'Medium-Dark': return '중강배전';
      case 'Dark': return '강배전 (Dark)';
      default: return roast;
    }
  }

  // Task 6-2: 배전도별 권장 추출 레시피 (BREW RECIPE)
  function getBrewRecipe(roast) {
    switch (roast) {
      case 'Light': return '약배전 92~93°C · 20g / 300ml';
      case 'Light-Medium': return '약중배전 91~92°C · 20g / 300ml';
      case 'Medium': return '중배전 90~91°C · 20g / 300ml';
      case 'Medium-Dark': return '중강배전 90~91°C · 20g / 300ml';
      case 'Dark': return '강배전 88~89°C · 20g / 300ml';
      default: return '표준 91~92°C · 20g / 300ml';
    }
  }

  // Task 6-1: 단일 모달 내부 시소(Rocker) 탭 전환 ([ 📋 상세 프로필 ] / [ 🧾 영수증 티켓 ])
  window.switchModalTab = function(tab) {
    const segTabs = document.getElementById("modalSegmentTabs");
    const profileSection = document.getElementById("modalProfileSection");
    const ticketStubWrap = document.getElementById("modalTicketStubWrap");
    const tabBtnProfile = document.getElementById("tabBtnProfile");
    const tabBtnTicket = document.getElementById("tabBtnTicket");
    const scrollBody = document.getElementById("modalScrollBody");

    if (tab === "ticket") {
      if (segTabs) segTabs.classList.add("is-ticket");
      if (profileSection) profileSection.classList.add("hidden");
      if (ticketStubWrap) ticketStubWrap.classList.remove("hidden");
      if (tabBtnProfile) {
        tabBtnProfile.classList.remove("active");
        tabBtnProfile.setAttribute("aria-selected", "false");
      }
      if (tabBtnTicket) {
        tabBtnTicket.classList.add("active");
        tabBtnTicket.setAttribute("aria-selected", "true");
      }
    } else {
      if (segTabs) segTabs.classList.remove("is-ticket");
      if (profileSection) profileSection.classList.remove("hidden");
      if (ticketStubWrap) ticketStubWrap.classList.add("hidden");
      if (tabBtnProfile) {
        tabBtnProfile.classList.add("active");
        tabBtnProfile.setAttribute("aria-selected", "true");
      }
      if (tabBtnTicket) {
        tabBtnTicket.classList.remove("active");
        tabBtnTicket.setAttribute("aria-selected", "false");
      }
    }
    if (scrollBody) scrollBody.scrollTop = 0;
  };

  function buildNameDecoderBar(item) {
    if (!item) return "";
    const lang = currentLang;
    const cCode = item.countryCode || "ETH";
    const originMapEntry = (typeof ORIGIN_I18N_MAP !== "undefined" && ORIGIN_I18N_MAP[cCode]) || null;
    const originEntry = originData.find(o => o.code === cCode);

    let originLabel = originMapEntry ? originMapEntry[lang] : ((item.origin || "").replace(/^[^\s]+\s*/, "").trim() || "Specialty");
    let originHint = lang === "en" ? "Single Origin" : (lang === "ja" ? "シングルオリジン" : "개성 있는 풍미");
    if (item.categoryType === "HOUSE_BLEND" || cCode === "BLEND") {
      if (item.categoryType === "FLAVORED") {
        originLabel = (typeof ORIGIN_I18N_MAP !== "undefined" && ORIGIN_I18N_MAP.FLV?.[lang]) || "Flavored";
        originHint = lang === "en" ? "Botanical Aroma" : (lang === "ja" ? "ボタニカル香" : "천연 향미");
      } else {
        originLabel = (typeof ORIGIN_I18N_MAP !== "undefined" && ORIGIN_I18N_MAP.BLD?.[lang]) || "House Blend";
        originHint = lang === "en" ? "Golden Balance" : (lang === "ja" ? "黄金バランス" : "황금 밸런스");
      }
    } else if (originEntry) {
      if (lang === "ko") {
        const topFlavors = (originEntry.flavor || "").split(",").slice(0, 2).map(s => s.trim()).filter(Boolean).join("·");
        originHint = topFlavors || "싱글오리진";
      } else {
        const fams = (item.flavorFamily || []).slice(0, 2).join("·");
        originHint = fams || (lang === "ja" ? "産地個性" : "Terroir");
      }
    }

    const vRaw = (item.varietal || "Arabica").trim();
    const vUp = vRaw.toUpperCase();
    const varietalHintMap = {
      geisha:  { ko: "꽃향기 품종", en: "Floral & Tea", ja: "花香品種" },
      sl:      { ko: "자몽·와인 산미", en: "Citrus & Wine", ja: "柑橘・ワイン" },
      eug:     { ko: "초극강 단맛 원종", en: "Ultra Sweet", ja: "極上甘み原種" },
      laurina: { ko: "저카페인 단맛", en: "Low-Caf Sweet", ja: "低カフェイン" },
      rare:    { ko: "과일·꽃향 희귀종", en: "Rare Floral", ja: "希少華やか種" },
      large:   { ko: "풍성한 대립종", en: "Giant Bean", ja: "大粒まろやか" },
      bourbon: { ko: "클래식 단맛", en: "Classic Sweet", ja: "定番の甘み" },
      typica:  { ko: "실크 밸런스", en: "Silky Balance", ja: "繊細バランス" },
      heir:    { ko: "꽃·베리 토착종", en: "Heirloom Berry", ja: "在来花実種" },
      cast:    { ko: "고소한 바디", en: "Nutty Body", ja: "香ばしボディ" },
      rob:     { ko: "진한 크레마", en: "Rich Crema", ja: "濃厚クレマ" },
      blend:   { ko: "멀티 품종 조화", en: "Multi-Varietal", ja: "複数品種調和" },
      def:     { ko: "깔끔한 밸런스", en: "Clean Balance", ja: "クリーン調和" }
    };
    let vKey = "def";
    if (vUp.includes("GEISHA") || vUp.includes("GESHA")) vKey = "geisha";
    else if (vUp.includes("SL28") || vUp.includes("SL34") || vUp.includes("SL14")) vKey = "sl";
    else if (vUp.includes("EUGENIOIDES")) vKey = "eug";
    else if (vUp.includes("LAURINA") || vUp.includes("POINTU")) vKey = "laurina";
    else if (vUp.includes("SIDRA") || vUp.includes("CHIROSO") || vUp.includes("WUSH") || vUp.includes("MEJORADO")) vKey = "rare";
    else if (vUp.includes("PACAMARA") || vUp.includes("MARAGOGIPE")) vKey = "large";
    else if (vUp.includes("BOURBON") || vUp.includes("CATURRA") || vUp.includes("CATUAI") || vUp.includes("PACAS") || vUp.includes("VILLA SARCHI")) vKey = "bourbon";
    else if (vUp.includes("TYPICA") || vUp.includes("BLUE MOUNTAIN") || vUp.includes("KONA") || vUp.includes("ARUSHA") || vUp.includes("KENT")) vKey = "typica";
    else if (vUp.includes("HEIRLOOM") || vUp.includes("74110") || vUp.includes("74112") || vUp.includes("JAVA") || vUp.includes("YEMENIA")) vKey = "heir";
    else if (vUp.includes("CASTILLO") || vUp.includes("CATIMOR") || vUp.includes("ATENG") || vUp.includes("TIM") || vUp.includes("ARARA") || vUp.includes("PARAINEMA")) vKey = "cast";
    else if (vUp.includes("ROBUSTA") || vUp.includes("CANEPHORA")) vKey = "rob";
    else if (vUp.includes("BLEND") || vRaw.includes("/")) vKey = "blend";
    const varietalHint = varietalHintMap[vKey][lang] || varietalHintMap[vKey].ko;

    const procKey = item.caffeine === "DECAF" ? "Decaf" : (item.processGroup || "Washed");
    const procMeta = (typeof COFFEE_TAXONOMY !== "undefined" && COFFEE_TAXONOMY.processGroup[procKey]) || COFFEE_TAXONOMY?.processGroup?.Washed;
    const procLabel = procMeta ? procMeta[lang] : (item.processGroup || item.process || "Washed");
    const procHint = (procMeta && procMeta.hint) ? procMeta.hint[lang] : (lang === "en" ? "Balanced↑" : "균형미↑");

    return `
      <div class="name-decoder-bar" aria-label="원두 이름 3초 해독">
        <span class="decoder-chip term-label-link" role="button" tabindex="0" data-term="origin" data-coffee-id="${escapeHtml(item.id)}" title="Origin">📍 <strong>${escapeHtml(originLabel)}</strong> · ${escapeHtml(originHint)}</span>
        <span class="decoder-chip term-label-link" role="button" tabindex="0" data-term="varietal" data-coffee-id="${escapeHtml(item.id)}" title="Varietal">🌱 <strong>${escapeHtml(vRaw)}</strong> · ${escapeHtml(varietalHint)}</span>
        <span class="decoder-chip term-label-link" role="button" tabindex="0" data-term="process" data-coffee-id="${escapeHtml(item.id)}" title="Process">☀️ <strong>${escapeHtml(procLabel)}</strong> · ${escapeHtml(procHint)}</span>
      </div>
    `;
  }

  // Phase 1 (Alpha2) + Phase 2-2A: 간단(3축) / 자세히(5축 오각형 + 단맛) 공유 축 빌더 및 레이더 차트
  function buildRadarAxes(item, mode = detailProfileMode) {
    const isDetailed = mode === "detailed";
    const roastLv = (item.brewSpec && item.brewSpec.roastIntensity) || (typeof COFFEE_TAXONOMY !== "undefined" && COFFEE_TAXONOMY.roast[item.roast]?.intensity) || 3;
    return isDetailed
      ? [
          { label: tUI("radarSour"),  val: item.sourDots || 1 },
          { label: tUI("radarNutty"), val: item.nuttyDots || 1 },
          { label: tUI("radarBody"),  val: item.bodyDots || 1 },
          { label: tUI("radarSweet"), val: item.sweetDots || 3 },
          { label: tUI("radarRoast"), val: roastLv }
        ]
      : [
          { label: tUI("radarSour"),  val: item.sourDots || 1 },
          { label: tUI("radarNutty"), val: item.nuttyDots || 1 },
          { label: tUI("radarBody"),  val: item.bodyDots || 1 }
        ];
  }

  function renderTasteRadarSvg(item, mode = detailProfileMode) {
    const isDetailed = mode === "detailed";
    const axes = buildRadarAxes(item, mode);

    const cx = 120;
    const cy = isDetailed ? 96 : 102;
    const maxR = 62;
    const count = axes.length;
    const pointAt = (idx, ratio) => {
      const angle = (-Math.PI / 2) + (idx * 2 * Math.PI / count);
      return [cx + Math.cos(angle) * maxR * ratio, cy + Math.sin(angle) * maxR * ratio];
    };

    const gridPolys = [0.2, 0.4, 0.6, 0.8, 1.0].map((r, gi) => {
      const pts = axes.map((_, i) => pointAt(i, r).map(n => n.toFixed(1)).join(",")).join(" ");
      return `<polygon points="${pts}" fill="${gi === 4 ? 'rgba(245, 239, 230, 0.55)' : 'none'}" stroke="rgba(92, 80, 70, ${gi === 4 ? 0.34 : 0.16})" stroke-width="${gi === 4 ? 1.2 : 0.9}" ${gi < 4 ? 'stroke-dasharray="2.5 2"' : ''}/>`;
    }).join("");

    const spokes = axes.map((_, i) => {
      const [x, y] = pointAt(i, 1);
      return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(92, 80, 70, 0.22)" stroke-width="0.9"/>`;
    }).join("");

    const dataPts = axes.map((a, i) => pointAt(i, Math.max(0.18, Math.min(5, a.val) / 5)));
    const dataPoly = `<polygon points="${dataPts.map(p => p.map(n => n.toFixed(1)).join(",")).join(" ")}" fill="rgba(184, 74, 39, 0.22)" stroke="#B84A27" stroke-width="2" stroke-linejoin="round"/>`;
    const dots = dataPts.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="#B84A27" stroke="#FFFDF9" stroke-width="1.3"/>`).join("");

    const labels = axes.map((a, i) => {
      const [lx, ly] = pointAt(i, 1.32);
      const anchor = Math.abs(lx - cx) < 10 ? "middle" : (lx > cx ? "start" : "end");
      const dy = ly < cy - 30 ? -2 : (ly > cy + 30 ? 8 : 3);
      return `<text x="${lx.toFixed(1)}" y="${(ly + dy).toFixed(1)}" text-anchor="${anchor}" font-family="Pretendard, sans-serif" font-size="10.2" font-weight="800" fill="#1E1915">${escapeHtml(a.label)} <tspan fill="#B84A27">${escapeHtml(a.val)}</tspan></text>`;
    }).join("");

    return `
      <div class="modal-radar-wrap" aria-label="테이스팅 프로필 레이더 차트">
        <svg class="taste-radar-svg" viewBox="0 0 240 192" role="img" aria-label="${isDetailed ? '5축 오각형' : '3축'} 맛 레이더 차트">
          ${gridPolys}
          ${spokes}
          ${dataPoly}
          ${dots}
          ${labels}
        </svg>
      </div>
    `;
  }

  function renderCompareRadarSvg(itemA, itemB, mode = detailProfileMode) {
    const isDetailed = mode === "detailed";
    const axesA = buildRadarAxes(itemA, mode);
    const axesB = buildRadarAxes(itemB, mode);
    const cx = 130;
    const cy = isDetailed ? 102 : 108;
    const maxR = 66;
    const count = axesA.length;
    const pointAt = (idx, ratio) => {
      const angle = (-Math.PI / 2) + (idx * 2 * Math.PI / count);
      return [cx + Math.cos(angle) * maxR * ratio, cy + Math.sin(angle) * maxR * ratio];
    };

    const gridPolys = [0.2, 0.4, 0.6, 0.8, 1.0].map((r, gi) => {
      const pts = axesA.map((_, i) => pointAt(i, r).map(n => n.toFixed(1)).join(",")).join(" ");
      return `<polygon points="${pts}" fill="${gi === 4 ? 'rgba(245, 239, 230, 0.55)' : 'none'}" stroke="rgba(92, 80, 70, ${gi === 4 ? 0.34 : 0.16})" stroke-width="${gi === 4 ? 1.2 : 0.9}" ${gi < 4 ? 'stroke-dasharray="2.5 2"' : ''}/>`;
    }).join("");

    const spokes = axesA.map((_, i) => {
      const [x, y] = pointAt(i, 1);
      return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(92, 80, 70, 0.22)" stroke-width="0.9"/>`;
    }).join("");

    const ptsA = axesA.map((a, i) => pointAt(i, Math.max(0.18, Math.min(5, a.val) / 5)));
    const ptsB = axesB.map((a, i) => pointAt(i, Math.max(0.18, Math.min(5, a.val) / 5)));

    const polyA = `<polygon points="${ptsA.map(p => p.map(n => n.toFixed(1)).join(",")).join(" ")}" fill="rgba(184, 74, 39, 0.22)" stroke="#B84A27" stroke-width="2.1" stroke-linejoin="round"/>`;
    const polyB = `<polygon points="${ptsB.map(p => p.map(n => n.toFixed(1)).join(",")).join(" ")}" fill="rgba(26, 107, 106, 0.20)" stroke="#1A6B6A" stroke-width="2.1" stroke-linejoin="round"/>`;

    const dotsA = ptsA.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="#B84A27" stroke="#FFFDF9" stroke-width="1.3"/>`).join("");
    const dotsB = ptsB.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="#1A6B6A" stroke="#FFFDF9" stroke-width="1.3"/>`).join("");

    const labels = axesA.map((a, i) => {
      const [lx, ly] = pointAt(i, 1.32);
      const anchor = Math.abs(lx - cx) < 10 ? "middle" : (lx > cx ? "start" : "end");
      const dy = ly < cy - 30 ? -2 : (ly > cy + 30 ? 8 : 3);
      return `<text x="${lx.toFixed(1)}" y="${(ly + dy).toFixed(1)}" text-anchor="${anchor}" font-family="Pretendard, sans-serif" font-size="10.4" font-weight="800" fill="#1E1915">${escapeHtml(a.label)}</text>`;
    }).join("");

    return `
      <svg class="compare-radar-svg" viewBox="0 0 260 204" role="img" aria-label="${escapeHtml(tUI("compareModalTitle"))}">
        ${gridPolys}
        ${spokes}
        ${polyA}
        ${polyB}
        ${dotsA}
        ${dotsB}
        ${labels}
      </svg>
    `;
  }

  window.toggleDetailProfileMode = function() {
    detailProfileMode = detailProfileMode === "detailed" ? "simple" : "detailed";
    try { localStorage.setItem("cta_detail_mode", detailProfileMode); } catch (e) {}
    if (currentOpenModalCoffeeId) {
      const scrollBody = document.getElementById("modalScrollBody");
      const savedScrollTop = scrollBody ? scrollBody.scrollTop : 0;
      const segTabs = document.getElementById("modalSegmentTabs");
      const wasTicket = segTabs && segTabs.classList.contains("is-ticket");
      window.openDetailModal(currentOpenModalCoffeeId);
      if (wasTicket) window.switchModalTab("ticket");
      const newScrollBody = document.getElementById("modalScrollBody");
      if (newScrollBody) newScrollBody.scrollTop = savedScrollTop;
    }
  };

  window.openDetailModal = function(coffeeId) {
    const item = coffeeData.find(c => c.id === coffeeId);
    if (!item) return;

    currentOpenModalCoffeeId = item.id;
    stopAudio();

    const loc = getLocalizedBean(item, currentLang);
    const isTasted = tastedSet.has(item.id);
    const isDetailed = detailProfileMode === "detailed";
    const today = new Date();
    const stampedDateStr = isTasted ? getTastedStampDate(item.id) : formatLocalStampDate(today);
    const todayFullStr = `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`;
    const altitudeDisplay = item.altitudeRange
      ? (item.altitudeRange[0] === item.altitudeRange[1]
          ? `${item.altitudeRange[0].toLocaleString()}m`
          : `${item.altitudeRange[0].toLocaleString()}m ~ ${item.altitudeRange[1].toLocaleString()}m`)
      : (currentLang === "en" ? "Multi-Origin (Blend)" : (currentLang === "ja" ? "産地別 (Blend)" : "산지별 상이 (Blend)"));
    const brewRecipe = loc.brewText || item.brewOverride || getBrewRecipe(item.roast);
    const brewWarnText = (item.brewTempWarning && (item.brewTempWarning[currentLang] || item.brewTempWarning.ko)) || "";
    const dialingNoteText = loc.dialingNote || (item.dialingNote && (item.dialingNote[currentLang] || item.dialingNote.ko)) || "";

    const caffeineBadgeHtml = item.caffeine === "DECAF"
      ? `<span class="modal-roast-pill" style="background:#EEF4F8; color:#2E5A78; border-color:#B6CFE0;">🌙 DECAF</span>`
      : item.caffeine === "LOW_CAF"
      ? `<span class="modal-roast-pill" style="background:#EEF7EE; color:#2F6B3B; border-color:#B7DEC0;">🌿 LOW-CAF</span>`
      : "";
    const categoryBadgeHtml = item.categoryType === "FERMENTED_LOT"
      ? `<span class="modal-roast-pill" style="background:#F5EFFA; color:#6B3FA0; border-color:#D8C4EE;">🧪 ${currentLang === "en" ? "Fermented" : (currentLang === "ja" ? "特殊発酵" : "특수발효")}</span>`
      : "";
    // 확정 정책: 기본(simple) 화면은 3축만 표시하고, 자세히(detailed) 모드에서만 단맛(sweetDots) 노출
    const sweetRowHtml = (isDetailed && item.sweetDots != null)
      ? `<div class="modal-profile-row">
              <span class="modal-profile-name"><span class="term-label-link" role="button" tabindex="0" data-term="sweet" data-coffee-id="${escapeHtml(item.id)}">${escapeHtml(tUI("labelSweet"))}</span></span>
              <div class="modal-profile-dots">${renderDots(item.sweetDots || 3, 'sour')}</div>
              <span class="modal-profile-desc">${escapeHtml(loc.sweetDesc)}</span>
            </div>`
      : "";

    const lineageClean = item.lineage ? item.lineage.replace(/\s*\([^)]*\)/g, "").trim() : "";
    const varietalDisplay = item.varietalCanonical || item.varietal;
    const varietalValHtml = (lineageClean && lineageClean.toLowerCase() !== (varietalDisplay || "").toLowerCase())
      ? `${escapeHtml(varietalDisplay)} <span style="font-size:0.72rem; color:var(--ink-sub); font-weight:600;">· ${escapeHtml(lineageClean)}</span>`
      : escapeHtml(varietalDisplay);
    const procMeta = (typeof COFFEE_TAXONOMY !== "undefined" && COFFEE_TAXONOMY.processGroup[item.processGroup]) || null;
    const processBase = procMeta ? procMeta[currentLang] : (item.processGroup || item.process || "");
    const gradeClean = item.physicalGrade ? item.physicalGrade.replace(/\s*\([^)]*\)/g, "").trim() : "";
    const processValHtml = gradeClean
      ? `${escapeHtml(processBase)} <span style="font-size:0.72rem; color:var(--ink-sub); font-weight:600;">· ${escapeHtml(gradeClean)}</span>`
      : escapeHtml(processBase);

    // Schema v3.1: Traceability (실명 검증 42 · 지역 등급 53 · 아키타입 16 · 검증 대기 9 — 가짜 출처 0건)
    const trace = item.traceability || {};
    const authType = trace.authenticityType || "PENDING_VERIFICATION";
    const authMeta = (typeof COFFEE_TAXONOMY !== "undefined" && COFFEE_TAXONOMY.authenticityBadge[authType]) || null;
    const authBadgeLabel = authMeta ? authMeta[currentLang] : authType;
    const authBadgeDesc = (authMeta && authMeta.desc) ? authMeta.desc[currentLang] : "";
    const authBadgeCls = authType === "ESTATE_LOT"
      ? "is-estate"
      : authType === "REGIONAL_GRADE"
      ? "is-regional"
      : authType === "PENDING_VERIFICATION"
      ? "is-pending"
      : "is-archetype";
    const tradeQuery = (trace.tradeSearchQuery && trace.tradeSearchQuery[currentLang]) || trace.tradeSearchQuery?.ko || `${item.name} 원두`;
    const tradeQueryKor = (trace.tradeSearchQuery && trace.tradeSearchQuery.ko) || `${item.name} 원두`;
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(tradeQuery)}`;
    const naverUrl = `https://search.naver.com/search.naver?query=${encodeURIComponent(tradeQueryKor)}`;
    const isPending = authType === "PENDING_VERIFICATION";
    const producerHtml = isPending
      ? `<span style="color:#8A5A00;">${escapeHtml(tUI("pendingProducerText"))}</span>${trace.estateOrStation ? ` <span style="font-size:0.74rem; color:var(--ink-sub); font-weight:600;">· ${escapeHtml(trace.estateOrStation)}</span>` : ""}`
      : `${escapeHtml(trace.producerName || loc.region)}${trace.estateOrStation ? ` <span style="font-size:0.74rem; color:var(--ink-sub); font-weight:600;">· ${escapeHtml(trace.estateOrStation)}</span>` : ""}`;
    const safeSourceUrl = (!isPending && trace.source && trace.source.url) ? sanitizeUrl(trace.source.url) : "";
    const sourceHtml = (safeSourceUrl && safeSourceUrl !== "#")
      ? `<a class="trace-source-link" href="${escapeHtml(safeSourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(trace.source.label)} ↗</a>`
      : `<span style="font-size:0.76rem; color:var(--ink-sub); font-weight:600;">${escapeHtml(tUI("pendingSourceText"))}</span>`;

    const traceabilityHtml = `
      <div class="modal-traceability-card">
        <div class="trace-header-row">
          <span class="trace-section-title">${escapeHtml(tUI("traceSectionTitle"))}</span>
          <span class="trace-auth-badge ${authBadgeCls}" title="${escapeHtml(authBadgeDesc)}">${escapeHtml(authBadgeLabel)}</span>
        </div>
        <div class="trace-info-list">
          <div class="trace-info-item">
            <span class="trace-info-label">${escapeHtml(tUI("labelProducer"))}</span>
            <span class="trace-info-val">${producerHtml}</span>
          </div>
          <div class="trace-info-item">
            <span class="trace-info-label">${escapeHtml(tUI("labelSourceRef"))}</span>
            <span class="trace-info-val">${sourceHtml}</span>
          </div>
          <div class="trace-info-item">
            <span class="trace-info-label">${escapeHtml(tUI("labelTradeQuery"))}</span>
            <span class="trace-info-val" style="font-size:0.78rem; color:var(--ink-sub);">${escapeHtml(tradeQuery)}</span>
          </div>
        </div>
        <div class="trace-search-actions">
          <a class="trace-search-btn" href="${escapeHtml(googleUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(tUI("btnSearchGoogle"))}</a>
          <a class="trace-search-btn" href="${escapeHtml(naverUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(tUI("btnSearchNaver"))}</a>
        </div>
      </div>
      <div class="modal-disclosure-note">${escapeHtml(tUI("disclosureNotice"))}</div>
    `;

    const safeCoffeeId = escapeHtml(item.id);
    const bodyDescRendered = currentLang === "ko" ? formatBodyNote(loc.bodyDesc) : loc.bodyDesc;

    detailModalContent.innerHTML = `
      <button type="button" class="modal-close-btn" aria-label="${escapeHtml(tUI("modalCloseAria"))}" data-action="close-detail-modal">✕</button>

      <div class="modal-meta-bar">
        <div class="modal-meta-left">
          <span class="modal-card-num">${escapeHtml(item.no)}</span>
          <span class="modal-roast-pill">🔥 ${escapeHtml(loc.roastShort)}</span><button type="button" class="term-help-btn" data-term="roast_naming" data-coffee-id="${safeCoffeeId}" title="배전도 및 이름 공식 설명" aria-label="배전도 및 이름 공식 설명">?</button>
          ${caffeineBadgeHtml}
          ${categoryBadgeHtml}
        </div>
        <span class="modal-origin-pill">${escapeHtml(loc.originBadge)}</span>
      </div>

      <!-- Task 6-1: 시소(Rocker) 메커니즘 기반 탭 스위처 -->
      <div class="modal-segment-tabs" id="modalSegmentTabs" role="tablist" aria-label="상세 프로필 및 영수증 티켓 전환">
        <button type="button" role="tab" aria-selected="true" class="modal-tab-btn active" id="tabBtnProfile" data-action="switch-modal-tab" data-tab="profile">
          <span class="rocker-dot"></span>
          <span>${escapeHtml(tUI("tabProfile"))}</span>
        </button>
        <div class="rocker-pivot-divider" aria-hidden="true"></div>
        <button type="button" role="tab" aria-selected="false" class="modal-tab-btn" id="tabBtnTicket" data-action="switch-modal-tab" data-tab="ticket">
          <span class="rocker-dot"></span>
          <span>${escapeHtml(tUI("tabTicket"))}</span>
        </button>
      </div>

      <div class="modal-title-section">
        <h2 class="modal-kor-name">${escapeHtml(loc.name)}</h2>
        <div class="modal-eng-name">${escapeHtml(loc.subName)}</div>
        <div class="modal-compare-row">
          <button type="button" class="modal-compare-btn ${isBeanInCompare(item.id) ? 'is-selected' : ''}" id="modalCompareBtn" data-action="toggle-compare" data-coffee-id="${safeCoffeeId}" aria-pressed="${isBeanInCompare(item.id)}">
            ${escapeHtml(isBeanInCompare(item.id) ? tUI("compareAddedBtn") : tUI("compareAddBtn"))}
          </button>
        </div>
      </div>

      <div class="modal-scroll-body" id="modalScrollBody">
        <div class="modal-profile-section-wrap" id="modalProfileSection">
          ${buildNameDecoderBar(item)}

          <!-- 1. 통합 스토리 카드 (한줄 평 + 바리스타 팁) -->
          <div class="modal-story-card">
            <div class="story-headline">“${escapeHtml(loc.headline)}”</div>
            <div class="story-guide">🗣️ ${escapeHtml(loc.guide)}</div>
          </div>

          <!-- 2. ☕ 맛 프로필 (기본 3축 / 자세히 5축 오각형 레이더 + 단맛) -->
          <div class="modal-profile-card">
            <div class="profile-card-title">
              <span>${escapeHtml(tUI("tasteSectionTitle"))}</span>
              <span class="profile-title-right">
                <button type="button" class="detail-mode-toggle-btn ${isDetailed ? 'is-detailed' : ''}" id="detailModeToggleBtn" data-action="toggle-detail-mode" aria-pressed="${isDetailed}">
                  ${escapeHtml(isDetailed ? tUI("modeDetailBtn") : tUI("modeSimpleBtn"))}
                </button>
                <button type="button" class="term-help-btn" data-term="taste_all" data-coffee-id="${safeCoffeeId}" title="맛 지표 설명" aria-label="맛 지표 설명">?</button>
              </span>
            </div>
            ${renderTasteRadarSvg(item, detailProfileMode)}
            <div class="modal-profile-row">
              <span class="modal-profile-name"><span class="term-label-link" role="button" tabindex="0" data-term="sour" data-coffee-id="${safeCoffeeId}">${escapeHtml(tUI("labelSour"))}</span></span>
              <div class="modal-profile-dots">${renderDots(item.sourDots, 'sour')}</div>
              <span class="modal-profile-desc">${escapeHtml(loc.sourDesc)}</span>
            </div>
            <div class="modal-profile-row">
              <span class="modal-profile-name"><span class="term-label-link" role="button" tabindex="0" data-term="nutty" data-coffee-id="${safeCoffeeId}">${escapeHtml(tUI("labelNutty"))}</span></span>
              <div class="modal-profile-dots">${renderDots(item.nuttyDots, 'nutty')}</div>
              <span class="modal-profile-desc">${escapeHtml(loc.nuttyDesc)}</span>
            </div>
            <div class="modal-profile-row">
              <span class="modal-profile-name"><span class="term-label-link" role="button" tabindex="0" data-term="body" data-coffee-id="${safeCoffeeId}">${escapeHtml(tUI("labelBody"))}</span></span>
              <div class="modal-profile-dots">${renderDots(item.bodyDots, 'body')}</div>
              <span class="modal-profile-desc highlight">${escapeHtml(bodyDescRendered)}</span>
            </div>
            ${sweetRowHtml}
          </div>

          <!-- 3. 원산지 & 추출 스펙 4분할 그리드 + 추출 온도 주의(안내문 2) + 추출 방식별 맛 변화(안내문 4) -->
          <div class="modal-spec-section">
            <div class="modal-spec-header"><span>${escapeHtml(tUI("specSectionTitle"))}</span><button type="button" class="term-help-btn" data-term="spec_all" data-coffee-id="${safeCoffeeId}" title="원두 스펙 및 추출 가이드" aria-label="원두 스펙 및 추출 가이드">?</button></div>
            <div class="modal-spec-grid">
              <div class="modal-spec-item">
                <span class="modal-spec-label"><span class="term-label-link" role="button" tabindex="0" data-term="varietal" data-coffee-id="${safeCoffeeId}">${escapeHtml(tUI("labelVarietal"))}</span></span>
                <span class="modal-spec-val">${varietalValHtml}</span>
              </div>
              <div class="modal-spec-item">
                <span class="modal-spec-label"><span class="term-label-link" role="button" tabindex="0" data-term="process" data-coffee-id="${safeCoffeeId}">${escapeHtml(tUI("labelProcess"))}</span></span>
                <span class="modal-spec-val">${processValHtml}</span>
              </div>
              <div class="modal-spec-item">
                <span class="modal-spec-label"><span class="term-label-link" role="button" tabindex="0" data-term="altitude" data-coffee-id="${safeCoffeeId}">${escapeHtml(tUI("labelRegionAlt"))}</span></span>
                <span class="modal-spec-val">${loc.region ? `${escapeHtml(loc.region)} · ` : ''}${escapeHtml(altitudeDisplay)}</span>
              </div>
              <div class="modal-spec-item">
                <span class="modal-spec-label"><span class="term-label-link" role="button" tabindex="0" data-term="recipe" data-coffee-id="${safeCoffeeId}">${escapeHtml(tUI("labelBrewRecipe"))}</span></span>
                <span class="modal-spec-val recipe-highlight">${escapeHtml(brewRecipe)}</span>
              </div>
            </div>
            ${dialingNoteText ? `<div class="modal-dialing-note-box"><strong>☕ ${escapeHtml(tUI("labelDialingNote"))}:</strong> ${escapeHtml(dialingNoteText)}</div>` : ""}
            ${brewWarnText ? `<div class="modal-brew-warning-box"><strong>${escapeHtml(tUI("labelBrewWarning"))}:</strong>${escapeHtml(brewWarnText)}</div>` : ""}
            <button type="button" class="modal-brew-methods-btn" data-term="brew_methods" data-coffee-id="${safeCoffeeId}">${escapeHtml(tUI("brewMethodsLink"))}</button>
          </div>

          <!-- 4. Schema v3.1: 생산자 · 농장 · 출처 및 실제 원두 검색 + 수익화/주관 평가 고지 -->
          ${traceabilityHtml}
        </div>

        <!-- 5. Task 6-1: 영수증 티켓 탭 -->
        <div class="modal-ticket-stub-wrap hidden" id="modalTicketStubWrap">
          <div class="modal-ticket-stub" id="modalTicketStub">
            <div class="stamp-seal ${isTasted ? 'stamped' : ''}" id="modalStampSeal">
              <span class="stamp-inner-text">TASTED</span>
              <span class="stamp-inner-text">시음완료</span>
              <span class="stamp-date-text" id="modalStampDateText">${escapeHtml(stampedDateStr)}</span>
            </div>
            <div class="stub-brand-title">DISPENSER TASTING TICKET</div>
            <div class="stub-header">
              <span>${escapeHtml(item.no)}</span>
              <span>${escapeHtml(todayFullStr)}</span>
            </div>
            <div class="stub-coffee-title">${escapeHtml(loc.name)}</div>
            <div class="stub-coffee-eng">${escapeHtml(loc.subName)}</div>
            <div class="stub-headline">"${escapeHtml(loc.headline)}"</div>
            <div class="stub-spec-rows">
              <div class="stub-row"><span>ORIGIN</span><span>${escapeHtml(loc.originBadge)}</span></div>
              <div class="stub-row"><span>PROCESS</span><span>${escapeHtml(processBase)}</span></div>
              <div class="stub-row"><span>TASTE DIAL</span><span>${escapeHtml(tUI("wheelSour"))} ${item.sourDots} · ${escapeHtml(tUI("wheelNutty"))} ${item.nuttyDots} · ${escapeHtml(tUI("wheelBody"))} ${item.bodyDots}</span></div>
              <div class="stub-row"><span>BREW RECIPE</span><span>${escapeHtml(brewRecipe)}</span></div>
            </div>
            <div class="stub-barcode-area">
              <canvas id="modalBarcodeSvg" width="220" height="36"></canvas>
              <span style="font-size:0.64rem; color:#887B70; font-weight:700; letter-spacing:0.6px;">SCA CERTIFIED SPECIALTY ARCHIVE</span>
            </div>
          </div>
          <canvas id="modalSawtoothCanvas" class="stub-sawtooth-canvas" width="720" height="24"></canvas>
          <div class="ticket-export-toolbar" data-html2canvas-ignore="true">
            <button type="button" class="ticket-export-btn" id="ticketDirectSaveBtn" data-action="save-modal-ticket" data-mode="download">${escapeHtml(tUI("ticketDirectSave"))}</button>
            <button type="button" class="ticket-export-btn" id="ticketShareBtn" data-action="save-modal-ticket" data-mode="share">${escapeHtml(tUI("ticketShare"))}</button>
            <button type="button" class="ticket-export-btn" id="ticketPrintBtn" data-action="print-modal-ticket">${escapeHtml(tUI("ticketPrint"))}</button>
          </div>
        </div>
      </div>

      <!-- 6. Task 6-3: 모달 하단 3열 액션 바 -->
      <div class="modal-perforated-section">
        <div class="modal-action-bar-3col">
          <button type="button" class="action-btn" id="modalAudioBtn" data-action="toggle-modal-audio" data-coffee-id="${safeCoffeeId}">
            ${escapeHtml(tUI("btnAudioRead"))}
          </button>
          <button type="button" class="action-btn ${isTasted ? 'tasted-active' : ''}" id="toggleTastedBtn" data-action="toggle-tasted" data-coffee-id="${safeCoffeeId}">
            ${escapeHtml(tUI("btnTasted"))}
          </button>
          <button type="button" class="action-btn primary-save" id="saveTicketImgBtn" data-action="save-modal-ticket" data-mode="download">
            ${escapeHtml(tUI("btnSaveTicket"))}
          </button>
        </div>
      </div>
    `;

    generateBarcodeSvg(item.id || item.no || item.name, "modalBarcodeSvg");
    drawTicketSawtoothCanvas("modalSawtoothCanvas");
    toggleUI(detailModalOverlay, null, true);
  };

  window.saveModalTicketImage = function(mode = "download", triggerBtn = null) {
    const stubWrap = document.getElementById("modalTicketStubWrap");
    if (stubWrap && stubWrap.classList.contains("hidden")) {
      window.switchModalTab("ticket");
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const wrap = document.getElementById("modalTicketStubWrap");
        const btn = triggerBtn || document.getElementById("saveTicketImgBtn");
        if (wrap && btn) {
          AudioFX.printer();
          captureAndSaveTicket(wrap, btn, "#ECE3D8", mode);
        }
      });
    });
  };

  window.printModalTicket = function() {
    const stubWrap = document.getElementById("modalTicketStubWrap");
    if (stubWrap && stubWrap.classList.contains("hidden")) {
      window.switchModalTab("ticket");
    }
    setTimeout(() => {
      window.print();
    }, 80);
  };

  window.addEventListener("beforeprint", () => {
    const isDetailOpen = detailModalOverlay && detailModalOverlay.classList.contains("open");
    const isPrinterOpen = printerModalOverlay && printerModalOverlay.classList.contains("open");
    if (!isDetailOpen && !isPrinterOpen && coffeeData.length > 0) {
      const sample = (lastRenderedItems && lastRenderedItems[0]) ? lastRenderedItems[0] : coffeeData[0];
      window.openDetailModal(sample.id);
      window.switchModalTab("ticket");
    } else if (isDetailOpen) {
      window.switchModalTab("ticket");
    }
  });

  window.triggerReceiptPrinterFromModal = function(coffeeId) {
    switchModalTab("ticket");
  };

  window.toggleTastedStatus = function(coffeeId) {
    const seal = document.getElementById("modalStampSeal");
    const btn = document.getElementById("toggleTastedBtn");
    const stubWrap = document.getElementById("modalTicketStubWrap");

    if (tastedSet.has(coffeeId)) {
      tastedSet.delete(coffeeId);
      delete tastedRecords[coffeeId];
      AudioFX.drip();
      if (seal) seal.classList.remove("stamped");
      if (btn) btn.classList.remove("tasted-active");
    } else {
      tastedSet.add(coffeeId);
      const now = new Date();
      const disp = formatLocalStampDate(now);
      tastedRecords[coffeeId] = { tastedAt: now.toISOString(), displayDate: disp };
      const stampDateEl = document.getElementById("modalStampDateText");
      if (stampDateEl) stampDateEl.textContent = disp;
      if (stubWrap && stubWrap.classList.contains("hidden")) {
        window.switchModalTab("ticket");
      }
      AudioFX.stamp();
      if (navigator.vibrate) navigator.vibrate([30, 40, 30]);

      if (seal) {
        seal.classList.remove("stamped");
        void seal.offsetWidth;
        seal.classList.add("stamped");
      }
      if (btn) btn.classList.add("tasted-active");
    }
    saveTastedSet();
    updateTastedFilterBtn();
    const targetCard = document.querySelector(`.compact-coffee-card[data-coffee-id="${coffeeId}"]`);
    if (targetCard) {
      targetCard.classList.toggle("is-tasted", tastedSet.has(coffeeId));
    }
    if (filterState.mode === "TASTED") {
      renderResults();
    }
  };

  window.closeDetailModal = function() { currentOpenModalCoffeeId = null; stopAudio(); toggleUI(detailModalOverlay, null, false); };
  if (detailModalOverlay) {
    detailModalOverlay.addEventListener("click", (e) => {
      if (e.target === detailModalOverlay) closeDetailModal();
    });
  }

  // TTS 오디오 (다국어 ko-KR / en-US / ja-JP 자동 연동)
  window.toggleAudio = function(btn, text) {
    if (!('speechSynthesis' in window)) return alert("음성 읽기를 지원하지 않는 환경입니다.");
    if (activeAudioBtn === btn) return stopAudio();
    stopAudio();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = tUI("ttsLang") || 'ko-KR'; utterance.rate = 0.95;
    utterance.addEventListener("start", () => { activeAudioBtn = btn; btn.classList.add('playing'); btn.innerHTML = escapeHtml(tUI("btnAudioStop")); });
    utterance.addEventListener("end", () => stopAudio());
    utterance.addEventListener("error", () => stopAudio());
    window.speechSynthesis.speak(utterance);
  };

  function stopAudio() {
    if ('speechSynthesis' in window && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
      window.speechSynthesis.cancel();
    }
    if (activeAudioBtn) { activeAudioBtn.classList.remove('playing'); activeAudioBtn.innerHTML = tUI("btnAudioRead"); activeAudioBtn = null; }
  }

  const coreCategoriesSection = document.getElementById("coreCategoriesSection");

  // Task 4-2: 전체 60종 필터 초기화 함수 (#resetAllBtn & 로고 클릭)
  function resetToAllCoffees(scrollToTop = false) {
    stopAudio();
    closeDetailModal();
    closeTermGuide();
    toggleUI(originDrawer, originOverlay, false);
    toggleUI(printerModalOverlay, null, false);

    searchInput.value = "";
    if (clearSearchBtn) clearSearchBtn.style.display = "none";
    if (searchJumpBadge) searchJumpBadge.style.display = "none";
    if (coreCategoriesSection) coreCategoriesSection.classList.remove("open");

    filterState.mode = "ALL";
    filterState.query = "";
    filterState.appliedWheel = null;
    filterState.isWheelDirty = false;

    if (leverTrigger) leverTrigger.classList.remove("needs-pull");
    updateMatchBadges();
    renderResults();

    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Task 4-2: #homeResetBtn (↑ 위로) - 현재 필터 유지한 채 상단으로만 부드럽게 스크롤
  function scrollToTopKeepFilter() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetToHome() {
    resetToAllCoffees(true);
  }

  function toggleTastedFilterMode() {
    if (filterState.mode === "TASTED") {
      resetToAllCoffees(false);
      return;
    }
    stopAudio();
    if (searchInput) searchInput.value = "";
    if (clearSearchBtn) clearSearchBtn.style.display = "none";
    if (searchJumpBadge) searchJumpBadge.style.display = "none";
    if (coreCategoriesSection) coreCategoriesSection.classList.remove("open");
    closeSearchDropdown();

    filterState.mode = "TASTED";
    filterState.query = "";
    filterState.appliedWheel = null;
    filterState.isWheelDirty = false;
    updateMatchBadges();
    renderResults();
  }

  // Task 5: 원두 추천 카드 내부 3축 태그 순서(산미 -> 고소함 -> 바디감) 및 1~5단계 수치 통일 + .is-matched 강조
  function formatBodyNote(bodyDesc = "") {
    return bodyDesc.replace(/^[1-5]단계\s*/, "").replace(/^\(|\)$/g, "").trim();
  }

  const BODY_SHORT_MAP = { 1: "허브티", 2: "주스", 3: "보리차", 4: "우유·초코", 5: "생크림" };

  function renderSortedTasteChips(c) {
    const applied = (filterState.mode === "DISPENSER" && filterState.appliedWheel) ? filterState.appliedWheel : null;
    const sourMatched = applied && applied.sour > 0 && c.sourDots === applied.sour ? "is-matched" : "";
    const nuttyMatched = applied && applied.nutty > 0 && c.nuttyDots === applied.nutty ? "is-matched" : "";
    const bodyMatched = applied && applied.body > 0 && c.bodyDots === applied.body ? "is-matched" : "";
    const loc = getLocalizedBean(c, currentLang);
    const sourLbl = currentLang === "en" ? "Acidity" : (currentLang === "ja" ? "酸味" : "산미");
    const nuttyLbl = currentLang === "en" ? "Nutty" : (currentLang === "ja" ? "香ばしさ" : "고소함");
    const bodyLbl = currentLang === "en" ? "Body" : (currentLang === "ja" ? "ボディ" : "바디");

    return [
      `<span class="compact-taste-chip ${sourMatched}">🍋 ${escapeHtml(sourLbl)} ${c.sourDots}</span>`,
      `<span class="compact-taste-chip ${nuttyMatched}">🥜 ${escapeHtml(nuttyLbl)} ${c.nuttyDots}</span>`,
      `<span class="compact-taste-chip ${bodyMatched}">⚖️ ${escapeHtml(bodyLbl)} ${c.bodyDots} · ${escapeHtml(loc.bodyShort)}</span>`
    ].join("");
  }

  // 📌 3D Card Tilt & 렌더링
  let lastRenderedItems = [];
  let lastRenderedHeader = null;

  function renderCompactCards(items, customCountHtml = null) {
    lastRenderedItems = items;
    lastRenderedHeader = customCountHtml;
    coffeeList.innerHTML = "";
    resultsContainer.classList.add("visible");

    if (resetAllBtn) {
      const allBtnFn = tUI("allBeansBtn");
      resetAllBtn.textContent = typeof allBtnFn === "function" ? allBtnFn(coffeeData.length) : `전체 ${coffeeData.length}종`;
      resetAllBtn.disabled = false;
      resetAllBtn.classList.toggle("is-all-active", filterState.mode === "ALL");
    }
    updateTastedFilterBtn();

    if (customCountHtml) {
      resultCount.innerHTML = customCountHtml;
    } else if (filterState.mode === "ALL") {
      const fn = tUI("allArchiveTitle");
      resultCount.innerHTML = typeof fn === "function" ? fn(items.length) : `전체 스페셜티 아카이브 <strong>${items.length}</strong>종`;
    } else {
      const fn = tUI("searchedCountTitle");
      resultCount.innerHTML = typeof fn === "function" ? fn(items.length) : `검색된 카드 <strong>${items.length}</strong>장`;
    }

    if (items.length === 0) {
      if (filterState.mode === "TASTED") {
        coffeeList.innerHTML = `
          <div class="no-result">
            <h3 style="font-family:'Nanum Myeongjo',serif; font-size:1.06rem; margin-bottom:6px;">${escapeHtml(tUI("emptyTastedTitle"))}</h3>
            <p style="font-size:0.84rem; line-height:1.55;">${tUI("emptyTastedDesc")}</p>
          </div>
        `;
      } else {
        coffeeList.innerHTML = `
          <div class="no-result">
            <h3 style="font-family:'Nanum Myeongjo',serif; font-size:1.1rem; margin-bottom:4px;">${escapeHtml(tUI("emptySearchTitle"))}</h3>
            <p style="font-size:0.82rem;">${escapeHtml(tUI("emptySearchDesc"))}</p>
          </div>
        `;
      }
      return;
    }

    const activeSearchQuery = filterState.mode === "SEARCH" ? filterState.query : "";

    items.forEach(c => {
      const loc = getLocalizedBean(c, currentLang);
      const isTasted = tastedSet.has(c.id);
      const wrapper = document.createElement("div");
      wrapper.className = "card-3d-wrapper";

      const card = document.createElement("div");
      card.className = `compact-coffee-card ${isTasted ? 'is-tasted' : ''}`;
      card.dataset.coffeeId = c.id;
      card.setAttribute("data-action", "open-detail-modal");
      const titleHtml = activeSearchQuery
        ? highlightSearchText(loc.name, activeSearchQuery)
        : escapeHtml(loc.name);
      const headlineHtml = activeSearchQuery
        ? highlightSearchText(loc.headline, activeSearchQuery)
        : escapeHtml(loc.headline);
      const originHtml = activeSearchQuery
        ? highlightSearchText(loc.originBadge, activeSearchQuery)
        : escapeHtml(loc.originBadge);

      card.innerHTML = `
        <div class="mini-tasted-badge">TASTED</div>
        <div class="compact-top">
          <div class="compact-meta"><span class="compact-no">${escapeHtml(c.no)}</span><span>🔥 ${escapeHtml(loc.roastShort)}</span></div>
          <span class="compact-origin-stamp">${originHtml}</span>
        </div>
        <div class="compact-title-row">
          <div class="compact-title">${titleHtml}</div>
        </div>
        <div class="compact-headline">"${headlineHtml}"</div>
        <div class="compact-card-footer">
          <div class="compact-taste-chips">
            ${renderSortedTasteChips(c)}
          </div>
          <button type="button" class="card-compare-btn ${isBeanInCompare(c.id) ? 'is-selected' : ''}" data-action="toggle-compare" data-coffee-id="${escapeHtml(c.id)}" aria-pressed="${isBeanInCompare(c.id)}">
            ${escapeHtml(isBeanInCompare(c.id) ? tUI("compareAddedBtn") : tUI("compareAddBtn"))}
          </button>
        </div>
      `;

      wrapper.appendChild(card);
      coffeeList.appendChild(wrapper);
    });
    scheduleCardScrollFocus();
  }

  let isFocusTicking = false;
  function updateCardScrollFocus() {
    if (!coffeeList) return;
    const wrappers = Array.from(coffeeList.querySelectorAll(".card-3d-wrapper"));
    if (wrappers.length === 0) return;

    if (wrappers.length <= 1) {
      wrappers.forEach(w => {
        w.style.opacity = "1";
        w.style.transform = "scale(1.01)";
        w.style.zIndex = "2";
        const cardEl = w.querySelector(".compact-coffee-card");
        if (cardEl) cardEl.style.boxShadow = "3.5px 3.5px 0px var(--line)";
      });
      return;
    }

    const vh = window.innerHeight || 800;
    const rects = wrappers.map(w => w.getBoundingClientRect());
    const avgHeight = rects.reduce((acc, r) => acc + r.height, 0) / rects.length || 155;

    const baseCenterY = vh * 0.5;
    let focusCenterY = baseCenterY;

    // 최상단·최하단 1장 중심 연속 보간(Smoothstep Lerp)으로 스크롤 경계 점프 제거
    const topTargetY = rects[0].top + rects[0].height * 0.5;
    const topLinear = Math.max(0, Math.min(1, (rects[0].top - vh * 0.05) / (vh * 0.35)));
    const topWeight = topLinear * topLinear * (3 - 2 * topLinear);
    focusCenterY = baseCenterY + (topTargetY - baseCenterY) * topWeight;

    const remainingBottom = Math.max(0, document.documentElement.scrollHeight - (window.scrollY + vh));
    if (remainingBottom < 260) {
      const lastRect = rects[rects.length - 1];
      const bottomTargetY = lastRect.top + lastRect.height * 0.5;
      const bottomLinear = Math.max(0, Math.min(1, 1 - remainingBottom / 260));
      const bottomWeight = bottomLinear * bottomLinear * (3 - 2 * bottomLinear);
      focusCenterY = focusCenterY + (bottomTargetY - focusCenterY) * bottomWeight;
    }

    const deadzone = Math.max(75, Math.min(105, avgHeight * 0.55));
    const maxFadeDist = Math.max(260, vh * 0.52);

    wrappers.forEach((w, idx) => {
      const rect = rects[idx];
      if (rect.bottom < -150 || rect.top > vh + 150) return;
      const cardEl = w.querySelector(".compact-coffee-card");
      const cardCenterY = rect.top + rect.height * 0.5;
      const dist = Math.abs(cardCenterY - focusCenterY);
      if (dist <= deadzone) {
        w.style.opacity = "1";
        w.style.transform = "scale(1.008)";
        w.style.zIndex = "2";
        if (cardEl) cardEl.style.boxShadow = "3.5px 3.5px 0px var(--line)";
      } else {
        const overflowDist = dist - deadzone;
        const t = Math.min(1, overflowDist / maxFadeDist);
        const eased = t * t * (3 - 2 * t);
        const scaleVal = (1.008 - eased * 0.032).toFixed(4);
        const opacityVal = (1 - eased * 0.16).toFixed(3);
        const shadowPx = (3.5 - eased * 2.0).toFixed(2);
        const shadowAlpha = (0.92 - eased * 0.42).toFixed(2);
        w.style.opacity = opacityVal;
        w.style.transform = `scale(${scaleVal})`;
        w.style.zIndex = eased < 0.25 ? "1" : "0";
        if (cardEl) cardEl.style.boxShadow = `${shadowPx}px ${shadowPx}px 0px rgba(30, 25, 21, ${shadowAlpha})`;
      }
    });
  }

  function scheduleCardScrollFocus() {
    if (isFocusTicking) return;
    isFocusTicking = true;
    requestAnimationFrame(() => {
      isFocusTicking = false;
      updateCardScrollFocus();
    });
  }

  window.addEventListener("scroll", scheduleCardScrollFocus, { passive: true });
  window.addEventListener("resize", scheduleCardScrollFocus, { passive: true });

  const renderCoffeeCards = renderCompactCards;

  function renderResults() {
    if (filterState.mode === "ALL") {
      const fn = tUI("allArchiveTitle");
      renderCompactCards(coffeeData, typeof fn === "function" ? fn(coffeeData.length) : `전체 스페셜티 아카이브 <strong>${coffeeData.length}</strong>종`);
    } else if (filterState.mode === "DISPENSER" && filterState.appliedWheel) {
      const { list, exactCount, closeCount, isExact } = getMatchingCoffees(filterState.appliedWheel);
      let customHeader = "";
      if (exactCount > 0 && closeCount > 0) {
        const mixedFn = tUI("dispenserMixedTitle");
        customHeader = typeof mixedFn === "function" ? mixedFn(list.length, exactCount, closeCount) : `🎰 맞춤 큐레이션 <strong>${list.length}</strong>종`;
      } else if (isExact) {
        const exactFn = tUI("dispenserExactTitle");
        customHeader = typeof exactFn === "function" ? exactFn(list.length) : `🎰 조합 일치 카드 <strong>${list.length}</strong>종`;
      } else {
        const closeFn = tUI("dispenserCloseTitle");
        customHeader = typeof closeFn === "function" ? closeFn(list.length) : `✨ 근접 추천 카드 <strong>${list.length}</strong>종`;
      }
      renderCompactCards(list, customHeader);
    } else if (filterState.mode === "SEARCH") {
      filterCoffeesBySearch(filterState.query);
    } else if (filterState.mode === "TASTED") {
      const list = coffeeData.filter(c => tastedSet.has(c.id));
      const fn = tUI("tastedCountTitle");
      renderCompactCards(list, typeof fn === "function" ? fn(list.length) : `☕ 내가 마셔본 스페셜티 아카이브 <strong>${list.length}</strong>종`);
    }
  }

  // Casper™ V1 검색 엔진 위임 (DOM 비의존 순수 함수 호출)
  function getSearchFilteredCoffees(rawQuery) {
    if (typeof CasperEngine !== "undefined" && typeof CasperEngine.getSearchFilteredCoffees === "function") {
      return CasperEngine.getSearchFilteredCoffees(rawQuery, coffeeData, originData);
    }
    return coffeeData;
  }

  // 📌 Phase 2-1C: 검색 기록(localStorage 최대 10개) 및 실시간 자동완성 드롭다운 관리
  const SEARCH_HISTORY_KEY = "cta_search_history";
  const MAX_SEARCH_HISTORY = 10;
  const searchDropdownPanel = document.getElementById("searchDropdownPanel");
  let activeDropdownIndex = -1;

  function loadSearchHistory() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(item => typeof item === "string" && item.trim().length > 0).slice(0, MAX_SEARCH_HISTORY);
    } catch (e) {
      return [];
    }
  }

  let searchHistoryList = loadSearchHistory();

  function saveSearchHistory() {
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistoryList.slice(0, MAX_SEARCH_HISTORY)));
    } catch (e) {}
  }

  function addSearchHistory(rawQuery) {
    const trimmed = (rawQuery || "").trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    searchHistoryList = [trimmed, ...searchHistoryList.filter(q => q.toLowerCase() !== lower)].slice(0, MAX_SEARCH_HISTORY);
    saveSearchHistory();
  }

  function deleteSearchHistoryItem(targetQuery) {
    const lower = (targetQuery || "").trim().toLowerCase();
    searchHistoryList = searchHistoryList.filter(q => q.toLowerCase() !== lower);
    saveSearchHistory();
    renderSearchDropdown();
  }

  function clearSearchHistory() {
    searchHistoryList = [];
    saveSearchHistory();
    renderSearchDropdown();
  }

  function closeSearchDropdown() {
    activeDropdownIndex = -1;
    if (searchDropdownPanel) {
      searchDropdownPanel.classList.remove("open", "is-autocomplete", "is-history");
      searchDropdownPanel.innerHTML = "";
    }
    if (searchInput) {
      searchInput.setAttribute("aria-expanded", "false");
      searchInput.removeAttribute("aria-activedescendant");
    }
  }

  function getDropdownOptionEls() {
    if (!searchDropdownPanel) return [];
    return Array.from(searchDropdownPanel.querySelectorAll("[data-dropdown-option]"));
  }

  function updateDropdownActiveHighlight(newIndex) {
    const opts = getDropdownOptionEls();
    if (opts.length === 0) {
      activeDropdownIndex = -1;
      if (searchInput) searchInput.removeAttribute("aria-activedescendant");
      return;
    }
    const clamped = ((newIndex % opts.length) + opts.length) % opts.length;
    activeDropdownIndex = clamped;
    opts.forEach((el, idx) => {
      const isAct = idx === clamped;
      el.classList.toggle("is-active", isAct);
      el.setAttribute("aria-selected", isAct ? "true" : "false");
      if (isAct && searchInput && el.id) {
        searchInput.setAttribute("aria-activedescendant", el.id);
        if (typeof el.scrollIntoView === "function") {
          el.scrollIntoView({ block: "nearest" });
        }
      }
    });
  }

  function getSugTypeBadgeLabel(type) {
    if (type === "origin") return tUI("sugTypeOrigin");
    if (type === "producer") return tUI("sugTypeProducer");
    if (type === "flavor") return tUI("sugTypeFlavor");
    return tUI("sugTypeBean");
  }

  function renderSearchDropdown() {
    if (!searchDropdownPanel || !searchInput) return;
    const rawVal = searchInput.value || "";
    const trimmed = rawVal.trim();
    activeDropdownIndex = -1;
    searchInput.removeAttribute("aria-activedescendant");

    if (!trimmed) {
      if (searchHistoryList.length === 0) {
        closeSearchDropdown();
        return;
      }
      const chipsHtml = searchHistoryList.map((q, idx) => `
        <div class="search-history-chip" id="searchOpt-${idx}" role="option" aria-selected="false" data-dropdown-option="history" data-query="${escapeHtml(q)}">
          <button type="button" class="search-history-select-btn" data-action="select-history" data-query="${escapeHtml(q)}">🕒 ${escapeHtml(q)}</button>
          <button type="button" class="search-history-del-btn" data-action="delete-history-item" data-query="${escapeHtml(q)}" aria-label="${escapeHtml(tUI("deleteHistoryAria"))}">✕</button>
        </div>
      `).join("");

      searchDropdownPanel.innerHTML = `
        <div class="search-dropdown-header">
          <span>${escapeHtml(tUI("recentSearchTitle"))}</span>
          <button type="button" class="search-history-clear-btn" data-action="clear-history">${escapeHtml(tUI("clearHistoryBtn"))}</button>
        </div>
        <div class="search-history-chips">${chipsHtml}</div>
      `;
      searchDropdownPanel.classList.remove("is-autocomplete");
      searchDropdownPanel.classList.add("open", "is-history");
      searchInput.setAttribute("aria-expanded", "true");
      return;
    }

    const suggestions = (typeof CasperEngine !== "undefined" && typeof CasperEngine.getAutocompleteSuggestions === "function")
      ? CasperEngine.getAutocompleteSuggestions(trimmed, coffeeData, originData, currentLang, 8)
      : [];

    if (suggestions.length === 0) {
      closeSearchDropdown();
      return;
    }

    const itemsHtml = suggestions.map((sug, idx) => {
      const badgeClass = `type-${escapeHtml(sug.type)}`;
      const badgeText = getSugTypeBadgeLabel(sug.type);
      const labelHtml = highlightSearchText(sug.label, trimmed);
      const subHtml = sug.subLabel ? `<span class="sug-sub">${escapeHtml(sug.subLabel)}</span>` : "";
      return `
        <div class="search-dropdown-item" id="searchOpt-${idx}" role="option" aria-selected="false" data-dropdown-option="autocomplete" data-action="select-autocomplete" data-query="${escapeHtml(sug.query)}" data-coffee-id="${escapeHtml(sug.coffeeId || "")}">
          <span class="sug-type-badge ${badgeClass}">${escapeHtml(badgeText)}</span>
          <span class="sug-text-wrap">
            <span class="sug-label">${labelHtml}</span>
            ${subHtml}
          </span>
        </div>
      `;
    }).join("");

    searchDropdownPanel.innerHTML = `
      <div class="search-dropdown-header">
        <span>${escapeHtml(tUI("autocompleteHeader"))}</span>
      </div>
      <div class="search-dropdown-list">${itemsHtml}</div>
    `;
    searchDropdownPanel.classList.remove("is-history");
    searchDropdownPanel.classList.add("open", "is-autocomplete");
    searchInput.setAttribute("aria-expanded", "true");
  }

  // Task 2-2 & 2-3: 검색 필터링 함수 (filterCoffeesBySearch & doSearch 호환)
  function filterCoffeesBySearch(query) {
    const trimmed = (query || "").trim();
    if (!trimmed) {
      resetToAllCoffees(false);
      return;
    }

    stopAudio();
    filterState.mode = "SEARCH";
    filterState.query = trimmed;
    filterState.isWheelDirty = false;
    if (leverTrigger) leverTrigger.classList.remove("needs-pull");
    updateMatchBadges();

    appContainer.classList.add("searched");
    resultsContainer.classList.add("visible");

    const filtered = getSearchFilteredCoffees(trimmed);

    if (searchJumpBadge) {
      const jumpFn = tUI("searchJumpBadgeText");
      searchJumpBadge.textContent = typeof jumpFn === "function" ? jumpFn(filtered.length) : `🔍 ${filtered.length}건 보기 ↓`;
      searchJumpBadge.style.display = "inline-flex";
    }
    if (clearSearchBtn) {
      clearSearchBtn.style.display = "flex";
    }

    const countFn = tUI("searchedCountTitle");
    const countHtml = typeof countFn === "function" ? countFn(filtered.length) : `검색된 카드 <strong>${filtered.length}</strong>장`;
    renderCompactCards(filtered, countHtml);
  }
  const doSearch = filterCoffeesBySearch;

  // Task 2-2: #searchJumpBadge 클릭 또는 검색창 Enter 입력 시 포커스 해제 및 #resultsHeader로 스무스 스크롤
  function jumpToSearchResults() {
    searchInput.blur();
    closeSearchDropdown();
    if (coreCategoriesSection) coreCategoriesSection.classList.remove("open");
    if (resultsHeader) {
      resultsHeader.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function executeSearchSelection(queryStr) {
    const q = (queryStr || "").trim();
    if (!q) return;
    if (searchInput) searchInput.value = q;
    addSearchHistory(q);
    closeSearchDropdown();
    if (coreCategoriesSection) coreCategoriesSection.classList.remove("open");
    filterCoffeesBySearch(q);
  }

  searchInput.addEventListener("keydown", (e) => {
    const isDropdownOpen = searchDropdownPanel && searchDropdownPanel.classList.contains("open");
    const opts = isDropdownOpen ? getDropdownOptionEls() : [];

    if (e.key === "ArrowDown" && opts.length > 0) {
      e.preventDefault();
      updateDropdownActiveHighlight(activeDropdownIndex + 1);
      return;
    }
    if (e.key === "ArrowUp" && opts.length > 0) {
      e.preventDefault();
      updateDropdownActiveHighlight(activeDropdownIndex <= 0 ? opts.length - 1 : activeDropdownIndex - 1);
      return;
    }
    if (e.key === "Escape") {
      closeSearchDropdown();
      if (coreCategoriesSection) coreCategoriesSection.classList.remove("open");
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (isDropdownOpen && activeDropdownIndex >= 0 && opts[activeDropdownIndex]) {
        const picked = opts[activeDropdownIndex].dataset.query;
        if (picked) {
          executeSearchSelection(picked);
          jumpToSearchResults();
          return;
        }
      }
      if (searchInput.value.trim()) {
        addSearchHistory(searchInput.value.trim());
      }
      jumpToSearchResults();
    }
  });

  // 📌 버튼 포인터다운/업 및 카드 클릭 시 기계식 타건 사운드 (모바일 터치 스크롤 오작동 방지 + 단일 재생 보장)
  const SOUND_BTN_SELECTOR =
    ".core-category-btn, .nav-fixed-btn, .action-btn, .ticket-export-btn, .modal-tab-btn, .modal-close-btn, .drawer-close-btn, .clear-btn, .wheel-random-btn, .reset-all-btn, .tasted-filter-btn, .home-reset-btn, .search-jump-badge, .term-help-btn, .term-label-link, .dispenser-version-trigger, .term-guide-close, .trace-search-btn, .detail-mode-toggle-btn, .modal-brew-methods-btn";
  const CARD_SOUND_SELECTOR = ".compact-coffee-card, .origin-info-card";
  const BRIGHT_BTN_SELECTOR = ".modal-tab-btn, .action-btn, .ticket-export-btn, .compact-coffee-card, .origin-info-card";
  let activeSoundBtnPressed = null;
  let lastPointerType = "mouse";
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let isTouchMoved = false;
  let lastWindowScrollMs = 0;

  window.addEventListener("scroll", () => {
    lastWindowScrollMs = performance.now();
    isTouchMoved = true;
    activeSoundBtnPressed = null;
  }, { passive: true });

  window.addEventListener("touchstart", (e) => {
    lastPointerType = "touch";
    if (e.touches && e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = performance.now();
      isTouchMoved = false;
    } else {
      isTouchMoved = true;
    }
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!e.touches || e.touches.length === 0) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartX);
    const dy = Math.abs(e.touches[0].clientY - touchStartY);
    if (dx > 6 || dy > 6) {
      isTouchMoved = true;
      activeSoundBtnPressed = null;
    }
  }, { passive: true });

  function isValidMobileTap() {
    if (lastPointerType !== "touch") return true;
    const now = performance.now();
    const holdDuration = now - touchStartTime;
    const recentlyScrolled = (now - lastWindowScrollMs) < 180;
    return !isTouchMoved && !recentlyScrolled && holdDuration > 0 && holdDuration < 220;
  }

  function isExcludedSoundBtn(el) {
    return !el || el.id === "soundToggleBtn" || el.id === "toggleTastedBtn" || el.id === "saveTicketImgBtn" || el.id === "ticketDirectSaveBtn" || el.id === "ticketShareBtn";
  }

  // '?' 마이크로 용어 가이드 버튼 클릭/키보드 캡처 핸들러 (카드 모달 / 로고 리셋 이벤트 전파 완벽 차단)
  document.addEventListener("click", (e) => {
    const helpBtn = e.target.closest("[data-term]");
    if (!helpBtn) return;
    e.preventDefault();
    e.stopPropagation();
    if (lastPointerType === "touch") {
      if (!isValidMobileTap()) return;
      AudioFX.drip();
    } else if (e.detail === 0) {
      AudioFX.drip();
    }
    openTermGuide(helpBtn.dataset.term, helpBtn.dataset.coffeeId || null, helpBtn);
  }, true);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const helpBtn = e.target.closest("[data-term]");
      if (helpBtn && helpBtn.tagName !== "BUTTON") {
        e.preventDefault();
        e.stopPropagation();
        AudioFX.drip();
        openTermGuide(helpBtn.dataset.term, helpBtn.dataset.coffeeId || null, helpBtn);
      }
    }
  }, true);

  document.addEventListener("pointerdown", (e) => {
    lastPointerType = e.pointerType || "mouse";
    if (lastPointerType === "touch") {
      AudioFX.init();
      activeSoundBtnPressed = null;
      return;
    }
    if (e.button !== undefined && e.button !== 0) return;
    const soundBtn = e.target.closest(SOUND_BTN_SELECTOR);
    if (soundBtn && !isExcludedSoundBtn(soundBtn)) {
      activeSoundBtnPressed = soundBtn;
      const variant = soundBtn.matches(BRIGHT_BTN_SELECTOR) ? "bright" : "default";
      AudioFX.drip(variant);
    } else {
      activeSoundBtnPressed = null;
    }
  }, { passive: true });

  document.addEventListener("pointerup", () => {
    if (activeSoundBtnPressed) {
      const variant = activeSoundBtnPressed.matches(BRIGHT_BTN_SELECTOR) ? "bright" : "default";
      activeSoundBtnPressed = null;
      AudioFX.keyRelease(variant);
    }
  }, { passive: true });

  document.addEventListener("pointercancel", () => {
    activeSoundBtnPressed = null;
  }, { passive: true });

  document.addEventListener("keyup", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const soundBtn = e.target.closest(SOUND_BTN_SELECTOR);
      if (soundBtn && !isExcludedSoundBtn(soundBtn)) {
        const variant = soundBtn.matches(BRIGHT_BTN_SELECTOR) ? "bright" : "default";
        AudioFX.keyRelease(variant);
      }
    }
  }, { passive: true });

  // 📌 data-action 기반 중앙 이벤트 위임 & 드립 파문(Ripple)
  function handleDelegatedActionClick(actionEl, e) {
    const action = actionEl.getAttribute("data-action");
    switch (action) {
      case "close-disclaimer":
        runDisclaimerUnboxing();
        break;
      case "toggle-sound":
        AudioFX.toggleMute();
        updateSoundBtnUI();
        if (!AudioFX.isMuted) AudioFX.drip();
        break;
      case "open-drawer":
        toggleUI(originDrawer, originOverlay, true);
        break;
      case "close-drawer":
        toggleUI(originDrawer, originOverlay, false);
        break;
      case "toggle-lang": {
        const idx = SUPPORTED_LANGS.indexOf(currentLang);
        currentLang = SUPPORTED_LANGS[(idx + 1) % SUPPORTED_LANGS.length];
        localStorage.setItem("cta_lang", currentLang);
        applyLanguageUI();
        break;
      }
      case "trigger-repeater":
        handleClockRepeaterClick();
        break;
      case "reset-home":
        resetToAllCoffees(true);
        break;
      case "jump-to-results":
        if (searchInput && searchInput.value.trim()) addSearchHistory(searchInput.value.trim());
        jumpToSearchResults();
        break;
      case "clear-search":
        resetToAllCoffees(false);
        if (searchInput) {
          searchInput.focus();
          renderSearchDropdown();
        }
        break;
      case "select-core-category": {
        const type = actionEl.dataset.type;
        const queryMap = {
          "no-sour": tUI("catNoSourTitle"),
          "bright-sour": tUI("catBrightSourTitle"),
          "fermented-flv": tUI("catFermentedTitle"),
          "balanced": tUI("catBalancedTitle")
        };
        const q = queryMap[type] || tUI("catBalancedTitle");
        executeSearchSelection(q);
        break;
      }
      case "select-origin-card": {
        const originLabel = actionEl.getAttribute("data-origin-label") || actionEl.getAttribute("data-origin-query") || "";
        toggleUI(originDrawer, originOverlay, false);
        if (searchInput) searchInput.value = originLabel;
        if (clearSearchBtn) clearSearchBtn.style.display = "flex";
        executeSearchSelection(originLabel);
        break;
      }
      case "select-autocomplete": {
        const q = actionEl.getAttribute("data-query") || "";
        executeSearchSelection(q);
        break;
      }
      case "select-history": {
        const q = actionEl.getAttribute("data-query") || "";
        executeSearchSelection(q);
        break;
      }
      case "delete-history-item": {
        e.stopPropagation();
        const q = actionEl.getAttribute("data-query") || "";
        deleteSearchHistoryItem(q);
        break;
      }
      case "clear-history":
        e.stopPropagation();
        clearSearchHistory();
        break;
      case "random-wheel":
        triggerRandomWheelDial();
        break;
      case "pull-lever":
        pullDispenserLever();
        break;
      case "toggle-tasted-filter":
        toggleTastedFilterMode();
        break;
      case "reset-all":
        resetToAllCoffees(false);
        break;
      case "scroll-top":
        scrollToTopKeepFilter();
        break;
      case "open-detail-modal": {
        if (e.target.closest("[data-term]")) return;
        const coffeeId = actionEl.getAttribute("data-coffee-id");
        if (coffeeId) window.openDetailModal(coffeeId);
        break;
      }
      case "close-detail-modal":
        window.closeDetailModal();
        break;
      case "switch-modal-tab":
        window.switchModalTab(actionEl.getAttribute("data-tab") || "profile");
        break;
      case "toggle-detail-mode":
        window.toggleDetailProfileMode();
        break;
      case "save-modal-ticket":
        window.saveModalTicketImage(actionEl.getAttribute("data-mode") || "download", actionEl);
        break;
      case "print-modal-ticket":
        window.printModalTicket();
        break;
      case "toggle-tasted": {
        const coffeeId = actionEl.getAttribute("data-coffee-id");
        if (coffeeId) window.toggleTastedStatus(coffeeId);
        break;
      }
      case "toggle-modal-audio": {
        const coffeeId = actionEl.getAttribute("data-coffee-id");
        const item = coffeeData.find(c => c.id === coffeeId);
        if (!item) break;
        const loc = getLocalizedBean(item, currentLang);
        const ttsSpeechText = currentLang === "en"
          ? `${loc.name}. ${loc.headline}. Body is ${loc.bodyDesc}. ${loc.guide}`
          : currentLang === "ja"
          ? `${loc.name}。${loc.headline}。ボディは${loc.bodyDesc}。${loc.guide}`
          : `${loc.name}. ${loc.headline}. 바디감은 ${loc.bodyDesc}. ${loc.guide}`;
        window.toggleAudio(actionEl, ttsSpeechText);
        break;
      }
      case "print-receipt":
        window.print();
        break;
      case "save-receipt-img":
        captureAndSaveTicket(document.getElementById("receiptPaper"), actionEl, "#FFFDF9", "download");
        break;
      case "share-receipt-img":
        captureAndSaveTicket(document.getElementById("receiptPaper"), actionEl, "#FFFDF9", "share");
        break;
      case "open-modal-from-receipt":
        toggleUI(printerModalOverlay, null, false);
        if (currentPrintedCoffee) window.openDetailModal(currentPrintedCoffee.id);
        break;
      case "close-printer":
        toggleUI(printerModalOverlay, null, false);
        break;
      case "close-ticket-preview":
        closeTicketImagePreview();
        break;
      case "share-ticket-preview":
        shareTicketPreviewBlob();
        break;
      case "open-external-browser":
        openTicketExternalBrowser();
        break;
      case "close-term-guide":
        closeTermGuide();
        break;
      case "select-onboarding-mode": {
        const mode = actionEl.getAttribute("data-mode") === "detailed" ? "detailed" : "simple";
        selectOnboardingMode(mode);
        break;
      }
      case "start-tutorial":
        startInteractiveTutorial(0);
        break;
      case "tutorial-prev":
        if (tutorialStepIndex > 0) renderTutorialStep(tutorialStepIndex - 1);
        break;
      case "tutorial-next":
        if (tutorialStepIndex < 2) {
          renderTutorialStep(tutorialStepIndex + 1);
        } else {
          closeInteractiveTutorial(true);
        }
        break;
      case "tutorial-skip":
        closeInteractiveTutorial(true);
        break;
      case "toggle-compare": {
        e.stopPropagation();
        const coffeeId = actionEl.getAttribute("data-coffee-id");
        if (coffeeId) toggleCompareBean(coffeeId);
        break;
      }
      case "clear-compare":
        clearCompareBeans();
        break;
      case "open-compare-modal":
        openCompareModal();
        break;
      case "close-compare-modal":
        closeCompareModal();
        break;
      case "toggle-compare-mode":
        toggleCompareRadarMode();
        break;
      case "detect-weather-gps":
        handleTodaysPickGpsClick();
        break;
      default:
        break;
    }
  }

  // =========================================================================
  // Phase 2-2A: Ui7 온보딩 · Ui6 3단계 튜토리얼 · 커피 2종 비교 컨트롤러
  // =========================================================================
  const onboardingModeOverlay = document.getElementById("onboardingModeOverlay");
  const onboardingModeCard = document.getElementById("onboardingModeCard");
  const tutorialOverlay = document.getElementById("tutorialOverlay");
  const tutorialHighlightRing = document.getElementById("tutorialHighlightRing");
  const tutorialTooltip = document.getElementById("tutorialTooltip");
  const compareFloatingTray = document.getElementById("compareFloatingTray");
  const compareModalOverlay = document.getElementById("compareModalOverlay");
  const compareModalContent = document.getElementById("compareModalContent");
  const compareToastEl = document.getElementById("compareToast");
  const tutorialReplayBtn = document.getElementById("tutorialReplayBtn");

  let tutorialStepIndex = 0;
  let compareIds = [];
  let compareRadarMode = detailProfileMode;
  let compareToastTimer = null;

  function isBeanInCompare(coffeeId) {
    return compareIds.includes(coffeeId);
  }

  function showCompareToast(msg) {
    if (!compareToastEl) return;
    compareToastEl.textContent = msg;
    compareToastEl.classList.add("show");
    if (compareToastTimer) clearTimeout(compareToastTimer);
    compareToastTimer = setTimeout(() => {
      compareToastEl.classList.remove("show");
    }, 2400);
  }

  function openOnboardingModeModal() {
    if (!onboardingModeOverlay || !onboardingModeCard) return;
    onboardingModeCard.innerHTML = `
      <span class="onboarding-badge">${escapeHtml(tUI("onboardingBadge"))}</span>
      <h2 class="onboarding-title" id="onboardingTitle">${escapeHtml(tUI("onboardingTitle"))}</h2>
      <p class="onboarding-desc">${escapeHtml(tUI("onboardingDesc"))}</p>
      <div class="onboarding-mode-grid">
        <button type="button" class="onboarding-mode-card" data-action="select-onboarding-mode" data-mode="simple">
          <span class="onboarding-mode-title">${escapeHtml(tUI("onboardingSimpleTitle"))}</span>
          <span class="onboarding-mode-sub">${escapeHtml(tUI("onboardingSimpleSub"))}</span>
          <span class="onboarding-mode-desc">${escapeHtml(tUI("onboardingSimpleDesc"))}</span>
        </button>
        <button type="button" class="onboarding-mode-card is-detailed-opt" data-action="select-onboarding-mode" data-mode="detailed">
          <span class="onboarding-mode-title">${escapeHtml(tUI("onboardingDetailedTitle"))}</span>
          <span class="onboarding-mode-sub">${escapeHtml(tUI("onboardingDetailedSub"))}</span>
          <span class="onboarding-mode-desc">${escapeHtml(tUI("onboardingDetailedDesc"))}</span>
        </button>
      </div>
    `;
    toggleUI(onboardingModeOverlay, null, true);
  }

  function selectOnboardingMode(mode) {
    detailProfileMode = mode === "detailed" ? "detailed" : "simple";
    compareRadarMode = detailProfileMode;
    try { localStorage.setItem(DETAIL_MODE_STORAGE_KEY, detailProfileMode); } catch (e) {}
    toggleUI(onboardingModeOverlay, null, false);
    if (currentOpenModalCoffeeId && detailModalOverlay && detailModalOverlay.classList.contains("open")) {
      window.openDetailModal(currentOpenModalCoffeeId);
    }
    if (!isTutorialDone()) {
      startInteractiveTutorial(0);
    }
  }

  function getTutorialSteps() {
    return [
      {
        selector: ".thumbwheel-group",
        fallback: ".dispenser-deck",
        titleKey: "tutorialStep1Title",
        descKey: "tutorialStep1Desc"
      },
      {
        selector: ".lever-station",
        fallback: "#leverTrigger",
        titleKey: "tutorialStep2Title",
        descKey: "tutorialStep2Desc"
      },
      {
        selector: "#coffeeList .compact-coffee-card",
        fallback: "#resultsContainer",
        titleKey: "tutorialStep3Title",
        descKey: "tutorialStep3Desc"
      }
    ];
  }

  function positionTutorialElements(stepIdx) {
    if (!tutorialOverlay || !tutorialOverlay.classList.contains("open") || !tutorialHighlightRing || !tutorialTooltip) return;
    const steps = getTutorialSteps();
    const step = steps[stepIdx] || steps[0];
    const targetEl = document.querySelector(step.selector) || document.querySelector(step.fallback);
    if (!targetEl) return;

    const rect = targetEl.getBoundingClientRect();
    const vw = window.innerWidth || 390;
    const vh = window.innerHeight || 844;
    const pad = 6;

    const ringLeft = Math.max(6, rect.left - pad);
    const ringTop = Math.max(6, rect.top - pad);
    const ringWidth = Math.min(vw - ringLeft - 6, rect.width + pad * 2);
    const ringHeight = Math.min(vh - ringTop - 6, rect.height + pad * 2);

    tutorialHighlightRing.style.left = `${ringLeft}px`;
    tutorialHighlightRing.style.top = `${ringTop}px`;
    tutorialHighlightRing.style.width = `${Math.max(40, ringWidth)}px`;
    tutorialHighlightRing.style.height = `${Math.max(40, ringHeight)}px`;

    const tipRect = tutorialTooltip.getBoundingClientRect();
    const tipW = tipRect.width || Math.min(330, vw - 24);
    const tipH = tipRect.height || 175;
    const gap = 12;

    let tipTop = rect.bottom + gap;
    if (tipTop + tipH > vh - 12) {
      const aboveTop = rect.top - tipH - gap;
      tipTop = aboveTop >= 12 ? aboveTop : Math.max(12, vh - tipH - 12);
    }
    let tipLeft = rect.left + (rect.width - tipW) / 2;
    tipLeft = Math.max(12, Math.min(vw - tipW - 12, tipLeft));

    tutorialTooltip.style.left = `${tipLeft}px`;
    tutorialTooltip.style.top = `${tipTop}px`;
  }

  function renderTutorialStep(stepIdx) {
    if (!tutorialOverlay || !tutorialTooltip) return;
    const steps = getTutorialSteps();
    tutorialStepIndex = Math.max(0, Math.min(steps.length - 1, stepIdx));
    const step = steps[tutorialStepIndex];
    const targetEl = document.querySelector(step.selector) || document.querySelector(step.fallback);
    if (targetEl && typeof targetEl.scrollIntoView === "function") {
      targetEl.scrollIntoView({ behavior: "auto", block: "center" });
    }

    const stepBadgeFn = tUI("tutorialStepBadge");
    const stepBadgeText = typeof stepBadgeFn === "function"
      ? stepBadgeFn(tutorialStepIndex + 1, steps.length)
      : `STEP ${tutorialStepIndex + 1} / ${steps.length}`;
    const isLast = tutorialStepIndex === steps.length - 1;

    tutorialTooltip.innerHTML = `
      <span class="tutorial-step-badge">${escapeHtml(stepBadgeText)}</span>
      <h3 class="tutorial-title" id="tutorialStepTitle">${escapeHtml(tUI(step.titleKey))}</h3>
      <p class="tutorial-desc">${escapeHtml(tUI(step.descKey))}</p>
      <div class="tutorial-actions">
        <button type="button" class="tutorial-btn is-skip" data-action="tutorial-skip">${escapeHtml(tUI("tutorialSkip"))}</button>
        <div class="tutorial-nav-group">
          <button type="button" class="tutorial-btn" data-action="tutorial-prev" ${tutorialStepIndex === 0 ? "disabled" : ""}>${escapeHtml(tUI("tutorialPrev"))}</button>
          <button type="button" class="tutorial-btn is-primary" data-action="tutorial-next">${escapeHtml(isLast ? tUI("tutorialDone") : tUI("tutorialNext"))}</button>
        </div>
      </div>
    `;

    tutorialOverlay.classList.add("open");
    requestAnimationFrame(() => positionTutorialElements(tutorialStepIndex));
  }

  function startInteractiveTutorial(stepIdx = 0) {
    renderTutorialStep(stepIdx);
  }

  function closeInteractiveTutorial(markDone = true) {
    if (!tutorialOverlay) return;
    tutorialOverlay.classList.remove("open");
    if (markDone) {
      try { localStorage.setItem(TUTORIAL_DONE_STORAGE_KEY, "1"); } catch (e) {}
    }
  }

  function syncCompareButtonStates() {
    document.querySelectorAll(".card-compare-btn[data-coffee-id]").forEach(btn => {
      const id = btn.getAttribute("data-coffee-id");
      const active = isBeanInCompare(id);
      btn.classList.toggle("is-selected", active);
      btn.setAttribute("aria-pressed", String(active));
      btn.textContent = active ? tUI("compareAddedBtn") : tUI("compareAddBtn");
    });
    const modalBtn = document.getElementById("modalCompareBtn");
    if (modalBtn) {
      const id = modalBtn.getAttribute("data-coffee-id");
      const active = isBeanInCompare(id);
      modalBtn.classList.toggle("is-selected", active);
      modalBtn.setAttribute("aria-pressed", String(active));
      modalBtn.textContent = active ? tUI("compareAddedBtn") : tUI("compareAddBtn");
    }
  }

  function renderCompareTray() {
    if (!compareFloatingTray) return;
    if (compareIds.length === 0) {
      compareFloatingTray.classList.remove("open");
      compareFloatingTray.innerHTML = "";
      return;
    }

    const countFn = tUI("compareTrayCount");
    const countText = typeof countFn === "function" ? countFn(compareIds.length) : `${compareIds.length}/2`;
    const chipsHtml = compareIds.map((id, idx) => {
      const item = coffeeData.find(c => c.id === id);
      if (!item) return "";
      const loc = getLocalizedBean(item, currentLang);
      return `
        <span class="compare-tray-chip ${idx === 1 ? "is-second" : ""}">
          <span class="compare-tray-chip-name">${escapeHtml(loc.name)}</span>
          <button type="button" class="compare-tray-chip-remove" data-action="toggle-compare" data-coffee-id="${escapeHtml(item.id)}" aria-label="${escapeHtml(tUI("compareTrayRemoveAria"))}">✕</button>
        </span>
      `;
    }).join("");

    compareFloatingTray.innerHTML = `
      <div class="compare-tray-top">
        <span class="compare-tray-count">${escapeHtml(countText)}</span>
        ${compareIds.length < 2 ? `<span class="compare-tray-hint">${escapeHtml(tUI("compareTrayHint"))}</span>` : ""}
      </div>
      <div class="compare-tray-bottom">
        <div class="compare-tray-chips">${chipsHtml}</div>
        <div class="compare-tray-actions">
          <button type="button" class="compare-tray-clear-btn" data-action="clear-compare" aria-label="${escapeHtml(tUI("compareTrayClearAria"))}">${escapeHtml(tUI("clearSearchAria"))}</button>
          <button type="button" class="compare-tray-open-btn" data-action="open-compare-modal" ${compareIds.length < 2 ? "disabled" : ""}>${escapeHtml(tUI("compareTrayOpenBtn"))}</button>
        </div>
      </div>
    `;
    compareFloatingTray.classList.add("open");
  }

  function toggleCompareBean(coffeeId) {
    const idx = compareIds.indexOf(coffeeId);
    if (idx !== -1) {
      compareIds.splice(idx, 1);
    } else {
      if (compareIds.length >= 2) {
        showCompareToast(tUI("compareMaxToast"));
        return;
      }
      compareIds.push(coffeeId);
    }
    syncCompareButtonStates();
    renderCompareTray();
    if (compareModalOverlay && compareModalOverlay.classList.contains("open") && compareIds.length < 2) {
      closeCompareModal();
    }
  }

  function clearCompareBeans() {
    compareIds = [];
    syncCompareButtonStates();
    renderCompareTray();
    closeCompareModal();
  }

  function renderCompareModalBody() {
    if (!compareModalContent || compareIds.length < 2) return;
    const itemA = coffeeData.find(c => c.id === compareIds[0]);
    const itemB = coffeeData.find(c => c.id === compareIds[1]);
    if (!itemA || !itemB) return;

    const locA = getLocalizedBean(itemA, currentLang);
    const locB = getLocalizedBean(itemB, currentLang);
    const isDetailed = compareRadarMode === "detailed";
    const getRoastLv = (item) => (item.brewSpec && item.brewSpec.roastIntensity) || (typeof COFFEE_TAXONOMY !== "undefined" && COFFEE_TAXONOMY.roast[item.roast]?.intensity) || 3;
    const getProcessLabel = (item) => {
      const procMeta = (typeof COFFEE_TAXONOMY !== "undefined" && COFFEE_TAXONOMY.processGroup[item.processGroup]) || null;
      return (procMeta ? procMeta[currentLang] : "") || item.processGroup || item.process || "-";
    };
    const getVarietalLabel = (item) => item.varietalCanonical || item.varietal || "-";
    const getRecipeLabel = (item, loc) => loc.brewText || item.brewOverride || getBrewRecipe(item.roast) || "-";

    const roastLvA = getRoastLv(itemA);
    const roastLvB = getRoastLv(itemB);
    const processA = getProcessLabel(itemA);
    const processB = getProcessLabel(itemB);
    const varietalA = getVarietalLabel(itemA);
    const varietalB = getVarietalLabel(itemB);
    const recipeA = getRecipeLabel(itemA, locA);
    const recipeB = getRecipeLabel(itemB, locB);

    compareModalContent.innerHTML = `
      <button type="button" class="modal-close-btn" aria-label="${escapeHtml(tUI("modalCloseAria"))}" data-action="close-compare-modal">✕</button>
      <div class="compare-modal-header">
        <h2 class="compare-modal-title" id="compareModalTitle">${escapeHtml(tUI("compareModalTitle"))}</h2>
        <button type="button" class="detail-mode-toggle-btn ${isDetailed ? "is-detailed" : ""}" data-action="toggle-compare-mode" aria-pressed="${isDetailed}">
          ${escapeHtml(isDetailed ? tUI("compareSwapModeDetailed") : tUI("compareSwapModeSimple"))}
        </button>
      </div>
      <div class="compare-legend">
        <span class="compare-legend-item"><span class="compare-legend-swatch is-a"></span><span>${escapeHtml(locA.name)}</span></span>
        <span class="compare-legend-item"><span class="compare-legend-swatch is-b"></span><span>${escapeHtml(locB.name)}</span></span>
      </div>
      <div class="compare-radar-wrap">
        ${renderCompareRadarSvg(itemA, itemB, compareRadarMode)}
      </div>
      <div class="compare-table-wrap">
        <table class="compare-table">
          <thead>
            <tr>
              <th></th>
              <th class="compare-col-a">${escapeHtml(locA.name)}</th>
              <th class="compare-col-b">${escapeHtml(locB.name)}</th>
            </tr>
          </thead>
          <tbody>
            <tr><th>${escapeHtml(tUI("compareSpecOrigin"))}</th><td>${escapeHtml(locA.originBadge)}</td><td>${escapeHtml(locB.originBadge)}</td></tr>
            <tr><th>${escapeHtml(tUI("compareSpecSour"))}</th><td>${escapeHtml(itemA.sourDots)} / 5</td><td>${escapeHtml(itemB.sourDots)} / 5</td></tr>
            <tr><th>${escapeHtml(tUI("compareSpecNutty"))}</th><td>${escapeHtml(itemA.nuttyDots)} / 5</td><td>${escapeHtml(itemB.nuttyDots)} / 5</td></tr>
            <tr><th>${escapeHtml(tUI("compareSpecBody"))}</th><td>${escapeHtml(itemA.bodyDots)} / 5</td><td>${escapeHtml(itemB.bodyDots)} / 5</td></tr>
            <tr><th>${escapeHtml(tUI("compareSpecSweet"))}</th><td>${escapeHtml(itemA.sweetDots || 3)} / 5</td><td>${escapeHtml(itemB.sweetDots || 3)} / 5</td></tr>
            <tr><th>${escapeHtml(tUI("compareSpecRoast"))}</th><td>${escapeHtml(locA.roastShort)} (${escapeHtml(roastLvA)}/5)</td><td>${escapeHtml(locB.roastShort)} (${escapeHtml(roastLvB)}/5)</td></tr>
            <tr><th>${escapeHtml(tUI("compareSpecProcess"))}</th><td>${escapeHtml(processA)}</td><td>${escapeHtml(processB)}</td></tr>
            <tr><th>${escapeHtml(tUI("compareSpecVarietal"))}</th><td>${escapeHtml(varietalA)}</td><td>${escapeHtml(varietalB)}</td></tr>
            <tr><th>${escapeHtml(tUI("compareSpecRecipe"))}</th><td>${escapeHtml(recipeA)}</td><td>${escapeHtml(recipeB)}</td></tr>
          </tbody>
        </table>
      </div>
    `;
  }

  function openCompareModal() {
    if (!compareModalOverlay || compareIds.length < 2) return;
    compareRadarMode = detailProfileMode;
    renderCompareModalBody();
    toggleUI(compareModalOverlay, null, true);
  }

  function closeCompareModal() {
    if (!compareModalOverlay) return;
    toggleUI(compareModalOverlay, null, false);
  }

  function toggleCompareRadarMode() {
    compareRadarMode = compareRadarMode === "detailed" ? "simple" : "detailed";
    renderCompareModalBody();
  }

  if (compareModalOverlay) {
    compareModalOverlay.addEventListener("click", (e) => {
      if (e.target === compareModalOverlay) closeCompareModal();
    });
  }

  // =========================================================================
  // Phase 2-2B: Today's Pick 바리스타 추천 배너 컨트롤러 (1단계 무API + 2단계 날씨)
  // =========================================================================
  const todaysPickSection = document.getElementById("todaysPickSection");
  let todaysPickWeatherState = {
    cityId: (typeof WeatherService !== "undefined") ? WeatherService.getSelectedCityId() : "seoul-gangnam",
    condition: null,
    tempC: null,
    source: "fallback"
  };

  function renderTodaysPickBanner() {
    if (!todaysPickSection || typeof CasperEngine === "undefined" || typeof CasperEngine.getTodaysPick !== "function") return;
    const ws = typeof WeatherService !== "undefined" ? WeatherService : null;
    const cityObj = ws ? ws.getCityById(todaysPickWeatherState.cityId) : null;
    const cityLabel = (ws && cityObj) ? ws.getCityLabel(cityObj, currentLang) : "";

    const pick = CasperEngine.getTodaysPick({
      date: new Date(),
      weatherCondition: todaysPickWeatherState.condition,
      tempC: todaysPickWeatherState.tempC,
      cityLabel,
      lang: currentLang,
      limit: 3
    }, coffeeData);

    if (!pick || !pick.primary) {
      todaysPickSection.style.display = "none";
      return;
    }

    todaysPickSection.style.display = "";
    const primaryLoc = getLocalizedBean(pick.primary, currentLang);
    const altPicks = pick.picks.slice(1);
    const modeTagText = pick.mode === "weather" ? tUI("todaysPickModeWeather") : tUI("todaysPickModeTime");

    const cityOptionsHtml = ws ? ws.CITY_PRESETS.map(preset => {
      const sel = preset.id === todaysPickWeatherState.cityId ? " selected" : "";
      return `<option value="${escapeHtml(preset.id)}"${sel}>${escapeHtml(ws.getCityLabel(preset, currentLang))}</option>`;
    }).join("") : "";

    const altChipsHtml = altPicks.map(item => {
      const loc = getLocalizedBean(item, currentLang);
      return `<button type="button" class="tp-bean-chip" data-action="open-detail-modal" data-coffee-id="${escapeHtml(item.id)}">${escapeHtml(loc.name)}</button>`;
    }).join("");

    todaysPickSection.innerHTML = `
      <div class="tp-top-row">
        <div class="tp-badges">
          <span class="tp-eyebrow">${escapeHtml(tUI("todaysPickLabel"))}</span>
          <span class="tp-reason-pill">${escapeHtml(pick.reasonBadge)}</span>
          <span class="tp-mode-tag">${escapeHtml(modeTagText)}</span>
        </div>
        ${ws ? `
        <div class="tp-location-controls">
          <select id="todaysPickCitySelect" class="tp-city-select" aria-label="${escapeHtml(tUI("todaysPickCityAria"))}">${cityOptionsHtml}</select>
          <button type="button" class="tp-gps-btn" data-action="detect-weather-gps" title="${escapeHtml(tUI("todaysPickGpsAria"))}" aria-label="${escapeHtml(tUI("todaysPickGpsAria"))}">${escapeHtml(tUI("todaysPickGpsBtn"))}</button>
        </div>` : ""}
      </div>
      <p class="tp-message" id="todaysPickMessage">“${escapeHtml(pick.message)}”</p>
      <div class="tp-bottom-row">
        <div class="tp-picks-group">
          ${altChipsHtml ? `<span class="tp-alt-label">${escapeHtml(tUI("todaysPickAltLabel"))}:</span>${altChipsHtml}` : ""}
        </div>
        <button type="button" class="tp-cta-btn" id="todaysPickCtaBtn" data-action="open-detail-modal" data-coffee-id="${escapeHtml(pick.primary.id)}">
          ☕ ${escapeHtml(primaryLoc.name)} · ${escapeHtml(tUI("todaysPickViewBtn"))} ➔
        </button>
      </div>
    `;
  }

  function refreshTodaysPickWeather(cityId) {
    if (typeof WeatherService === "undefined") {
      renderTodaysPickBanner();
      return;
    }
    const targetCityId = cityId || todaysPickWeatherState.cityId || WeatherService.getSelectedCityId();
    todaysPickWeatherState.cityId = targetCityId;
    WeatherService.fetchWeatherForCity(targetCityId).then((res) => {
      if (res && res.ok && res.condition) {
        todaysPickWeatherState.condition = res.condition;
        todaysPickWeatherState.tempC = res.tempC;
        todaysPickWeatherState.source = res.source || "proxy";
      } else {
        todaysPickWeatherState.condition = null;
        todaysPickWeatherState.tempC = null;
        todaysPickWeatherState.source = "fallback";
      }
      renderTodaysPickBanner();
    });
  }

  function handleTodaysPickGpsClick() {
    if (typeof WeatherService === "undefined") return;
    WeatherService.detectNearestPresetByGps().then((res) => {
      if (res && res.ok && res.city) {
        todaysPickWeatherState.cityId = res.city.id;
        refreshTodaysPickWeather(res.city.id);
      } else {
        showCompareToast(tUI("todaysPickGpsFailed"));
      }
    });
  }

  if (todaysPickSection) {
    todaysPickSection.addEventListener("change", (e) => {
      const sel = e.target.closest("#todaysPickCitySelect");
      if (!sel || typeof WeatherService === "undefined") return;
      const city = WeatherService.setSelectedCityId(sel.value);
      todaysPickWeatherState.cityId = city.id;
      todaysPickWeatherState.condition = null;
      todaysPickWeatherState.tempC = null;
      renderTodaysPickBanner();
      refreshTodaysPickWeather(city.id);
    });
  }

  window.addEventListener("resize", () => {
    if (tutorialOverlay && tutorialOverlay.classList.contains("open")) {
      positionTutorialElements(tutorialStepIndex);
    }
  }, { passive: true });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (tutorialOverlay && tutorialOverlay.classList.contains("open")) {
      closeInteractiveTutorial(true);
    } else if (compareModalOverlay && compareModalOverlay.classList.contains("open")) {
      closeCompareModal();
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrap, #coreCategoriesSection")) {
      if (coreCategoriesSection) coreCategoriesSection.classList.remove("open");
      closeSearchDropdown();
    }

    const cardTarget = e.target.closest(CARD_SOUND_SELECTOR);
    const tapBtnTarget = (e.detail === 0 || lastPointerType === "touch") ? e.target.closest(SOUND_BTN_SELECTOR) : null;
    const soundTarget = cardTarget || tapBtnTarget;
    if (soundTarget && !isExcludedSoundBtn(soundTarget)) {
      if (lastPointerType !== "touch" || isValidMobileTap()) {
        const variant = soundTarget.matches(BRIGHT_BTN_SELECTOR) ? "bright" : "default";
        AudioFX.drip(variant);
      }
    }

    const btn = e.target.closest(".core-category-btn, .nav-fixed-btn, .action-btn");
    if (btn && btn.id !== "soundToggleBtn") {
      const rect = btn.getBoundingClientRect();
      const circle = document.createElement("span");
      const diameter = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
      circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;
      circle.className = "drip-ripple";
      const old = btn.querySelector(".drip-ripple");
      if (old) old.remove();
      btn.appendChild(circle);
    }

    const actionEl = e.target.closest("[data-action]");
    if (actionEl) {
      handleDelegatedActionClick(actionEl, e);
    }
  });

  // 검색창 클릭/포커스 시 메인 테이스트 카테고리 및 자동완성/검색 기록 드롭다운 노출
  const handleSearchFocusOrClick = () => {
    const hasText = Boolean(searchInput.value && searchInput.value.trim());
    if (coreCategoriesSection) {
      coreCategoriesSection.classList.toggle("open", !hasText);
    }
    renderSearchDropdown();
  };
  searchInput.addEventListener("focus", handleSearchFocusOrClick);
  searchInput.addEventListener("click", handleSearchFocusOrClick);

  searchInput.addEventListener("input", (e) => {
    const val = e.target.value;
    if (!val.trim()) {
      resetToAllCoffees(false);
      if (document.activeElement === searchInput && coreCategoriesSection) {
        coreCategoriesSection.classList.add("open");
      }
      renderSearchDropdown();
    } else {
      if (coreCategoriesSection) coreCategoriesSection.classList.remove("open");
      filterCoffeesBySearch(val);
      renderSearchDropdown();
    }
  });

  // 🌐 Schema v3 다국어 UI 일괄 적용 및 언어 전환 버튼 이벤트
  function applyLanguageUI() {
    document.documentElement.lang = currentLang;
    if (langToggleBtn) langToggleBtn.textContent = LANG_BTN_LABELS[currentLang] || "🌐 KR";

    const titleEl = document.querySelector(".archive-title");
    const descEl = document.querySelector(".archive-desc");
    if (titleEl) titleEl.textContent = tUI("appTitle");
    if (descEl) descEl.textContent = tUI("appDesc");

    if (openDrawerBtn) openDrawerBtn.textContent = tUI("originDrawerBtn");
    updateSoundBtnUI();
    if (searchInput) searchInput.placeholder = tUI("searchPlaceholder");
    if (clearSearchBtn) clearSearchBtn.setAttribute("title", tUI("clearSearchAria"));
    if (searchDropdownPanel) {
      searchDropdownPanel.setAttribute("aria-label", tUI("searchDropdownAria"));
      if (searchDropdownPanel.classList.contains("open")) renderSearchDropdown();
    }

    const catBtns = document.querySelectorAll(".core-category-btn");
    if (catBtns.length >= 4) {
      catBtns[0].querySelector(".cat-title").textContent = tUI("catNoSourTitle");
      catBtns[0].querySelector(".cat-sub").textContent = tUI("catNoSourSub");
      catBtns[1].querySelector(".cat-title").textContent = tUI("catBrightSourTitle");
      catBtns[1].querySelector(".cat-sub").textContent = tUI("catBrightSourSub");
      catBtns[2].querySelector(".cat-title").textContent = tUI("catFermentedTitle");
      catBtns[2].querySelector(".cat-sub").textContent = tUI("catFermentedSub");
      catBtns[3].querySelector(".cat-title").textContent = tUI("catBalancedTitle");
      catBtns[3].querySelector(".cat-sub").textContent = tUI("catBalancedSub");
    }
    const primerPill = document.querySelector(".beginner-primer-pill");
    if (primerPill) primerPill.innerHTML = tUI("primerPillHtml");

    const leverTitleEl = document.querySelector(".lever-title");
    const leverDescEl = document.querySelector(".lever-desc");
    if (leverTitleEl) leverTitleEl.textContent = tUI("leverTitle");
    if (leverDescEl) leverDescEl.textContent = tUI("leverDesc");
    if (wheelRandomBtn) {
      wheelRandomBtn.innerHTML = `<span class="wheel-random-dot"></span>${tUI("randomBtn")}`;
    }

    const wheelUnits = document.querySelectorAll(".thumbwheel-unit .wheel-label-kor");
    if (wheelUnits.length >= 4) {
      wheelUnits[0].textContent = tUI("wheelSour");
      wheelUnits[1].textContent = tUI("wheelNutty");
      wheelUnits[2].textContent = tUI("wheelBody");
      wheelUnits[3].textContent = tUI("wheelOrigin");
    }

    const originDrawerTitle = document.querySelector("#originDrawer .drawer-header h2");
    const originDrawerNotice = document.querySelector("#originDrawer .drawer-notice");
    if (originDrawerTitle) {
      originDrawerTitle.textContent = currentLang === "en"
        ? "🌍 Coffee Origin Atlas"
        : currentLang === "ja"
        ? "🌍 コーヒー原産地図鑑"
        : "🌍 커피 원산지 도감";
    }
    if (originDrawerNotice) {
      originDrawerNotice.textContent = currentLang === "en"
        ? "💡 Tap any country to view its specialty tasting cards."
        : currentLang === "ja"
        ? "💡 国名をタップすると該当産地のテイスティングカードを表示します。"
        : "💡 나라 이름을 누르면 해당 국가 원두의 테이스팅 카드를 모아드립니다.";
    }

    if (homeResetBtn) homeResetBtn.textContent = tUI("topBtn");
    if (tutorialReplayBtn) {
      tutorialReplayBtn.setAttribute("title", tUI("tutorialReplayAria"));
      tutorialReplayBtn.setAttribute("aria-label", tUI("tutorialReplayAria"));
    }
    ["sour", "nutty", "body", "origin"].forEach(t => updateWheelVisual(t, wheelState[t], false, false));
    updateMatchBadges();
    renderOriginDrawerCards();
    renderResults();
    renderCompareTray();
    renderTodaysPickBanner();

    if (onboardingModeOverlay && onboardingModeOverlay.classList.contains("open")) {
      openOnboardingModeModal();
    }
    if (tutorialOverlay && tutorialOverlay.classList.contains("open")) {
      renderTutorialStep(tutorialStepIndex);
    }
    if (compareModalOverlay && compareModalOverlay.classList.contains("open")) {
      renderCompareModalBody();
    }

    // 열려 있는 상세 모달이 있으면 현재 탭 유지한 채 새 언어로 즉시 재렌더링
    if (detailModalOverlay && detailModalOverlay.classList.contains("open") && currentOpenModalCoffeeId) {
      const segTabs = document.getElementById("modalSegmentTabs");
      const wasTicket = segTabs && segTabs.classList.contains("is-ticket");
      window.openDetailModal(currentOpenModalCoffeeId);
      if (wasTicket) window.switchModalTab("ticket");
    }
  }

  // 초기 로드 시 다국어 및 전체 120종 스페셜티 아카이브 렌더링
  applyLanguageUI();
  refreshTodaysPickWeather();

  // 📌 상단 실시간 커피 증기 Canvas 최적화 유지
  const canvas = document.getElementById("steamCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let isCanvasVisible = true;

  const resizeCanvas = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
  window.addEventListener("resize", resizeCanvas); resizeCanvas();

  const observer = new IntersectionObserver((entries) => { isCanvasVisible = entries[0].isIntersecting; });
  observer.observe(canvas);

  class SteamParticle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = canvas.width / 2 + (Math.random() - 0.5) * 200;
      this.y = initial ? Math.random() * canvas.height : canvas.height - 6;
      this.radius = 14 + Math.random() * 18;
      this.vy = -(0.35 + Math.random() * 0.52);
      this.driftPhase = Math.random() * Math.PI * 2;
      this.driftSpeed = 0.015 + Math.random() * 0.018;
      this.driftAmp = 0.25 + Math.random() * 0.35;
      this.alpha = 0.22 + Math.random() * 0.22;
    }
    update() {
      this.driftPhase += this.driftSpeed;
      this.y += this.vy;
      this.x += Math.sin(this.driftPhase) * this.driftAmp;
      this.alpha -= 0.0014;
      this.radius += 0.16;
      if (this.alpha <= 0.01 || this.y + this.radius <= 0) this.reset(false);
    }
    draw() {
      // 라이트 빈티지 종이 배경(#F5EFE6)에서도 은은하게 보이는 따뜻한 로스팅 세피아·크림 라디얼 증기
      const grad = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, this.radius);
      grad.addColorStop(0, `rgba(142, 110, 84, ${(this.alpha * 0.42).toFixed(3)})`);
      grad.addColorStop(0.55, `rgba(176, 145, 118, ${(this.alpha * 0.20).toFixed(3)})`);
      grad.addColorStop(1, "rgba(245, 239, 230, 0)");
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 22; i++) particles.push(new SteamParticle());
  function animateSteam() {
    if (isCanvasVisible) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
    }
    requestAnimationFrame(animateSteam);
  }
  animateSteam();