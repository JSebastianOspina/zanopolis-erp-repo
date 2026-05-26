import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseService } from './purchase.service';
import { IPurchaseRepository } from '../domain/output-ports/purchase.repository.interface';
import { IRecipeService } from '../../recipe/domain/input-ports/recipe.service.interface';
import { PurchaseModel } from '../domain/purchase.model';

describe('PurchaseService', () => {
  let service: PurchaseService;
  let purchaseRepository: jest.Mocked<IPurchaseRepository>;
  let recipeService: jest.Mocked<IRecipeService>;

  beforeEach(async () => {
    purchaseRepository = {
      get: jest.fn(),
      search: jest.fn(),
      createWithTransaction: jest.fn(),
    } as unknown as jest.Mocked<IPurchaseRepository>;

    recipeService = {
      get: jest.fn(),
      search: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      duplicate: jest.fn(),
      recalculateCost: jest.fn(),
      getRecipeIdsByIngredients: jest.fn(),
    } as unknown as jest.Mocked<IRecipeService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
        {
          provide: 'IPurchaseRepository',
          useValue: purchaseRepository,
        },
        {
          provide: 'IRecipeService',
          useValue: recipeService,
        },
      ],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a purchase and trigger recipe recalculation', async () => {
      const partialModel = {
        supplierId: 'sup-1',
        total: 100,
        items: [
          { ingredientId: 'ing-1', quantity: 10, totalCost: 50 },
          { ingredientId: 'ing-2', quantity: 5, totalCost: 50 },
        ],
      } as unknown as Partial<PurchaseModel>;

      const createdPurchase = {
        id: 'pur-1',
        ...partialModel,
      } as unknown as PurchaseModel;

      purchaseRepository.createWithTransaction.mockResolvedValue(createdPurchase);
      recipeService.getRecipeIdsByIngredients.mockResolvedValue(['recipe-1', 'recipe-2']);
      recipeService.recalculateCost.mockResolvedValue({} as any);

      const result = await service.create(partialModel, 'user-1');

      expect(result).toBe(createdPurchase);
      expect(purchaseRepository.createWithTransaction).toHaveBeenCalled();
      
      // Should find recipes using the affected ingredients
      expect(recipeService.getRecipeIdsByIngredients).toHaveBeenCalledWith(['ing-1', 'ing-2']);
      
      // Should trigger recalculation for each affected recipe
      expect(recipeService.recalculateCost).toHaveBeenCalledWith('recipe-1');
      expect(recipeService.recalculateCost).toHaveBeenCalledWith('recipe-2');
      expect(recipeService.recalculateCost).toHaveBeenCalledTimes(2);
    });

    it('should catch errors from recalculation so purchase does not fail', async () => {
      const partialModel = {
        supplierId: 'sup-1',
        total: 100,
        items: [
          { ingredientId: 'ing-1', quantity: 10, totalCost: 100 },
        ],
      } as unknown as Partial<PurchaseModel>;

      const createdPurchase = {
        id: 'pur-1',
        ...partialModel,
      } as unknown as PurchaseModel;

      purchaseRepository.createWithTransaction.mockResolvedValue(createdPurchase);
      recipeService.getRecipeIdsByIngredients.mockResolvedValue(['recipe-1']);
      
      // Mock an error during recalculation
      recipeService.recalculateCost.mockRejectedValue(new Error('Recalculation failed'));

      // Ensure console.error does not pollute test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await service.create(partialModel, 'user-1');

      expect(result).toBe(createdPurchase); // Purchase should still be returned successfully
      expect(consoleSpy).toHaveBeenCalledWith('Failed to recalculate recipe recipe-1', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});
