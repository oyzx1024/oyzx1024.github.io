(() => {
  const LEVELS = window.LEAN_PROOF_ALCHEMY_LEVELS || [];
  const STORAGE_KEY = "leanProofAlchemyProgress";
  const DUR = {
    snap: 180,
    combine: 420,
    tokenFlash: 450,
    shake: 220,
    success: 650
  };

  const GameState = {
    HOME: "HOME",
    LEVEL_SELECT: "LEVEL_SELECT",
    LEVEL_INTRO: "LEVEL_INTRO",
    PLAYING: "PLAYING",
    ANIMATING: "ANIMATING",
    SUCCESS: "SUCCESS",
    REPLAY: "REPLAY"
  };

  const app = document.getElementById("app");
  let progress = loadProgress();
  let replayTimer = null;
  let drag = null;
  let state = {
    screen: GameState.HOME,
    levelIndex: progress.lastPlayedLevelId ? Math.max(0, LEVELS.findIndex((level) => level.id === progress.lastPlayedLevelId)) : 0
  };

  app.addEventListener("click", handleClick);
  app.addEventListener("pointerdown", handlePointerDown);
  render();

  function loadProgress() {
    const fallback = {
      unlockedLevelIndex: 0,
      completedLevels: [],
      lastPlayedLevelId: LEVELS[0] ? LEVELS[0].id : ""
    };
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || !Array.isArray(saved.completedLevels)) return fallback;
      return {
        unlockedLevelIndex: Math.max(0, saved.unlockedLevelIndex || 0),
        completedLevels: saved.completedLevels,
        lastPlayedLevelId: saved.lastPlayedLevelId || fallback.lastPlayedLevelId
      };
    } catch (error) {
      return fallback;
    }
  }

  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  function resetProgress() {
    progress = {
      unlockedLevelIndex: 0,
      completedLevels: [],
      lastPlayedLevelId: LEVELS[0] ? LEVELS[0].id : ""
    };
    saveProgress();
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function currentLevel() {
    return LEVELS[state.levelIndex] || LEVELS[0];
  }

  function render() {
    clearReplayTimerIfClosed();
    if (!LEVELS.length) {
      app.innerHTML = `<div class="screen home-screen"><p>没有找到关卡数据。</p></div>`;
      return;
    }

    if (state.screen === GameState.HOME) {
      app.innerHTML = renderHome();
      return;
    }
    if (state.screen === GameState.LEVEL_SELECT) {
      app.innerHTML = renderLevelSelect();
      return;
    }
    if (state.screen === GameState.LEVEL_INTRO) {
      app.innerHTML = renderIntro();
      return;
    }
    app.innerHTML = renderGame();
  }

  function renderHome() {
    const last = LEVELS.find((level) => level.id === progress.lastPlayedLevelId) || LEVELS[0];
    return `
      <div class="screen home-screen">
        <div class="brand">
          <div class="alchemy-mark" aria-hidden="true"></div>
          <h1>Lean Proof Alchemy</h1>
          <p class="subtitle">证明炼金工坊</p>
        </div>
        <div class="primary-actions">
          <button class="btn primary" data-action="continue">继续：${esc(last.title)}</button>
          <button class="btn" data-action="level-select">选择关卡</button>
          <button class="btn ghost" data-action="restart-progress">重新开始</button>
        </div>
      </div>
    `;
  }

  function renderLevelSelect() {
    const chapters = [];
    LEVELS.forEach((level, index) => {
      let chapter = chapters.find((item) => item.title === level.chapter);
      if (!chapter) {
        chapter = { title: level.chapter, levels: [] };
        chapters.push(chapter);
      }
      chapter.levels.push({ level, index });
    });

    return `
      <div class="screen select-screen">
        <div class="select-header">
          <h2>选择关卡</h2>
          <button class="btn small ghost" data-action="home">返回</button>
        </div>
        <div class="chapter-list">
          ${chapters.map((chapter) => `
            <section class="chapter">
              <h3 class="chapter-title">${esc(chapter.title)}</h3>
              ${chapter.levels.map(({ level, index }) => renderLevelButton(level, index)).join("")}
            </section>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderLevelButton(level, index) {
    const locked = index > progress.unlockedLevelIndex;
    const done = progress.completedLevels.includes(level.id);
    return `
      <button class="level-button ${locked ? "locked" : ""}" data-action="open-level" data-level-index="${index}" ${locked ? "disabled" : ""}>
        <span class="num">${index + 1}</span>
        <span>
          <strong>${esc(level.title)}</strong>
          <span class="meta">${esc(level.learningFocus)}</span>
        </span>
        <span>${done ? "✓" : locked ? "锁" : ""}</span>
      </button>
    `;
  }

  function renderIntro() {
    const level = currentLevel();
    return `
      <div class="screen intro-screen">
        <div class="intro-header">
          <button class="btn small ghost" data-action="level-select">关卡</button>
          <button class="btn small ghost" data-action="home">首页</button>
        </div>
        <section class="intro-card">
          <p class="intro-kicker">${esc(level.chapter)} · 第 ${state.levelIndex + 1} 关 / ${LEVELS.length}</p>
          <h2 class="intro-title">${esc(level.title)}</h2>
          <p class="intro-line">${esc(level.objectiveText)}</p>
          <p class="intro-line">${esc(level.learningFocus)}</p>
          <button class="btn primary" data-action="start-level">开始</button>
        </section>
      </div>
    `;
  }

  function renderGame() {
    const level = currentLevel();
    return `
      <div class="app" data-state="${esc(state.screen)}">
        ${renderTopbar(level)}
        ${renderCode(level)}
        ${renderWorkshop(level)}
        ${renderWarehouse(level)}
      </div>
      ${state.tokenPopover ? renderTokenPopover() : ""}
      ${state.toast ? `<div class="toast ${state.toast.kind || ""}">${esc(state.toast.text)}</div>` : ""}
      ${state.completed ? renderSuccessPanel(level) : ""}
      ${state.replayOpen ? renderReplayPanel() : ""}
    `;
  }

  function renderTopbar(level) {
    return `
      <header class="topbar">
        <div class="top-title">
          <div class="level-line">第 ${state.levelIndex + 1} 关 / ${LEVELS.length}：${esc(level.title)}</div>
          <div class="goal-line">目标：制造 proof of ${esc(state.goalCurrentType || level.goal.requiredType)}</div>
        </div>
        <div class="top-actions">
          <button class="icon-btn" data-action="hint" aria-label="提示" title="提示">?</button>
          <button class="icon-btn" data-action="reset-level" aria-label="重置" title="重置">↻</button>
          <button class="icon-btn" data-action="level-select" aria-label="关卡" title="关卡">≡</button>
        </div>
      </header>
    `;
  }

  function renderCode(level) {
    const active = activeLineIndex();
    const understoodLines = new Set((state.trace || []).map((entry) => entry.lineIndex).filter((line) => line !== undefined));
    return `
      <section class="code-panel">
        <div class="code-card">
          ${level.codeLines.map((line, index) => `
            <div class="code-line ${index === active ? "active" : ""} ${understoodLines.has(index) ? "understood" : ""}">
              ${line.map((token) => renderCodeToken(token)).join("")}
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderCodeToken(token) {
    const required = (currentLevel().requiredTokenClicks || []).includes(token.id);
    const clicked = state.clickedTokens && state.clickedTokens.has(token.id);
    const linked = (state.activeTokenRefs || []).includes(token.id) || isTokenInReplay(token.id);
    return `
      <span
        class="code-token ${required && !clicked ? "required" : ""} ${clicked ? "understood" : ""} ${linked ? "linked" : ""}"
        data-token-id="${esc(token.id)}"
      >${esc(token.text)}</span>
    `;
  }

  function renderWorkshop(level) {
    return `
      <main class="workshop">
        <div class="target-row">
          ${renderTarget(level)}
        </div>
        <div class="workshop-scroll">
          ${renderSubgoals()}
          ${renderProducts()}
          ${renderMachines(level)}
          ${renderConstructors(level)}
        </div>
        <div class="empty-note">${esc(level.objectiveText)}</div>
      </main>
    `;
  }

  function renderTarget(level) {
    if (state.subgoals && state.subgoals.length) {
      return `
        <div class="target-slot complete">
          <div class="slot-title">目标槽</div>
          <div class="slot-need">${esc(level.goal.requiredType)}</div>
          <div class="slot-help">已拆成 ${state.subgoals.length} 个子目标</div>
        </div>
      `;
    }
    const filled = state.goalFilledBy ? findModuleById(state.goalFilledBy) : null;
    const key = zoneKey({ type: "target" });
    return `
      <div
        class="target-slot drop-zone ${filled ? "complete" : ""} ${state.badZoneKey === key ? "is-bad" : ""}"
        data-zone-type="target"
        data-zone-key="${esc(key)}"
        data-required-type="${esc(state.goalCurrentType)}"
      >
        <div class="slot-title">目标槽</div>
        <div class="slot-need">需要：${esc(state.goalCurrentType)}</div>
        ${filled ? `<div class="slot-fill">${esc(filled.label)} : ${esc(filled.type)}</div>` : `<div class="slot-help">拖入一个 proof of ${esc(state.goalCurrentType)}</div>`}
      </div>
    `;
  }

  function renderSubgoals() {
    if (!state.subgoals || !state.subgoals.length) return "";
    return `
      <section>
        <div class="section-title">subgoalArea</div>
        <div class="subgoal-grid">
          ${state.subgoals.map((goal, index) => {
            const filled = goal.filledBy ? findModuleById(goal.filledBy) : null;
            const key = zoneKey({ type: "subgoal", subgoalIndex: index });
            return `
              <div
                class="subgoal-slot drop-zone ${filled ? "complete" : ""} ${state.badZoneKey === key ? "is-bad" : ""}"
                data-zone-type="subgoal"
                data-subgoal-index="${index}"
                data-zone-key="${esc(key)}"
                data-required-type="${esc(goal.requiredType)}"
              >
                <div class="slot-title">子目标 ${index + 1}</div>
                <div class="slot-need">需要：${esc(goal.requiredType)}</div>
                ${filled ? `<div class="slot-fill">${esc(filled.label)} : ${esc(filled.type)}</div>` : `<div class="slot-help">拖入 proof of ${esc(goal.requiredType)}</div>`}
              </div>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }

  function renderMachines(level) {
    if (!level.machines.length) return "";
    return `
      <section>
        <div class="section-title">machineArea</div>
        <div class="machine-grid">
          ${level.machines.map((machine) => renderMachine(machine)).join("")}
        </div>
      </section>
    `;
  }

  function renderMachine(machine) {
    const inputModule = state.machineInputs[machine.id] ? findModuleById(state.machineInputs[machine.id]) : null;
    const key = zoneKey({ type: "machine", machineId: machine.id });
    return `
      <div class="machine ${state.flashId === machine.id ? "flash" : ""}">
        <div class="machine-head">
          <div class="machine-name">${esc(machine.label)}</div>
          <div class="machine-type">${esc(machine.inputType)} → ${esc(machine.outputType)}</div>
        </div>
        <div class="io-row">
          <div
            class="drop-zone ${state.badZoneKey === key ? "is-bad" : ""}"
            data-zone-type="machine"
            data-machine-id="${esc(machine.id)}"
            data-zone-key="${esc(key)}"
            data-required-type="${esc(machine.inputType)}"
          >${inputModule ? esc(inputModule.label) : `输入 ${esc(machine.inputType)}`}</div>
          <div class="arrow">→</div>
          <div class="drop-zone" data-zone-type="output-preview">输出 ${esc(machine.outputType)}</div>
        </div>
      </div>
    `;
  }

  function renderConstructors(level) {
    if (!level.constructors.length) return "";
    return `
      <section>
        <div class="section-title">constructorArea</div>
        <div class="constructor-grid">
          ${level.constructors.map((ctor) => renderConstructor(ctor)).join("")}
        </div>
      </section>
    `;
  }

  function renderConstructor(ctor) {
    const inputs = state.constructorInputs[ctor.id] || [];
    return `
      <div class="constructor-machine ${state.flashId === ctor.id ? "flash" : ""}">
        <div class="machine-head">
          <div class="machine-name">${esc(ctor.label)}</div>
          <div class="machine-type">输出 ${esc(ctor.outputType)}</div>
        </div>
        <div class="constructor-inputs">
          ${ctor.inputTypes.map((type, index) => {
            const inputModule = inputs[index] ? findModuleById(inputs[index]) : null;
            const key = zoneKey({ type: "constructor", constructorId: ctor.id, inputIndex: index });
            return `
              <div
                class="drop-zone ${state.badZoneKey === key ? "is-bad" : ""}"
                data-zone-type="constructor"
                data-constructor-id="${esc(ctor.id)}"
                data-input-index="${index}"
                data-zone-key="${esc(key)}"
                data-required-type="${esc(type)}"
              >${inputModule ? esc(inputModule.label) : `输入 ${esc(type)}`}</div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  function renderProducts() {
    if (!state.products.length) return "";
    return `
      <section>
        <div class="section-title">productArea</div>
        <div class="product-grid">
          <div class="module-row">
            ${state.products.map((module) => renderModuleCard(module, "product")).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderWarehouse(level) {
    return `
      <section class="warehouse">
        <div class="warehouse-head">
          <span>模块仓库</span>
          <span>${esc(nextStepLabel())}</span>
        </div>
        <div class="module-row">
          ${state.modules.map((module) => renderModuleCard(module, "warehouse")).join("")}
        </div>
      </section>
    `;
  }

  function renderModuleCard(module, source) {
    const isProof = module.kind === "proof";
    const isTactic = module.kind === "tactic";
    const disabled = isTactic && !isExpectedTactic(module.id);
    const draggable = isProof && module.draggable !== false && !state.completed;
    return `
      <div
        class="module-card kind-${esc(module.kind)} ${disabled ? "disabled" : ""} ${state.badModuleId === module.id ? "is-bad" : ""}"
        data-module-id="${esc(module.id)}"
        data-source="${esc(source)}"
        data-draggable="${draggable ? "true" : "false"}"
        data-tactic="${isTactic ? "true" : "false"}"
        role="${isTactic ? "button" : "group"}"
      >
        <div class="module-name">${esc(module.label)}</div>
        <div class="module-type">${module.kind === "proof" ? `proof of ${esc(module.type)}` : esc(module.type || module.tacticType || "")}</div>
        <div class="module-lean">Lean: ${esc(module.lean || module.label)}</div>
        ${module.canSplit ? `<button class="mini-btn" data-action="split-module" data-module-id="${esc(module.id)}">拆解</button>` : ""}
      </div>
    `;
  }

  function renderTokenPopover() {
    return `
      <div class="token-popover">
        <div class="popover-title">${esc(state.tokenPopover.text.trim() || "token")}</div>
        <div class="popover-body">${esc(state.tokenPopover.explain)}</div>
        <div class="panel-actions">
          <button class="btn small" data-action="close-popover">知道了</button>
        </div>
      </div>
    `;
  }

  function renderSuccessPanel(level) {
    return `
      <div class="success-panel">
        <div class="success-title">证明完成</div>
        <div class="success-text">${esc(level.successText)} ${esc(level.learningFocus)}</div>
        <div class="panel-actions">
          <button class="btn small" data-action="open-replay">运行证明</button>
          <button class="btn small primary" data-action="next-level">下一关</button>
        </div>
      </div>
    `;
  }

  function renderReplayPanel() {
    const trace = state.trace || [];
    const step = trace[state.replayIndex] || trace[trace.length - 1];
    const total = Math.max(trace.length, 1);
    return `
      <div class="replay-panel">
        <div class="replay-title">证明回放 · 第 ${Math.min(state.replayIndex + 1, total)} 步 / ${total}</div>
        <div class="replay-text">模块动作：${esc(step ? step.actionLabel : "暂无步骤")}</div>
        <div class="replay-code">${esc(step ? (step.leanLine || step.leanExpr || "") : "")}</div>
        <div class="replay-text">${esc(step ? step.explanation : "")}</div>
        <div class="panel-actions">
          <button class="btn small ghost" data-action="close-replay">关闭</button>
          <button class="btn small" data-action="auto-replay">自动播放</button>
          <button class="btn small primary" data-action="next-replay">下一步</button>
        </div>
      </div>
    `;
  }

  function handleClick(event) {
    const actionTarget = event.target.closest("[data-action]");
    if (actionTarget) {
      const action = actionTarget.dataset.action;
      if (action === "continue") {
        const index = LEVELS.findIndex((level) => level.id === progress.lastPlayedLevelId);
        openLevel(index >= 0 ? Math.min(index, progress.unlockedLevelIndex) : progress.unlockedLevelIndex);
      } else if (action === "home") {
        stopReplayTimer();
        state.screen = GameState.HOME;
        render();
      } else if (action === "level-select") {
        stopReplayTimer();
        state.screen = GameState.LEVEL_SELECT;
        render();
      } else if (action === "restart-progress") {
        resetProgress();
        state.screen = GameState.LEVEL_INTRO;
        state.levelIndex = 0;
        render();
      } else if (action === "open-level") {
        openLevel(Number(actionTarget.dataset.levelIndex));
      } else if (action === "start-level") {
        startLevel(state.levelIndex);
      } else if (action === "reset-level") {
        startLevel(state.levelIndex);
      } else if (action === "hint") {
        showHint();
      } else if (action === "close-popover") {
        state.tokenPopover = null;
        render();
      } else if (action === "split-module") {
        event.stopPropagation();
        splitModule(actionTarget.dataset.moduleId);
      } else if (action === "open-replay") {
        openReplay();
      } else if (action === "close-replay") {
        stopReplayTimer();
        state.replayOpen = false;
        render();
      } else if (action === "next-replay") {
        replayNext();
      } else if (action === "auto-replay") {
        autoReplay();
      } else if (action === "next-level") {
        const next = Math.min(state.levelIndex + 1, LEVELS.length - 1);
        openLevel(next);
      }
      return;
    }

    const tokenTarget = event.target.closest("[data-token-id]");
    if (tokenTarget && state.screen === GameState.PLAYING) {
      const token = findToken(tokenTarget.dataset.tokenId);
      if (token) {
        state.clickedTokens.add(token.id);
        state.tokenPopover = token;
        render();
      }
      return;
    }

    const tacticCard = event.target.closest('.module-card[data-tactic="true"]');
    if (tacticCard && state.screen === GameState.PLAYING) {
      clickTactic(tacticCard.dataset.moduleId);
    }
  }

  function openLevel(index) {
    if (!Number.isFinite(index)) index = 0;
    if (index > progress.unlockedLevelIndex) return;
    stopReplayTimer();
    state = {
      screen: GameState.LEVEL_INTRO,
      levelIndex: Math.max(0, Math.min(index, LEVELS.length - 1))
    };
    progress.lastPlayedLevelId = LEVELS[state.levelIndex].id;
    saveProgress();
    render();
  }

  function startLevel(index) {
    const level = LEVELS[index];
    stopReplayTimer();
    state = {
      screen: GameState.PLAYING,
      phase: GameState.PLAYING,
      levelIndex: index,
      modules: clone(level.initialModules),
      products: [],
      machineInputs: {},
      constructorInputs: {},
      subgoals: null,
      goalCurrentType: level.goal.requiredType,
      goalFilledBy: null,
      stepIndex: 0,
      trace: [],
      clickedTokens: new Set(),
      activeTokenRefs: [],
      hintIndex: 0,
      toast: null,
      tokenPopover: null,
      completed: false,
      replayOpen: false,
      replayIndex: 0,
      flashId: "",
      badZoneKey: "",
      badModuleId: ""
    };
    progress.lastPlayedLevelId = level.id;
    saveProgress();
    render();
  }

  function activeLineIndex() {
    if (state.replayOpen && state.trace && state.trace[state.replayIndex]) {
      return state.trace[state.replayIndex].lineIndex ?? 0;
    }
    const step = expectedStep();
    return step && step.lineIndex !== undefined ? step.lineIndex : 0;
  }

  function expectedStep() {
    const level = currentLevel();
    return level.scriptedSteps[state.stepIndex] || null;
  }

  function nextStepLabel() {
    const step = expectedStep();
    if (!step) return state.completed ? "已完成" : "准备中";
    if (step.type === "dropToGoal") return `下一步：填入目标`;
    if (step.type === "dropToSubgoal") return `下一步：填入子目标 ${step.subgoalIndex + 1}`;
    if (step.type === "dropToMachine") return `下一步：输入 ${step.machineId}`;
    if (step.type === "dropToConstructor") return `下一步：输入 ${step.constructorId}`;
    if (step.type === "clickTactic") return `下一步：点击 ${step.moduleId.replace("_", " ")}`;
    if (step.type === "splitModule") return `下一步：拆解 ${step.moduleId}`;
    return "下一步";
  }

  function findToken(id) {
    for (const line of currentLevel().codeLines) {
      const token = line.find((item) => item.id === id);
      if (token) return token;
    }
    return null;
  }

  function isTokenInReplay(tokenId) {
    if (!state.replayOpen || !state.trace || !state.trace[state.replayIndex]) return false;
    return (state.trace[state.replayIndex].tokenRefs || []).includes(tokenId);
  }

  function findModuleById(id) {
    return [...(state.modules || []), ...(state.products || [])].find((module) => module.id === id) || null;
  }

  function findMachine(id) {
    return currentLevel().machines.find((machine) => machine.id === id) || null;
  }

  function findConstructor(id) {
    return currentLevel().constructors.find((ctor) => ctor.id === id) || null;
  }

  function handlePointerDown(event) {
    const card = event.target.closest('.module-card[data-draggable="true"]');
    if (!card || state.screen !== GameState.PLAYING || state.completed) return;
    if (event.target.closest("button")) return;
    const module = findModuleById(card.dataset.moduleId);
    if (!module || module.kind !== "proof") return;
    if (!requiredTokensSatisfied()) {
      showToast("先点亮代码里的声明和目标。", "bad");
      return;
    }

    event.preventDefault();
    const rect = card.getBoundingClientRect();
    const cloneCard = card.cloneNode(true);
    cloneCard.classList.add("floating");
    cloneCard.style.width = `${rect.width}px`;
    cloneCard.style.left = `${rect.left}px`;
    cloneCard.style.top = `${rect.top}px`;
    document.body.appendChild(cloneCard);

    drag = {
      module,
      clone: cloneCard,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top
    };
    state.activeTokenRefs = module.tokenRefs || [];
    setLinkedTokens(state.activeTokenRefs);
    moveDragClone(event.clientX, event.clientY);
    updateDropHighlights(event.clientX, event.clientY);

    document.addEventListener("pointermove", handlePointerMove, { passive: false });
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointercancel", cancelDrag);
  }

  function handlePointerMove(event) {
    if (!drag) return;
    event.preventDefault();
    moveDragClone(event.clientX, event.clientY);
    updateDropHighlights(event.clientX, event.clientY);
  }

  function handlePointerUp(event) {
    if (!drag) return;
    const drop = findDropTarget(event.clientX, event.clientY);
    const module = drag.module;
    cleanupDrag();
    if (drop && drop.compatible) {
      handleDrop(module, drop.zone);
    } else if (drop && drop.zone) {
      rejectDrop(typeMismatchMessage(module, drop.zone), drop.zone, module.id);
    } else {
      state.activeTokenRefs = [];
      render();
    }
  }

  function cancelDrag() {
    cleanupDrag();
    state.activeTokenRefs = [];
    render();
  }

  function cleanupDrag() {
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
    document.removeEventListener("pointercancel", cancelDrag);
    clearDropHighlights();
    clearLinkedTokens();
    if (drag && drag.clone) drag.clone.remove();
    drag = null;
  }

  function moveDragClone(clientX, clientY) {
    if (!drag) return;
    drag.clone.style.left = `${clientX - drag.offsetX}px`;
    drag.clone.style.top = `${clientY - drag.offsetY}px`;
  }

  function updateDropHighlights(clientX, clientY) {
    clearDropHighlights();
    document.querySelectorAll(".drop-zone").forEach((zone) => {
      if (zone.dataset.zoneType === "output-preview") return;
      if (canDrop(drag.module, zone)) {
        zone.classList.add("is-compatible");
      }
    });
  }

  function clearDropHighlights() {
    document.querySelectorAll(".drop-zone.is-compatible").forEach((zone) => zone.classList.remove("is-compatible"));
  }

  function setLinkedTokens(tokenRefs) {
    clearLinkedTokens();
    tokenRefs.forEach((id) => {
      const token = app.querySelector(`[data-token-id="${CSS.escape(id)}"]`);
      if (token) token.classList.add("linked");
    });
  }

  function clearLinkedTokens() {
    app.querySelectorAll(".code-token.linked").forEach((token) => token.classList.remove("linked"));
  }

  function findDropTarget(clientX, clientY) {
    const zones = [...document.querySelectorAll(".drop-zone")].filter((zone) => zone.dataset.zoneType !== "output-preview");
    let best = null;
    let hoveredBad = null;
    for (const zone of zones) {
      const rect = zone.getBoundingClientRect();
      const inside = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
      const dx = clientX - (rect.left + rect.width / 2);
      const dy = clientY - (rect.top + rect.height / 2);
      const distance = inside ? 0 : Math.hypot(dx, dy);
      const compatible = canDrop(drag.module, zone);
      if (compatible && distance <= 48 && (!best || distance < best.distance)) {
        best = { zone, compatible: true, distance };
      } else if (inside && !compatible) {
        hoveredBad = { zone, compatible: false, distance };
      }
    }
    return best || hoveredBad;
  }

  function canDrop(module, zone) {
    if (!module || module.kind !== "proof") return false;
    const type = zone.dataset.zoneType;
    if (type === "target") {
      return !state.subgoals && module.type === state.goalCurrentType && !state.goalFilledBy;
    }
    if (type === "subgoal") {
      const goal = state.subgoals && state.subgoals[Number(zone.dataset.subgoalIndex)];
      return Boolean(goal && !goal.filledBy && module.type === goal.requiredType);
    }
    if (type === "machine") {
      const machine = findMachine(zone.dataset.machineId);
      return Boolean(machine && module.type === machine.inputType);
    }
    if (type === "constructor") {
      const ctor = findConstructor(zone.dataset.constructorId);
      const index = Number(zone.dataset.inputIndex);
      const inputs = state.constructorInputs[ctor ? ctor.id : ""] || [];
      return Boolean(ctor && !inputs[index] && module.type === ctor.inputTypes[index]);
    }
    return false;
  }

  function handleDrop(module, zone) {
    state.activeTokenRefs = [];
    const type = zone.dataset.zoneType;
    const step = expectedStep();
    if (type === "target") {
      if (!step || step.type !== "dropToGoal" || step.moduleId !== module.id || step.goalType !== state.goalCurrentType) {
        rejectDrop(sequenceMessage(step), zone, module.id);
        return;
      }
      state.goalFilledBy = module.id;
      addTrace(step, [module]);
      advanceStep();
      completeLevel();
      return;
    }

    if (type === "subgoal") {
      const index = Number(zone.dataset.subgoalIndex);
      if (!step || step.type !== "dropToSubgoal" || step.moduleId !== module.id || step.subgoalIndex !== index) {
        rejectDrop(sequenceMessage(step), zone, module.id);
        return;
      }
      state.subgoals[index].filledBy = module.id;
      addTrace(step, [module]);
      advanceStep();
      if (state.subgoals.every((goal) => goal.filledBy)) completeLevel();
      return;
    }

    if (type === "machine") {
      const machine = findMachine(zone.dataset.machineId);
      if (!step || step.type !== "dropToMachine" || step.moduleId !== module.id || step.machineId !== machine.id) {
        rejectDrop(sequenceMessage(step), zone, module.id);
        return;
      }
      state.machineInputs[machine.id] = module.id;
      const product = createMachineProduct(step, machine, module);
      addProduct(product);
      state.flashId = machine.id;
      addTrace(step, [module, product, machine]);
      advanceStep();
      pulseClear();
      return;
    }

    if (type === "constructor") {
      const ctor = findConstructor(zone.dataset.constructorId);
      const index = Number(zone.dataset.inputIndex);
      if (!step || step.type !== "dropToConstructor" || step.moduleId !== module.id || step.constructorId !== ctor.id || step.inputIndex !== index) {
        rejectDrop(sequenceMessage(step), zone, module.id);
        return;
      }
      if (!state.constructorInputs[ctor.id]) state.constructorInputs[ctor.id] = [];
      state.constructorInputs[ctor.id][index] = module.id;
      let traceModules = [module, ctor];
      if (step.outputId) {
        const product = createConstructorProduct(step, ctor);
        addProduct(product);
        state.flashId = ctor.id;
        traceModules.push(product);
        pulseClear();
      }
      addTrace(step, traceModules);
      advanceStep();
    }
  }

  function createMachineProduct(step, machine, input) {
    const lean = step.outputLean || machine.outputTemplate.replace("{input}", input.lean);
    return {
      id: step.outputId,
      kind: "proof",
      label: lean,
      type: step.outputType || machine.outputType,
      lean,
      explanation: `把 ${input.label} 交给 ${machine.label}，得到 ${step.outputType || machine.outputType} 的证明。`,
      draggable: true,
      tokenRefs: [...(machine.tokenRefs || []), ...(input.tokenRefs || [])]
    };
  }

  function createConstructorProduct(step, ctor) {
    const lean = step.outputLean || ctor.leanTemplate;
    return {
      id: step.outputId,
      kind: "proof",
      label: lean,
      type: step.outputType || ctor.outputType,
      lean,
      explanation: `${ctor.label} 合成了 ${step.outputType || ctor.outputType} 的证明。`,
      draggable: true,
      tokenRefs: ctor.tokenRefs || []
    };
  }

  function addProduct(product) {
    if (!state.products.some((module) => module.id === product.id)) {
      state.products.push(product);
    }
  }

  function splitModule(moduleId) {
    const module = findModuleById(moduleId);
    const step = expectedStep();
    if (!module || !module.canSplit) return;
    if (!step || step.type !== "splitModule" || step.moduleId !== moduleId) {
      rejectDrop(sequenceMessage(step), null, moduleId);
      return;
    }
    module.splitOutputs.forEach((output) => addProduct(clone(output)));
    state.flashId = module.id;
    addTrace(step, [module, ...module.splitOutputs]);
    advanceStep();
    pulseClear();
  }

  function clickTactic(moduleId) {
    const module = findModuleById(moduleId);
    const step = expectedStep();
    if (!module || module.kind !== "tactic") return;
    if (!step || step.type !== "clickTactic" || step.moduleId !== moduleId) {
      rejectDrop(sequenceMessage(step), null, moduleId);
      return;
    }

    if (step.tactic === "constructor") {
      state.subgoals = step.subgoals.map((requiredType) => ({ requiredType, filledBy: null }));
      state.goalFilledBy = null;
    }

    if (step.tactic === "intro") {
      state.goalCurrentType = step.nextGoalType;
      if (step.introduced && !findModuleById(step.introduced.id)) {
        state.modules.unshift(clone(step.introduced));
      }
    }

    state.flashId = moduleId;
    addTrace(step, [module, step.introduced || null]);
    advanceStep();
    pulseClear();
  }

  function advanceStep() {
    state.stepIndex += 1;
    render();
  }

  function completeLevel() {
    state.completed = true;
    state.phase = GameState.SUCCESS;
    if (!progress.completedLevels.includes(currentLevel().id)) {
      progress.completedLevels.push(currentLevel().id);
    }
    progress.unlockedLevelIndex = Math.max(progress.unlockedLevelIndex, Math.min(state.levelIndex + 1, LEVELS.length - 1));
    progress.lastPlayedLevelId = currentLevel().id;
    saveProgress();
    window.setTimeout(() => {
      if (state.completed) render();
    }, DUR.success);
    render();
  }

  function addTrace(step, modules) {
    const tokenRefs = [];
    modules.filter(Boolean).forEach((module) => {
      if (module.tokenRefs) tokenRefs.push(...module.tokenRefs);
    });
    state.trace.push({
      actionLabel: step.actionLabel || "完成一个证明动作",
      leanLine: step.leanLine || "",
      leanExpr: step.leanExpr || "",
      explanation: step.explanation || "这个动作让证明向目标前进了一步。",
      lineIndex: step.lineIndex ?? activeLineIndex(),
      tokenRefs: [...new Set(tokenRefs)]
    });
  }

  function showHint() {
    const level = currentLevel();
    const hints = level.hints || [level.hint || level.objectiveText];
    const hint = hints[state.hintIndex % hints.length];
    state.hintIndex += 1;
    showToast(hint, "");
  }

  function showToast(text, kind) {
    state.toast = { text, kind };
    render();
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      if (state.toast && state.toast.text === text) {
        state.toast = null;
        render();
      }
    }, 2100);
  }

  function rejectDrop(message, zone, moduleId) {
    state.badZoneKey = zone ? zone.dataset.zoneKey : "";
    state.badModuleId = moduleId || "";
    state.toast = { text: message, kind: "bad" };
    render();
    window.setTimeout(() => {
      state.badZoneKey = "";
      state.badModuleId = "";
      if (state.toast && state.toast.text === message) state.toast = null;
      render();
    }, DUR.shake + 900);
  }

  function typeMismatchMessage(module, zone) {
    const required = zone.dataset.requiredType || "正确类型";
    return `类型不匹配：这里需要 proof of ${required}，但你放入的是 proof of ${module.type}。`;
  }

  function sequenceMessage(step) {
    if (!step) return "这一步还不能放在这里。";
    if (step.type === "dropToMachine") return `当前步骤需要把 ${step.moduleId} 输入 ${step.machineId}。`;
    if (step.type === "dropToConstructor") return `当前步骤需要把 ${step.moduleId} 放入第 ${step.inputIndex + 1} 个输入口。`;
    if (step.type === "dropToGoal") return `当前步骤需要把 ${step.moduleId} 放入目标。`;
    if (step.type === "dropToSubgoal") return `当前步骤需要把 ${step.moduleId} 放入子目标 ${step.subgoalIndex + 1}。`;
    if (step.type === "clickTactic") return `当前步骤需要点击 ${step.moduleId.replace("_", " ")}。`;
    if (step.type === "splitModule") return `当前步骤需要拆解 ${step.moduleId}。`;
    return "请按高亮步骤继续。";
  }

  function requiredTokensSatisfied() {
    const required = currentLevel().requiredTokenClicks || [];
    return required.every((id) => state.clickedTokens && state.clickedTokens.has(id));
  }

  function isExpectedTactic(moduleId) {
    const step = expectedStep();
    return Boolean(step && step.type === "clickTactic" && step.moduleId === moduleId);
  }

  function zoneKey(parts) {
    if (parts.type === "target") return "target";
    if (parts.type === "subgoal") return `subgoal:${parts.subgoalIndex}`;
    if (parts.type === "machine") return `machine:${parts.machineId}`;
    if (parts.type === "constructor") return `constructor:${parts.constructorId}:${parts.inputIndex}`;
    return "zone";
  }

  function pulseClear() {
    window.setTimeout(() => {
      state.flashId = "";
      if (!drag) render();
    }, DUR.combine);
  }

  function openReplay() {
    stopReplayTimer();
    state.replayOpen = true;
    state.replayIndex = 0;
    render();
  }

  function replayNext() {
    if (!state.trace || !state.trace.length) return;
    if (state.replayIndex < state.trace.length - 1) {
      state.replayIndex += 1;
    } else {
      stopReplayTimer();
    }
    render();
  }

  function autoReplay() {
    stopReplayTimer();
    state.replayIndex = 0;
    render();
    replayTimer = window.setInterval(() => {
      if (!state.replayOpen || state.replayIndex >= state.trace.length - 1) {
        stopReplayTimer();
        render();
      } else {
        state.replayIndex += 1;
        render();
      }
    }, 900);
  }

  function stopReplayTimer() {
    if (replayTimer) {
      window.clearInterval(replayTimer);
      replayTimer = null;
    }
  }

  function clearReplayTimerIfClosed() {
    if (!state.replayOpen) stopReplayTimer();
  }
})();
