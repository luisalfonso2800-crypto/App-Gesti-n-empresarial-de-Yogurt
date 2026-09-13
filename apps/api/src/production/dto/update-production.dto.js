import { IsNumber, IsOptional, IsArray, IsDateString, Min } from 'class-validator';

export class UpdateProductionDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  cantidadProducidaReal;

  @IsOptional()
  @IsDateString()
  fechaVencimiento;

  @IsOptional()
  @IsArray()
  detalles;
}
