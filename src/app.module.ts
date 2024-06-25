import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { LabelsModule } from './labels/labels.module';

@Module({
  imports: [TodosModule, LabelsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
