import {ApiOperation, GetOperationMetadata} from '../../../src/metadata/index';
import {TaskModel} from '../task.model';
import {Injectable} from 'injection-js';
import {AbstractGetOperation} from '../../../src/operations/index';
import {TaskService} from '../task.service';
import {populateResult} from '../middleware/populate-result';

@ApiOperation<GetOperationMetadata<TaskModel>>({
  name: 'app_task_get_with_post_read',
  transports: ['HTTP'],
  http_path: '/tasks-with-post-read/:id',
  service: TaskService,
  postRead: [
    populateResult({'name': 'modified by post-read'}),
  ]
})
@Injectable()
export class GetTaskWithPostReadOperation extends AbstractGetOperation<TaskModel> { }