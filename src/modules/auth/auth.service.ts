import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '@database/schemas/user.schema';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtPayload } from './strategies/jwt.strategy';

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        roles: string[];
    };
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async register(registerDto: RegisterDto): Promise<AuthResponse> {
        const { email, password, firstName, lastName } = registerDto;

        // Check if user exists
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const saltRounds = this.configService.get<number>('security.bcryptSaltRounds', 10);
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const newUser = new this.userModel({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        await newUser.save();

        // Generate tokens
        const tokens = await this.generateTokens(newUser);

        // Save refresh token
        newUser.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
        await newUser.save();

        return {
            user: {
                id: newUser._id.toString(),
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                roles: newUser.roles,
            },
            ...tokens,
        };
    }

    async login(loginDto: LoginDto): Promise<AuthResponse> {
        const { email, password } = loginDto;

        // Find user
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Check if user is active
        if (!user.isActive) {
            throw new UnauthorizedException('Account is deactivated');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Update last login
        user.lastLogin = new Date();

        // Generate tokens
        const tokens = await this.generateTokens(user);

        // Save refresh token
        user.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
        await user.save();

        return {
            user: {
                id: user._id.toString(),
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles,
            },
            ...tokens,
        };
    }

    async refreshTokens(userId: string, refreshToken: string): Promise<AuthResponse> {
        const user = await this.userModel.findById(userId);

        if (!user || !user.refreshToken) {
            throw new UnauthorizedException('Access denied');
        }

        const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!refreshTokenMatches) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const tokens = await this.generateTokens(user);

        user.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
        await user.save();

        return {
            user: {
                id: user._id.toString(),
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles,
            },
            ...tokens,
        };
    }

    async logout(userId: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(userId, {
            refreshToken: null,
        });
    }

    private async generateTokens(user: UserDocument) {
        const payload: JwtPayload = {
            sub: user._id.toString(),
            email: user.email,
            roles: user.roles,
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('jwt.secret'),
                expiresIn: this.configService.get<string>('jwt.expiresIn'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('jwt.refreshSecret'),
                expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    async validateUser(userId: string): Promise<UserDocument> {
        const user = await this.userModel.findById(userId);
        if (!user || !user.isActive) {
            throw new UnauthorizedException('User not found or inactive');
        }
        return user;
    }
}
