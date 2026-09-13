import { IsString, IsNumber, IsOptional, IsArray, IsDateString, Min } from 'class-validator';

export class CreateProductionDto {
  @IsString()
  idProducto;

  @IsNumber()
  @Min(0.01)
  cantidadPlanificada;

  @IsOptional()
  @IsDateString()
  fechaProduccion;

  @IsOptional()
  @IsDateString()
  fechaPlanificada;

  @IsOptional()
  @IsDateString()
  fechaVencimiento;

  @IsOptional()
  @IsString()
  estado;

  @IsOptional()
  @IsString()
  observaciones;

  @IsOptional()
  @IsArray()
  detalles;
}