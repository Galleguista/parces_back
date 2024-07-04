import { Test, TestingModule } from '@nestjs/testing';
import { MuroService } from './muro.service';

describe('MuroService', () => {
  let service: MuroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MuroService],
    }).compile();

    service = module.get<MuroService>(MuroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
