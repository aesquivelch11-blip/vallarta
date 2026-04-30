/**
 * Splits text into word spans for GSAP cascade animation.
 * Outer span: overflow:hidden clip box. Inner span: animated target.
 * Target inner spans in GSAP via the className prop.
 */
export function splitWords(text, className = 'word-inner') {
  const words = text.split(' ')
  return words.map((word, i) => (
    <span
      key={i}
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        verticalAlign: 'bottom',
        marginRight: i < words.length - 1 ? '0.28em' : 0,
      }}
    >
      <span className={className} style={{ display: 'inline-block' }}>
        {word}
      </span>
    </span>
  ))
}
