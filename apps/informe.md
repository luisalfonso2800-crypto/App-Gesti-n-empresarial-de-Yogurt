ESTE FUE EL ILTIMO INFORME QUE ME DISTES EN EL CHAT DE AGY.
 Persistence Decisions Review                                                                                                     
                                                                                                                                    
  ## 1. Fuentes revisadas                                                                                                           
                                                                                                                                    
  Se realizó una revisión exhaustiva y cruzada sobre la totalidad de la documentación de arquitectura, modelo de datos, backend e   
  implementación:                                                                                                                   
                                                                                                                                    
  • Modelo de datos y validaciones:                                                                                                 
      • 00-data-model-overview.md: Visión general del modelo conceptual y capas de datos.                                           
      • 01-entities.md: Catálogo de entidades maestras, transaccionales, de detalle y conceptos derivados.                          
      • 02-relationships.md: Mapa de relaciones conceptuales, cardinalidades y dependencias.                                        
      • 03-data-integrity-rules.md: Reglas de integridad referencial, unicidad y validación.                                        
      • 04-history-and-traceability.md: Inmutabilidad histórica, snapshots de precios/costos y auditoría.                           
      • 05-data-model-decisions.md: Decisiones estructurales consolidadas del modelo de datos.                                      
      • 06-inventory-flow.md: Flujo integral de movimientos y balance de existencias.                                               
      • 07-business-processes.md: Ciclo operativo de compras, producción, ventas y recaudo.                                         
      • 08-cross-module-rules.md: Reglas de interacción y fronteras de propiedad entre agregados.                                   
      • 09-calculation-responsibilities.md: Matriz de asignación de autoridad exclusiva para cálculos.                              
      • 10-technical-implementation-notes.md: Directrices técnicas para PostgreSQL, Prisma y NestJS.                                
      • 11-model-validation.md: Validación cruzada del modelo V1, registro de ambigüedades (A-01 a A-06) y pendientes (D-01 a D-06).
      • 12-vba-fidelity-validation.md: Validación de fidelidad contra el sistema maestro original en VBA.                           
  • Fronteras y arquitectura backend:                                                                                               
      • 04-persistence-boundaries.md: Límites de persistencia, propiedad de datos y encapsulamiento ORM.                            
      • 05-transaction-boundaries.md: Límites transaccionales y operaciones atómicas de negocio.                                    
      • 08-backend-decisions.md: Decisiones técnicas de backend consolidadas.                                                       
  • Planes de implementación y revisiones previas:                                                                                  
      • 02-database-implementation-plan.md: Plan de traducción del modelo conceptual a base de datos.                               
      • 05-prisma-implementation-plan.md: Plan de implementación progresiva con Prisma ORM.                                         
      • 02-database-implementation-readiness-review.md: Revisión de preparación técnica de base de datos.                           
      • naming.md: Estado de convenciones de nombres.                                                                               
                                                                                                                                    
  ──────                                                                                                                            
  ## 2. A-01 — Presentation                                                                                                         
                                                                                                                                    
  ### Evidencia encontrada                                                                                                          
                                                                                                                                    
  • En 01-entities.md:219-220 (Sección 4) y 03-data-integrity-rules.md, la entidad Presentation contempla los campos numéricos      
  Cantidad_Oz y Cantidad_ml, exigiendo únicamente que ambos sean mayores a cero (> 0).                                              
  • En 11-model-validation.md:191-196 (Sección A-01) y su decisión correspondiente 11-model-validation.md:243-248, se documenta que 
  el sistema maestro original permitía ingresar ambos valores manualmente de forma independiente, dejando abierta la necesidad de   
  ratificar si debe existir un cálculo de conversión estandarizado (1  oz = 29.5735  ml) o persistir como captura manual libre.     
                                                                                                                                    
  ### Decisión                                                                                                                      
                                                                                                                                    
  Definir si en la persistencia y reglas de validación:                                                                             
                                                                                                                                    
  1. El usuario captura ambos campos de manera independiente.                                                                       
  2. El sistema calcula y sincroniza automáticamente Cantidad_ml = Cantidad_Oz * 29.5735 (o viceversa) con redondeo estándar en la  
  capa de servicio antes de persistir.                                                                                              
                                                                                                                                    
  ### Estado                                                                                                                        
                                                                                                                                    
  DECISIÓN PENDIENTE                                                                                                                
  ──────                                                                                                                            
  ## 3. A-02 — Lot                                                                                                                  
                                                                                                                                    
  ### Evidencia encontrada                                                                                                          
                                                                                                                                    
  • En 01-entities.md:1193-1197 (Sección 17) y 00-data-model-overview.md, la entidad Lot posee los atributos Tipo_Lote, ID_Producto 
  e ID_Insumo.                                                                                                                      
  • En 12-vba-fidelity-validation.md:800-841 (Sección 11 y H-06), se confirma que la tabla histórica tblLotes admitía lotes de      
  productos y de insumos.                                                                                                           
  • En 01-entities.md:818 (Sección 12), PurchaseDetail captura el atributo Lote_Proveedor como texto de trazabilidad.               
  • En 11-model-validation.md:197-202 (Sección A-02) y 11-model-validation.md:249-256, se delimita que en PostgreSQL esto requiere  
  definir entre una estructura polimórfica o separar la persistencia de lotes de insumos.                                           
                                                                                                                                    
  ### Decisión                                                                                                                      
                                                                                                                                    
  Seleccionar la estructura relacional para Lot:                                                                                    
                                                                                                                                    
  • Opción A: Tabla única lots con tipo_lote y claves foráneas opcionales a Product y Supply, protegidas por restricción XOR (CHECK 
  ((id_producto IS NOT NULL AND id_insumo IS NULL) OR (id_producto IS NULL AND id_insumo IS NOT NULL))).                            
  • Opción B: Tabla lots exclusiva para Producto Terminado (id_producto obligatorio) y gestión del lote de insumos únicamente como  
  atributo textual/trazable en PurchaseDetail e InventoryMovement.                                                                  
                                                                                                                                    
  ### Estado                                                                                                                        
                                                                                                                                    
  DECISIÓN PENDIENTE                                                                                                                
  ──────                                                                                                                            
  ## 4. A-03 — Production → Lot                                                                                                     
                                                                                                                                    
  ### Evidencia encontrada                                                                                                          
                                                                                                                                    
  • En 08-production.md, 01-entities.md:1058 (Sección 15) y 12-vba-fidelity-validation.md:554-570, la orden de producción registra  
  ID_Lote (relación 1:1 en el flujo estándar).                                                                                      
  • En 02-relationships.md (Sección 20) y 11-model-validation.md:203-208 (A-03 y D-03), se identifica la ambigüedad sobre si una    
  orden de producción debe admitir la generación de múltiples lotes (1:N).                                                          
  • 05-data-model-decisions.md:371-399 (Sección 12) ratifica la separación conceptual obligatoria entre la orden de fabricación     
  (Production) y el lote físico (Lot).                                                                                              
                                                                                                                                    
  ### Decisión                                                                                                                      
                                                                                                                                    
  Fijar la cardinalidad relacional física en Prisma:                                                                                
                                                                                                                                    
  1. Cardinalidad 1:1 con restricción @unique (cada orden completada genera exactamente un lote de producto terminado).             
  2. Cardinalidad 1:N donde lots posee la clave foránea production_id sin restricción de unicidad (permitiendo divisiones de lote   
  por tanda).                                                                                                                       
                                                                                                                                    
  ### Estado                                                                                                                        
                                                                                                                                    
  DECISIÓN PENDIENTE                                                                                                                
  ──────                                                                                                                            
  ## 5. A-04 — Sale → Lot                                                                                                           
                                                                                                                                    
  ### Evidencia encontrada                                                                                                          
                                                                                                                                    
  • En 01-entities.md:1420-1430 (Sección 20) y 02-relationships.md (Sección 26), la entidad SaleDetail vincula directamente un      
  ID_Producto y un ID_Lote.                                                                                                         
  • En 11-model-validation.md:209-214 (A-04 y D-04), se evidencia que cuando una venta requiere una cantidad superior a la          
  disponibilidad de un único lote, no está definido el mecanismo de persistencia para satisfacer el pedido desde múltiples lotes.   
                                                                                                                                    
  ### Decisión                                                                                                                      
                                                                                                                                    
  Definir la regla de persistencia ante consumos de múltiples lotes:                                                                
                                                                                                                                    
  • Opción A: División automática de la línea en múltiples registros de SaleDetail (cada registro vincula un único ID_Lote con su   
  respectiva cantidad y subtotal).                                                                                                  
  • Opción B: Creación de una entidad relacional intermedia de desglose (SaleDetailLotAllocation).                                  
                                                                                                                                    
  ### Estado                                                                                                                        
                                                                                                                                    
  DECISIÓN PENDIENTE                                                                                                                
  ──────                                                                                                                            
  ## 6. A-05 — InventoryBalance                                                                                                     
                                                                                                                                    
  ### Evidencia encontrada                                                                                                          
                                                                                                                                    
  • En 01-entities.md:943-1003 (Sección 14), 06-inventory-flow.md y 04-persistence-boundaries.md:507-551, se establece que          
  InventoryMovement es la única fuente de verdad inmutable de variación de stock.                                                   
  • En 12-vba-fidelity-validation.md:423-547 (Sección 7, 24 H-03, 25 C-01 y 26 D-02), se constata que en el VBA original existía    
  tanto la tabla de movimientos como una tabla consolidada tblInventario.                                                           
  • En 11-model-validation.md:215-220 (A-05 y D-05), se registra la necesidad de decidir entre persistencia materializada o cálculo 
  al vuelo.                                                                                                                         
                                                                                                                                    
  ### Decisión                                                                                                                      
                                                                                                                                    
  Definir la estrategia de persistencia del balance de existencias:                                                                 
                                                                                                                                    
  1. Cálculo dinámico bajo demanda mediante consultas agregadas o vistas SQL sobre InventoryMovement (evitando redundancia física en
  V1).                                                                                                                              
  2. Creación de un modelo físico InventoryBalance sincronizado atómicamente dentro de la transacción de cada movimiento.           
                                                                                                                                    
  ### Estado                                                                                                                        
                                                                                                                                    
  DECISIÓN PENDIENTE                                                                                                                
  ──────                                                                                                                            
  ## 7. A-06 — Campos opcionales                                                                                                    
                                                                                                                                    
  ### Evidencia encontrada                                                                                                          
                                                                                                                                    
  • En 01-entities.md:229-233 (Sección 4), aparece el atributo opcional Tapilla para Presentation.                                  
  • En 01-entities.md:683-690 (Sección 10), aparece el atributo opcional Activo para RecipeDetail.                                  
  • En 11-model-validation.md:221-226 (A-06), se identifica que ambos provienen de notas de versiones maestras avanzadas y se       
  requiere confirmar si forman parte obligatoria de la V1.                                                                          
                                                                                                                                    
  ### Decisión                                                                                                                      
                                                                                                                                    
  Ratificar si en el schema de persistencia V1:                                                                                     
                                                                                                                                    
  1. Se incluyen como columnas nullables/por defecto (Tapilla String? y Activo Boolean @default(true)).                             
  2. Se excluyen de la versión inicial V1 para apegarse a la estructura mínima confirmada.                                          
                                                                                                                                    
  ### Estado                                                                                                                        
                                                                                                                                    
  DECISIÓN PENDIENTE                                                                                                                
  ──────                                                                                                                            
  ## 8. Estrategia de IDs                                                                                                           
                                                                                                                                    
  ### Decisión                                                                                                                      
                                                                                                                                    
  Definir la estrategia uniforme para las claves primarias técnicas (id) de todos los modelos persistentes en Prisma y PostgreSQL:  
                                                                                                                                    
  • CUID (String @id @default(cuid()))                                                                                              
  • UUID v4 (String @id @default(uuid()) o @default(dbgenerated("gen_random_uuid()")))                                              
  • Entero secuencial (Int @id @default(autoincrement()))                                                                           
                                                                                                                                    
  ### Justificación                                                                                                                 
                                                                                                                                    
  En 10-technical-implementation-notes.md:329-357 (Sección 9), 02-database-implementation-plan.md:537-587 (Sección 10 y 11) y       
  02-database-implementation-readiness-review.md:462 (Sección 16), se establece la obligatoriedad de separar identificadores        
  técnicos de claves funcionales de negocio, dejando catalogada la elección del tipo técnico como "NO DEFINIDO".                    
                                                                                                                                    
  ### Estado                                                                                                                        
                                                                                                                                    
  DECISIÓN PENDIENTE                                                                                                                
  ──────                                                                                                                            
  ## 9. Precisión Decimal                                                                                                           
                                                                                                                                    
  ### Decisión                                                                                                                      
                                                                                                                                    
  Fijar la precisión y escala numérica exacta (@db.Decimal(precision, scale)) por categoría de datos:                               
                                                                                                                                    
  1. Valores monetarios y costos (precios, costos unitarios, totales, pagos, gastos): ej. @db.Decimal(12, 2) o @db.Decimal(12, 4).  
  2. Cantidades y consumos (insumos, inventario, rendimientos): ej. @db.Decimal(12, 4).                                             
  3. Porcentajes (mermas de receta, descuentos, márgenes): ej. @db.Decimal(5, 2) o @db.Decimal(5, 4).                               
                                                                                                                                    
  ### Justificación                                                                                                                 
                                                                                                                                    
  En 10-technical-implementation-notes.md:453-525 (Sección 12 y 13), 02-database-implementation-plan.md:874-938 (Sección 20 y 21) y 
  02-database-implementation-readiness-review.md:463 (Sección 16), se prohíbe el uso de punto flotante binario (Float/Double) para  
  dinero y cantidades, pero se documenta que la escala exacta por columna está pendiente de especificación.                         
                                                                                                                                    
  ### Estado                                                                                                                        
                                                                                                                                    
  DECISIÓN PENDIENTE                                                                                                                
  ──────                                                                                                                            
  ## 10. Convención de nombres físicos                                                                                              
                                                                                                                                    
  ### Decisión                                                                                                                      
                                                                                                                                    
  Estandarizar las reglas de mapeo físico entre capas:                                                                              
                                                                                                                                    
  • Modelos y propiedades en JavaScript / Prisma: PascalCase para modelos y camelCase para campos.                                  
  • Tablas y columnas en PostgreSQL: snake_case mediante anotaciones explícitas @@map("nombre_tabla") y @map("nombre_columna").     
                                                                                                                                    
  ### Justificación                                                                                                                 
                                                                                                                                    
  naming.md se encuentra registrado como "Pendiente de definición." y 02-database-implementation-readiness-review.md:461 (Sección   
  16) lo cataloga expresamente como un punto no definido antes de construir schema.prisma.                                          
                                                                                                                                    
  ### Estado                                                                                                                        
                                                                                                                                    
  DECISIÓN PENDIENTE                                                                                                                
  ──────                                                                                                                            
  ## 11. PostgreSQL schema                                                                                                          
                                                                                                                                    
  ### Decisión                                                                                                                      
                                                                                                                                    
  Determinar si los modelos persistirán en:                                                                                         
                                                                                                                                    
  1. El esquema por defecto public.                                                                                                 
  2. Un esquema PostgreSQL dedicado (ej. app, core) mediante directivas schemas = [...] en el bloque datasource de Prisma y cadenas 
  de conexión aisladas.                                                                                                             
                                                                                                                                    
  ### Justificación                                                                                                                 
                                                                                                                                    
  En 05-prisma-implementation-plan.md:175-195 (Sección 6) y 02-database-implementation-readiness-review.md:464 (Sección 16), se     
  constata que la configuración del esquema físico en PostgreSQL no ha sido fijada.                                                 
                                                                                                                                    
  ### Estado                                                                                                                        
                                                                                                                                    
  DECISIÓN PENDIENTE                                                                                                                
  ──────                                                                                                                            
  ## 12. Decisiones pendientes                                                                                                      
                                                                                                                                    
  A continuación se resume el inventario consolidado de decisiones técnicas que requieren ratificación formal antes de generar      
  schema.prisma:                                                                                                                    
                                                                                                                                    
  1. D-01 (A-01): Regla de captura/cálculo entre Cantidad_Oz y Cantidad_ml en Presentation.                                         
  2. D-02 (A-02): Estructura relacional de Lot (tabla polimórfica con constraint XOR vs. tabla exclusiva de producto terminado).    
  3. D-03 (A-03): Cardinalidad relacional física entre Production y Lot (1:1 con @unique vs. 1:N).                                  
  4. D-04 (A-04): Manejo de consumos de múltiples lotes en ventas (split en SaleDetail vs. tabla intermedia SaleDetailLotAllocation).
  5. D-05 (A-05): Estrategia de balance de inventario (cálculo dinámico / vistas SQL vs. tabla persistente InventoryBalance).       
  6. D-06 (A-06): Inclusión o exclusión de campos opcionales (Tapilla en Presentation y Activo en RecipeDetail).                    
  7. D-07: Estrategia unificada de identificadores técnicos (CUID, UUID o Int autoincrement).                                       
  8. D-08: Especificación de precisión y escala en tipos @db.Decimal (moneda, cantidades, porcentajes).                             
  9. D-09: Estandarización de mapeo de nombres físicos (camelCase / PascalCase a snake_case con @map y @@map).                      
  10. D-10: Selección del esquema PostgreSQL (public vs. esquema dedicado).                                                         
  ──────                                                                                                                            
  ## 13. Riesgos                                                                                                                    
                                                                                                                                    
  1. Riesgo de migraciones destructivas o retrabajos: Iniciar la codificación de schema.prisma sin fijar la estrategia de IDs (UUID 
  vs Int) o la cardinalidad Production-Lot obligaría a refactorizaciones complejas y migraciones correctivas.                       
  2. Riesgo de inconsistencias numéricas y redondeos: No fijar la escala de Decimal puede generar pérdidas de precisión en costos   
  unitarios de insumos, subtotales de ventas o cálculos de merma.                                                                   
  3. Riesgo de complejidad accidental en ventas: No formalizar el manejo de fraccionamiento de lotes puede acoplar prematuramente la
  UI o requerir cambios estructurales en SaleDetail.                                                                                
  4. Riesgo de dispersión de convenciones físicas: Omitir la regla de @map y @@map causaría discrepancias entre las convenciones de 
  JavaScript (camelCase) y los estándares de bases de datos relacionales en PostgreSQL (snake_case).                                
  ──────                                                                                                                            
  ## 14. Impacto sobre el modelo existente                                                                                          
                                                                                                                                    
  Se confirma formalmente que:                                                                                                      
                                                                                                                                    
  • No se modificaron entidades, atributos, relaciones ni reglas de negocio existentes en la documentación.                         
  • No se agregaron tablas, entidades ni relaciones nuevas.                                                                         
  • Se mantuvo la fidelidad documental frente a ,  y .                                                                              
  ──────                                                                                                                            
  ## 15. Estado final                                                                                                               
                                                                                                                                    
  DECISIONS REQUIRED                                                                                                                
