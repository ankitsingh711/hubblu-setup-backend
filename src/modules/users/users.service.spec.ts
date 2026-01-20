import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { User } from '@database/schemas/user.schema';

describe('UsersService', () => {
    let service: UsersService;

    const mockUserModel = {
        new: jest.fn().mockResolvedValue({}),
        constructor: jest.fn().mockResolvedValue({}),
        find: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        findOneAndUpdate: jest.fn(),
        countDocuments: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        exec: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn((key: string, defaultValue?: any) => {
            const config = {
                'security.bcryptSaltRounds': 10,
            };
            return config[key] || defaultValue;
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getModelToken(User.name),
                    useValue: mockUserModel,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const users = [
                { email: 'test1@example.com', firstName: 'Test1' },
                { email: 'test2@example.com', firstName: 'Test2' },
            ];

            mockUserModel.find.mockReturnValue({
                select: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(users),
                }),
            });

            const result = await service.findAll();
            expect(result).toEqual(users);
            expect(mockUserModel.find).toHaveBeenCalledWith({ isDeleted: false });
        });
    });

    describe('count', () => {
        it('should return the count of users', async () => {
            mockUserModel.countDocuments.mockResolvedValue(5);

            const result = await service.count();
            expect(result).toBe(5);
            expect(mockUserModel.countDocuments).toHaveBeenCalledWith({ isDeleted: false });
        });
    });
});
