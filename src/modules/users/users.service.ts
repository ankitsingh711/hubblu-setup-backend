import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '@database/schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private configService: ConfigService,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        const { email, password } = createUserDto;

        // Check if user exists
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const saltRounds = this.configService.get<number>('security.bcryptSaltRounds', 10);
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });

        return user.save();
    }

    async findAll(): Promise<UserDocument[]> {
        return this.userModel.find({ isDeleted: false }).select('-password -refreshToken').exec();
    }

    async findOne(id: string): Promise<UserDocument> {
        const user = await this.userModel.findOne({ _id: id, isDeleted: false }).select('-password -refreshToken');

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async findByEmail(email: string): Promise<UserDocument> {
        const user = await this.userModel.findOne({ email, isDeleted: false });

        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }

        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
        const user = await this.userModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: updateUserDto },
            { new: true, runValidators: true },
        ).select('-password -refreshToken');

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async remove(id: string): Promise<void> {
        // Soft delete
        const result = await this.userModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                $set: {
                    isDeleted: true,
                    deletedAt: new Date(),
                    isActive: false,
                }
            },
        );

        if (!result) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    }

    async count(): Promise<number> {
        return this.userModel.countDocuments({ isDeleted: false });
    }
}
