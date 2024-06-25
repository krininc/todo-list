import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { Label } from './interfaces/label.interface';

@Injectable()
export class LabelsService {
  private labels: Label[] = [];

  constructor() {
    this.loadFromFile();
  }

  create(name: string, color?: string): Label {
    const newLabel: Label = {
      id: uuidv4(),
      name,
      color,
    };
    this.labels.push(newLabel);
    this.saveToFile();
    return newLabel;
  }

  findAll(): Label[] {
    return this.labels;
  }

  delete(id: string): { message: string } {
    const index = this.labels.findIndex(label => label.id === id);
    if (index === -1) {
      throw new NotFoundException(`Label with id ${id} not found`);
    }
    this.labels.splice(index, 1);
    this.saveToFile();
    return { message: 'Label deleted successfully' };
  }

  private saveToFile() {
    const filePath = path.resolve(__dirname, '..', 'labels.json');
    fs.writeFileSync(filePath, JSON.stringify(this.labels, null, 2));
  }

  private loadFromFile() {
    const filePath = path.resolve(__dirname, '..', 'labels.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      this.labels = JSON.parse(data);
    }
  }
}
