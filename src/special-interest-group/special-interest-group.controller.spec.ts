import { Test, TestingModule } from '@nestjs/testing';
import { SpecialInterestGroupController } from './special-interest-group.controller';

describe('SpecialInterestGroupController', () => {
  let controller: SpecialInterestGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialInterestGroupController],
    }).compile();

    controller = module.get<SpecialInterestGroupController>(SpecialInterestGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
