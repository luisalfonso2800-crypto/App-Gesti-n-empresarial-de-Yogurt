/**
 * @file create-recipe.dto.js
 * @module Recipes/DTO
 * @description Data Transfer Object para la creación de recetas técnicas, etapas y detalles de manufactura.
 * @responsibility Validar tipos, rangos numéricos estrictos y obligatoriedad de campos al registrar una nueva receta.
 * @usedBy apps/api/src/recipes/recipes.controller.js
 * @dependencies class-validator
 */

import { IsString, IsNumber, IsOptional, IsArray, IsBoolean, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateRecipeDetailDto {
  @IsOptional()
  @IsString()
  idInsumo;

  @IsOptional()
  @IsString()
  idProductoIntermedio;

  @IsNumber()
  @Min(0.0001, { message: 'La cantidad requerida debe ser estrictamente mayor a 0' })
  cantidadRequerida;

  @IsString()
  @IsNotEmpty({ message: 'La unidad de medida no puede estar vacía' })
  unidad;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'El porcentaje de merma no puede ser negativo' })
  @Max(99.9999, { message: 'El porcentaje de merma debe ser estrictamente menor al 100%' })
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

export class CreateRecipeEtapaDto {
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

export class CreateRecipeDto {
  @IsString()
  idProducto;

  @IsString()
  nombre;

  @IsNumber()
  @Min(0.01)
  rendimientoBase;

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