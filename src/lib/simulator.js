(function() {
  const vis = require('vis-network')
  const {NFA} = window.lib
  let {NETWORK_OPTIONS, render_nfa_to_network_data} = window.renderer
  const {run: run_simulator, runWithBacktrack: run_simulator_backtrack} = window.simulator_step
  const network = new vis.Network(document.getElementById('canvas'), {nodes: [], edges: []}, NETWORK_OPTIONS)
  const btnTextStart = "执行匹配"
  const btnTextNext = "下一步"

  let running = false
  let nextStep = null
  let currentNfa = null
  // eslint-disable-next-line no-unused-vars
  let withBacktrack = true
  let regexData = window.regexData


  const el_regx = document.getElementById('input-regx')
  const el_text = document.getElementById('input-text')
  const el_result = document.getElementById('result')

  el_regx.addEventListener('input', invokeLater(render))
  document.getElementById('btn-run').addEventListener('click', run)
  document.getElementById('btn-stop').addEventListener('click', stop)
  document.getElementById('checkbox-physics').addEventListener('click', togglePhysics)
  window.togglePhysics = togglePhysics
  render()

  function invokeLater(fn, delay = 200) {
    let timer
    return () => {
      clearTimeout(timer)
      timer = setTimeout(() => fn(), delay)
    }
  }

  function render() {
    const regexp = el_regx.value
    const nfa = currentNfa = NFA.createFromRegexp(regexp)
    const data = render_nfa_to_network_data(nfa)
    network.setData(data)
    let blob = new Blob([JSON.stringify(data)], {type: "application/octet-stream"})
    regexData.blobLink = URL.createObjectURL(blob)
    regexData.blobName = Date.now() + '.nfa'
    el_result.innerHTML = ''
  }

  function run() {
    regexData.btnText = btnTextNext
    regexData.inputDisabled = true
    regexData.btnIcon = 'mdi-skip-next'
    withBacktrack = regexData.isBackTrack
    if (running) {
      nextStep()
    } else {
      running = true
      // eslint-disable-next-line no-constant-condition
      ;(true ? run_simulator_backtrack : run_simulator)(currentNfa, el_text.value, (state, next) => {
        if (next === null) {
          console.log(next)
          updateState(state, false)
          stop()
          return
        }
        updateState(state, true)
        nextStep = next
      })
    }
  }

  function updateState(state, hasNext) {
    //if (state.states.size === 0) return
    const nodes = Array.from(state.states).map((s) => s.id)
    network.setSelection({nodes}, {highlightEdges: false})
    if(hasNext){
      el_result.innerHTML = `步数：<b>${state.step}</b><br>下一步：<b>${state.char || ''}</b>`
    }else {
      el_result.innerHTML = `步数：<b>${state.step}</b><br>匹配结果：<b>${state.result || false}</b>`
    }

  }

  function stop() {
    regexData.btnText = btnTextStart
    regexData.inputDisabled = false
    regexData.btnIcon = 'mdi-play'
    running = false
  }

  function togglePhysics(enabled){
    if (NETWORK_OPTIONS.physics === undefined){
      console.log(NETWORK_OPTIONS)
      NETWORK_OPTIONS.physics = {}
    }
    NETWORK_OPTIONS.physics.enabled = enabled;
    network.setOptions(NETWORK_OPTIONS)
  }
})()