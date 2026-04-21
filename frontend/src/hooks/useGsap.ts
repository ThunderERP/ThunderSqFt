import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * GSAP hook for animating a set of elements when they enter the viewport.
 * Pass a selector string targeting children to stagger-animate.
 */
export function useGsapStagger(selector: string, options?: { delay?: number; stagger?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(selector, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: options?.stagger ?? 0.1,
        delay: options?.delay ?? 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
          scroller: '#main-content'
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [selector, options?.delay, options?.stagger])

  return containerRef
}

/**
 * GSAP hook for a smooth counter animation on a numeric value.
 */
export function useGsapCounter(targetValue: number, duration = 1.2) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const obj = { value: 0 }
    gsap.to(obj, {
      value: targetValue,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = `₹${Math.round(obj.value).toLocaleString()}`
        }
      },
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 95%',
        scroller: '#main-content'
      },
    })
  }, [targetValue, duration])

  return ref
}

/**
 * GSAP hook for chart container reveal with scale + fade.
 */
export function useGsapReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.from(ref.current!, {
        opacity: 0,
        y: 30,
        scale: 0.97,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 90%',
          scroller: '#main-content'
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return ref
}

export { gsap, ScrollTrigger }
