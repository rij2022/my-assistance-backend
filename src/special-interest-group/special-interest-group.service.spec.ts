import { Test, TestingModule } from '@nestjs/testing';
import { SpecialInterestGroupService } from './special-interest-group.service';

describe('SpecialInterestGroupService', () => {
  let service: SpecialInterestGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecialInterestGroupService],
    }).compile();

    service = module.get<SpecialInterestGroupService>(SpecialInterestGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
