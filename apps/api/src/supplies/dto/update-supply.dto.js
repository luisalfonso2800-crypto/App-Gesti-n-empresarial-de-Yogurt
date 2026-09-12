import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class UpdateSupplyDto {
  @IsOptional()
  @IsString()
  nombre;

  @IsOptional()
  @IsString()
  categoria;

  @IsOptional()
  @IsString()
  subcategoria;

  @IsOptional()
  @IsString()
  marca;

  @IsOptional()
  @IsString()
  unidadBase;

  @IsOptional()
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
