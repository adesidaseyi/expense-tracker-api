import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NewCategoryDto } from './dto/new-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/users/users.service';
import { IResponse } from 'src/response.interface';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly usersService: UserService,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async newCategory(
    userId: number,
    newCategoryDto: NewCategoryDto,
  ): Promise<IResponse> {
    try {
      const foundUser = await this.usersService.findUserId(userId);
      const foundCategory = await this.findCategoryByName(
        newCategoryDto.name.toLowerCase(),
        userId,
      );
      if (foundCategory) {
        throw new ConflictException('Category name already exists');
      }

      const savedCategory = await this.categoryRepository.save({
        name: newCategoryDto.name.toLowerCase(),
        createdBy: foundUser,
      });
      savedCategory.name = this.toTitleCase(savedCategory.name);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Successfully saved category',
        data: savedCategory,
      };
    } catch (err) {
      throw err;
    }
  }

  async getCategories(): Promise<IResponse> {
    const allCategories = await this.categoryRepository.find({
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
    allCategories.forEach((category) => {
      category.name = this.toTitleCase(category.name);
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully retrieved all categories',
      data: allCategories,
    };
  }

  async updateCategory(
    userId: number,
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<IResponse> {
    try {
      const { name } = updateCategoryDto;
      const category = await this.categoryRepository.findOne({
        where: { createdBy: { id: userId }, id: categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      if (await this.findCategoryByName(name.toLowerCase(), userId)) {
        throw new ConflictException('Category name already exists');
      }

      const updatedCategory = await this.categoryRepository.save({
        id: category.id,
        name: name.toLowerCase() || category.name,
      });
      updatedCategory.name = this.toTitleCase(updatedCategory.name);
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfuly updated Category',
        data: updatedCategory,
      };
    } catch (err) {
      throw err;
    }
  }

  async deleteCategory(userId: number, categoryId: number): Promise<IResponse> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { createdBy: { id: userId }, id: categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      const deletedCategory = await this.categoryRepository.remove(category);
      deletedCategory.name = this.toTitleCase(deletedCategory.name);
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted category',
        data: deletedCategory,
      };
    } catch (err) {
      throw err;
    }
  }

  async findCategoryByName(catName: string, userId: number): Promise<Boolean> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { createdBy: { id: userId }, name: catName },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      return !!category;
    } catch (err) {
      throw err;
    }
  }

  async findCategoryById(userId: number, categoryId: number) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { createdBy: { id: userId }, id: categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      return category;
    } catch (err) {
      throw err;
    }
  }

  toTitleCase(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
