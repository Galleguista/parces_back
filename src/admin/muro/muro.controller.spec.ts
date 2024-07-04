import { Test, TestingModule } from '@nestjs/testing';
import { MuroController } from './muro.controller';
import { MuroService } from './muro.service';

describe('MuroController', () => {
  let controller: MuroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MuroController],
      providers: [MuroService],
    }).compile();

    controller = module.get<MuroController>(MuroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
