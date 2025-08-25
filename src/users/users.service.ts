import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async findAllUsers() {
        const user = await this.userRepository.find({
            select: { 
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
            },
        });
        return user;
    }

    async findUserId(userId: number) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
                select: { 
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                },
            });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            return user;
        } catch(err) {
            throw err;
        }
    }

    async findUserEmail(email: string) {
            const user = await this.userRepository.findOneBy({ email: email });
            return user;
    }

    async createUser(email: string, password: string, firstName: string, lastName: string) {
        try {
            const newUser = this.userRepository.create({ 
                email: email, 
                password: password,
                firstName: firstName,
                lastName: lastName,
            });
            await this.userRepository.save(newUser);
        } catch(err) {
            throw err;
        }
    }
}