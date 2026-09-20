import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  nombre;

  @IsString()
  idPresentacion;

  @IsString()
  categoria;

  @IsOptional()
  @IsString()
  descripcion;

  @IsString()
  canalVenta;

  @IsNumber()
  @Min(0)
  precioVenta;

  @IsNumber()
  @Min(0)
  margenObjetivo;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precioMayorista;

  @IsOptional()
  @IsNumber()
  @Min(1)
  cantidadMinimaMayorista;

  @IsOptional()
  @IsNumber()
  @Min(0)
  descuentoMayoristaPorcentaje;

  @IsOptional()
  @IsString()
  imagenUrl;

  @IsOptional()
  @IsBoolean()
  activo;

  @IsOptional()
  @IsString()
  observaciones;
}