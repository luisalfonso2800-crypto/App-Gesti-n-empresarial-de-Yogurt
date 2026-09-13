/**
 * @file update-recipe.dto.js
 * @module Recipes/DTO
 * @description Data Transfer Object para la actualización de recetas técnicas, etapas y detalles de manufactura.
 * @responsibility Validar tipos y rangos numéricos permitidos en modificaciones parciales o totales de recetas.
 * @usedBy apps/api/src/recipes/recipes.controller.js
 * @dependencies class-validator
 */

import { IsString, IsNumber, IsOptional, IsArray, IsBoolean, Min, Max, IsNotEmpty } from 'class-validator';

export class UpdateRecipeDetailDto {
  @IsOptional()
  @IsString()
  id;

  @IsOptional()
  @IsString()
  idInsumo;

  @IsOptional()
  @IsString()
  idProductoIntermedio;

  @IsOptional()
  @IsNumber()
  @Min(0.0001, { message: 'La cantidad requerida debe ser estrictamente mayor a 0' })
  cantidadRequerida;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'La unidad de medida no puede estar vacía' })
  unidad;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100, { message: 'El porcentaje de merma no puede exceder el 100%' })
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

export class UpdateRecipeEtapaDto {
  @IsOptional()
  @IsString()
  id;

  @IsOptional()
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