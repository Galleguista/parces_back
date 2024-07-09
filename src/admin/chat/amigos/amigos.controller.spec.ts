import { Test, TestingModule } from '@nestjs/testing';
import { AmigosController } from './amigos.controller';
import { AmigosService } from './amigos.service';

describe('AmigosController', () => {
  let controller: AmigosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmigosController],
      providers: [AmigosService],
    }).compile();

    controller = module.get<AmigosController>(AmigosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
