import { Test, TestingModule } from '@nestjs/testing';
import { RecipeService } from './recipe.service';
import { IRecipeRepository } from '../domain/output-ports/recipe.repository.interface';
import { IIngredientRepository } from '@/modules/ingredient/domain/output-ports/ingredient.repository.interface';
import { RecipeModel } from '../domain/recipe.model';
import Decimal from 'decimal.js';

describe('RecipeService', () => {
  let service: RecipeService;
  let recipeRepository: jest.Mocked<IRecipeRepository>;
  let ingredientRepository: jest.Mocked<IIngredientRepository>;

  beforeEach(async () => {
    recipeRepository = {
      get: jest.fn(),
      search: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createWithItems: jest.fn(),
      updateCosts: jest.fn(),
      getRecipeIdsByIngredients: jest.fn(),
    } as unknown as jest.Mocked<IRecipeRepository>;

    ingredientRepository = {
      get: jest.fn(),
      search: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findLowStock: jest.fn(),
    } as unknown as jest.Mocked<IIngredientRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeService,
        {
          provide: 'IRecipeRepository',
          useValue: recipeRepository,
        },
        {
          provide: 'IIngredientRepository',
          useValue: ingredientRepository,
        },
      ],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('recalculateCost', () => {
    it('should recalculate cost based on ingredients and sub-recipes', async () => {
      // Mock recipe
      const mockRecipe = {
        id: 'recipe-1',
        laborCost: 10,
        marginPercentage: 50, // 50% margin
        items: [
          { type: 'INGREDIENT', referenceId: 'ing-1', quantity: 2 },
          { type: 'RECIPE', referenceId: 'recipe-2', quantity: 1 },
        ],
      } as unknown as RecipeModel;

      // Mock sub-recipe
      const mockSubRecipe = {
        id: 'recipe-2',
        currentProductionCost: 20,
        laborCost: 5,
        marginPercentage: 10,
        items: [],
      } as unknown as RecipeModel;

      // Mock ingredient
      const mockIngredient = {
        id: 'ing-1',
        averageCostPerUnit: 5,
      };

      // Set up mocks
      jest.spyOn(service, 'get').mockImplementation(async (id) => {
        if (id === 'recipe-1') return mockRecipe;
        if (id === 'recipe-2') return mockSubRecipe;
        return undefined as any;
      });

      ingredientRepository.get.mockResolvedValue(mockIngredient as any);
      
      const expectedTotalCost = new Decimal(10) // labor cost
        .add(new Decimal(5).mul(2)) // 2 ingredients at 5 each = 10
        .add(new Decimal(20).mul(1)); // 1 sub-recipe at 20 = 20
        // Total = 40

      const expectedSuggestedPrice = new Decimal(40).mul(1.5); // 50% margin = 60

      const updatedRecipeMock = { id: 'recipe-1' } as any;
      recipeRepository.updateCosts.mockResolvedValue(updatedRecipeMock);
      
      // We also need to mock the updateCosts for the recursive call if it happens
      // Wait, recalculateCost calls itself for sub-recipes. So recipe-2 will be recalculated.
      // For recipe-2, laborCost=5, no items. Total=5. SuggestedPrice=5*1.1=5.5
      // Let's just mock updateCosts to return what was passed.
      recipeRepository.updateCosts.mockImplementation(async (id, cost, price) => {
        if (id === 'recipe-2') {
          return { ...mockSubRecipe, currentProductionCost: cost } as any;
        }
        return updatedRecipeMock;
      });

      const result = await service.recalculateCost('recipe-1');
      
      expect(result).toBe(updatedRecipeMock);
      
      // For recipe-2
      expect(recipeRepository.updateCosts).toHaveBeenCalledWith('recipe-2', new Decimal(5), new Decimal(5.5));
      
      // For recipe-1
      // Cost of recipe-2 returned by recalculateCost('recipe-2') is 5 (since it uses the updated production cost)
      // So recipe-1 total cost = 10 (labor) + 10 (ingredients) + 5 (subrecipe) = 25
      // Suggested price = 25 * 1.5 = 37.5
      expect(recipeRepository.updateCosts).toHaveBeenCalledWith('recipe-1', new Decimal(25), new Decimal(37.5));
    });
  });

  describe('getRecipeIdsByIngredients', () => {
    it('should delegate to repository', async () => {
      recipeRepository.getRecipeIdsByIngredients.mockResolvedValue(['recipe-1']);
      const result = await service.getRecipeIdsByIngredients(['ing-1']);
      expect(result).toEqual(['recipe-1']);
      expect(recipeRepository.getRecipeIdsByIngredients).toHaveBeenCalledWith(['ing-1']);
    });
  });
});
