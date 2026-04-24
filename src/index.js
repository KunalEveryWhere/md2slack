import { jsxslack } from '@speee-js/jsx-slack'
import Markdown from './markdown'
import './styles.css'

const markdownBlocks = md =>
  jsxslack`<Blocks><${Markdown} markdown=${md} /></Blocks>`

const textarea = document.querySelector('textarea')
const blocks = document.querySelector('#blocks')
const send = document.querySelector('#send')

const updateButton = json => {
  const q = new URLSearchParams()
  q.append('blocks', JSON.stringify(json))
  q.append('mode', 'message')

  send.href = `https://api.slack.com/tools/block-kit-builder?${q}`
  send.classList.remove('disabled')
}

const resetToReady = () => {
  blocks.classList.add('ready')
  blocks.classList.remove('error')
  blocks.textContent = 'A generated JSON for Block Kit will show in this pane.'
  send.classList.add('disabled')
  send.href = '#'
}

const updateBlocks = () => {
  if (!textarea.value.trim()) {
    resetToReady()
    return
  }

  blocks.classList.remove('ready')

  try {
    const outputBlocks = markdownBlocks(textarea.value)

    blocks.classList.remove('error')
    blocks.textContent = JSON.stringify(outputBlocks, null, 2)

    updateButton(outputBlocks)
  } catch (e) {
    blocks.classList.add('error')
    blocks.textContent = e.toString()

    send.classList.add('disabled')
    send.href = '#'
  }
}

textarea.addEventListener('input', updateBlocks, false)

const loadTemplate = document.querySelector('#load-template')
loadTemplate.addEventListener('click', () => {
  fetch('./template.md')
    .then(r => r.text())
    .then(text => {
      textarea.value = text
      updateBlocks()
    })
}, false)
