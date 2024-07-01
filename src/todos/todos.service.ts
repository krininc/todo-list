/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './interfaces/todo.interface';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { format, parse, isValid } from 'date-fns';

@Injectable()
export class TodosService {
  private todos: Todo[] = [];

  constructor() {
    this.loadFromFile();
  }

  create(createTodoDto: CreateTodoDto): Todo {
    const newTodo: Todo = {
      id: uuidv4(),
      ...createTodoDto,
      reminder: createTodoDto.reminder
        ? format(
            parse(createTodoDto.reminder, 'yyyy-MM-dd', new Date()),
            'yyyy-MM-dd',
          )
        : null,
      dueDate: format(
        parse(createTodoDto.dueDate, 'yyyy-MM-dd', new Date()),
        'yyyy-MM-dd',
      ),
      status: 'incomplete',
    };
    this.todos.push(newTodo);
    this.saveToFile();
    return newTodo;
  }

  findAll(): Todo[] {
    return this.todos;
  }

  update(id: string, updateTodoDto: CreateTodoDto): Todo {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      this.todos[index] = { ...this.todos[index], ...updateTodoDto };
      this.saveToFile();
      return this.todos[index];
    }
    return null;
  }

  remove(id: string): { message: string } {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this.saveToFile();
      return { message: 'TODO item deleted successfully' };
    }
    return null;
  }

  findByLabel(label: string): Todo[] {
    return this.todos.filter((todo) => todo.labels.includes(label));
  }

  findReminders(): Todo[] {
    return this.todos
      .filter((todo) => {
        const parsedDate = parse(todo.reminder, 'yyyy-MM-dd', new Date());
        return isValid(parsedDate);
      })
      .sort((a, b) => {
        const dateA = parse(a.reminder, 'yyyy-MM-dd', new Date());
        const dateB = parse(b.reminder, 'yyyy-MM-dd', new Date());
        return dateA.getTime() - dateB.getTime();
      });
  }

  private saveToFile() {
    const filePath = path.resolve(__dirname, '..', 'todos.json');
    fs.writeFileSync(filePath, JSON.stringify(this.todos, null, 2));
  }

  private loadFromFile() {
    const filePath = path.resolve(__dirname, '..', 'todos.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      this.todos = JSON.parse(data);
    }
  }

  findByToday(): Todo[] {
    const today = format(new Date(), 'yyyy-MM-dd');
    return this.todos.filter((todo) => todo.dueDate === today);
  }

  updateStatus(id: string, status: string): Todo {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      this.todos[index].status = status;
      this.saveToFile();
      return this.todos[index];
    }
    return null;
  }
}
