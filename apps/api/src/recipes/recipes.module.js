import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { RecipesRepository } from './recipes.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RecipesController],
  providers: [RecipesService, RecipesRepository],
  exports: [RecipesService],
})
export class RecipesModule {}
