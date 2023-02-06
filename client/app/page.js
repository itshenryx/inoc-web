'use client';
import Image from 'next/image'
import {Inter} from '@next/font/google'
import styles from './page.module.css'
import {useEffect, useRef} from 'react';

const inter = Inter({subsets: ['latin']})

export default function Home() {
    const logo = useRef(null);
    const text = useRef(null);

    useEffect(() => {
        window.addEventListener("scroll", (e) => {
            // let scaleRate = (window.scrollY > 0 ? window.scrollY : 1) * 0.1;
            let scale = 1 - window.scrollY * 0.001;

            // ${window.scrollY > 600 ? `position: absolute` : `position: fixed`};
            logo.current.style = `
                transform:${window.scrollY < 300 ? `scale(${scale})` : `scale(${1 - 300 * 0.001})`} ${window.scrollY > 300 && window.scrollY < 600 ? `translateX(${-((window.scrollY - 300)*0.1) + "vw"})` : window.scrollY > 599 ? 
                `translateX(-30vw)`:``}
                ${window.scrollY > 600 ? `translateY(${-(window.scrollY - 600) + "px"})` : `translateY(0px)`} 
                ;
            `;

            window.scrollY > 300 ?
                logo.current.children[1].children[0].setAttribute("data-motion", "fade-out") :
                logo.current.children[1].children[0].setAttribute("data-motion", "fade-back");
            window.scrollY > 400 ?
                logo.current.children[1].children[1].setAttribute("data-motion", "fade-out") :
                logo.current.children[1].children[1].setAttribute("data-motion", "fade-back");
            window.scrollY > 500 ?
                logo.current.children[1].children[2].setAttribute("data-motion", "fade-out") :
                logo.current.children[1].children[2].setAttribute("data-motion", "fade-back");
        });
    }, []);

    return (
        <main>
            <div className={styles["sticky-parent"]}>
                <section className={styles.landing}>
                    <div ref={logo}>
                        <img ref={logo} className={styles.logo} src="/images/logo.png" alt=""/>
                        <p ref={text}>
                            <span data-motion="fade-back">AI Assisted</span>
                            <span data-motion="fade-back">Data Collection</span>
                            <span data-motion="fade-back">& Analysis</span>
                        </p>
                    </div>
                </section>
            </div>
            <section className={styles.test}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque corporis doloremque eaque earum exercitationem
                facere, saepe tempora! Accusantium aspernatur harum illo ipsa perspiciatis placeat quam quis, quisquam. Illo
                impedit, odit.
            </section>
        </main>
    )
}
