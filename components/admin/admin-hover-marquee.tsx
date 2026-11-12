"use client"

import { useEffect } from "react"

/**
 * Global Admin Dashboard Revolving Hover Marquee Controller
 * - Any single-line truncated element (`truncate` / `text-overflow: ellipsis` / `white-space: nowrap`)
 *   whose full text overflows its available column/row space (`scrollWidth > clientWidth`)
 *   displays `...` by default.
 * - When hovered, it smoothly revolves the full detail continuously from right to left
 *   at a slow, comfortable reading speed until the cursor leaves.
 */
export function AdminHoverMarquee() {
  useEffect(() => {
    let activeEl: HTMLElement | null = null
    let activeTrigger: HTMLElement | null = null
    let activeOverlay: HTMLSpanElement | null = null
    let savedStyles: {
      position: string
      color: string
      textOverflow: string
    } | null = null

    const stopMarquee = () => {
      if (activeOverlay && activeOverlay.parentNode) {
        activeOverlay.parentNode.removeChild(activeOverlay)
      }
      if (activeEl) {
        activeEl.classList.remove("admin-marquee-host-active")
        if (savedStyles) {
          activeEl.style.position = savedStyles.position
          activeEl.style.color = savedStyles.color
          activeEl.style.textOverflow = savedStyles.textOverflow
        }
      }
      if (activeTrigger) {
        activeTrigger.removeEventListener("mouseleave", handleMouseLeave)
      }
      activeEl = null
      activeTrigger = null
      activeOverlay = null
      savedStyles = null
    }

    const handleMouseLeave = () => {
      stopMarquee()
    }

    const isSingleLineOverflowing = (el: HTMLElement): boolean => {
      if (!el) return false
      const style = window.getComputedStyle(el)
      if (style.whiteSpace !== "nowrap") return false
      if (style.overflowX !== "hidden" && style.overflow !== "hidden") return false
      return el.scrollWidth > el.clientWidth + 1
    }

    const findBestTruncatedTarget = (
      startNode: HTMLElement
    ): {
      marqueeEl: HTMLElement
      triggerEl: HTMLElement
    } | null => {
      let curr: HTMLElement | null = startNode
      let depth = 0

      while (curr && curr !== document.body && depth < 4) {
        if (
          curr.tagName === "TD" ||
          curr.tagName === "TH" ||
          curr.tagName === "TR" ||
          curr.tagName === "TABLE" ||
          curr.tagName === "TBODY"
        ) {
          break
        }

        // If curr is a wrapper containing a single `.truncate` child, check that child first
        const childTruncates = Array.from(
          curr.querySelectorAll<HTMLElement>(".truncate")
        )
        if (
          childTruncates.length === 1 &&
          isSingleLineOverflowing(childTruncates[0])
        ) {
          return { marqueeEl: childTruncates[0], triggerEl: curr }
        }

        if (isSingleLineOverflowing(curr)) {
          return { marqueeEl: curr, triggerEl: curr }
        }

        curr = curr.parentElement
        depth++
      }

      return null
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target || !(target instanceof HTMLElement)) return

      // Keep revolving uninterrupted while pointer stays inside the active trigger
      if (
        activeTrigger &&
        (activeTrigger === target || activeTrigger.contains(target))
      ) {
        return
      }

      const found = findBestTruncatedTarget(target)
      if (!found) {
        if (activeEl) stopMarquee()
        return
      }

      const { marqueeEl, triggerEl } = found
      if (activeEl === marqueeEl) return

      stopMarquee()

      const fullWidth = marqueeEl.scrollWidth
      const visibleWidth = marqueeEl.clientWidth
      if (fullWidth <= visibleWidth + 1) return

      const fullText = (marqueeEl.textContent || "").replace(/\s+/g, " ").trim()
      if (!fullText) return

      const computed = window.getComputedStyle(marqueeEl)
      const textColor = computed.color

      savedStyles = {
        position: marqueeEl.style.position,
        color: marqueeEl.style.color,
        textOverflow: marqueeEl.style.textOverflow,
      }

      if (computed.position === "static") {
        marqueeEl.style.position = "relative"
      }
      marqueeEl.style.color = "transparent"
      marqueeEl.style.textOverflow = "clip"
      marqueeEl.classList.add("admin-marquee-host-active")

      // Create seamless revolving marquee overlay
      const overlay = document.createElement("span")
      overlay.className = "admin-marquee-overlay"
      overlay.setAttribute("aria-hidden", "true")
      overlay.style.color = textColor

      const track = document.createElement("span")
      track.className = "admin-marquee-track"

      // Very slow, steady revolving speed (~28px per second)
      const cyclePx = fullWidth + 36
      const durationSec = Math.max(5.5, cyclePx / 28)
      track.style.setProperty(
        "--admin-marquee-duration",
        `${durationSec.toFixed(2)}s`
      )

      const item1 = document.createElement("span")
      item1.className = "admin-marquee-item"
      item1.textContent = fullText

      const sep1 = document.createElement("span")
      sep1.className = "admin-marquee-sep"
      sep1.textContent = "•"

      const item2 = document.createElement("span")
      item2.className = "admin-marquee-item"
      item2.textContent = fullText

      const sep2 = document.createElement("span")
      sep2.className = "admin-marquee-sep"
      sep2.textContent = "•"

      track.append(item1, sep1, item2, sep2)
      overlay.appendChild(track)
      marqueeEl.appendChild(overlay)

      activeEl = marqueeEl
      activeTrigger = triggerEl
      activeOverlay = overlay

      triggerEl.addEventListener("mouseleave", handleMouseLeave, { once: true })
    }

    document.addEventListener("mouseover", handleMouseOver, { passive: true })
    return () => {
      document.removeEventListener("mouseover", handleMouseOver)
      stopMarquee()
    }
  }, [])

  return (
    <style jsx global>{`
      @keyframes admin-revolve-marquee {
        0% {
          transform: translate3d(0, 0, 0);
        }
        100% {
          transform: translate3d(-50%, 0, 0);
        }
      }

      .admin-marquee-host-active > *:not(.admin-marquee-overlay) {
        opacity: 0 !important;
      }

      .admin-marquee-overlay {
        position: absolute !important;
        inset: 0 !important;
        overflow: hidden !important;
        pointer-events: none !important;
        display: flex !important;
        align-items: center !important;
        white-space: nowrap !important;
        user-select: none !important;
      }

      .admin-marquee-track {
        display: inline-flex !important;
        align-items: center !important;
        width: max-content !important;
        white-space: nowrap !important;
        will-change: transform;
        animation: admin-revolve-marquee var(--admin-marquee-duration, 7s) linear infinite !important;
      }

      .admin-marquee-item {
        display: inline-block !important;
        white-space: nowrap !important;
      }

      .admin-marquee-sep {
        display: inline-block !important;
        padding: 0 16px !important;
        opacity: 0.45 !important;
        font-size: 0.85em !important;
      }
    `}</style>
  )
}
