import { Test, TestingModule } from '@nestjs/testing';
import { AiStoreController } from './ai-store.controller';

describe('AiStoreController', () => {
  let controller: AiStoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiStoreController],
    }).compile();

    controller = module.get<AiStoreController>(AiStoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
