import { useScrollProgress } from '../../../hooks/useScrollReveal'

/**
 * A thin progress bar fixed at the very top of the main content area.
 */
export default function ScrollProgress() {
  const progress = useScrollProgress()

  return (
    <div className="scroll-progress-track">
      <div
        className="scroll-progress-bar"
        style={{ height: `${progress}%` }}
      />
    </div>
  )
}
