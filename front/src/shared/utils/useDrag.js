import { useState, useRef, useEffect } from "react";

const useDrag = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const onMouseDown = (e) => {
      const rect = ref.current.getBoundingClientRect();
      setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setIsDragging(true);
      e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (!isDragging || !ref.current) return;

      const newX = Math.min(
        window.innerWidth + 50 - ref.current.offsetWidth,
        Math.max(0, e.clientX - offset.x)
      );
      const newY = Math.min(
        window.innerHeight + 25 - ref.current.offsetHeight,
        Math.max(0, e.clientY - offset.y)
      );

      ref.current.style.left = `${newX}px`;
      ref.current.style.top = `${newY}px`;
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    if (ref.current) {
      ref.current.style.position = "absolute";

      ref.current.addEventListener("mousedown", onMouseDown);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("mousedown", onMouseDown);
      }
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, offset]);

  return { ref };
};

export default useDrag;
