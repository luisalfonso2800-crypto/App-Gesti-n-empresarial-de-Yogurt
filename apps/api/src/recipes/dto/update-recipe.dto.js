import { IsString, IsNumber, IsOptional, IsArray, IsBoolean, Min } from 'class-validator';

export class UpdateRecipeDto {
  @IsOptional()
  @IsString()
  idProducto;

  @IsOptional()
  @IsString()
  nombre;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  rendimientoBase;

  @IsOptional()
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