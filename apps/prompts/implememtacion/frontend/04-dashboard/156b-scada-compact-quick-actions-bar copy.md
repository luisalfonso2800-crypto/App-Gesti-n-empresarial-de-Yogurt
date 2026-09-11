<section className={styles.quickAccessRibbon} aria-label="Accesos Rápidos Operativos">
  <span className={styles.quickAccessLabel}>ACCESOS RÁPIDOS:</span>

  <div className={styles.quickButtonsGroup}>
    <Link className="{styles.quickBtn}" href="/operations/purchases" title="Módulo de Compras">
      <ShoppingCart className="{styles.quickIcon}" size="{13}"/>
      <span>Compras</span>
    </Link>

    <Link className="{styles.quickBtn}" href="/catalog/supplier-prices" title="Precios de Proveedor e Insumos">
      <Tag className="{styles.quickIcon}" size="{13}"/>
      <span>Comprar Insumos</span>
    </Link>

    <Link className="{styles.quickBtn}" href="/catalog/products" title="Catálogo de Productos Terminados">
      <Package className="{styles.quickIcon}" size="{13}"/>
      <span>Catálogo Productos</span>
    </Link>

    <Link className="{styles.quickBtn}" href="/commercial/payments" title="Gestión de Pagos y Cobros">
      <CreditCard className="{styles.quickIcon}" size="{13}"/>
      <span>Pagos y Cobros</span>
    </Link>

    <Link className="{styles.quickBtn}" href="/commercial/sales" title="Registro y Control de Ventas">
      <TrendingUp className="{styles.quickIcon}" size="{13}"/>
      <span>Ventas</span>
    </Link>
  </div>
</section>