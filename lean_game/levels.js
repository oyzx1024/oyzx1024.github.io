window.LEAN_PROOF_ALCHEMY_LEVELS = [
  {
    id: "L01_exact_P",
    title: "第一块证明石",
    chapter: "第 1 章：直接匹配 exact",
    visualLevel: 1,
    objectiveText: "制造 proof of P。",
    learningFocus: "理解 hP : P 可以直接证明目标 P。",
    goal: { requiredType: "P", label: "目标：proof of P" },
    codeLines: [
      [
        { id: "L01_exact", text: "exact", explain: "exact 用已有证明关闭当前目标。" },
        { id: "L01_hP_code", text: " hP", explain: "这里使用已有证明 hP。" }
      ]
    ],
    initialModules: [
      { id: "hP", kind: "proof", label: "hP", type: "P", lean: "hP", explanation: "hP 是一个 P 的证明。", draggable: true, tokenRefs: ["L01_hP_code"] }
    ],
    machines: [],
    constructors: [],
    scriptedSteps: [
      { type: "dropToGoal", moduleId: "hP", goalType: "P", lineIndex: 0, leanLine: "exact hP", actionLabel: "把 hP : P 放入目标 P", explanation: "hP 的类型正好是 P，所以 exact hP 关闭目标。" }
    ],
    hints: ["你需要制造 proof of P。", "仓库里有 hP : P。", "把 hP 拖到目标槽。"],
    hint: "把 hP : P 拖到目标槽。",
    successText: "你完成了第一个 Lean 证明：exact hP。"
  },
  {
    id: "L02_exact_Q",
    title: "换一个名字",
    chapter: "第 1 章：直接匹配 exact",
    visualLevel: 1,
    objectiveText: "制造 proof of Q。",
    learningFocus: "名字可以不同，关键是类型匹配。",
    goal: { requiredType: "Q", label: "目标：proof of Q" },
    codeLines: [
      [
        { id: "L02_exact", text: "exact", explain: "exact 用已有证明关闭当前目标。" },
        { id: "L02_hQ_code", text: " hQ", explain: "hQ 是 Q 的一个证明。" }
      ]
    ],
    initialModules: [
      { id: "hQ", kind: "proof", label: "hQ", type: "Q", lean: "hQ", explanation: "hQ 是一个 Q 的证明。", draggable: true, tokenRefs: ["L02_hQ_code"] }
    ],
    machines: [],
    constructors: [],
    scriptedSteps: [
      { type: "dropToGoal", moduleId: "hQ", goalType: "Q", lineIndex: 0, leanLine: "exact hQ", actionLabel: "把 hQ : Q 放入目标 Q", explanation: "目标需要 Q，hQ 的类型也是 Q。" }
    ],
    hints: ["目标需要 proof of Q。", "名字不是重点，类型才是。", "把 hQ 拖到目标槽。"],
    hint: "把 hQ 拖到目标槽。",
    successText: "Lean 看类型。这里 exact hQ 正好匹配。"
  },
  {
    id: "L03_type_mismatch",
    title: "类型不匹配演示",
    chapter: "第 1 章：直接匹配 exact",
    visualLevel: 1,
    objectiveText: "制造 proof of Q。",
    learningFocus: "Lean 看的是类型是否匹配。",
    goal: { requiredType: "Q", label: "目标：proof of Q" },
    codeLines: [
      [
        { id: "L03_exact", text: "exact", explain: "exact 用一个证明关闭目标。" },
        { id: "L03_hQ_code", text: " hQ", explain: "这里必须使用 Q 的证明。" }
      ]
    ],
    initialModules: [
      { id: "hP", kind: "proof", label: "hP", type: "P", lean: "hP", explanation: "hP 是 P 的证明，不是 Q。", draggable: true, tokenRefs: [] },
      { id: "hQ", kind: "proof", label: "hQ", type: "Q", lean: "hQ", explanation: "hQ 是 Q 的证明。", draggable: true, tokenRefs: ["L03_hQ_code"] }
    ],
    machines: [],
    constructors: [],
    scriptedSteps: [
      { type: "dropToGoal", moduleId: "hQ", goalType: "Q", lineIndex: 0, leanLine: "exact hQ", actionLabel: "把 hQ : Q 放入目标 Q", explanation: "hP 的类型是 P。目标要 Q，所以要使用 hQ。" }
    ],
    hints: ["目标需要 proof of Q。", "hP 是 P，不能填 Q。", "把 hQ 拖到目标槽。"],
    hint: "把 hQ 拖到目标槽。",
    successText: "类型匹配时，目标才会关闭。"
  },
  {
    id: "L04_transform",
    title: "证明转换器",
    chapter: "第 2 章：蕴含作为转换机器",
    visualLevel: 1,
    objectiveText: "制造 proof of Q。",
    learningFocus: "hPQ hP 是把 hP 交给 hPQ。",
    goal: { requiredType: "Q", label: "目标：proof of Q" },
    codeLines: [
      [
        { id: "L04_exact", text: "exact", explain: "exact 使用后面的证明表达式关闭目标。" },
        { id: "L04_hPQ_code", text: " hPQ", explain: "hPQ : P → Q。给它 P，就会得到 Q。" },
        { id: "L04_hP_code", text: " hP", explain: "hP : P，正好能作为 hPQ 的输入。" }
      ]
    ],
    initialModules: [
      { id: "hP", kind: "proof", label: "hP", type: "P", lean: "hP", explanation: "hP 是 P 的证明。", draggable: true, tokenRefs: ["L04_hP_code"] }
    ],
    machines: [
      { id: "hPQ", kind: "transform", label: "hPQ", inputType: "P", outputType: "Q", type: "P → Q", lean: "hPQ", outputTemplate: "hPQ {input}", explanation: "hPQ 可以把 P 的证明变成 Q 的证明。", tokenRefs: ["L04_hPQ_code"] }
    ],
    constructors: [],
    scriptedSteps: [
      { type: "dropToMachine", moduleId: "hP", machineId: "hPQ", outputId: "prod_hPQ_hP", outputLean: "hPQ hP", outputType: "Q", lineIndex: 0, leanExpr: "hPQ hP", actionLabel: "把 hP 输入 hPQ", explanation: "hPQ : P → Q，hP : P，因此 hPQ hP : Q。" },
      { type: "dropToGoal", moduleId: "prod_hPQ_hP", goalType: "Q", lineIndex: 0, leanLine: "exact hPQ hP", actionLabel: "把 hPQ hP : Q 放入目标 Q", explanation: "生成的 proof module 类型是 Q，正好关闭目标。" }
    ],
    hints: ["你需要制造 proof of Q。", "hPQ 的输入口需要 P。看看谁是 proof of P。", "把 hP 拖进 hPQ，然后把生成的 hPQ hP 放入目标槽。"],
    hint: "把 hP 输入 hPQ。",
    successText: "hPQ hP 不是魔法。它是一次证明转换。"
  },
  {
    id: "L05_chain",
    title: "两步转换",
    chapter: "第 2 章：蕴含作为转换机器",
    visualLevel: 1,
    objectiveText: "制造 proof of R。",
    learningFocus: "证明可以嵌套组合。",
    goal: { requiredType: "R", label: "目标：proof of R" },
    codeLines: [
      [
        { id: "L05_exact", text: "exact", explain: "exact 使用完整证明表达式关闭目标。" },
        { id: "L05_hQR_code", text: " hQR", explain: "hQR : Q → R。它需要 Q 的证明。" },
        { id: "L05_open", text: " (", explain: "括号把先生成 Q 的过程包起来。" },
        { id: "L05_hPQ_code", text: "hPQ", explain: "hPQ : P → Q。它先把 P 变成 Q。" },
        { id: "L05_hP_code", text: " hP", explain: "hP : P，是第一台机器的输入。" },
        { id: "L05_close", text: ")", explain: "里面先得到 Q，再交给 hQR。" }
      ]
    ],
    initialModules: [
      { id: "hP", kind: "proof", label: "hP", type: "P", lean: "hP", explanation: "hP 是 P 的证明。", draggable: true, tokenRefs: ["L05_hP_code"] }
    ],
    machines: [
      { id: "hPQ", kind: "transform", label: "hPQ", inputType: "P", outputType: "Q", type: "P → Q", lean: "hPQ", outputTemplate: "hPQ {input}", explanation: "hPQ 把 P 的证明变成 Q 的证明。", tokenRefs: ["L05_hPQ_code"] },
      { id: "hQR", kind: "transform", label: "hQR", inputType: "Q", outputType: "R", type: "Q → R", lean: "hQR", outputTemplate: "hQR ({input})", explanation: "hQR 把 Q 的证明变成 R 的证明。", tokenRefs: ["L05_hQR_code"] }
    ],
    constructors: [],
    scriptedSteps: [
      { type: "dropToMachine", moduleId: "hP", machineId: "hPQ", outputId: "prod_hPQ_hP", outputLean: "hPQ hP", outputType: "Q", lineIndex: 0, leanExpr: "hPQ hP", actionLabel: "先制造 hPQ hP : Q", explanation: "hPQ 需要 P。输入 hP 后，得到 Q 的证明。" },
      { type: "dropToMachine", moduleId: "prod_hPQ_hP", machineId: "hQR", outputId: "prod_hQR_hPQ_hP", outputLean: "hQR (hPQ hP)", outputType: "R", lineIndex: 0, leanExpr: "hQR (hPQ hP)", actionLabel: "把 Q 的证明输入 hQR", explanation: "hQR 需要 Q。刚生成的 hPQ hP 正好是 Q。" },
      { type: "dropToGoal", moduleId: "prod_hQR_hPQ_hP", goalType: "R", lineIndex: 0, leanLine: "exact hQR (hPQ hP)", actionLabel: "把 R 的证明放入目标", explanation: "最后得到的 proof module 类型是 R。" }
    ],
    hints: ["目标需要 proof of R。", "先用 hPQ 把 P 变成 Q，再用 hQR 把 Q 变成 R。", "顺序是 hP → hPQ → hQR → 目标。"],
    hint: "先制造 Q，再制造 R。",
    successText: "你完成了一段嵌套证明：hQR (hPQ hP)。"
  },
  {
    id: "L06_machine_input",
    title: "机器也需要正确输入",
    chapter: "第 2 章：蕴含作为转换机器",
    visualLevel: 1,
    objectiveText: "制造 proof of Q。",
    learningFocus: "P → Q 的输入口只接受 proof of P。",
    goal: { requiredType: "Q", label: "目标：proof of Q" },
    codeLines: [
      [
        { id: "L06_exact", text: "exact", explain: "exact 使用后面的证明表达式关闭目标。" },
        { id: "L06_hPQ_code", text: " hPQ", explain: "hPQ 的输入类型是 P。" },
        { id: "L06_hP_code", text: " hP", explain: "hP 正好是 P 的证明。" }
      ]
    ],
    initialModules: [
      { id: "hR", kind: "proof", label: "hR", type: "R", lean: "hR", explanation: "hR 是 R 的证明，不能输入 P → Q。", draggable: true, tokenRefs: [] },
      { id: "hP", kind: "proof", label: "hP", type: "P", lean: "hP", explanation: "hP 是 P 的证明。", draggable: true, tokenRefs: ["L06_hP_code"] }
    ],
    machines: [
      { id: "hPQ", kind: "transform", label: "hPQ", inputType: "P", outputType: "Q", type: "P → Q", lean: "hPQ", outputTemplate: "hPQ {input}", explanation: "hPQ 只接受 P 的证明。", tokenRefs: ["L06_hPQ_code"] }
    ],
    constructors: [],
    scriptedSteps: [
      { type: "dropToMachine", moduleId: "hP", machineId: "hPQ", outputId: "prod_hPQ_hP", outputLean: "hPQ hP", outputType: "Q", lineIndex: 0, leanExpr: "hPQ hP", actionLabel: "把 hP 输入 hPQ", explanation: "hR 的类型是 R。hPQ 的输入口需要 P，所以要用 hP。" },
      { type: "dropToGoal", moduleId: "prod_hPQ_hP", goalType: "Q", lineIndex: 0, leanLine: "exact hPQ hP", actionLabel: "把 hPQ hP : Q 放入目标", explanation: "生成的 Q 证明关闭目标。" }
    ],
    hints: ["目标需要 proof of Q。", "hPQ 的输入口写着 P。", "把 hP 拖进 hPQ，不是 hR。"],
    hint: "hPQ 需要 P。",
    successText: "机器的输入类型必须对上。"
  },
  {
    id: "L07_and_intro",
    title: "合成双证明",
    chapter: "第 3 章：合取构造",
    visualLevel: 1,
    objectiveText: "制造 proof of P ∧ Q。",
    learningFocus: "合取证明由两个证明组成。",
    goal: { requiredType: "P ∧ Q", label: "目标：proof of P ∧ Q" },
    codeLines: [
      [
        { id: "L07_exact", text: "exact", explain: "exact 可以使用一个构造出来的证明。" },
        { id: "L07_and", text: " And.intro", explain: "And.intro 把两个证明合成一个合取证明。" },
        { id: "L07_hP_code", text: " hP", explain: "第一个输入是 P 的证明。" },
        { id: "L07_hQ_code", text: " hQ", explain: "第二个输入是 Q 的证明。" }
      ]
    ],
    initialModules: [
      { id: "hP", kind: "proof", label: "hP", type: "P", lean: "hP", explanation: "hP 是 P 的证明。", draggable: true, tokenRefs: ["L07_hP_code"] },
      { id: "hQ", kind: "proof", label: "hQ", type: "Q", lean: "hQ", explanation: "hQ 是 Q 的证明。", draggable: true, tokenRefs: ["L07_hQ_code"] }
    ],
    machines: [],
    constructors: [
      { id: "andIntro", kind: "constructor", label: "And.intro", inputTypes: ["P", "Q"], outputType: "P ∧ Q", leanTemplate: "And.intro {0} {1}", explanation: "And.intro 把 P 的证明和 Q 的证明合成 P ∧ Q 的证明。", tokenRefs: ["L07_and"] }
    ],
    scriptedSteps: [
      { type: "dropToConstructor", moduleId: "hP", constructorId: "andIntro", inputIndex: 0, lineIndex: 0, leanExpr: "And.intro hP ...", actionLabel: "把 hP 放入第一个输入口", explanation: "And.intro 的第一个输入口需要 proof of P。" },
      { type: "dropToConstructor", moduleId: "hQ", constructorId: "andIntro", inputIndex: 1, outputId: "prod_and_hP_hQ", outputLean: "And.intro hP hQ", outputType: "P ∧ Q", lineIndex: 0, leanExpr: "And.intro hP hQ", actionLabel: "把 hQ 放入第二个输入口", explanation: "两个输入都齐了，得到 P ∧ Q 的证明。" },
      { type: "dropToGoal", moduleId: "prod_and_hP_hQ", goalType: "P ∧ Q", lineIndex: 0, leanLine: "exact And.intro hP hQ", actionLabel: "把合取证明放入目标", explanation: "And.intro hP hQ 的类型正好是 P ∧ Q。" }
    ],
    hints: ["目标需要 proof of P ∧ Q。", "And.intro 有两个输入口：P 和 Q。", "把 hP、hQ 依次放入 And.intro，再把成品放入目标。"],
    hint: "用 And.intro 合成两个证明。",
    successText: "合取证明需要左右两边都成立。"
  },
  {
    id: "L08_and_order",
    title: "顺序重要",
    chapter: "第 3 章：合取构造",
    visualLevel: 1,
    objectiveText: "制造 proof of Q ∧ P。",
    learningFocus: "P ∧ Q 和 Q ∧ P 需要按目标顺序构造。",
    goal: { requiredType: "Q ∧ P", label: "目标：proof of Q ∧ P" },
    codeLines: [
      [
        { id: "L08_exact", text: "exact", explain: "exact 使用构造出的合取证明。" },
        { id: "L08_and", text: " And.intro", explain: "And.intro 的输入顺序跟目标顺序一致。" },
        { id: "L08_hQ_code", text: " hQ", explain: "这次左边需要 Q。" },
        { id: "L08_hP_code", text: " hP", explain: "右边需要 P。" }
      ]
    ],
    initialModules: [
      { id: "hP", kind: "proof", label: "hP", type: "P", lean: "hP", explanation: "hP 是 P 的证明。", draggable: true, tokenRefs: ["L08_hP_code"] },
      { id: "hQ", kind: "proof", label: "hQ", type: "Q", lean: "hQ", explanation: "hQ 是 Q 的证明。", draggable: true, tokenRefs: ["L08_hQ_code"] }
    ],
    machines: [],
    constructors: [
      { id: "andIntro", kind: "constructor", label: "And.intro", inputTypes: ["Q", "P"], outputType: "Q ∧ P", leanTemplate: "And.intro {0} {1}", explanation: "这个 And.intro 先要 Q，再要 P。", tokenRefs: ["L08_and"] }
    ],
    scriptedSteps: [
      { type: "dropToConstructor", moduleId: "hQ", constructorId: "andIntro", inputIndex: 0, lineIndex: 0, leanExpr: "And.intro hQ ...", actionLabel: "把 hQ 放入 Q 输入口", explanation: "目标左边是 Q，所以第一个输入用 hQ。" },
      { type: "dropToConstructor", moduleId: "hP", constructorId: "andIntro", inputIndex: 1, outputId: "prod_and_hQ_hP", outputLean: "And.intro hQ hP", outputType: "Q ∧ P", lineIndex: 0, leanExpr: "And.intro hQ hP", actionLabel: "把 hP 放入 P 输入口", explanation: "第二个输入是 P，得到 Q ∧ P 的证明。" },
      { type: "dropToGoal", moduleId: "prod_and_hQ_hP", goalType: "Q ∧ P", lineIndex: 0, leanLine: "exact And.intro hQ hP", actionLabel: "把 Q ∧ P 放入目标", explanation: "成品类型与目标完全一致。" }
    ],
    hints: ["目标是 Q ∧ P。", "先填 Q，再填 P。", "把 hQ、hP 放入 And.intro，再放入目标。"],
    hint: "这次顺序是 hQ 然后 hP。",
    successText: "合取的左右顺序在这里要严格对上。"
  },
  {
    id: "L09_constructor",
    title: "constructor 的第一次出现",
    chapter: "第 3 章：合取构造",
    visualLevel: 2,
    objectiveText: "制造 proof of P ∧ Q。",
    learningFocus: "constructor 可以把合取目标拆成两个子目标。",
    goal: { requiredType: "P ∧ Q", label: "目标：proof of P ∧ Q" },
    codeLines: [
      [
        { id: "L09_by", text: "by", explain: "by 后面开始写证明步骤。" }
      ],
      [
        { id: "L09_constructor", text: "  constructor", explain: "constructor 把 P ∧ Q 拆成 P 和 Q 两个子目标。" }
      ],
      [
        { id: "L09_b1", text: "  ·", explain: "圆点表示一个子目标分支。" },
        { id: "L09_exact1", text: " exact", explain: "用已有证明关闭这个子目标。" },
        { id: "L09_hP_code", text: " hP", explain: "hP 关闭 P 子目标。" }
      ],
      [
        { id: "L09_b2", text: "  ·", explain: "这是第二个子目标分支。" },
        { id: "L09_exact2", text: " exact", explain: "用已有证明关闭这个子目标。" },
        { id: "L09_hQ_code", text: " hQ", explain: "hQ 关闭 Q 子目标。" }
      ]
    ],
    initialModules: [
      { id: "constructor", kind: "tactic", label: "constructor", type: "拆合取目标", lean: "constructor", tacticType: "constructor", explanation: "constructor 把合取目标拆成两个子目标。", tokenRefs: ["L09_constructor"] },
      { id: "hP", kind: "proof", label: "hP", type: "P", lean: "hP", explanation: "hP 是 P 的证明。", draggable: true, tokenRefs: ["L09_hP_code"] },
      { id: "hQ", kind: "proof", label: "hQ", type: "Q", lean: "hQ", explanation: "hQ 是 Q 的证明。", draggable: true, tokenRefs: ["L09_hQ_code"] }
    ],
    machines: [],
    constructors: [],
    scriptedSteps: [
      { type: "clickTactic", moduleId: "constructor", tactic: "constructor", subgoals: ["P", "Q"], lineIndex: 1, leanLine: "constructor", actionLabel: "点击 constructor", explanation: "目标 P ∧ Q 被拆成 P 和 Q 两个子目标。" },
      { type: "dropToSubgoal", moduleId: "hP", subgoalIndex: 0, goalType: "P", lineIndex: 2, leanLine: "exact hP", actionLabel: "用 hP 完成第一个子目标", explanation: "第一个子目标需要 P，hP 正好匹配。" },
      { type: "dropToSubgoal", moduleId: "hQ", subgoalIndex: 1, goalType: "Q", lineIndex: 3, leanLine: "exact hQ", actionLabel: "用 hQ 完成第二个子目标", explanation: "第二个子目标需要 Q，hQ 正好匹配。" }
    ],
    hints: ["目标是 P ∧ Q。", "constructor 会把目标拆成 P 和 Q。", "点击 constructor，再把 hP 和 hQ 放入对应子目标。"],
    hint: "先点击 constructor。",
    successText: "constructor 把一个合取目标变成两个小目标。"
  },
  {
    id: "L10_left",
    title: "打开合取盒子左边",
    chapter: "第 4 章：合取拆解",
    visualLevel: 2,
    objectiveText: "制造 proof of P。",
    learningFocus: "合取假设可以取出左侧证明。",
    goal: { requiredType: "P", label: "目标：proof of P" },
    codeLines: [
      [
        { id: "L10_by", text: "by", explain: "by 后面是证明步骤。" }
      ],
      [
        { id: "L10_exact", text: "  exact", explain: "exact 关闭当前目标。" },
        { id: "L10_left_code", text: " h.left", explain: "h.left 是 h : P ∧ Q 的左边，也就是 P。" }
      ]
    ],
    initialModules: [
      { id: "h", kind: "proof", label: "h", type: "P ∧ Q", lean: "h", explanation: "h 同时包含 P 和 Q 的证明。", draggable: true, canSplit: true, splitOutputs: [
        { id: "h_left", kind: "proof", label: "h.left", type: "P", lean: "h.left", explanation: "h.left 是 P 的证明。", draggable: true, tokenRefs: ["L10_left_code"] },
        { id: "h_right", kind: "proof", label: "h.right", type: "Q", lean: "h.right", explanation: "h.right 是 Q 的证明。", draggable: true, tokenRefs: [] }
      ], tokenRefs: ["L10_left_code"] }
    ],
    machines: [],
    constructors: [],
    scriptedSteps: [
      { type: "splitModule", moduleId: "h", lineIndex: 1, leanExpr: "h.left / h.right", actionLabel: "拆解 h : P ∧ Q", explanation: "从 h 里弹出 h.left : P 和 h.right : Q。" },
      { type: "dropToGoal", moduleId: "h_left", goalType: "P", lineIndex: 1, leanLine: "exact h.left", actionLabel: "把 h.left 放入目标", explanation: "h.left 的类型是 P，正好完成目标。" }
    ],
    hints: ["目标需要 proof of P。", "h : P ∧ Q 可以拆出左边和右边。", "点 h 上的拆解，再把 h.left 放入目标。"],
    hint: "拆解 h，使用 h.left。",
    successText: "从合取假设中取左边：h.left。"
  },
  {
    id: "L11_right",
    title: "打开合取盒子右边",
    chapter: "第 4 章：合取拆解",
    visualLevel: 2,
    objectiveText: "制造 proof of Q。",
    learningFocus: "合取假设可以取出右侧证明。",
    goal: { requiredType: "Q", label: "目标：proof of Q" },
    codeLines: [
      [
        { id: "L11_by", text: "by", explain: "by 后面是证明步骤。" }
      ],
      [
        { id: "L11_exact", text: "  exact", explain: "exact 关闭当前目标。" },
        { id: "L11_right_code", text: " h.right", explain: "h.right 是 h : P ∧ Q 的右边，也就是 Q。" }
      ]
    ],
    initialModules: [
      { id: "h", kind: "proof", label: "h", type: "P ∧ Q", lean: "h", explanation: "h 同时包含 P 和 Q 的证明。", draggable: true, canSplit: true, splitOutputs: [
        { id: "h_left", kind: "proof", label: "h.left", type: "P", lean: "h.left", explanation: "h.left 是 P 的证明。", draggable: true, tokenRefs: [] },
        { id: "h_right", kind: "proof", label: "h.right", type: "Q", lean: "h.right", explanation: "h.right 是 Q 的证明。", draggable: true, tokenRefs: ["L11_right_code"] }
      ], tokenRefs: ["L11_right_code"] }
    ],
    machines: [],
    constructors: [],
    scriptedSteps: [
      { type: "splitModule", moduleId: "h", lineIndex: 1, leanExpr: "h.left / h.right", actionLabel: "拆解 h : P ∧ Q", explanation: "从 h 里弹出 h.left : P 和 h.right : Q。" },
      { type: "dropToGoal", moduleId: "h_right", goalType: "Q", lineIndex: 1, leanLine: "exact h.right", actionLabel: "把 h.right 放入目标", explanation: "h.right 的类型是 Q，正好完成目标。" }
    ],
    hints: ["目标需要 proof of Q。", "h.right 是右边的 Q。", "拆解 h，再把 h.right 放入目标。"],
    hint: "拆解 h，使用 h.right。",
    successText: "从合取假设中取右边：h.right。"
  },
  {
    id: "L12_swap_and",
    title: "交换合取",
    chapter: "第 4 章：合取拆解",
    visualLevel: 2,
    objectiveText: "制造 proof of Q ∧ P。",
    learningFocus: "先拆再合成，是很多证明的基本模式。",
    goal: { requiredType: "Q ∧ P", label: "目标：proof of Q ∧ P" },
    codeLines: [
      [
        { id: "L12_by", text: "by", explain: "by 后面是证明步骤。" }
      ],
      [
        { id: "L12_exact", text: "  exact", explain: "exact 使用构造出的证明。" },
        { id: "L12_and", text: " And.intro", explain: "And.intro 合成一个 Q ∧ P。" },
        { id: "L12_right_code", text: " h.right", explain: "h.right 是 Q，要放在左边。" },
        { id: "L12_left_code", text: " h.left", explain: "h.left 是 P，要放在右边。" }
      ]
    ],
    initialModules: [
      { id: "h", kind: "proof", label: "h", type: "P ∧ Q", lean: "h", explanation: "h 同时包含 P 和 Q 的证明。", draggable: true, canSplit: true, splitOutputs: [
        { id: "h_left", kind: "proof", label: "h.left", type: "P", lean: "h.left", explanation: "h.left 是 P 的证明。", draggable: true, tokenRefs: ["L12_left_code"] },
        { id: "h_right", kind: "proof", label: "h.right", type: "Q", lean: "h.right", explanation: "h.right 是 Q 的证明。", draggable: true, tokenRefs: ["L12_right_code"] }
      ], tokenRefs: ["L12_left_code", "L12_right_code"] }
    ],
    machines: [],
    constructors: [
      { id: "andIntro", kind: "constructor", label: "And.intro", inputTypes: ["Q", "P"], outputType: "Q ∧ P", leanTemplate: "And.intro {0} {1}", explanation: "先输入 Q，再输入 P。", tokenRefs: ["L12_and"] }
    ],
    scriptedSteps: [
      { type: "splitModule", moduleId: "h", lineIndex: 1, leanExpr: "h.left / h.right", actionLabel: "拆解 h : P ∧ Q", explanation: "先得到 h.left : P 和 h.right : Q。" },
      { type: "dropToConstructor", moduleId: "h_right", constructorId: "andIntro", inputIndex: 0, lineIndex: 1, leanExpr: "And.intro h.right ...", actionLabel: "把 h.right 放入 Q 输入口", explanation: "目标左边是 Q，所以先放 h.right。" },
      { type: "dropToConstructor", moduleId: "h_left", constructorId: "andIntro", inputIndex: 1, outputId: "prod_and_hright_hleft", outputLean: "And.intro h.right h.left", outputType: "Q ∧ P", lineIndex: 1, leanExpr: "And.intro h.right h.left", actionLabel: "把 h.left 放入 P 输入口", explanation: "现在得到 Q ∧ P 的证明。" },
      { type: "dropToGoal", moduleId: "prod_and_hright_hleft", goalType: "Q ∧ P", lineIndex: 1, leanLine: "exact And.intro h.right h.left", actionLabel: "把 Q ∧ P 放入目标", explanation: "成品类型与目标完全一致。" }
    ],
    hints: ["目标是 Q ∧ P。", "先把 h 拆成 h.left 和 h.right。", "用 And.intro 按 h.right、h.left 的顺序合成。"],
    hint: "拆解后按 Q、P 顺序重新合成。",
    successText: "先拆再合，是 Lean 证明里常见的动作。"
  },
  {
    id: "L13_intro_identity",
    title: "制造一个恒等函数",
    chapter: "第 5 章：引入前提 intro",
    visualLevel: 2,
    objectiveText: "制造 proof of P → P。",
    learningFocus: "证明 P → P 时，可以假设 P，再证明 P。",
    goal: { requiredType: "P → P", label: "目标：proof of P → P" },
    codeLines: [
      [
        { id: "L13_by", text: "by", explain: "by 后面开始写 tactic 证明。" }
      ],
      [
        { id: "L13_intro", text: "  intro hP", explain: "intro hP 把前提 P 变成一个可用资源 hP : P。" }
      ],
      [
        { id: "L13_exact", text: "  exact", explain: "exact 关闭当前目标。" },
        { id: "L13_hP_code", text: " hP", explain: "引入后的 hP 正好证明 P。" }
      ]
    ],
    initialModules: [
      { id: "intro_hP", kind: "tactic", label: "intro hP", type: "引入 P", lean: "intro hP", tacticType: "intro", explanation: "intro hP 把 P → P 的前提 P 放进仓库。", tokenRefs: ["L13_intro"] }
    ],
    machines: [],
    constructors: [],
    scriptedSteps: [
      { type: "clickTactic", moduleId: "intro_hP", tactic: "intro", nextGoalType: "P", introduced: { id: "hP", kind: "proof", label: "hP", type: "P", lean: "hP", explanation: "hP 是刚引入的 P 的证明。", draggable: true, tokenRefs: ["L13_hP_code"] }, lineIndex: 1, leanLine: "intro hP", actionLabel: "点击 intro hP", explanation: "前提 P 变成资源 hP : P，目标变成 P。" },
      { type: "dropToGoal", moduleId: "hP", goalType: "P", lineIndex: 2, leanLine: "exact hP", actionLabel: "用 hP 完成目标 P", explanation: "引入后的 hP 正好证明当前目标。" }
    ],
    hints: ["目标是 P → P。", "intro 会把箭头左边的 P 变成资源。", "点击 intro hP，再把 hP 放入目标。"],
    hint: "先点击 intro hP。",
    successText: "证明箭头时，intro 把前提变成可用证明。"
  },
  {
    id: "L14_intro_transform",
    title: "引入后使用转换器",
    chapter: "第 5 章：引入前提 intro",
    visualLevel: 2,
    objectiveText: "制造 proof of P → Q。",
    learningFocus: "intro 把前提变成可用资源。",
    goal: { requiredType: "P → Q", label: "目标：proof of P → Q" },
    codeLines: [
      [
        { id: "L14_by", text: "by", explain: "by 后面开始写 tactic 证明。" }
      ],
      [
        { id: "L14_intro", text: "  intro hP", explain: "intro hP 引入 P 的证明。" }
      ],
      [
        { id: "L14_exact", text: "  exact", explain: "exact 使用生成的 Q 证明关闭目标。" },
        { id: "L14_hPQ_code", text: " hPQ", explain: "hPQ : P → Q。" },
        { id: "L14_hP_code", text: " hP", explain: "hP 是 intro 得到的 P 证明。" }
      ]
    ],
    initialModules: [
      { id: "intro_hP", kind: "tactic", label: "intro hP", type: "引入 P", lean: "intro hP", tacticType: "intro", explanation: "intro hP 把 P → Q 的前提 P 放进仓库。", tokenRefs: ["L14_intro"] }
    ],
    machines: [
      { id: "hPQ", kind: "transform", label: "hPQ", inputType: "P", outputType: "Q", type: "P → Q", lean: "hPQ", outputTemplate: "hPQ {input}", explanation: "hPQ 把 P 的证明变成 Q 的证明。", tokenRefs: ["L14_hPQ_code"] }
    ],
    constructors: [],
    scriptedSteps: [
      { type: "clickTactic", moduleId: "intro_hP", tactic: "intro", nextGoalType: "Q", introduced: { id: "hP", kind: "proof", label: "hP", type: "P", lean: "hP", explanation: "hP 是刚引入的 P 的证明。", draggable: true, tokenRefs: ["L14_hP_code"] }, lineIndex: 1, leanLine: "intro hP", actionLabel: "点击 intro hP", explanation: "前提 P 变成资源 hP : P，目标变成 Q。" },
      { type: "dropToMachine", moduleId: "hP", machineId: "hPQ", outputId: "prod_hPQ_hP", outputLean: "hPQ hP", outputType: "Q", lineIndex: 2, leanExpr: "hPQ hP", actionLabel: "把 hP 输入 hPQ", explanation: "hPQ 需要 P，intro 刚给了 hP : P。" },
      { type: "dropToGoal", moduleId: "prod_hPQ_hP", goalType: "Q", lineIndex: 2, leanLine: "exact hPQ hP", actionLabel: "把 Q 的证明放入目标", explanation: "hPQ hP 的类型是 Q，当前目标也是 Q。" }
    ],
    hints: ["目标是 P → Q。", "先 intro，把 P 变成 hP。", "把 hP 输入 hPQ，再把 hPQ hP 放入目标。"],
    hint: "先 intro，再用 hPQ。",
    successText: "intro 给出输入，转换器给出输出。"
  },
  {
    id: "L15_two_intros",
    title: "两个前提",
    chapter: "第 5 章：引入前提 intro",
    visualLevel: 2,
    objectiveText: "制造 proof of P → Q → P ∧ Q。",
    learningFocus: "连续箭头对应连续引入。",
    goal: { requiredType: "P → Q → P ∧ Q", label: "目标：proof of P → Q → P ∧ Q" },
    codeLines: [
      [
        { id: "L15_by", text: "by", explain: "by 后面开始写 tactic 证明。" }
      ],
      [
        { id: "L15_introP", text: "  intro hP", explain: "先引入 P，得到 hP : P。" }
      ],
      [
        { id: "L15_introQ", text: "  intro hQ", explain: "再引入 Q，得到 hQ : Q。" }
      ],
      [
        { id: "L15_exact", text: "  exact", explain: "exact 使用合成出的合取证明。" },
        { id: "L15_and", text: " And.intro", explain: "And.intro 合成 P ∧ Q。" },
        { id: "L15_hP_code", text: " hP", explain: "hP 证明左边 P。" },
        { id: "L15_hQ_code", text: " hQ", explain: "hQ 证明右边 Q。" }
      ]
    ],
    initialModules: [
      { id: "intro_hP", kind: "tactic", label: "intro hP", type: "引入 P", lean: "intro hP", tacticType: "intro", explanation: "引入第一个前提 P。", tokenRefs: ["L15_introP"] },
      { id: "intro_hQ", kind: "tactic", label: "intro hQ", type: "引入 Q", lean: "intro hQ", tacticType: "intro", explanation: "引入第二个前提 Q。", tokenRefs: ["L15_introQ"] }
    ],
    machines: [],
    constructors: [
      { id: "andIntro", kind: "constructor", label: "And.intro", inputTypes: ["P", "Q"], outputType: "P ∧ Q", leanTemplate: "And.intro {0} {1}", explanation: "把 hP 和 hQ 合成 P ∧ Q。", tokenRefs: ["L15_and"] }
    ],
    scriptedSteps: [
      { type: "clickTactic", moduleId: "intro_hP", tactic: "intro", nextGoalType: "Q → P ∧ Q", introduced: { id: "hP", kind: "proof", label: "hP", type: "P", lean: "hP", explanation: "hP 是刚引入的 P 的证明。", draggable: true, tokenRefs: ["L15_hP_code"] }, lineIndex: 1, leanLine: "intro hP", actionLabel: "引入第一个前提", explanation: "目标从 P → Q → P ∧ Q 变成 Q → P ∧ Q。" },
      { type: "clickTactic", moduleId: "intro_hQ", tactic: "intro", nextGoalType: "P ∧ Q", introduced: { id: "hQ", kind: "proof", label: "hQ", type: "Q", lean: "hQ", explanation: "hQ 是刚引入的 Q 的证明。", draggable: true, tokenRefs: ["L15_hQ_code"] }, lineIndex: 2, leanLine: "intro hQ", actionLabel: "引入第二个前提", explanation: "现在目标变成 P ∧ Q，仓库里有 hP 和 hQ。" },
      { type: "dropToConstructor", moduleId: "hP", constructorId: "andIntro", inputIndex: 0, lineIndex: 3, leanExpr: "And.intro hP ...", actionLabel: "把 hP 放入 P 输入口", explanation: "P ∧ Q 的左边需要 P。" },
      { type: "dropToConstructor", moduleId: "hQ", constructorId: "andIntro", inputIndex: 1, outputId: "prod_and_hP_hQ", outputLean: "And.intro hP hQ", outputType: "P ∧ Q", lineIndex: 3, leanExpr: "And.intro hP hQ", actionLabel: "把 hQ 放入 Q 输入口", explanation: "右边也完成后，得到 P ∧ Q 的证明。" },
      { type: "dropToGoal", moduleId: "prod_and_hP_hQ", goalType: "P ∧ Q", lineIndex: 3, leanLine: "exact And.intro hP hQ", actionLabel: "把 P ∧ Q 放入目标", explanation: "当前目标是 P ∧ Q，成品正好匹配。" }
    ],
    hints: ["目标有两个箭头。", "先 intro hP，再 intro hQ。", "用 And.intro hP hQ 合成目标。"],
    hint: "连续点击两个 intro。",
    successText: "连续前提，要连续 intro。"
  },
  {
    id: "L16_full_example",
    title: "第一次看到完整 example",
    chapter: "第 6 章：完整 Lean 外壳",
    visualLevel: 3,
    objectiveText: "制造 proof of P。",
    learningFocus: "Lean 证明的外壳结构。",
    goal: { requiredType: "P", label: "目标：proof of P" },
    requiredTokenClicks: ["L16_prop", "L16_hP_decl", "L16_goal"],
    codeLines: [
      [
        { id: "L16_example", text: "example", explain: "这是一个匿名例子，用来写一个证明。" },
        { id: "L16_prop", text: " (P : Prop)", explain: "声明 P 是一个命题。" },
        { id: "L16_hP_decl", text: " (hP : P)", explain: "声明 hP 是 P 的一个证明。" },
        { id: "L16_goal", text: " : P", explain: "冒号后面的 P 是本关目标。" },
        { id: "L16_by", text: " := by", explain: "by 后面开始写证明步骤。" }
      ],
      [
        { id: "L16_exact", text: "  exact", explain: "exact 用已有证明关闭当前目标。" },
        { id: "L16_hP_code", text: " hP", explain: "这里使用声明里的 hP。" }
      ]
    ],
    initialModules: [
      { id: "hP", kind: "proof", label: "hP", type: "P", lean: "hP", explanation: "hP 是 P 的证明。", draggable: true, tokenRefs: ["L16_hP_decl", "L16_hP_code"] }
    ],
    machines: [],
    constructors: [],
    scriptedSteps: [
      { type: "dropToGoal", moduleId: "hP", goalType: "P", lineIndex: 1, leanLine: "exact hP", actionLabel: "把 hP : P 放入目标 P", explanation: "完整外壳只是说明资源和目标，证明步骤仍然是 exact hP。" }
    ],
    hints: ["先点亮代码里的 P 声明、hP 声明和目标。", "hP : P 是可用资源。", "点完三个 token 后，把 hP 拖到目标槽。"],
    hint: "先点击三个高亮 token。",
    successText: "你已经能从完整 example 中读出资源和目标。"
  },
  {
    id: "L17_full_implication",
    title: "完整 example 中的蕴含",
    chapter: "第 6 章：完整 Lean 外壳",
    visualLevel: 3,
    objectiveText: "制造 proof of Q。",
    learningFocus: "从 theorem statement 中读出资源和目标。",
    goal: { requiredType: "Q", label: "目标：proof of Q" },
    codeLines: [
      [
        { id: "L17_example", text: "example", explain: "这是一个匿名证明。" },
        { id: "L17_props", text: " (P Q : Prop)", explain: "声明 P 和 Q 都是命题。" },
        { id: "L17_hP_decl", text: " (hP : P)", explain: "hP 是 P 的证明。" },
        { id: "L17_hPQ_decl", text: " (hPQ : P → Q)", explain: "hPQ 把 P 的证明变成 Q 的证明。" },
        { id: "L17_goal", text: " : Q", explain: "目标是 Q。" },
        { id: "L17_by", text: " := by", explain: "by 后面开始写证明。" }
      ],
      [
        { id: "L17_exact", text: "  exact", explain: "exact 使用证明表达式关闭目标。" },
        { id: "L17_hPQ_code", text: " hPQ", explain: "使用转换器 hPQ。" },
        { id: "L17_hP_code", text: " hP", explain: "把 hP 作为输入。" }
      ]
    ],
    initialModules: [
      { id: "hP", kind: "proof", label: "hP", type: "P", lean: "hP", explanation: "hP 是 P 的证明。", draggable: true, tokenRefs: ["L17_hP_decl", "L17_hP_code"] }
    ],
    machines: [
      { id: "hPQ", kind: "transform", label: "hPQ", inputType: "P", outputType: "Q", type: "P → Q", lean: "hPQ", outputTemplate: "hPQ {input}", explanation: "hPQ 把 P 的证明变成 Q 的证明。", tokenRefs: ["L17_hPQ_decl", "L17_hPQ_code"] }
    ],
    constructors: [],
    scriptedSteps: [
      { type: "dropToMachine", moduleId: "hP", machineId: "hPQ", outputId: "prod_hPQ_hP", outputLean: "hPQ hP", outputType: "Q", lineIndex: 1, leanExpr: "hPQ hP", actionLabel: "把 hP 输入 hPQ", explanation: "声明里有 hPQ : P → Q 和 hP : P，所以能生成 Q。" },
      { type: "dropToGoal", moduleId: "prod_hPQ_hP", goalType: "Q", lineIndex: 1, leanLine: "exact hPQ hP", actionLabel: "把 hPQ hP : Q 放入目标", explanation: "目标是 Q，生成的模块类型也是 Q。" }
    ],
    hints: ["目标是 Q。", "完整代码里已经声明 hP 和 hPQ。", "把 hP 输入 hPQ，再把 hPQ hP 放入目标。"],
    hint: "读出资源：hP 和 hPQ。",
    successText: "完整 theorem statement 也能读成资源、机器和目标。"
  },
  {
    id: "L18_full_tactic",
    title: "完整 tactic proof",
    chapter: "第 6 章：完整 Lean 外壳",
    visualLevel: 3,
    objectiveText: "制造 proof of P ∧ Q。",
    learningFocus: "by 后面的多行 tactic proof 结构。",
    goal: { requiredType: "P ∧ Q", label: "目标：proof of P ∧ Q" },
    codeLines: [
      [
        { id: "L18_example", text: "example", explain: "这是一个匿名证明。" },
        { id: "L18_props", text: " (P Q : Prop)", explain: "声明 P 和 Q 是命题。" },
        { id: "L18_hP_decl", text: " (hP : P)", explain: "hP 是 P 的证明。" },
        { id: "L18_hQ_decl", text: " (hQ : Q)", explain: "hQ 是 Q 的证明。" },
        { id: "L18_goal", text: " : P ∧ Q", explain: "目标是 P ∧ Q。" },
        { id: "L18_by", text: " := by", explain: "by 后面开始写证明步骤。" }
      ],
      [
        { id: "L18_constructor", text: "  constructor", explain: "constructor 把 P ∧ Q 拆成 P 和 Q 两个子目标。" }
      ],
      [
        { id: "L18_b1", text: "  ·", explain: "这是第一个子目标。" },
        { id: "L18_exact1", text: " exact", explain: "用已有证明关闭子目标。" },
        { id: "L18_hP_code", text: " hP", explain: "hP 完成 P 子目标。" }
      ],
      [
        { id: "L18_b2", text: "  ·", explain: "这是第二个子目标。" },
        { id: "L18_exact2", text: " exact", explain: "用已有证明关闭子目标。" },
        { id: "L18_hQ_code", text: " hQ", explain: "hQ 完成 Q 子目标。" }
      ]
    ],
    initialModules: [
      { id: "constructor", kind: "tactic", label: "constructor", type: "拆合取目标", lean: "constructor", tacticType: "constructor", explanation: "constructor 把合取目标拆成两个子目标。", tokenRefs: ["L18_constructor"] },
      { id: "hP", kind: "proof", label: "hP", type: "P", lean: "hP", explanation: "hP 是 P 的证明。", draggable: true, tokenRefs: ["L18_hP_decl", "L18_hP_code"] },
      { id: "hQ", kind: "proof", label: "hQ", type: "Q", lean: "hQ", explanation: "hQ 是 Q 的证明。", draggable: true, tokenRefs: ["L18_hQ_decl", "L18_hQ_code"] }
    ],
    machines: [],
    constructors: [],
    scriptedSteps: [
      { type: "clickTactic", moduleId: "constructor", tactic: "constructor", subgoals: ["P", "Q"], lineIndex: 1, leanLine: "constructor", actionLabel: "点击 constructor", explanation: "完整代码里，constructor 仍然是把目标拆成两个子目标。" },
      { type: "dropToSubgoal", moduleId: "hP", subgoalIndex: 0, goalType: "P", lineIndex: 2, leanLine: "exact hP", actionLabel: "用 hP 完成第一个子目标", explanation: "第一个 bullet 下的目标是 P。" },
      { type: "dropToSubgoal", moduleId: "hQ", subgoalIndex: 1, goalType: "Q", lineIndex: 3, leanLine: "exact hQ", actionLabel: "用 hQ 完成第二个子目标", explanation: "第二个 bullet 下的目标是 Q。" }
    ],
    hints: ["完整代码的目标是 P ∧ Q。", "constructor 会产生两个 bullet 对应的子目标。", "点击 constructor，再把 hP、hQ 放入对应子目标。"],
    hint: "constructor 对应两条 bullet。",
    successText: "你完成了完整 tactic proof。"
  }
];
