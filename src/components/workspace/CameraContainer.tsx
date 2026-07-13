/**
 * The structural container Milestone 3 will animate with CSS
 * `translate`/`scale` transforms to pan and zoom toward each Focus
 * state's anchor point (EXPERIENCE_ARCHITECTURE.md's Camera Philosophy).
 *
 * Milestone 2 scope stops here deliberately: this component exists to
 * prove the layout supports that later behavior without needing to be
 * restructured for it, not to implement any movement. It renders with
 * an identity transform and no event handlers, per Milestone 2's
 * explicit exclusion of camera movement.
 */

interface CameraContainerProps {
  children: React.ReactNode;
}

export function CameraContainer({ children }: CameraContainerProps) {
  return (
    <div
      className="absolute inset-0 origin-center"
      style={{ transform: "translate(0px, 0px) scale(1)" }}
    >
      {children}
    </div>
  );
}
