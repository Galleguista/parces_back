import { Test, TestingModule } from '@nestjs/testing';
import { ForosController } from './foros.controller';
import { ForosService } from './foros.service';

describe('ForosController', () => {
  let controller: ForosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForosController],
      providers: [ForosService],
    }).compile();

    controller = module.get<ForosController>(ForosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
