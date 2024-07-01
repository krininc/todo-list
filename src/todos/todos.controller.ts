/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './interfaces/todo.interface';

@Controller('api/todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto): Todo {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  findAll(): Todo[] {
    return this.todosService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: CreateTodoDto): Todo {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): { message: string } {
    return this.todosService.remove(id);
  }

  @Get('label/:label')
  findByLabel(@Param('label') label: string): Todo[] {
    return this.todosService.findByLabel(label);
  }

  @Get('reminders')
  findReminders(): Todo[] {
    return this.todosService.findReminders();
  }

  @Get('today')
  findByToday(): Todo[] {
    return this.todosService.findByToday();
  }

  @Put(':id/complete')
  markTodoComplete(@Param('id') id: string) {
    const updatedTodo = this.todosService.updateStatus(id, 'complete');
    if (!updatedTodo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return updatedTodo;
  }
}
