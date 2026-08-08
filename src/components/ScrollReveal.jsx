import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollReveal({
  children,
  y = 40,
  duration = 0.7,
  delay = 0,
  stagger = 0,
  className = '',
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = stagger ? Array.from(el.children) : [el]
    if (!targets.length) return
    const tweens = []

    gsap.set(targets, { opacity: 0, y })

    const tween = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger: stagger || 0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    })
    tweens.push(tween)

    return () => {
      tweens.forEach((t) => t.kill())
    }
  }, [y, duration, delay, stagger])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
