import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { NewCategoryDto } from './dto/new-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/users/users.service';

@Injectable()
export class CategoriesService {
    constructor(
        private readonly usersService: UserService,
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    ) {}

    async newCategory(userId: number, newCategoryDto: NewCategoryDto) {
        try {
            const foundUser = await this.usersService.findUserId(userId);
            const newCategory = this.categoryRepository.create({ name: newCategoryDto.name, createdBy: foundUser });
            return await this.categoryRepository.save(newCategory);
        } catch(err) {
            const pgUniqueErrorViolationCode = '23505';
            if (err.code === pgUniqueErrorViolationCode) {
                throw new ConflictException('Category name already exists');
            }
            throw err; 
        }
    }

    async getCategories() {
        const allCategories = await this.categoryRepository.find({
            select: {
                id: true,
                name: true,
                createdAt: true,
                createdBy: { email: true, firstName: true, lastName: true, role: true }
            }
        });
        return allCategories;
    }

    async updateCategory(userId: number, categoryId: number, updateCategoryDto: UpdateCategoryDto) {
        try {
            const category = await this.categoryRepository.findOne({ where: { createdBy: { id: userId }, id: categoryId } });
            if(!category) {
                throw new NotFoundException('Category not found');
            }
            for (const key in updateCategoryDto) {
                if (updateCategoryDto[key] !== undefined) {
                    category[key] = updateCategoryDto[key];
                }
            }
            return await this.categoryRepository.save(category);
        } catch(err) {
            throw err;
        }
    }

    async deleteCategory(userId: number, categoryId: number) {
        try {
            const category = await this.categoryRepository.findOne({ where: { createdBy: { id: userId }, id: categoryId } });
            if(!category) {
                throw new NotFoundException('Category not found');
            }
            return await this.categoryRepository.remove(category);
        } catch(err) {
            throw err;
        }
    }
}
