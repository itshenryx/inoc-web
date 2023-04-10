'use client';
import {Inter} from '@next/font/google'
import styles from './page.module.css'
import {useEffect, useRef} from 'react';

const inter = Inter({subsets: ['latin']})

export default function Home() {
    const logo = useRef(null);
    const logoDuplicate = useRef(null);

    useEffect(() => {
        window.addEventListener("scroll", (e) => {
            // let scaleRate = (window.scrollY > 0 ? window.scrollY : 1) * 0.1;
            let scale = 1 - window.scrollY * 0.001;

            // ${window.scrollY > 600 ? `position: absolute` : `position: fixed`};
            logo.current.style = `
                transform:${window.scrollY < 300 ? `scale(${scale})` : `scale(${1 - 300 * 0.001})`} ${window.scrollY > 300 && window.scrollY < 600 ? `translateX(${-((window.scrollY - 300) * 0.1) + "vw"})` : window.scrollY > 599 ?
                `translateX(-30vw)` : ``}
                ${window.scrollY > 600 ? `translateY(${-(window.scrollY - 600) + "px"})` : `translateY(0px)`} 
                ;
            `;

            window.scrollY > 100 ?
                logo.current.children[1].children[0].setAttribute("data-motion", "fade-out") :
                logo.current.children[1].children[0].setAttribute("data-motion", "fade-back");
            window.scrollY > 200 ?
                logo.current.children[1].children[1].setAttribute("data-motion", "fade-out") :
                logo.current.children[1].children[1].setAttribute("data-motion", "fade-back");
            window.scrollY > 300 ?
                logo.current.children[1].children[2].setAttribute("data-motion", "fade-out") :
                logo.current.children[1].children[2].setAttribute("data-motion", "fade-back");

            logoDuplicate.current.style = `
                transform:${window.scrollY < 300 ? `scale(${scale})` : `scale(${1 - 300 * 0.001})`} ${window.scrollY > 300 && window.scrollY < 600 ? `translateX(${-((window.scrollY - 300) * 0.1) + "vw"})` : window.scrollY > 599 ?
                `translateX(-30vw)` : ``}
                ${window.scrollY > 600 ? `translateY(${-(window.scrollY - 600) + "px"})` : `translateY(0px)`} 
                ;
            `;

            window.scrollY > 100 ?
                logoDuplicate.current.children[1].children[0].setAttribute("data-motion", "fade-out") :
                logoDuplicate.current.children[1].children[0].setAttribute("data-motion", "fade-back");
            window.scrollY > 200 ?
                logoDuplicate.current.children[1].children[1].setAttribute("data-motion", "fade-out") :
                logoDuplicate.current.children[1].children[1].setAttribute("data-motion", "fade-back");
            window.scrollY > 300 ?
                logoDuplicate.current.children[1].children[2].setAttribute("data-motion", "fade-out") :
                logoDuplicate.current.children[1].children[2].setAttribute("data-motion", "fade-back");

            // let pos1 = logo.current.children[0].getBoundingClientRect(),
            //     pos2 = logoDuplicate.current.getBoundingClientRect(),
            //     moveX =  pos1.x - pos2.x - 2,
            //     moveY =  pos1.y - pos2.y;
            //
            // let transform = logoDuplicate.current.style.transform.split(' ');
            //
            // if (moveX !== 0) transform[0] = `translateX(${moveX + "px"})`;
            // if (moveY !== 0) transform[1] = `translateY(${Math.abs(moveY) + "px"})`;
            // transform[2] = window.scrollY < 300 ? `scale(${scale})` : `scale(${1 - 300 * 0.001})`
            //
            // logoDuplicate.current.style.transform = transform.join(' ');

            // if (moveX !== 0) logoDuplicate.current.style.transform += `translateX(${moveX + "px"})`;
            // if (moveY !== 0) logoDuplicate.current.style.transform += `translateY(${moveY + "px"})`;
            // if (moveY !== 0) logoDuplicate.current.style = `transform: translateY(${moveY + "px"}) translateX(0px);`;

            // logoDuplicate.current.style = `transform:
            //    ${moveY !== 0 ?  `translateY(${moveY + "px"})` :
            //                     `translateY(${ + "px"})`}`;
        });
    }, []);

    return (
        <main>
            <div className={styles["sticky-parent"]}>
                <section className={styles.landing}>
                    {/*<div className={styles.circle}>*/}
                    {/*    <div className={styles["logo-box"]} ref={logoDuplicate}>*/}
                    {/*        <img className={styles.logo} src="/images/logo.png" alt=""/>*/}
                    {/*        <p >*/}
                    {/*            <span data-motion="fade-back">AI Assisted</span>*/}
                    {/*            <span data-motion="fade-back">Data Collection</span>*/}
                    {/*            <span data-motion="fade-back">& Analysis</span>*/}
                    {/*        </p>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div className={styles["grid-box"]}>
                        <div className={styles["logo-box"]} ref={logo}>
                            <img className={styles.logo} src="/images/logo.png" alt=""/>
                            <p>
                                <span data-motion="fade-back">AI Assisted</span>
                                <span data-motion="fade-back">Data Collection</span>
                                <span data-motion="fade-back">& Analysis</span>
                            </p>
                        </div>
                        <div className={styles.mask}>
                            <div className={styles["logo-box"]} ref={logoDuplicate}>
                                <img className={styles.logo} src="/images/logo.png" alt=""/>
                                <p>
                                    <span data-motion="fade-back">AI Assisted</span>
                                    <span data-motion="fade-back">Data Collection</span>
                                    <span data-motion="fade-back">& Analysis</span>
                                </p>
                            </div>
                        </div>
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
