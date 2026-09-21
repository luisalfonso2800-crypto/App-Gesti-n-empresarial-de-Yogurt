'use client';

import React, { useState } from 'react';
import { Scroll, ChevronDown, ChevronUp } from 'lucide-react';
import styles from '../goals.module.css';

/**
 * @file PurposeDedicationSection.jsx
 * @description Pieza editorial inmutable y solemne con dedicatoria a Yenny Prado.
 */
export function PurposeDedicationSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={styles.editorialWrapper} aria-label="Dedicatoria y Carta Fundacional MANNÁ">
      <div className={styles.editorialBar}>
        <div className={styles.editorialBarLeft}>
          <Scroll size={20} color="#C5A880" />
          <span className={styles.editorialBarMotto}>Seguimos sembrando.</span>
        </div>
        <button
          type="button"
          className={styles.editorialToggleBtn}
          onClick={() => setIsOpen(prev => !prev)}
        >
          <Scroll size={14} />
          {isOpen ? 'Cerrar Carta' : 'Nuestra Historia · Para Yenny'}
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {isOpen && (
        <article className={styles.storyContent}>
          <p className={styles.storyLead}>
            Todo fruto comienza con una semilla.
          </p>
          <p className={styles.storyEpigraph}>
            Pero algunas semillas nacieron en tierra árida, bajo el frío de la incertidumbre y regadas con lágrimas que nadie más vio.
          </p>

          <h2 className={styles.storyTitle}>Para Yenny Prado</h2>

          <p className={styles.storyParagraph}>
            Hubo noches en las que la desesperanza pesaba en el pecho y el alma dolía de tanta incertidumbre. Hubo momentos de frustración profunda, de silencios amargos y de un llanto que solo Dios y estas cuatro paredes conocieron.
          </p>

          <p className={styles.storyParagraph}>
            El camino fue cruel. Exigió sacrificios que partieron el corazón, y aun cuando todo alrededor gritaba que era momento de rendirse, tú permaneciste de pie.
          </p>

          <p className={styles.storyParagraph}>
            Estuviste cuando no había un techo propio al que llamar hogar. Estuviste cuando en los bolsillos solo había sueños rotos que intentábamos remendar al amanecer. Creyiste en este propósito antes de que existiera una sola gota de yogur, una sola venta o un motivo visible para sonreír.
          </p>

          <p className={styles.storyParagraph}>
            Por eso, este tablero no mide números fríos. Cada peso ganado, cada litro transformado y cada meta alcanzada en este sistema tiene un solo significado: retribuir cada lágrima que derramaste y construir, ladrillo a ladrillo, la paz y el hogar que tu alma merece.
          </p>

          <p className={styles.storyHighlight}>
            Todavía no hemos llegado a la cima, pero las raíces ya rompieron la piedra. Y esta vez cosecharemos juntos.
          </p>

          <p className={styles.storyMottoCallout}>
            Sigamos sembrando.
          </p>

          <footer className={styles.storyFooter}>
            <span className={styles.storyHolding}>Santa Marta, Colombia · GUERRERO PRADO HOLDING COMPANY FAMILY S.A.S.</span>
            <span className={styles.storyBrandMotto}>MANNÁ · Semilla · Tiempo · Fruto</span>
          </footer>
        </article>
      )}
    </section>
  );
}
