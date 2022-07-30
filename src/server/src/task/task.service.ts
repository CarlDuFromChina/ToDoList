import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import assert from 'src/common/assert';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>
  ) {}

  singleQuery(id: string) {
    return this.taskRepository.findOne(id);
  }

  query(userCode: string){
    return this.taskRepository.find({
      where: { user_code: userCode },
      order: {
        star: 'DESC',
        order: 'ASC',
      },
    });
  }

  save(data: Task) {
    this.taskRepository.save(data);
  }

  delete(id: string) {
    this.taskRepository.delete(id);
  }

  async swap(code: string, ids: Array<string>) {
    await this.taskRepository.manager.transaction(async () => {
      var plist = await this.query(code);
      var list = await this.taskRepository.findByIds(ids);
      var clist = ids.map(item => list.find(e => e.id === item));

      clist.forEach((item, index) => {
        item.order = plist[index].order;
      });
      await this.taskRepository.save(list);
    });
  }
}