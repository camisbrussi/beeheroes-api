import { inject, injectable } from 'tsyringe';

import { City } from '@modules/addresses/infra/typeorm/entities/City';
import { ICitiesRepository } from '@modules/addresses/repositories/ICitiesRepository';

@injectable()
class ListCitiesUseCase {
  constructor(
    @inject('CitiesRepository')
    private citiesRepository: ICitiesRepository,
  ) {}

  async execute(id: number): Promise<City[]> {
    const cities = await this.citiesRepository.listByState(id);

    return cities;
  }
}

export { ListCitiesUseCase };
