import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { TaskStatus, Task } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  transform(value: any) {
    const statusValue = value.toUpperCase();

    if (!this.isStatusValid(statusValue)) {
      throw new BadRequestException(`${value} is an invalid status`);
    }
    return statusValue;
  }

  private isStatusValid(status: TaskStatus): boolean {
    return Boolean(this.allowedStatuses.find(allowedStatus => allowedStatus === status));
  }
}
