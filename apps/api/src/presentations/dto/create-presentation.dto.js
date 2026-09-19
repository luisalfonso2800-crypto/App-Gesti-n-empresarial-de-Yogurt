import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreatePresentationDto {
  @IsString()
  nombre;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cantidadOz;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cantidadMl;

  @IsString()
  tipoEnvase;

  @IsOptional()
  @IsString()
  tapilla;

  @IsOptional()
  @IsString()
  unidadMedida;

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
