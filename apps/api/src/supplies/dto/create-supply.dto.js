import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreateSupplyDto {
  @IsString()
  nombre;

  @IsString()
  categoria;

  @IsString()
  subcategoria;

  @IsString()
  marca;

  @IsString()
  unidadBase;

  @IsNumber()
  @Min(0)
  stockMinimo;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costoBase;

  @IsOptional()
  @IsBoolean()
  activo;

  @IsOptional()
  @IsString()
  observaciones;
}
