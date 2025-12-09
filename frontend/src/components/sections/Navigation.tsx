"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { TocItem, DocumentMeta } from "@/types/document";

interface NavigationProps {
  meta: DocumentMeta;
  tocItems: TocItem[];
}

export function Navigation({ meta, tocItems }: NavigationProps) {
  const [tocNavVisible, setTocNavVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const tocNavInnerRef = useRef<HTMLDivElement>(null);

  const updateArrows = useCallback(() => {
    const inner = tocNavInnerRef.current;
    if (!inner) return;
    setCanScrollLeft(inner.scrollLeft > 10);
    setCanScrollRight(inner.scrollLeft < inner.scrollWidth - inner.clientWidth - 10);
  }, []);

  const scrollNavLeft = useCallback(() => {
    tocNavInnerRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  }, []);

  const scrollNavRight = useCallback(() => {
    tocNavInnerRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const tocBlock = document.getElementById("tocBlock");
      const isVisible = tocBlock ? tocBlock.getBoundingClientRect().bottom < 64 : false;
      setTocNavVisible(isVisible);

      const sections = document.querySelectorAll("section[id]");
      const targetPos = window.innerHeight * 0.3;
      let current = "";

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= targetPos && rect.bottom > targetPos) {
          current = section.getAttribute("id") || "";
        }
      }

      if (!current) {
        for (const section of sections) {
          const sectionTop = section.getBoundingClientRect().top;
          if (sectionTop < 200) {
            current = section.getAttribute("id") || "";
          }
        }
      }

      setActiveSection(current);

      // Auto-scroll nav to active item
      if (isVisible && current && tocNavInnerRef.current) {
        const activeLink = tocNavInnerRef.current.querySelector(`a[href="#${current}"]`) as HTMLElement;
        if (activeLink) {
          const inner = tocNavInnerRef.current;
          const linkRect = activeLink.getBoundingClientRect();
          const navRect = inner.getBoundingClientRect();
          const linkCenter = linkRect.left + linkRect.width / 2;
          const navCenter = navRect.left + navRect.width / 2;
          inner.scrollTo({
            left: inner.scrollLeft + (linkCenter - navCenter),
            behavior: "smooth"
          });
        }
      }

      updateArrows();

      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [updateArrows]);

  useEffect(() => {
    const inner = tocNavInnerRef.current;
    if (!inner) return;
    inner.addEventListener("scroll", updateArrows);
    return () => inner.removeEventListener("scroll", updateArrows);
  }, [updateArrows]);

  return (
    <>
      <nav>
        <a
          href="#"
          className="nav-logo"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <img src={meta.logo.white} alt="Drakkar" />
          {meta.clientLogo && (
            <>
              <span className="nav-collab">×</span>
              <img src={meta.clientLogo} alt={meta.title} className="logo-cameleon" />
            </>
          )}
        </a>
        <span className="nav-date">{meta.date}</span>
      </nav>

      <div className="progress-bar" id="progress" style={{ width: `${scrollProgress}%` }} />

      <div className={`toc-nav ${tocNavVisible ? "visible" : ""}`}>
        <button type="button"
          className="nav-arrow nav-arrow-left"
          aria-label="Scroll left"
          onClick={scrollNavLeft}
          style={{ opacity: canScrollLeft ? 1 : 0.3 }}
        >
          ‹
        </button>
        <div className="toc-nav-inner" ref={tocNavInnerRef}>
          {tocItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? "active" : ""}
            >
              <span className="nav-num">{item.num}.</span> {item.title}
            </a>
          ))}
        </div>
        <button type="button"
          className="nav-arrow nav-arrow-right"
          aria-label="Scroll right"
          onClick={scrollNavRight}
          style={{ opacity: canScrollRight ? 1 : 0.3 }}
        >
          ›
        </button>
      </div>
    </>
  );
}
