import {Project} from './project';
import {TimeSpan} from './time-span';
export class Trigger {
  public _id:string;
  public name:string;
  public type:string;
  public timeSpan:TimeSpan;
  public areaTrigger:string;
  public socialTrigger:string;
  public healthTrigger:string;
  public repeats:number;
  public children:[Trigger];
  public project:Project;

  constructor(project:Project) {
      this.project = project;
      let timeSpan:TimeSpan = new TimeSpan();
      timeSpan.cronStart = '0 0 10 1/1 * ? *';
      timeSpan.cronEnd = '0 0 22 1/1 * ? *';
      timeSpan.repeats = 1;
      this.timeSpan = timeSpan;
  }
}

