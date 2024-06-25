import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { Label } from './interfaces/label.interface';
import { CreateLabelDto } from './dto/create-label.dto';

@Controller('api/labels')
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Post()
  create(@Body() createLabelDto: CreateLabelDto): Label {
    return this.labelsService.create(createLabelDto.name, createLabelDto.color);
  }

  @Get()
  findAll(): Label[] {
    return this.labelsService.findAll();
  }

  @Delete(':id')
  delete(@Param('id') id: string): {message: string } {
    return this.labelsService.delete(id); 
  }
}
