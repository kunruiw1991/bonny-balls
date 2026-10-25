// Bonny Balls (虫子祖玛 / Bug Zuma) — Authentic HTML5 Reproduction
// Decompiled & reconstructed from original 7Seas Technologies Ltd SWF (650x500, 25fps)
// Honoring Bilibili BV1y5hR6gEuY: "虫子祖玛游戏录制，第七关0.2game over，看来第七关必须0.1，快一档都不行"

(function () {
  'use strict';

  const STAGE_W = 650;
  const STAGE_H = 500;

  // Original Config.as constants
  const Config = {
    BALL_RADIUS: 15,
    BALL_CONNECT_TOLERANCE: 5,
    BALL_TYPES: 6,
    BALL_SHOOT_SPEED: 1400,
    BALL_SHOOT_INTERVAL: 0.2, // 200ms
    BALL_INSERT_TIME: 0.1,    // 100ms
    BALL_CREATE_SPEED: 750,
    BALL_DROP_ACCELERATION: 1000,
    BALL_LOSE_SPEED: 1500,
    BALL_SAME_POSSIBILITY: 0.2,
    STAGE_COUNT: 8,
    STAGE_INITIAL_BALL_TYPES: 5,
    STAGE_BALL_TYPES_INCREASE: 3,
    STAGE_INITIAL_MOVE_SPEED: 20,
    STAGE_MOVE_SPEED_INCREASE: 3,
    STAGE_INITIAL_NO_OF_BALLS: 80,
    STAGE_NO_OF_BALLS_INCREASE: 5,
    STAGE_CREATE_PROPORTION: 20,
    SCORE_BASE: 30,
    SCORE_EXTRA: 40,
    SCORE_COMBO: 50,
    SCORE_STAR: 10,
    STAR_SPACING: 30,

    // Exact STAGEBACKGROUND_BALLMASKS from Config.as
    BALL_MASKS: {
      1: [[-1, -1]],
      2: [[-1, -1]],
      3: [[-1, -1]],
      4: [[21, 987]],
      5: [[13, 988]],
      6: [[13, 988]],
      7: [[14, 488], [14, 504]],
      70: [[14, 986]], // Single-arch variant
      8: [[-1, 960]]
    },

    // Exact STAGEBACKGROUND_BALLCANNOTHITS from Config.as
    BALL_CANNOT_HITS: {
      1: [[-1, -1]],
      2: [[-1, -1]],
      3: [[-1, -1]],
      4: [[29, 976]],
      5: [[22, 980]],
      6: [[22, 980]],
      7: [[22, 480], [22, 496]],
      70: [[22, 978]],
      8: [[5, 950]]
    }
  };

  // 6 Original Ball Colors (matching SWF Sprite 44 frames 1..6)
  // 0: Red, 1: Blue, 2: Lime Green, 3: Golden Yellow, 4: Pink/Magenta, 5: Cyan/Aqua
  const BALL_PALETTE = [
    { name: 'Red',    hi: '#ff9a9a', mid: '#ea1d24', lo: '#7d0509', rim: '#ff4d52' },
    { name: 'Blue',   hi: '#9ad4ff', mid: '#1565eb', lo: '#06246f', rim: '#4794ff' },
    { name: 'Green',  hi: '#b8ff7a', mid: '#32c912', lo: '#0f5c02', rim: '#68ea46' },
    { name: 'Yellow', hi: '#fffb9c', mid: '#f2c809', lo: '#825b00', rim: '#ffe347' },
    { name: 'Pink',   hi: '#ffb5f8', mid: '#e034cf', lo: '#6b0a61', rim: '#f56ee6' },
    { name: 'Cyan',   hi: '#affff8', mid: '#1cc9bd', lo: '#075c55', rim: '#5cebe0' }
  ];

  // Random match bonus table (matching Game.as randomb 0..26)
  const MATCH_BONUSES = [
    { label: 'Good Shot!', score: 0,   effect: null,   color: '#b7ff4a' },
    { label: '$ 200',      score: 200, effect: null,   color: '#ffe44d' },
    { label: 'Excellent!', score: 0,   effect: null,   color: '#7af0ff' },
    { label: 'Slow',       score: 0,   effect: 'slow', color: '#9dff57' },
    { label: 'Well Done!', score: 0,   effect: null,   color: '#ffd166' },
    { label: '$ 600',      score: 600, effect: null,   color: '#ffe44d' },
    { label: 'Bonus +400', score: 400, effect: null,   color: '#ff9ef5' },
    { label: 'Move Back!', score: 0,   effect: 'move', color: '#6efafb' },
    { label: 'Slow',       score: 0,   effect: 'slow', color: '#9dff57' },
    { label: '$ 600',      score: 600, effect: null,   color: '#ffe44d' },
    { label: 'Nice Pick!', score: 0,   effect: null,   color: '#b7ff4a' },
    { label: '$ 500',      score: 500, effect: null,   color: '#ffe44d' },
    { label: 'WOW!',       score: 100, effect: null,   color: '#fff275' }
  ];

  // Asset Loader
  const Assets = {
    images: {},
    sounds: {},
    loaded: false,
    loadAll(onDone) {
      const imgList = {
        title: 'assets/bg_title.jpg',
        bg1: 'assets/bg_level1.jpg',
        bg2: 'assets/bg_level2.jpg',
        bg3: 'assets/bg_level3.jpg',
        bg4: 'assets/bg_level4.jpg',
        bg5: 'assets/bg_level5.jpg',
        bg6: 'assets/bg_level6.jpg',
        bg7: 'assets/bg_level7.jpg',
        bg7_arch: 'assets/bg_level7_arch.jpg',
        bg8: 'assets/bg_level8.jpg',
        lvl4_pool: 'assets/lvl4_pool.png',
        lvl4_flower: 'assets/lvl4_flower.png',
        lvl4_lily1: 'assets/lvl4_lily1.png',
        lvl4_lily2: 'assets/lvl4_lily2.png',
        lvl4_tunnel: 'assets/lvl4_tunnel.png',
        lvl4_umbrella: 'assets/lvl4_umbrella.png',
        lvl8_bunker: 'assets/lvl8_bunker.png'
      };
      const sndList = {
        click: 'assets/click.mp3',
        rollin: 'assets/rollin.mp3',
        blast: 'assets/blast.mp3',
        bgm: 'assets/bgm.mp3',
        lose: 'assets/lose.mp3',
        shoot: 'assets/shoot.mp3',
        win: 'assets/win.mp3'
      };

      const keys = Object.keys(imgList);
      let remaining = keys.length;
      keys.forEach((k) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          remaining--;
          if (remaining <= 0) {
            Assets.loaded = true;
            if (onDone) onDone();
          }
        };
        img.src = imgList[k];
        Assets.images[k] = img;
      });

      Object.keys(sndList).forEach((k) => {
        try {
          const a = new Audio(sndList[k]);
          a.preload = 'auto';
          if (k === 'bgm') {
            a.loop = true;
            a.volume = 0.38;
          } else {
            a.volume = 0.7;
          }
          Assets.sounds[k] = a;
        } catch (e) {}
      });
    },
    playSound(name) {
      if (state.muted) return;
      const snd = Assets.sounds[name];
      if (!snd) return;
      try {
        if (name === 'bgm') {
          snd.play().catch(() => {});
        } else {
          const clone = snd.cloneNode();
          clone.volume = snd.volume;
          clone.play().catch(() => {});
        }
      } catch (e) {}
    },
    stopBgm() {
      const bgm = Assets.sounds.bgm;
      if (bgm) {
        try { bgm.pause(); } catch (e) {}
      }
    }
  };

  // PathInfo class (exact port of PathInfo.as)
  class PathInfo {
    constructor(points, maskRange, cannotHitRange) {
      this.points = points;
      this.maxPointSpacing = 1;
      for (let i = 1; i < points.length; i++) {
        const dx = points[i][0] - points[i - 1][0];
        const dy = points[i][1] - points[i - 1][1];
        const d = Math.hypot(dx, dy);
        if (d > this.maxPointSpacing) this.maxPointSpacing = d;
      }
      this.ballSpacing = (Config.BALL_RADIUS * 2) / this.maxPointSpacing;
      this.connectedBallSpacing = (Config.BALL_RADIUS * 2 + Config.BALL_CONNECT_TOLERANCE) / this.maxPointSpacing;
      this.maskStart = maskRange ? maskRange[0] : -1;
      this.maskEnd = maskRange ? maskRange[1] : -1;
      this.cannotHitStart = cannotHitRange ? cannotHitRange[0] : -1;
      this.cannotHitEnd = cannotHitRange ? cannotHitRange[1] : -1;
    }

    getXY(pointIndex) {
      if (pointIndex <= 0) {
        return { x: this.points[0][0], y: this.points[0][1] };
      }
      const maxIdx = this.points.length - 1;
      if (pointIndex >= maxIdx) {
        return { x: this.points[maxIdx][0], y: this.points[maxIdx][1] };
      }
      const i0 = Math.floor(pointIndex);
      const i1 = i0 + 1;
      const f = pointIndex - i0;
      return {
        x: this.points[i0][0] + (this.points[i1][0] - this.points[i0][0]) * f,
        y: this.points[i0][1] + (this.points[i1][1] - this.points[i0][1]) * f
      };
    }

    getAngle(pointIndex) {
      const i0 = Math.max(0, Math.min(this.points.length - 2, Math.floor(pointIndex)));
      const dx = this.points[i0 + 1][0] - this.points[i0][0];
      const dy = this.points[i0 + 1][1] - this.points[i0][1];
      return Math.atan2(dy, dx);
    }

    getCannotHit(pointIndex) {
      if (this.cannotHitStart !== -1 && pointIndex < this.cannotHitStart) return true;
      if (this.cannotHitEnd !== -1 && pointIndex > this.cannotHitEnd) return true;
      return false;
    }
  }

  // Ball instance
  let nextBallUid = 1;
  class Ball {
    constructor(type) {
      this.uid = nextBallUid++;
      this.type = type;
      this.x = -100;
      this.y = -100;
      this.pointIndex = 0;
      this.cannotHit = false;
      this.insertTime = 0;
      this.insertStartX = 0;
      this.insertStartY = 0;
      this.rollPhase = Math.random() * Math.PI * 2;
    }
  }

  // Game State
  const state = {
    screen: 'TITLE', // 'TITLE' | 'INSTRUCTIONS' | 'PLAYING' | 'GAMEOVER' | 'VICTORY'
    phase: 'CREATE', // 'CREATE' | 'PLAY' | 'WIN_STARS' | 'LOSE_DRAIN' | 'STAGE_CLEAR' | 'CHANCE_LOST'
    currentLevel: 1,
    level7Mode: 'bilibili', // 'bilibili' (Dual-Track 2 chains) | 'arch' (Single-Arch 1 chain)
    score: 0,
    chances: 2,
    speedGear: 1.0, // 0.05, 0.1, 0.2, 0.5, 1.0, 1.5
    aimGuide: true,
    paused: false,
    muted: false,
    mouseX: 325,
    mouseY: 200,
    noOfBallTypes: 5,
    baseMoveSpeed: 20,
    maxNoOfBalls: 80,
    noOfBallsCreated: 0,
    pathInfos: [],
    ballLines: [],
    shootingBalls: [],
    dropInfos: [],
    explodes: [],
    popups: [],
    stars: [],
    lastDestroyPointIndexes: [],
    cannon: {
      x: 321.35,
      y: 243.1,
      sliding: false,
      rotation: -Math.PI / 2,
      frontType: 0,
      backType: 1,
      recoil: 0,
      lastShootTime: -10
    },
    slowTimer: 0,
    reverseTimer: 0,
    bannerTimer: 0,
    bannerTitle: '',
    bannerSub: '',
    shockwaveRadius: 0,
    winStarQueue: [],
    winStarTimer: 0,
    animTime: 0
  };

  function pickAllowedBallType() {
    if (state.noOfBallsCreated >= state.maxNoOfBalls) {
      const present = new Set();
      for (let i = 0; i < state.ballLines.length; i++) {
        for (let j = 0; j < state.ballLines[i].length; j++) {
          present.add(state.ballLines[i][j].type);
        }
      }
      if (present.size > 0) {
        const arr = Array.from(present);
        return arr[Math.floor(Math.random() * arr.length)];
      }
    }
    return Math.floor(Math.random() * state.noOfBallTypes);
  }

  function checkRemainingTypes() {
    if (state.noOfBallsCreated < state.maxNoOfBalls) return;
    const present = new Set();
    for (let i = 0; i < state.ballLines.length; i++) {
      for (let j = 0; j < state.ballLines[i].length; j++) {
        present.add(state.ballLines[i][j].type);
      }
    }
    if (present.size === 0) return;
    const arr = Array.from(present);
    if (!present.has(state.cannon.frontType)) {
      state.cannon.frontType = arr[Math.floor(Math.random() * arr.length)];
    }
    if (!present.has(state.cannon.backType)) {
      state.cannon.backType = arr[Math.floor(Math.random() * arr.length)];
    }
  }

  function startLevel(lvl, resetScoreAndChances) {
    const levelNum = Math.max(1, Math.min(8, Number(lvl) || 1));
    state.currentLevel = levelNum;
    if (resetScoreAndChances) {
      state.score = 0;
      state.chances = 2;
    }
    state.screen = 'PLAYING';
    state.phase = 'CREATE';
    state.paused = false;

    state.noOfBallTypes = Math.min(
      Config.BALL_TYPES,
      Config.STAGE_INITIAL_BALL_TYPES + (levelNum - 1) * Config.STAGE_BALL_TYPES_INCREASE
    );
    state.baseMoveSpeed =
      Config.STAGE_INITIAL_MOVE_SPEED + (levelNum - 1) * Config.STAGE_MOVE_SPEED_INCREASE;
    state.maxNoOfBalls =
      Config.STAGE_INITIAL_NO_OF_BALLS + (levelNum - 1) * Config.STAGE_NO_OF_BALLS_INCREASE;
    state.noOfBallsCreated = 0;

    const pData = window.BONNY_PATHS[levelNum];
    const useArch = levelNum === 7 && state.level7Mode === 'arch';
    const rawLines = useArch ? pData.singleArchLine : pData.lines;
    const maskKey = useArch ? 70 : levelNum;

    state.pathInfos = rawLines.map((pts, idx) => {
      const mRange = (Config.BALL_MASKS[maskKey] && Config.BALL_MASKS[maskKey][idx]) || [-1, -1];
      const cRange =
        (Config.BALL_CANNOT_HITS[maskKey] && Config.BALL_CANNOT_HITS[maskKey][idx]) || [-1, -1];
      return new PathInfo(pts, mRange, cRange);
    });

    state.ballLines = state.pathInfos.map(() => []);
    state.lastDestroyPointIndexes = state.pathInfos.map(() => 0);
    state.shootingBalls = [];
    state.dropInfos = [];
    state.explodes = [];
    state.popups = [];
    state.stars = [];
    state.winStarQueue = [];
    state.slowTimer = 0;
    state.reverseTimer = 0;
    state.shockwaveRadius = 0;

    state.cannon.x = pData.cannon[0];
    state.cannon.y = pData.cannon[1];
    state.cannon.sliding = !!pData.sliding;
    state.cannon.rotation = -Math.PI / 2;
    state.cannon.frontType = Math.floor(Math.random() * state.noOfBallTypes);
    state.cannon.backType = Math.floor(Math.random() * state.noOfBallTypes);
    state.cannon.recoil = 0;

    state.bannerTitle = 'Stage ' + levelNum;
    state.bannerSub =
      levelNum === 7 && state.level7Mode === 'bilibili'
        ? 'Dual-Track Pyramid Challenge (Bilibili BV1y5hR6gEuY)'
        : 'Clear all ' + state.maxNoOfBalls + ' balls!';
    state.bannerTimer = 2.0;

    syncTopControls();
    Assets.playSound('rollin');
    Assets.playSound('bgm');
  }

  function updateBallOnPath(lineIdx, ball) {
    const pInfo = state.pathInfos[lineIdx];
    const pos = pInfo.getXY(ball.pointIndex);
    if (ball.insertTime > 0) {
      const frac = Math.max(0, Math.min(1, ball.insertTime / Config.BALL_INSERT_TIME));
      ball.x = pos.x + (ball.insertStartX - pos.x) * frac;
      ball.y = pos.y + (ball.insertStartY - pos.y) * frac;
    } else {
      ball.x = pos.x;
      ball.y = pos.y;
    }
    ball.cannotHit = pInfo.getCannotHit(ball.pointIndex);
  }

  function createBallIfNeeded(lineIdx) {
    const line = state.ballLines[lineIdx];
    const pInfo = state.pathInfos[lineIdx];
    while (
      state.noOfBallsCreated < state.maxNoOfBalls &&
      (line.length === 0 || line[0].pointIndex >= pInfo.ballSpacing)
    ) {
      let type;
      if (line.length > 0 && Math.random() < Config.BALL_SAME_POSSIBILITY) {
        type = line[0].type;
      } else {
        type = Math.floor(Math.random() * state.noOfBallTypes);
      }
      const b = new Ball(type);
      b.pointIndex = line.length === 0 ? 0 : line[0].pointIndex - pInfo.ballSpacing;
      updateBallOnPath(lineIdx, b);
      line.unshift(b);
      state.noOfBallsCreated++;
    }
  }

  // Exact port of Game.prototype.pushBalls
  function pushBalls(lineIdx, startIdx, deltaPointIndex) {
    const line = state.ballLines[lineIdx];
    if (!line || startIdx < 0 || startIdx >= line.length) return;
    const pInfo = state.pathInfos[lineIdx];

    line[startIdx].pointIndex += deltaPointIndex;
    updateBallOnPath(lineIdx, line[startIdx]);

    for (let i = startIdx; i < line.length - 1; i++) {
      let spacingScale = 1.0;
      if (line[i + 1].insertTime > 0) {
        spacingScale = 1.0 - line[i + 1].insertTime / Config.BALL_INSERT_TIME;
      }
      const minNextIdx = line[i].pointIndex + pInfo.ballSpacing * spacingScale;
      if (line[i + 1].pointIndex < minNextIdx) {
        line[i + 1].pointIndex = minNextIdx;
        updateBallOnPath(lineIdx, line[i + 1]);
      } else if (deltaPointIndex >= 0) {
        // Forward push stops at the first gap in the chain
        break;
      }
    }
  }

  function updateCannonAim() {
    if (state.cannon.sliding) {
      state.cannon.x = Math.max(25, Math.min(STAGE_W - 25, state.mouseX));
      state.cannon.rotation = -Math.PI / 2;
    } else {
      const dx = state.mouseX - state.cannon.x;
      const dy = state.mouseY - state.cannon.y;
      if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
        state.cannon.rotation = Math.atan2(dy, dx);
      }
    }
  }

  function swapBalls() {
    if (state.screen !== 'PLAYING' || state.paused) return;
    const tmp = state.cannon.frontType;
    state.cannon.frontType = state.cannon.backType;
    state.cannon.backType = tmp;
    Assets.playSound('click');
  }

  function shoot() {
    if (state.screen !== 'PLAYING' || state.paused) return;
    if (state.phase !== 'PLAY') return;
    if (state.animTime - state.cannon.lastShootTime < Config.BALL_SHOOT_INTERVAL) return;

    updateCannonAim();
    const angle = state.cannon.rotation;
    const muzzleDist = 30;
    const b = new Ball(state.cannon.frontType);
    b.x = state.cannon.x + Math.cos(angle) * muzzleDist;
    b.y = state.cannon.y + Math.sin(angle) * muzzleDist;
    b.vx = Math.cos(angle) * Config.BALL_SHOOT_SPEED;
    b.vy = Math.sin(angle) * Config.BALL_SHOOT_SPEED;
    state.shootingBalls.push(b);

    state.cannon.frontType = state.cannon.backType;
    state.cannon.backType = pickAllowedBallType();
    state.cannon.recoil = 7;
    state.cannon.lastShootTime = state.animTime;
    Assets.playSound('shoot');
  }

  // Exact port of Game.prototype.checkDestroy
  function checkDestroy(lineIdx, ballIdx, combo) {
    const line = state.ballLines[lineIdx];
    if (!line || ballIdx < 0 || ballIdx >= line.length) return;
    const pInfo = state.pathInfos[lineIdx];
    const targetType = line[ballIdx].type;

    let startIdx = ballIdx;
    while (
      startIdx > 0 &&
      line[startIdx - 1].type === targetType &&
      line[startIdx].pointIndex - line[startIdx - 1].pointIndex <= pInfo.connectedBallSpacing
    ) {
      startIdx--;
    }

    let endIdx = ballIdx;
    while (
      endIdx < line.length - 1 &&
      line[endIdx + 1].type === targetType &&
      line[endIdx + 1].pointIndex - line[endIdx].pointIndex <= pInfo.connectedBallSpacing
    ) {
      endIdx++;
    }

    const count = endIdx - startIdx + 1;
    if (count < 3) return;

    // Score calculation from Game.as
    let gained =
      count * Config.SCORE_BASE +
      (count - 3) * Config.SCORE_EXTRA +
      combo * Config.SCORE_COMBO;

    // Pick bonus popup / effect
    const midBall = line[Math.floor((startIdx + endIdx) / 2)];
    const bonus = MATCH_BONUSES[Math.floor(Math.random() * MATCH_BONUSES.length)];
    gained += bonus.score;
    state.score += gained;

    if (bonus.effect === 'slow') {
      state.slowTimer = 4.0;
    } else if (bonus.effect === 'move') {
      state.reverseTimer = 1.6;
    }

    state.popups.push({
      x: midBall.x,
      y: midBall.y,
      text: combo > 0 ? 'Combo x' + (combo + 1) + '! ' + bonus.label : bonus.label,
      sub: '+' + gained,
      color: bonus.color,
      life: 1.1,
      maxLife: 1.1
    });

    state.lastDestroyPointIndexes[lineIdx] = line[endIdx].pointIndex;

    for (let i = startIdx; i <= endIdx; i++) {
      state.explodes.push({
        x: line[i].x,
        y: line[i].y,
        color: BALL_PALETTE[line[i].type].mid,
        life: 0.42,
        maxLife: 0.42
      });
    }
    Assets.playSound('blast');

    // Remove matched balls
    line.splice(startIdx, count);

    // If balls remain on both sides of the gap, create a DropInfo to pull the front segment back!
    if (startIdx > 0 && startIdx < line.length) {
      const anchorBall = line[startIdx - 1];
      // Avoid duplicate DropInfo for the same anchor
      const existing = state.dropInfos.findIndex(
        (d) => d.lineIndex === lineIdx && d.ball === anchorBall
      );
      if (existing !== -1) {
        state.dropInfos.splice(existing, 1);
      }
      state.dropInfos.push({
        lineIndex: lineIdx,
        ball: anchorBall,
        ballIndex: startIdx - 1,
        speed: 0,
        combo: combo + 1
      });
    }

    checkRemainingTypes();
  }

  // Exact port of Game.prototype.landBallOnPath
  function landBallOnPath(lineIdx, hitIdx, shotBall) {
    const line = state.ballLines[lineIdx];
    const pInfo = state.pathInfos[lineIdx];
    const hitBall = line[hitIdx];

    const beforePos = pInfo.getXY(hitBall.pointIndex - pInfo.ballSpacing);
    const afterPos = pInfo.getXY(hitBall.pointIndex + pInfo.ballSpacing);
    const distBefore = Math.hypot(shotBall.x - beforePos.x, shotBall.y - beforePos.y);
    const distAfter = Math.hypot(shotBall.x - afterPos.x, shotBall.y - afterPos.y);

    let insertIdx;
    if (distBefore < distAfter) {
      insertIdx = hitIdx;
      shotBall.pointIndex = hitBall.pointIndex;
    } else {
      insertIdx = hitIdx + 1;
      shotBall.pointIndex = hitBall.pointIndex + pInfo.ballSpacing;
    }

    shotBall.insertTime = Config.BALL_INSERT_TIME;
    shotBall.insertStartX = shotBall.x;
    shotBall.insertStartY = shotBall.y;
    line.splice(insertIdx, 0, shotBall);
    updateBallOnPath(lineIdx, shotBall);

    // Push forward balls ahead of insertIdx
    pushBalls(lineIdx, insertIdx, 0);

    // Hand off any active magnetic pull-back anchor on hitBall to shotBall (matching Game.as L1528-1563)
    if (insertIdx > hitIdx) {
      for (let i = 0; i < state.dropInfos.length; i++) {
        const d = state.dropInfos[i];
        if (d.lineIndex === lineIdx && d.ball === hitBall) {
          d.ball = shotBall;
          d.ballIndex = insertIdx;
        }
      }
    }

    checkDestroy(lineIdx, insertIdx, 0);
  }

  // Exact port of Game.prototype.moveShootingBalls
  function moveShootingBalls(dt) {
    for (let s = state.shootingBalls.length - 1; s >= 0; s--) {
      const sb = state.shootingBalls[s];
      const dx = sb.vx * dt;
      const dy = sb.vy * dt;
      const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / (Config.BALL_RADIUS * 2)));
      const stepX = dx / steps;
      const stepY = dy / steps;

      let landed = false;
      for (let step = 0; step < steps && !landed; step++) {
        sb.x += stepX;
        sb.y += stepY;

        for (let lineIdx = 0; lineIdx < state.ballLines.length && !landed; lineIdx++) {
          const line = state.ballLines[lineIdx];
          for (let j = 0; j < line.length; j++) {
            const target = line[j];
            if (target.cannotHit) continue;
            const dist = Math.hypot(sb.x - target.x, sb.y - target.y);
            if (dist < Config.BALL_RADIUS * 2) {
              state.shootingBalls.splice(s, 1);
              landBallOnPath(lineIdx, j, sb);
              landed = true;
              break;
            }
          }
        }
      }

      if (
        !landed &&
        (sb.x < -Config.BALL_RADIUS ||
          sb.x > STAGE_W + Config.BALL_RADIUS ||
          sb.y < -Config.BALL_RADIUS ||
          sb.y > STAGE_H + Config.BALL_RADIUS)
      ) {
        state.shootingBalls.splice(s, 1);
      }
    }
  }

  // Exact port of Game.prototype.dropBalls (magnetic pull-back after a match)
  function updateDropBalls(dt) {
    if (state.dropInfos.length === 0) return;

    // Validate dropInfos indices
    for (let i = state.dropInfos.length - 1; i >= 0; i--) {
      const d = state.dropInfos[i];
      const line = state.ballLines[d.lineIndex];
      const idx = line ? line.indexOf(d.ball) : -1;
      if (idx === -1 || idx >= line.length - 1) {
        state.dropInfos.splice(i, 1);
      } else {
        d.ballIndex = idx;
      }
    }

    const collided = [];
    for (let i = 0; i < state.dropInfos.length; i++) {
      const d = state.dropInfos[i];
      const lineIdx = d.lineIndex;
      const line = state.ballLines[lineIdx];
      const pInfo = state.pathInfos[lineIdx];

      d.speed += Config.BALL_DROP_ACCELERATION * dt;
      let deltaIdx = (d.speed * dt * pInfo.ballSpacing) / (Config.BALL_RADIUS * 2);

      const frontStart = d.ballIndex + 1;
      // Determine where this segment ends (up to next gap or end of line)
      let frontEnd = line.length;
      for (let k = frontStart; k < line.length - 1; k++) {
        if (line[k + 1].pointIndex - line[k].pointIndex > pInfo.connectedBallSpacing) {
          frontEnd = k + 1;
          break;
        }
      }

      let hitBack = false;
      if (line[frontStart].pointIndex - deltaIdx <= line[d.ballIndex].pointIndex + pInfo.ballSpacing) {
        deltaIdx = line[frontStart].pointIndex - line[d.ballIndex].pointIndex - pInfo.ballSpacing;
        hitBack = true;
      }

      for (let k = frontStart; k < frontEnd; k++) {
        line[k].pointIndex -= deltaIdx;
        updateBallOnPath(lineIdx, line[k]);
      }

      if (hitBack) {
        collided.push(d);
        state.dropInfos.splice(i, 1);
        i--;
      }
    }

    for (let i = 0; i < collided.length; i++) {
      const c = collided[i];
      const line = state.ballLines[c.lineIndex];
      const idx = line.indexOf(c.ball);
      if (idx !== -1 && idx + 1 < line.length) {
        if (line[idx].type === line[idx + 1].type) {
          checkDestroy(c.lineIndex, idx, c.combo);
        }
      }
    }
  }

  function triggerStageWin() {
    state.phase = 'WIN_STARS';
    state.shootingBalls = [];
    state.dropInfos = [];
    state.winStarQueue = [];

    for (let i = 0; i < state.pathInfos.length; i++) {
      const pInfo = state.pathInfos[i];
      const startPt = Math.max(0, state.lastDestroyPointIndexes[i] || 0);
      const step = (Config.STAR_SPACING * pInfo.ballSpacing) / (Config.BALL_RADIUS * 2);
      for (let pt = startPt; pt < pInfo.points.length - 1; pt += step) {
        const xy = pInfo.getXY(pt);
        state.winStarQueue.push({ x: xy.x, y: xy.y });
      }
    }
    state.winStarTimer = 0;
    Assets.playSound('win');
  }

  function triggerStageLose() {
    state.phase = 'LOSE_DRAIN';
    state.shootingBalls = [];
    state.dropInfos = [];
    state.shockwaveRadius = 10;
    Assets.playSound('lose');
  }

  function stepGame(dt) {
    state.animTime += dt;
    if (state.screen !== 'PLAYING' || state.paused) return;

    updateCannonAim();
    if (state.cannon.recoil > 0) {
      state.cannon.recoil = Math.max(0, state.cannon.recoil - 45 * dt);
    }
    if (state.bannerTimer > 0) {
      state.bannerTimer = Math.max(0, state.bannerTimer - dt);
    }

    // Update insert interpolations
    for (let i = 0; i < state.ballLines.length; i++) {
      const line = state.ballLines[i];
      for (let j = 0; j < line.length; j++) {
        if (line[j].insertTime > 0) {
          line[j].insertTime = Math.max(0, line[j].insertTime - dt);
          updateBallOnPath(i, line[j]);
        }
        line[j].rollPhase += dt * 4 * state.speedGear;
      }
    }

    // Update explosions, popups, stars
    for (let i = state.explodes.length - 1; i >= 0; i--) {
      state.explodes[i].life -= dt;
      if (state.explodes[i].life <= 0) state.explodes.splice(i, 1);
    }
    for (let i = state.popups.length - 1; i >= 0; i--) {
      state.popups[i].y -= 28 * dt;
      state.popups[i].life -= dt;
      if (state.popups[i].life <= 0) state.popups.splice(i, 1);
    }
    for (let i = state.stars.length - 1; i >= 0; i--) {
      state.stars[i].life -= dt;
      if (state.stars[i].life <= 0) state.stars.splice(i, 1);
    }

    if (state.phase === 'CREATE') {
      let allReady = true;
      for (let i = 0; i < state.ballLines.length; i++) {
        const line = state.ballLines[i];
        const pInfo = state.pathInfos[i];
        const targetIdx = (pInfo.points.length * Config.STAGE_CREATE_PROPORTION) / 100;
        if (line.length === 0 || line[line.length - 1].pointIndex < targetIdx) {
          createBallIfNeeded(i);
          const deltaIdx =
            (Config.BALL_CREATE_SPEED * dt * pInfo.ballSpacing) / (Config.BALL_RADIUS * 2);
          pushBalls(i, 0, deltaIdx);
          createBallIfNeeded(i);
          allReady = false;
        }
      }
      if (allReady) {
        state.phase = 'PLAY';
        state.bannerTimer = 0;
      }
      return;
    }

    if (state.phase === 'PLAY') {
      if (state.slowTimer > 0) state.slowTimer = Math.max(0, state.slowTimer - dt);
      if (state.reverseTimer > 0) state.reverseTimer = Math.max(0, state.reverseTimer - dt);

      let speedMult = state.speedGear;
      if (state.slowTimer > 0) speedMult *= 0.35;
      if (state.reverseTimer > 0) speedMult *= -0.9;

      let allEmpty = state.noOfBallsCreated >= state.maxNoOfBalls;
      let anyLost = false;

      for (let i = 0; i < state.ballLines.length; i++) {
        createBallIfNeeded(i);
        const line = state.ballLines[i];
        const pInfo = state.pathInfos[i];
        if (line.length > 0) {
          allEmpty = false;
          const deltaIdx =
            (state.baseMoveSpeed * speedMult * dt * pInfo.ballSpacing) / (Config.BALL_RADIUS * 2);
          if (deltaIdx >= 0) {
            pushBalls(i, 0, deltaIdx);
          } else {
            // Reverse move bonus pulls the leading segment back slightly
            for (let j = 0; j < line.length; j++) {
              line[j].pointIndex = Math.max(0, line[j].pointIndex + deltaIdx);
              updateBallOnPath(i, line[j]);
            }
          }
          if (line[line.length - 1].pointIndex >= pInfo.points.length - 1) {
            anyLost = true;
          }
        }
      }

      if (anyLost) {
        triggerStageLose();
        return;
      }
      if (allEmpty) {
        triggerStageWin();
        return;
      }

      moveShootingBalls(dt);
      updateDropBalls(dt);
      return;
    }

    if (state.phase === 'WIN_STARS') {
      state.winStarTimer += dt;
      while (state.winStarQueue.length > 0 && state.winStarTimer >= 0.03) {
        state.winStarTimer -= 0.03;
        const st = state.winStarQueue.shift();
        state.score += Config.SCORE_STAR;
        state.stars.push({ x: st.x, y: st.y, life: 0.7, maxLife: 0.7 });
      }
      if (state.winStarQueue.length === 0 && state.stars.length === 0) {
        state.phase = 'STAGE_CLEAR';
        state.bannerTimer = 2.2;
      }
      return;
    }

    if (state.phase === 'STAGE_CLEAR') {
      if (state.bannerTimer <= 0) {
        if (state.currentLevel < Config.STAGE_COUNT) {
          startLevel(state.currentLevel + 1, false);
        } else {
          state.screen = 'VICTORY';
        }
      }
      return;
    }

    if (state.phase === 'LOSE_DRAIN') {
      state.shockwaveRadius += 520 * dt;
      let allDrained = true;
      for (let i = 0; i < state.ballLines.length; i++) {
        const line = state.ballLines[i];
        const pInfo = state.pathInfos[i];
        if (line.length > 0) {
          allDrained = false;
          const deltaIdx =
            (Config.BALL_LOSE_SPEED * dt * pInfo.ballSpacing) / (Config.BALL_RADIUS * 2);
          for (let j = 0; j < line.length; j++) {
            line[j].pointIndex += deltaIdx;
            updateBallOnPath(i, line[j]);
          }
          while (line.length > 0 && line[line.length - 1].pointIndex >= pInfo.points.length - 1) {
            line.pop();
          }
        }
      }
      if (allDrained) {
        state.chances--;
        state.phase = 'CHANCE_LOST';
        state.bannerTimer = 2.2;
      }
      return;
    }

    if (state.phase === 'CHANCE_LOST') {
      if (state.bannerTimer <= 0) {
        if (state.chances >= 0) {
          startLevel(state.currentLevel, false);
        } else {
          state.screen = 'GAMEOVER';
        }
      }
    }
  }

  // ============================================================================
  // RENDERING (650x500 logical stage at 2x Retina HiDPI)
  // ============================================================================
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');

  function drawBallSprite(x, y, radius, type, rollPhase, alpha) {
    const pal = BALL_PALETTE[type % BALL_PALETTE.length];
    ctx.save();
    if (alpha !== undefined && alpha < 1) ctx.globalAlpha = alpha;
    ctx.translate(x, y);

    // Subtle drop shadow
    ctx.fillStyle = 'rgba(0,0,0,0.34)';
    ctx.beginPath();
    ctx.arc(2, 3, radius, 0, Math.PI * 2);
    ctx.fill();

    // 3D glossy radial sphere gradient
    const g = ctx.createRadialGradient(
      -radius * 0.35,
      -radius * 0.35,
      radius * 0.1,
      0,
      0,
      radius
    );
    g.addColorStop(0, pal.hi);
    g.addColorStop(0.55, pal.mid);
    g.addColorStop(1, pal.lo);

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // Rolling band stripe to show ball rotation along the track
    if (rollPhase !== undefined) {
      ctx.save();
      ctx.rotate(rollPhase);
      ctx.strokeStyle = 'rgba(255,255,255,0.22)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.62, -0.7, 0.7);
      ctx.stroke();
      ctx.restore();
    }

    // Specular highlight oval
    ctx.fillStyle = 'rgba(255,255,255,0.68)';
    ctx.beginPath();
    ctx.ellipse(-radius * 0.32, -radius * 0.34, radius * 0.28, radius * 0.16, -0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  // Authentic Cartoon Caterpillar Head (cid=110 in SWF, Levels 1, 2, 3)
  function drawCaterpillarHead(x, y, angleDeg, scaleX, scaleY) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angleDeg * Math.PI) / 180);
    ctx.scale(scaleX || 1, scaleY || 1);

    // Dark mouth cavity
    ctx.fillStyle = '#1d2b08';
    ctx.beginPath();
    ctx.ellipse(18, 0, 17, 19, 0, 0, Math.PI * 2);
    ctx.fill();

    // Lime-green head dome
    const hg = ctx.createRadialGradient(-6, -10, 4, 0, 0, 34);
    hg.addColorStop(0, '#dcff5e');
    hg.addColorStop(0.6, '#84d618');
    hg.addColorStop(1, '#3e7a04');
    ctx.fillStyle = hg;
    ctx.beginPath();
    ctx.ellipse(-4, 0, 28, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2d5902';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Mouth rim lip
    ctx.strokeStyle = '#9be825';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(12, 0, 18, -1.2, 1.2);
    ctx.stroke();

    // Antennae
    ctx.strokeStyle = '#2a5200';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(6, -16);
    ctx.quadraticCurveTo(22, -32, 30, -24);
    ctx.moveTo(6, 16);
    ctx.quadraticCurveTo(22, 32, 30, 24);
    ctx.stroke();

    // Big cartoon eyes (blinking periodically)
    const blink = Math.sin(state.animTime * 3.2) > 0.94;
    [-10, 10].forEach((ey) => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(2, ey, 8.5, 6.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#234500';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      if (blink) {
        ctx.fillStyle = '#7ed115';
        ctx.beginPath();
        ctx.ellipse(2, ey, 8.5, 6.8, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#1b5e05';
        ctx.beginPath();
        ctx.arc(4.5, ey, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(3.2, ey - 1.5, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.restore();
  }

  // Authentic Glossy Blue Bug Head (cid=126 in SWF, Levels 2 & 3 exit mouth)
  function drawBlueBugHead(x, y, angleDeg, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angleDeg * Math.PI) / 180);
    ctx.scale(scale || 1, scale || 1);

    // Wide dark mouth opening
    ctx.fillStyle = '#081b33';
    ctx.beginPath();
    ctx.ellipse(0, 20, 26, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glossy sky-blue dome body
    const bg = ctx.createRadialGradient(-10, -14, 5, 0, 0, 38);
    bg.addColorStop(0, '#adf2ff');
    bg.addColorStop(0.55, '#1aa3ff');
    bg.addColorStop(1, '#054a91');
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(0, 0, 32, Math.PI * 0.92, Math.PI * 2.08, false);
    ctx.quadraticCurveTo(28, 22, 0, 16);
    ctx.quadraticCurveTo(-28, 22, -31, 4);
    ctx.closePath();
    ctx.fill();

    // White smile rim
    ctx.strokeStyle = '#d9f7ff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.quadraticCurveTo(0, 22, 25, 12);
    ctx.stroke();

    // Cute bug eyes
    [-11, 11].forEach((ex) => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(ex, 4, 7.5, 9.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#043970';
      ctx.lineWidth = 1.3;
      ctx.stroke();

      ctx.fillStyle = '#092c54';
      ctx.beginPath();
      ctx.arc(ex, 6, 4.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ex - 1.5, 4, 1.6, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  // Authentic Red-Orange Cannon with Wheels, Front Ball & Back Ball (cid=65 in SWF)
  function drawCannon() {
    const c = state.cannon;
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rotation);
    ctx.translate(-c.recoil, 0);

    // Next (Back) ball preview sticking out the rear breech (ballBack at x=-26, scale=0.66)
    drawBallSprite(-25, 0, Config.BALL_RADIUS * 0.66, c.backType, undefined, 1);

    // Current (Front) ball loaded inside the muzzle (ballFront at x=26)
    drawBallSprite(26, 0, Config.BALL_RADIUS, c.frontType, undefined, 1);

    // Left & Right Wooden/Bronze Wheels
    [-22, 22].forEach((wy) => {
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(-12, wy - 5, 24, 10, 4) : ctx.rect(-12, wy - 5, 24, 10);
      ctx.fill();

      const wg = ctx.createLinearGradient(-12, wy - 6, 12, wy + 6);
      wg.addColorStop(0, '#592507');
      wg.addColorStop(0.5, '#c4621d');
      wg.addColorStop(1, '#3d1702');
      ctx.fillStyle = wg;
      ctx.fillRect(-12, wy - 6, 24, 11);
      ctx.strokeStyle = '#290e00';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-12, wy - 6, 24, 11);

      // Gold axle cap
      ctx.fillStyle = '#f5b82e';
      ctx.beginPath();
      ctx.arc(0, wy, 3.2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Cannon Barrel Body (Red-Orange metallic gradient tapering from rear to muzzle)
    const bg = ctx.createLinearGradient(0, -20, 0, 20);
    bg.addColorStop(0, '#7a1204');
    bg.addColorStop(0.28, '#f24c1e');
    bg.addColorStop(0.5, '#ff9a66');
    bg.addColorStop(0.75, '#d92b0b');
    bg.addColorStop(1, '#590a00');

    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.moveTo(-20, -14);
    ctx.lineTo(22, -17);
    ctx.quadraticCurveTo(27, 0, 22, 17);
    ctx.lineTo(-20, 14);
    ctx.quadraticCurveTo(-26, 0, -20, -14);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#470800';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // White decorative chevron / flame emblem on barrel (matching lvl1.jpg..lvl7.jpg)
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.moveTo(-10, -12);
    ctx.lineTo(-2, -4);
    ctx.lineTo(9, 0);
    ctx.lineTo(-2, 4);
    ctx.lineTo(-10, 12);
    ctx.quadraticCurveTo(-5, 0, -10, -12);
    ctx.fill();

    // Muzzle rim collar
    ctx.strokeStyle = '#ff8552';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(21, -16);
    ctx.lineTo(21, 16);
    ctx.stroke();

    ctx.restore();
  }

  function drawAimingGuide() {
    if (!state.aimGuide || state.screen !== 'PLAYING' || state.phase !== 'PLAY') return;
    const c = state.cannon;
    const angle = c.rotation;
    ctx.save();
    ctx.strokeStyle = BALL_PALETTE[c.frontType].hi;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.globalAlpha = 0.65;
    ctx.beginPath();
    ctx.moveTo(c.x + Math.cos(angle) * 38, c.y + Math.sin(angle) * 38);
    ctx.lineTo(c.x + Math.cos(angle) * 260, c.y + Math.sin(angle) * 260);
    ctx.stroke();
    ctx.restore();
  }

  function drawBackgroundUnderlay() {
    const lvl = state.currentLevel;
    let bgImg = Assets.images['bg' + lvl];
    if (lvl === 7 && state.level7Mode === 'arch') {
      bgImg = Assets.images.bg7_arch;
    }
    if (bgImg && bgImg.complete) {
      ctx.drawImage(bgImg, 0, 0, STAGE_W, STAGE_H);
    } else {
      ctx.fillStyle = '#4ea819';
      ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    }

    // Level 4 specific underlay decals (swimming pool + lilies + beach umbrella)
    if (lvl === 4) {
      const pool = Assets.images.lvl4_pool;
      if (pool && pool.complete) {
        ctx.drawImage(pool, 355, 88, 217 * 0.68, 153 * 0.68);
      }
      const l1 = Assets.images.lvl4_lily1;
      if (l1 && l1.complete) ctx.drawImage(l1, 368, 148, 30, 26);
      const l2 = Assets.images.lvl4_lily2;
      if (l2 && l2.complete) ctx.drawImage(l2, 444, 134, 28, 26);
      const fl = Assets.images.lvl4_flower;
      if (fl && fl.complete) ctx.drawImage(fl, 442, 114, 24, 24);

      const umb = Assets.images.lvl4_umbrella;
      if (umb && umb.complete) {
        ctx.drawImage(umb, 189.2, 172.85, 86, 94);
      }
    }
  }

  // Draw foreground tunnels, pyramids, and bug heads ABOVE the balls (exact Sprite 180 depth > 81)
  function drawForegroundOverlays() {
    const lvl = state.currentLevel;

    if (lvl === 1) {
      // Caterpillar head at top-right entrance [603.85, 94.55]
      drawCaterpillarHead(599, 82, 62, 0.78, 0.78);
    } else if (lvl === 2) {
      // Caterpillar head at top-left entrance [146.65, 68.1]
      drawCaterpillarHead(128, 66, 8, 0.85, 0.85);
      // Blue bug head at center-right exit [460.25, 233.0]
      drawBlueBugHead(452, 215, -16, 0.85);
    } else if (lvl === 3) {
      // Caterpillar head at bottom-right entrance [539.7, 461.95]
      drawCaterpillarHead(554, 460, 176, 0.85, -0.85);
      // Blue bug head at center-right exit [372.1, 245.65]
      drawBlueBugHead(390, 242, 72, 0.85);
    } else if (lvl === 4) {
      // Wooden tunnel roof (bmp_154.png) placed above balls at (7.95, 19.9)
      const tun = Assets.images.lvl4_tunnel;
      if (tun && tun.complete) {
        ctx.drawImage(tun, 7.95, 19.9, 209, 89);
      }
    } else if (lvl === 5) {
      // Clip of bg_level5.jpg over top-right pyramid & center-left pyramid
      const bg5 = Assets.images.bg5;
      if (bg5 && bg5.complete) {
        ctx.drawImage(bg5, 591, 40, 59, 79, 591, 40, 59, 79);
        ctx.drawImage(bg5, 0, 236, 39, 80, 0, 236, 39, 80);
      }
    } else if (lvl === 6) {
      // Clip of bg_level6.jpg over bottom-left pyramid & top-right pyramid
      const bg6 = Assets.images.bg6;
      if (bg6 && bg6.complete) {
        ctx.drawImage(bg6, 0, 402, 29, 80, 0, 402, 29, 80);
        ctx.drawImage(bg6, 561, 36, 80, 41, 561, 36, 80, 41);
      }
    } else if (lvl === 7) {
      // Clip of bg_level7 over bottom-left & bottom-right pyramids, plus top-center pyramids in Bilibili mode
      const bg7 = state.level7Mode === 'arch' ? Assets.images.bg7_arch : Assets.images.bg7;
      if (bg7 && bg7.complete) {
        ctx.drawImage(bg7, 0, 420, 51, 80, 0, 420, 51, 80);
        ctx.drawImage(bg7, 598, 417, 52, 80, 598, 417, 52, 80);
        if (state.level7Mode === 'bilibili') {
          ctx.drawImage(bg7, 248, 0, 154, 44, 248, 0, 154, 44);
        }
      }
    } else if (lvl === 8) {
      // Stone bunker roof (bmp_175.png) placed above balls at (-19.3, 335.55)
      const bnk = Assets.images.lvl8_bunker;
      if (bnk && bnk.complete) {
        ctx.drawImage(bnk, -19.3, 335.55, 138, 137);
      }
    }
  }

  // Authentic top & bottom stage HUD (matching Bilibili video frames lvl1.jpg..lvl7.jpg)
  function drawStageHUD() {
    ctx.save();
    ctx.font = '900 18px "Arial Black", Impact, sans-serif';
    ctx.textBaseline = 'top';

    function drawOutlinedText(txt, x, y, fill, stroke) {
      ctx.strokeStyle = stroke || '#1b4d00';
      ctx.lineWidth = 4;
      ctx.strokeText(txt, x, y);
      ctx.fillStyle = fill || '#fff566';
      ctx.fillText(txt, x, y);
    }

    drawOutlinedText('Score: ' + state.score, 12, 6);
    drawOutlinedText('Level: ' + state.currentLevel, 206, 6);
    drawOutlinedText('Chances: ' + Math.max(0, state.chances), 305, 6);
    drawOutlinedText('Menu', 432, 6, '#ffe85e');

    ctx.font = '800 14px Arial, sans-serif';
    drawOutlinedText('Space = Swap', 500, 9, '#eaff8c');

    // Red circular Pause & Mute buttons at top-right (matching lvl1.jpg..end_01.jpg)
    const btns = [
      { cx: 608, cy: 15, label: state.paused ? '▶' : '||' },
      { cx: 634, cy: 15, label: state.muted ? '✕' : '♪' }
    ];
    btns.forEach((b) => {
      ctx.fillStyle = '#d91e18';
      ctx.beginPath();
      ctx.arc(b.cx, b.cy, 10.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.label, b.cx, b.cy + 0.5);
    });

    // Bottom copyright & website watermarks matching original SWF
    ctx.font = 'bold 11px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.strokeStyle = 'rgba(0,0,0,0.65)';
    ctx.lineWidth = 2.5;
    ctx.strokeText('www.onlinerealgames.com', 8, STAGE_H - 4);
    ctx.fillText('www.onlinerealgames.com', 8, STAGE_H - 4);

    ctx.textAlign = 'right';
    ctx.strokeText('Copyright © 7Seas Technologies Ltd', STAGE_W - 8, STAGE_H - 4);
    ctx.fillText('Copyright © 7Seas Technologies Ltd', STAGE_W - 8, STAGE_H - 4);

    // Active Speed Gear badge on canvas
    if (state.speedGear !== 1.0 || state.slowTimer > 0) {
      const gearTxt =
        'SPEED: ' +
        state.speedGear.toFixed(2).replace(/0$/, '') +
        'x' +
        (state.slowTimer > 0 ? ' (SLOW BONUS)' : '');
      ctx.textAlign = 'left';
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
      ctx.fillRect(10, 30, 175, 20);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 30, 175, 20);
      ctx.fillStyle = '#7dd3fc';
      ctx.fillText(gearTxt, 16, 44);
    }

    ctx.restore();
  }

  function drawEffectsAndBanners() {
    // Explosions
    state.explodes.forEach((ex) => {
      const p = 1 - ex.life / ex.maxLife;
      const r = 12 + p * 26;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - p);
      const g = ctx.createRadialGradient(ex.x, ex.y, 2, ex.x, ex.y, r);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.45, '#ffe347');
      g.addColorStop(1, ex.color);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(ex.x, ex.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Stage Clear Stars
    state.stars.forEach((st) => {
      const p = st.life / st.maxLife;
      ctx.save();
      ctx.translate(st.x, st.y);
      ctx.scale(0.6 + (1 - p) * 0.6, 0.6 + (1 - p) * 0.6);
      ctx.globalAlpha = Math.max(0, p);
      ctx.fillStyle = '#fff352';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a1 = (i * 72 - 90) * (Math.PI / 180);
        const a2 = ((i + 0.5) * 72 - 90) * (Math.PI / 180);
        ctx.lineTo(Math.cos(a1) * 14, Math.sin(a1) * 14);
        ctx.lineTo(Math.cos(a2) * 6, Math.sin(a2) * 6);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });

    // Floating score & bonus popups
    state.popups.forEach((pop) => {
      const alpha = Math.min(1, pop.life / (pop.maxLife * 0.4));
      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.font = '900 20px "Arial Black", Impact, sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#143300';
      ctx.lineWidth = 4;
      ctx.strokeText(pop.text, pop.x, pop.y);
      ctx.fillStyle = pop.color;
      ctx.fillText(pop.text, pop.x, pop.y);

      ctx.font = 'bold 14px Arial, sans-serif';
      ctx.strokeText(pop.sub, pop.x, pop.y + 18);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(pop.sub, pop.x, pop.y + 18);
      ctx.restore();
    });

    // Expanding shockwave ring on Lose (exact match to end_01.jpg & gameover.jpg!)
    if (state.phase === 'LOSE_DRAIN' || state.phase === 'CHANCE_LOST') {
      ctx.save();
      [1, 0.55].forEach((mult) => {
        const r = state.shockwaveRadius * mult;
        if (r > 5 && r < 420) {
          ctx.strokeStyle = 'rgba(220, 215, 255, 0.85)';
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.arc(STAGE_W / 2, STAGE_H / 2, r, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(STAGE_W / 2, STAGE_H / 2, r, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      ctx.font = '900 44px "Arial Black", Impact, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const msg = state.chances < 0 ? 'GAME OVER' : 'Chance Lost';
      ctx.strokeStyle = '#1e5200';
      ctx.lineWidth = 7;
      ctx.strokeText(msg, STAGE_W / 2, STAGE_H / 2);
      ctx.fillStyle = '#dcff6b';
      ctx.fillText(msg, STAGE_W / 2, STAGE_H / 2);
      ctx.restore();
    }

    // Stage Begin / Stage Clear Banner
    if (state.bannerTimer > 0 && (state.phase === 'CREATE' || state.phase === 'STAGE_CLEAR')) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
      ctx.fillRect(0, STAGE_H / 2 - 52, STAGE_W, 104);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 40px "Arial Black", Impact, sans-serif';
      ctx.strokeStyle = '#1b4d00';
      ctx.lineWidth = 6;
      const title = state.phase === 'STAGE_CLEAR' ? 'STAGE CLEAR!' : state.bannerTitle;
      ctx.strokeText(title, STAGE_W / 2, STAGE_H / 2 - 12);
      ctx.fillStyle = '#e6ff66';
      ctx.fillText(title, STAGE_W / 2, STAGE_H / 2 - 12);

      ctx.font = 'bold 16px Arial, sans-serif';
      ctx.fillStyle = '#ffffff';
      const sub =
        state.phase === 'STAGE_CLEAR'
          ? 'Bonus Stars Tallied — Preparing Next Stage...'
          : state.bannerSub;
      ctx.fillText(sub, STAGE_W / 2, STAGE_H / 2 + 24);
      ctx.restore();
    }

    if (state.paused) {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(0, 0, STAGE_W, STAGE_H);
      ctx.font = '900 42px "Arial Black", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff566';
      ctx.fillText('PAUSED', STAGE_W / 2, STAGE_H / 2 - 10);
      ctx.font = 'bold 16px Arial, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Click Pause button or press P to resume', STAGE_W / 2, STAGE_H / 2 + 26);
      ctx.restore();
    }
  }

  function drawTitleOrEndScreen() {
    const bg = Assets.images.title;
    if (bg && bg.complete) {
      ctx.drawImage(bg, 0, 0, STAGE_W, STAGE_H);
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, STAGE_H);
      g.addColorStop(0, '#2b7de9');
      g.addColorStop(0.55, '#8fd3fe');
      g.addColorStop(0.6, '#56b818');
      g.addColorStop(1, '#296e04');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    }

    // Animated rainbow ball train on the right grass slope (matching menu_08.jpg & sheet_09.jpg)
    for (let i = 9; i >= 0; i--) {
      const bx = 370 + i * 28;
      const by = 435 - i * 11 + Math.sin(state.animTime * 4 + i * 0.5) * 3;
      const r = 26 - i * 1.4;
      drawBallSprite(bx, by, r, i % 6, state.animTime * 2 + i, 1);
    }

    // Bouncing "BONNY BALLS" colorful ball title arch
    const titleLetters = 'BONNY BALLS'.split('');
    titleLetters.forEach((ch, idx) => {
      if (ch === ' ') return;
      const lx = 88 + idx * 46;
      const ly = 96 + Math.sin(state.animTime * 3.5 + idx * 0.6) * 6;
      drawBallSprite(lx, ly, 23, idx % 6, undefined, 1);
      ctx.save();
      ctx.font = '900 24px "Arial Black", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#1b0a00';
      ctx.lineWidth = 4;
      ctx.strokeText(ch, lx, ly + 1);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(ch, lx, ly + 1);
      ctx.restore();
    });

    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = 'bold 16px Arial, sans-serif';
    ctx.fillStyle = '#fff9a6';
    ctx.strokeStyle = '#0c3000';
    ctx.lineWidth = 3.5;
    const subTitle =
      state.screen === 'GAMEOVER'
        ? 'GAME OVER — Final Score: ' + state.score
        : state.screen === 'VICTORY'
        ? 'CONGRATULATIONS! ALL 8 STAGES CLEARED! Score: ' + state.score
        : '虫子祖玛 (Bug Zuma) — Authentic 8-Stage SWF Reproduction';
    ctx.strokeText(subTitle, STAGE_W / 2, 152);
    ctx.fillText(subTitle, STAGE_W / 2, 152);

    // Green pill buttons on the left (matching original menu_08.jpg / sheet_09.jpg)
    const buttons = [
      { id: 'play_lvl1', x: 75, y: 245, w: 210, h: 42, text: '▶ PLAY STAGE 1' },
      { id: 'play_lvl7', x: 75, y: 300, w: 210, h: 42, text: '🔥 STAGE 7 (0.1x / 0.2x)' },
      { id: 'toggle_01x', x: 75, y: 355, w: 210, h: 42, text: '⚡ SPEED GEAR: ' + state.speedGear + 'x' }
    ];

    buttons.forEach((b) => {
      const g = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.h);
      g.addColorStop(0, '#a8ff3e');
      g.addColorStop(0.5, '#4ec20e');
      g.addColorStop(1, '#246b02');
      ctx.fillStyle = g;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(b.x, b.y, b.w, b.h);
      ctx.fill();
      ctx.stroke();

      ctx.font = '900 15px "Arial Black", Arial, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#184700';
      ctx.lineWidth = 3;
      ctx.strokeText(b.text, b.x + b.w / 2, b.y + b.h / 2 + 5);
      ctx.fillText(b.text, b.x + b.w / 2, b.y + b.h / 2 + 5);
    });

    // Quick instructions box
    ctx.fillStyle = 'rgba(10, 28, 12, 0.72)';
    ctx.fillRect(60, 412, 260, 62);
    ctx.strokeStyle = '#8ce842';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, 412, 260, 62);
    ctx.font = 'bold 12px Arial, sans-serif';
    ctx.fillStyle = '#eaffc2';
    ctx.fillText('Click/Tap to Shoot • Space / Right-Click to Swap', 190, 432);
    ctx.fillText('Levels 4 & 8: Sliding Cannon • Level 7: Dual-Track', 190, 450);
    ctx.fillText('Use Top Bar to pick any Stage 1–8 or Speed 0.05x–1.5x', 190, 466);

    ctx.restore();
  }

  function render() {
    ctx.save();
    // Scale 650x500 logical coordinates to 1300x1000 HiDPI canvas
    ctx.scale(canvas.width / STAGE_W, canvas.height / STAGE_H);
    ctx.clearRect(0, 0, STAGE_W, STAGE_H);

    if (state.screen !== 'PLAYING') {
      drawTitleOrEndScreen();
      ctx.restore();
      return;
    }

    drawBackgroundUnderlay();
    drawAimingGuide();

    // Draw all balls on all active tracks
    for (let i = 0; i < state.ballLines.length; i++) {
      const line = state.ballLines[i];
      for (let j = 0; j < line.length; j++) {
        const b = line[j];
        drawBallSprite(b.x, b.y, Config.BALL_RADIUS, b.type, b.rollPhase, 1);
      }
    }

    // Draw flying shot balls
    for (let i = 0; i < state.shootingBalls.length; i++) {
      const sb = state.shootingBalls[i];
      drawBallSprite(sb.x, sb.y, Config.BALL_RADIUS, sb.type, state.animTime * 12, 1);
    }

    // Draw foreground tunnels, pyramids, and bug heads ABOVE the balls
    drawForegroundOverlays();

    // Draw Cannon
    drawCannon();

    // Draw Explosions, Stars, Popups, and Lose Shockwave
    drawEffectsAndBanners();

    // Draw Stage Top/Bottom HUD
    drawStageHUD();

    ctx.restore();
  }

  // ============================================================================
  // INPUT & UI WIRING
  // ============================================================================
  function getStageCoords(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * STAGE_W,
      y: ((clientY - rect.top) / rect.height) * STAGE_H
    };
  }

  canvas.addEventListener('mousemove', (e) => {
    const pt = getStageCoords(e.clientX, e.clientY);
    state.mouseX = pt.x;
    state.mouseY = pt.y;
    updateCannonAim();
  });

  canvas.addEventListener('mousedown', (e) => {
    if (e.button === 2) {
      e.preventDefault();
      swapBalls();
      return;
    }
    const pt = getStageCoords(e.clientX, e.clientY);
    state.mouseX = pt.x;
    state.mouseY = pt.y;

    if (state.screen !== 'PLAYING') {
      // Check title buttons
      if (pt.x >= 75 && pt.x <= 285 && pt.y >= 245 && pt.y <= 287) {
        startLevel(1, true);
      } else if (pt.x >= 75 && pt.x <= 285 && pt.y >= 300 && pt.y <= 342) {
        state.speedGear = 0.1;
        startLevel(7, true);
      } else if (pt.x >= 75 && pt.x <= 285 && pt.y >= 355 && pt.y <= 397) {
        const gears = [0.05, 0.1, 0.2, 0.5, 1.0, 1.5];
        const idx = (gears.indexOf(state.speedGear) + 1) % gears.length;
        setSpeedGear(gears[idx]);
      } else {
        startLevel(state.currentLevel || 1, true);
      }
      return;
    }

    // Check top-bar canvas buttons (Menu, Pause, Mute)
    if (pt.y <= 28) {
      if (pt.x >= 425 && pt.x <= 485) {
        state.screen = 'TITLE';
        return;
      }
      if (Math.hypot(pt.x - 608, pt.y - 15) <= 13) {
        state.paused = !state.paused;
        syncTopControls();
        return;
      }
      if (Math.hypot(pt.x - 634, pt.y - 15) <= 13) {
        state.muted = !state.muted;
        if (state.muted) Assets.stopBgm();
        else Assets.playSound('bgm');
        syncTopControls();
        return;
      }
    }

    updateCannonAim();
    shoot();
  });

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  canvas.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        const pt = getStageCoords(e.touches[0].clientX, e.touches[0].clientY);
        state.mouseX = pt.x;
        state.mouseY = pt.y;
        if (state.screen !== 'PLAYING') {
          startLevel(state.currentLevel || 1, true);
        } else {
          updateCannonAim();
          shoot();
        }
      }
    },
    { passive: false }
  );

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      swapBalls();
    } else if (e.key === 'p' || e.key === 'P') {
      state.paused = !state.paused;
      syncTopControls();
    } else if (e.key === 'm' || e.key === 'M') {
      state.muted = !state.muted;
      if (state.muted) Assets.stopBgm();
      else Assets.playSound('bgm');
      syncTopControls();
    } else if (e.key === 'r' || e.key === 'R') {
      startLevel(state.currentLevel, false);
    } else if (e.key >= '1' && e.key <= '8') {
      startLevel( parseInt(e.key, 10), false);
    }
  });

  function setSpeedGear(mult) {
    state.speedGear = Number(mult) || 1.0;
    syncTopControls();
  }

  function syncTopControls() {
    document.querySelectorAll('[data-level-btn]').forEach((btn) => {
      const l = parseInt(btn.getAttribute('data-level-btn'), 10);
      btn.classList.toggle('active', state.screen === 'PLAYING' && state.currentLevel === l);
    });
    document.querySelectorAll('[data-speed-btn]').forEach((btn) => {
      const s = parseFloat(btn.getAttribute('data-speed-btn'));
      btn.classList.toggle('active', Math.abs(state.speedGear - s) < 0.001);
    });
    const modeBtn = document.getElementById('btn-lvl7-mode');
    if (modeBtn) {
      modeBtn.textContent =
        state.level7Mode === 'bilibili' ? 'Lvl7: Dual-Track (Bilibili)' : 'Lvl7: Single-Arch';
    }
    const pauseBtn = document.getElementById('btn-pause');
    if (pauseBtn) pauseBtn.textContent = state.paused ? '▶ Resume' : '⏸ Pause';
    const muteBtn = document.getElementById('btn-mute');
    if (muteBtn) muteBtn.textContent = state.muted ? '🔇 Muted' : '🔊 Audio';
  }

  // Bind HTML toolbar controls
  document.querySelectorAll('[data-level-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lvl = parseInt(btn.getAttribute('data-level-btn'), 10);
      startLevel(lvl, false);
    });
  });

  document.querySelectorAll('[data-speed-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setSpeedGear(parseFloat(btn.getAttribute('data-speed-btn')));
    });
  });

  const btnSwap = document.getElementById('btn-swap');
  if (btnSwap) btnSwap.addEventListener('click', swapBalls);

  const btnPause = document.getElementById('btn-pause');
  if (btnPause) {
    btnPause.addEventListener('click', () => {
      state.paused = !state.paused;
      syncTopControls();
    });
  }

  const btnMute = document.getElementById('btn-mute');
  if (btnMute) {
    btnMute.addEventListener('click', () => {
      state.muted = !state.muted;
      if (state.muted) Assets.stopBgm();
      else Assets.playSound('bgm');
      syncTopControls();
    });
  }

  const btnLvl7Mode = document.getElementById('btn-lvl7-mode');
  if (btnLvl7Mode) {
    btnLvl7Mode.addEventListener('click', () => {
      state.level7Mode = state.level7Mode === 'bilibili' ? 'arch' : 'bilibili';
      syncTopControls();
      if (state.currentLevel === 7 && state.screen === 'PLAYING') {
        startLevel(7, false);
      }
    });
  }

  // Main Animation Loop
  let lastTs = performance.now();
  function tick(now) {
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
    lastTs = now;
    stepGame(dt);
    render();
    window.requestAnimationFrame(tick);
  }

  // Expose deterministic test & automation API
  window.__BONNY_BALLS__ = {
    loadLevel: (lvl, reset) => startLevel(lvl, !!reset),
    setSpeedGear: (mult) => setSpeedGear(mult),
    setLevel7Mode: (mode) => {
      state.level7Mode = mode;
      if (state.currentLevel === 7) startLevel(7, false);
    },
    swapBalls: () => swapBalls(),
    shootAt: (x, y) => {
      state.mouseX = x;
      state.mouseY = y;
      updateCannonAim();
      state.cannon.lastShootTime = -10;
      shoot();
    },
    step: (dt) => {
      let rem = Math.max(0, Number(dt) || 0);
      if (rem === 0) {
        stepGame(0);
      } else {
        while (rem > 1e-6) {
          const s = Math.min(0.02, rem);
          stepGame(s);
          rem -= s;
        }
      }
      render();
    },
    getState: () => ({
      screen: state.screen,
      phase: state.phase,
      currentLevel: state.currentLevel,
      level7Mode: state.level7Mode,
      score: state.score,
      chances: state.chances,
      speedGear: state.speedGear,
      lineCount: state.ballLines.length,
      lineLengths: state.ballLines.map((l) => l.length),
      noOfBallsCreated: state.noOfBallsCreated,
      maxNoOfBalls: state.maxNoOfBalls,
      cannon: { ...state.cannon }
    })
  };

  Assets.loadAll(() => {
    syncTopControls();
    render();
  });
  window.requestAnimationFrame(tick);
})();
