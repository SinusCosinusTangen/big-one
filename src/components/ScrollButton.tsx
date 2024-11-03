import { useEffect, useState } from "react";
import Icon from "react-icons-kit";
import { arrowUp as arrowUp } from "react-icons-kit/fa";

const ScrollButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY >= 200) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <button
            onClick={scrollToTop}
            style={{ display: visible ? 'block' : 'none' }}
            className="fixed bottom-2 right-2 p-4 text-slate-400 hover:scale-105 active:scale-95 transition-transform duration-200"
            title="Scroll to top"
        >
            <Icon icon={arrowUp} size={40} />
        </button>
    );
};

export default ScrollButton;