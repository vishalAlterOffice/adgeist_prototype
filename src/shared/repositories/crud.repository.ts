import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';

export class CrudRepository<T> {
  constructor(private readonly repository: Repository<T>) {}

  // Helper function for error handling
  private handleError(method: string, error: any): never {
    console.error(`Error in CrudRepository - ${method}:`, error.message, error);
    throw new Error(`Something went wrong during ${method} operation.`);
  }

  // Create a new entity
  async create(data: DeepPartial<T>): Promise<T> {
    try {
      const entity = this.repository.create(data);
      return await this.repository.save(entity);
    } catch (error) {
      this.handleError('create', error);
    }
  }

  // Get entity by ID
  async get(id: string | number): Promise<T | null> {
    try {
      return await this.repository.findOne({
        where: { id } as unknown as FindOptionsWhere<T>,
      });
    } catch (error) {
      this.handleError('get', error);
    }
  }

  // Get all entities
  async getAll(): Promise<T[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      this.handleError('getAll', error);
    }
  }

  // Update an entity by ID
  async update(id: string | number, data: any): Promise<T | null> {
    try {
      await this.repository.update(id, data);
      return await this.get(id);
    } catch (error) {
      this.handleError('update', error);
    }
  }

  // Find one entity by criteria
  async findOne(criteria: FindOptionsWhere<T>): Promise<T | null> {
    try {
      return await this.repository.findOne({ where: criteria });
    } catch (error) {
      this.handleError('findOne', error);
    }
  }

  // Find one entity by ID and additional parameters
  async findByValue(
    id: string | number,
    params: FindOptionsWhere<T>,
  ): Promise<T | null> {
    try {
      return await this.repository.findOne({ where: { id, ...params } });
    } catch (error) {
      this.handleError('findByValue', error);
    }
  }

  // Delete an entity by ID
  async destroy(id: string | number): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      this.handleError('destroy', error);
    }
  }

  // Find multiple entities by criteria
  async findManyByCriteria(criteria: FindOptionsWhere<T>): Promise<T[]> {
    try {
      return await this.repository.find({ where: criteria });
    } catch (error) {
      this.handleError('findManyByCriteria', error);
    }
  }

  // Find multiple entities by relation
  async findAllByRelation(relation: string): Promise<T[]> {
    try {
      return await this.repository.find({ relations: [relation] });
    } catch (error) {
      this.handleError('findAllByRelation', error);
    }
  }

  // Find one entity by ID with relations
  async findOneByRelation(id: number, relation: string): Promise<T | null> {
    try {
      return await this.repository.findOne({
        where: { id } as unknown as FindOptionsWhere<T>,
        relations: [relation],
      });
    } catch (error) {
      this.handleError('findOneByRelation', error);
    }
  }
}
