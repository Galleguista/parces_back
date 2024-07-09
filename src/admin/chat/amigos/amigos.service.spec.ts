import { Test, TestingModule } from '@nestjs/testing';
import { AmigosService } from './amigos.service';

describe('AmigosService', () => {
  let service: AmigosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmigosService],
    }).compile();

    service = module.get<AmigosService>(AmigosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
