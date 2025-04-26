import { Test, TestingModule } from '@nestjs/testing';
import { AiStoreService } from './ai-store.service';

describe('AiStoreService', () => {
  let service: AiStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiStoreService],
    }).compile();

    service = module.get<AiStoreService>(AiStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
