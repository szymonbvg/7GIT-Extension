import { useFloating } from "@floating-ui/react-dom";
import { useEffect, useRef, useState } from "react";
import "./Emote.css";

type EmoteProps = {
  id: string;
  name: string;
};

type ImgSize = {
  width: number | string;
  height: number | string;
};

export default function Emote(props: EmoteProps) {
  const [size, setSize] = useState<ImgSize>({ width: "auto", height: "auto" });
  const [loaded, setLoaded] = useState(false);
  const [showFloating, setShowFloating] = useState(false);
  const { refs, floatingStyles } = useFloating();
  const emoteRef = useRef<HTMLImageElement>(null);

  const handleLoad = () => {
    if (!emoteRef.current) {
      return;
    }
    const w = emoteRef.current.width;
    const h = emoteRef.current.height;

    setSize({ width: w, height: h });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setLoaded(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );
    if (emoteRef.current) {
      observer.observe(emoteRef.current);
    }

    return () => {
      if (emoteRef.current) {
        observer.unobserve(emoteRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const emote = emoteRef.current;
    if (!emote) {
      return;
    }
    if (loaded) {
      const src = emote.getAttribute("emote-src");
      if (src) {
        emote.removeAttribute("emote-src");
        emoteRef.current.src = src;
      }
    } else {
      emote.setAttribute("emote-src", `https://cdn.7tv.app/emote/${props.id}/1x.webp`);
      emote.removeAttribute("src");
    }
  }, [loaded, props.id]);

  return (
    <>
      <div
        ref={refs.setReference}
        className="emote"
        onMouseEnter={() => setShowFloating(true)}
        onMouseLeave={() => setShowFloating(false)}
      >
        <img
          ref={emoteRef}
          style={{ width: size.width, height: size.height }}
          loading="lazy"
          onLoad={handleLoad}
        />
      </div>
      {showFloating && (
        <div className="emote-floating" ref={refs.setFloating} style={floatingStyles}>
          <p>{props.name}</p>
        </div>
      )}
    </>
  );
}
