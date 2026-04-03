import { ICounterEntity } from "../../../models/counter_entity";
import { IBaseRepository } from "../../base_repository.interface";

export interface ICounterRepository extends IBaseRepository<ICounterEntity> {
  increment(key: string): Promise<number>
}