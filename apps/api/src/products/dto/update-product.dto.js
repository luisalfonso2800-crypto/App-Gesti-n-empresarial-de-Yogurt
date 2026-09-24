import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  nombre;

  @IsOptional()
  @IsString()
  idPresentacion;

  @IsOptional()
  @IsString()
  categoria;

  @IsOptional()
  @IsString()
  descripcion;

  @IsOptional()
  @IsString()
  canalVenta;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precioVenta;

  @IsOptional()
  @IsNumber()
  @Min(0)
  margenObjetivo;

  @IsOptional()
  @IsString()
  imagenUrl;

  @IsOptional()
  @IsBoolean()
  activo;

  @IsOptional()
  @IsString()
  observaciones;

  @IsOptional()
  @IsString()
  codigo;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costoEstimado;

  @IsOptional()
  @IsString()
  unidadVenta;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockMinimo;
}