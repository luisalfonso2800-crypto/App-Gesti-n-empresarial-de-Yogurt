'use client';

import React, { useState } from 'react';
import { Scroll, ChevronDown, ChevronUp, Heart, Sparkles, Feather } from 'lucide-react';
import styles from '../goals.module.css';

/**
 * @file PurposeDedicationSection.jsx
 * @description Pieza editorial inmutable y solemne con dedicatoria y carta fundacional MANNÁ (< 120 líneas).
 */
export function PurposeDedicationSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={styles.editorialWrapper} aria-label="Dedicatoria y Carta Fundacional MANNÁ">
      {/* Barra de cabecera siempre visible */}
      <div className={styles.editorialBar}>
        <div className={styles.editorialBarLeft}>
          <div className={styles.editorialIconBadge}>
            <Scroll size={18} className={styles.editorialIconGold} />
          </div>
          <div className={styles.editorialTitlesCol}>
            <span className={styles.editorialBarMotto}>Seguimos Sembrando</span>
            <span className={styles.editorialSubMotto}>Carta Fundacional & Propósito de Vida</span>
          </div>
        </div>
        <button
          type="button"
          className={styles.editorialToggleBtn}
          onClick={() => setIsOpen(prev => !prev)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Cerrar Carta Fundacional' : 'Abrir Nuestra Historia'}
        >
          <Feather size={14} className={styles.toggleBtnIcon} />
          <span>{isOpen ? 'Guardar Carta' : 'Nuestra Historia · Para Yenny'}</span>
          {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>

      {/* Contenido desplegable con diseño solemne y responsivo */}
      {isOpen && (
        <article className={styles.storyContent}>
          <div className={styles.storyHeaderEmblem}>
            <Sparkles size={20} className={styles.storyEmblemIcon} />
            <span className={styles.storyHeaderSeal}>MEMORIA Y GRATITUD</span>
          </div>

          <p className={styles.storyLead}>
            «Todo fruto fecundo comienza en el silencio de una semilla.»
          </p>

          <p className={styles.storyEpigraph}>
            Pero algunas semillas nacieron en tierra árida, bajo el frío de la incertidumbre y regadas con lágrimas que nadie más vio.
          </p>

          <div className={styles.storyTitleContainer}>
            <h2 className={styles.storyTitle}>Para Yenny Prado</h2>
            <div className={styles.storyTitleUnderline} />
          </div>

          <div className={styles.storyParagraphsGroup}>
            <p className={styles.storyParagraph}>
              Hubo noches en las que la desesperanza pesaba en el pecho y el alma dolía de tanta incertidumbre. Hubo momentos de frustración profunda, de silencios amargos y de un llanto que solo Dios y estas cuatro paredes conocieron.
            </p>

            <p className={styles.storyParagraph}>
              El camino fue implacable. Exigió sacrificios que partieron el corazón, y aun cuando todo alrededor gritaba que era momento de claudicar, tú permaneciste de pie, firme como un roble.
            </p>

            <p className={styles.storyParagraph}>
              Estuviste cuando no había un techo propio al que llamar hogar. Estuviste cuando en los bolsillos solo había sueños rotos que intentábamos remendar al amanecer. Creyiste en este propósito antes de que existiera una sola gota de yogur, una sola venta o un motivo tangible para sonreír.
            </p>

            <p className={styles.storyParagraph}>
              Por eso, este tablero no mide números fríos ni vanagloria. Cada peso ganado, cada litro transformado y cada meta alcanzada en este sistema tiene un solo significado sagrado: honrar y retribuir cada lágrima que derramaste, construyendo, ladrillo a ladrillo, la paz, la dignidad y el hogar que tu alma merece.
            </p>
          </div>

          <div className={styles.storyHighlightBox}>
            <Heart size={18} className={styles.storyHeartIcon} />
            <p className={styles.storyHighlight}>
              Todavía no hemos llegado a la cima, pero las raíces ya rompieron la piedra. Y esta vez cosecharemos juntos.
            </p>
          </div>

          <p className={styles.storyMottoCallout}>
            Seguimos sembrando.
          </p>

          <footer className={styles.storyFooter}>
            <span className={styles.storyHolding}>Santa Marta, Colombia · GUERRERO PRADO HOLDING COMPANY FAMILY S.A.S.</span>
            <span className={styles.storyBrandMotto}>MANNÁ · Semilla · Tiempo · Cosecha</span>
          </footer>
        </article>
      )}
    </section>
  );
}
