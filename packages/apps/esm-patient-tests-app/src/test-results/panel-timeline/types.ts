import { type ObsRecord } from '../../types';
import { type ParsedTimeType } from '../filter/filter-types';

export interface TimelineData {
  parsedTimes: ParsedTimeType;
  timelineData: Record<string, Array<ObsRecord>>;
  panelName: string;
}
