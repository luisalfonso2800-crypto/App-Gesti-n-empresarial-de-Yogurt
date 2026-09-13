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
  @IsString()
  imagenUrl;

  @IsOptional()
  @IsBoolean()
  activo;

  @IsOptional()
  @IsString()
  observaciones;
}