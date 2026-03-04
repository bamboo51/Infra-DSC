import {useState, useEffect} from "react";

export function useResponsiveGallery() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(()=>{
    const handleResize = () => {
      if(window.innerWidth >=768 && isOpen){
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const toggle = () => setIsOpen((prev) => !prev);

  return { isOpen, toggle, setIsOpen };
}