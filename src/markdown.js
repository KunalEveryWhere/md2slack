import { jsxslack } from '@speee-js/jsx-slack'
import MarkdownIt from 'markdown-it'
import markdownItBlockImage from 'markdown-it-block-image'

const md = new MarkdownIt('commonmark', {
  breaks: true,
  html: false,
  xhtmlOut: true,
  linkify: true,
})

// Setup features and plugins
md.enable(['strikethrough', 'linkify']).use(markdownItBlockImage, {
  outputContainer: 'div',
  containerClassName: null,
})

const fallbackRenderer = (tokens, idx, opts, _, self) =>
  self.renderToken(tokens, idx, opts)

const { blockquote_open, blockquote_close, image } = md.renderer.rules

// Headings
const blockHeadingOpen = (tokens, idx) => {
  const token = tokens[idx]
  return `<${token.tag === 'h6' ? 'Context' : 'Section'}><b>`
}

const blockHeadingClose = (tokens, idx) => {
  const token = tokens[idx]
  const close = `</b></${token.tag === 'h6' ? 'Context' : 'Section'}>`

  // GitHub style headings
  if (token.tag === 'h1' || token.tag === 'h2') return `${close}<Divider />`

  return close
}

md.renderer.rules.heading_open = blockHeadingOpen
md.renderer.rules.heading_close = blockHeadingClose

// Divider
const hr = () => '<Divider />'
md.renderer.rules.hr = hr

// Blockquote
md.renderer.rules.blockquote_open = function(...args) {
  md.renderer.rules.heading_open = () => '<p><b>'
  md.renderer.rules.heading_close = () => '</b></p>'
  md.renderer.rules.hr = () => '<p>────────────────────</p>'

  return (blockquote_open || fallbackRenderer).apply(this, args)
}

md.renderer.rules.blockquote_close = function(...args) {
  md.renderer.rules.heading_open = blockHeadingOpen
  md.renderer.rules.heading_close = blockHeadingClose
  md.renderer.rules.hr = hr

  return (blockquote_close || fallbackRenderer).apply(this, args)
}

// Image (block level only)
md.renderer.rules.image = () => ''

md.renderer.rules['block-image_open'] = () => {
  md.renderer.rules.image = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]
    const { renderToken } = slf

    token.tag = 'Image'

    try {
      slf.renderToken = (tokens, idx, opts) => {
        const token = tokens[idx]
        token.attrSet(
          'alt',
          token.attrGet('alt') || token.attrGet('title') || 'Image'
        )

        return renderToken.call(slf, tokens, idx, opts)
      }

      return image(tokens, idx, options, env, slf)
    } finally {
      slf.renderToken = renderToken
    }
  }
  return ''
}

md.renderer.rules['block-image_close'] = () => {
  md.renderer.rules.image = () => ''
  return ''
}

// <Markdown> custom block for jsx-slack
const Markdown = ({ markdown }) => {
  let parsed = jsxslack.fragment([md.render(markdown)])
  if (!Array.isArray(parsed)) parsed = [parsed]

  let section = []
  const blocks = []

  for (const content of [...parsed, Symbol('end')]) {
    if (typeof content.type === 'string') {
      section.push(content)
    } else {
      if (section.length > 0) {
        const sec = jsxslack.fragment`<Section children=${section} />`
        if (sec.props.text.text) blocks.push(sec)
      }
      section = []

      if (typeof content !== 'symbol') blocks.push(content)
    }
  }

  return blocks
}

export default Markdown
