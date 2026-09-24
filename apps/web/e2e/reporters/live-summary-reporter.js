/**
 * @file live-summary-reporter.js
 * @description Reporter de Playwright que mantiene una barra fija en vivo en la terminal
 * mostrando el progreso exacto: [X de Y], pasados, fallados y test actual.
 */

class LiveSummaryReporter {
  onBegin(config, suite) {
    this.total = suite.allTests().length;
    this.current = 0;
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
  }

  onTestBegin(test) {
    // Muestra el indicador en vivo en la línea inferior
    process.stdout.write(
      `\r\x1b[K📊 [${this.current + 1}/${this.total}] En ejecución... `
    );
  }

  onTestEnd(test, result) {
    this.current++;
    if (result.status === 'passed') {
      this.passed++;
    } else if (result.status === 'failed' || result.status === 'timedOut') {
      this.failed++;
    } else {
      this.skipped++;
    }

    // Línea fija interactiva al pie
    const bar = `📊 Progreso: [${this.current}/${this.total}] | ✅ ${this.passed} pasados | ❌ ${this.failed} fallados`;
    process.stdout.write(`\r\x1b[K${bar}`);
  }

  onEnd() {
    process.stdout.write('\n');
    const header = '='.repeat(50);
    process.stdout.write(`\n${header}\n`);
    process.stdout.write(`📌 RESUMEN DE EJECUCIÓN:\n`);
    process.stdout.write(`   Total tests : ${this.total}\n`);
    process.stdout.write(`   ✅ Pasados   : ${this.passed}\n`);
    process.stdout.write(`   ❌ Fallados  : ${this.failed}\n`);
    if (this.skipped > 0) {
      process.stdout.write(`   ⚠️ Omitidos  : ${this.skipped}\n`);
    }
    process.stdout.write(`${header}\n\n`);
  }
}

export default LiveSummaryReporter;
