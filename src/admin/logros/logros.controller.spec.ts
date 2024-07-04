import { Test, TestingModule } from '@nestjs/testing';
import { LogrosController } from './logros.controller';
import { LogrosService } from './logros.service';

describe('LogrosController', () => {
  let controller: LogrosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogrosController],
      providers: [LogrosService],
    }).compile();

    controller = module.get<LogrosController>(LogrosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
