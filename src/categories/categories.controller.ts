import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/iam/authentication/public.decorator';
import { Role } from 'src/users/enums/roles.enum';
import { Roles } from 'src/iam/authorization/roles.decorator';
import { ActiveUser } from 'src/iam/authentication/active-user.decorator';
import { NewCategoryDto } from './dto/new-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    newCategory(@ActiveUser('sub') userId: number, @Body() newCategoryDto: NewCategoryDto) {
        return this.categoriesService.newCategory(userId, newCategoryDto);
    }

    @Public()
    @Get()
    getCategories() {
        return this.categoriesService.getCategories();
    }

    @Patch(':id')
    updateCategory(@ActiveUser('sub') userId: number, @Param('id') categoryId: number, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.updateCategory(userId, categoryId, updateCategoryDto);
    }

    @Roles(Role.ADMIN)
    @Delete(':id')
    deleteCategory(@ActiveUser('sub') userId: number, @Param('id') categoryId: number) {
        return this.categoriesService.deleteCategory(userId, categoryId);
    }
}
