import { Test, TestingModule } from '@nestjs/testing';
import { ForosService } from './foros.service';

describe('ForosService', () => {
  let service: ForosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForosService],
    }).compile();

    service = module.get<ForosService>(ForosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
