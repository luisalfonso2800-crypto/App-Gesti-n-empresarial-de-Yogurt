import { IsString, IsNumber, IsOptional, IsArray, IsBoolean, Min } from 'class-validator';

export class CreateRecipeDetailDto {
  @IsOptional()
  @IsString()
  idInsumo;

  @IsOptional()
  @IsString()
  idProductoIntermedio;

  @IsNumber()
  @Min(0)
  cantidadRequerida;

  @IsString()
  unidad;

  @IsOptional()
  @IsNumber()
  @Min(0)
  mermaPorcentaje;

  @IsOptional()
  @IsBoolean()
  esOpcional;

  @IsOptional()
  @IsString()
  grupoVariante;

  @IsOptional()
  @IsString()
  tipoInsumo;

  @IsOptional()
  @IsBoolean()
  activo;

  @IsOptional()
  @IsString()
  observaciones;
}

export class CreateRecipeEtapaDto {
  @IsString()
  nombre;

  @IsOptional()
  @IsNumber()
  orden;

  @IsOptional()
  @IsNumber()
  tiempoMinimoMin;

  @IsOptional()
  @IsNumber()
  tiempoEstandarMin;

  @IsOptional()
  @IsNumber()
  tiempoMaximoMin;

  @IsOptional()
  @IsNumber()
  tempMinimaGrados;

  @IsOptional()
  @IsNumber()
  tempMaximaGrados;

  @IsOptional()
  @IsString()
  instrucciones;

  @IsOptional()
  @IsBoolean()
  activo;

  @IsOptional()
  @IsArray()
  detalles;
}

export class CreateRecipeDto {
  @IsString()
  idProducto;

  @IsString()
  nombre;

  @IsNumber()
  @Min(0.01)
  rendimientoBase;

  @IsString()
  unidadRendimiento;

  @IsOptional()
  @IsBoolean()
  activo;

  @IsOptional()
  @IsString()
  observaciones;

  @IsOptional()
  @IsArray()
  etapas;
}