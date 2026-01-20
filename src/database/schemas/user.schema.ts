import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from './base.schema';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    MODERATOR = 'moderator',
}

export type UserDocument = User & Document;

@Schema({
    timestamps: true,
    collection: 'users'
})
export class User extends BaseSchema {
    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, trim: true })
    firstName: string;

    @Prop({ required: true, trim: true })
    lastName: string;

    @Prop({ type: [String], enum: UserRole, default: [UserRole.USER] })
    roles: UserRole[];

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ required: false })
    refreshToken?: string;

    @Prop({ type: Date, default: null })
    lastLogin: Date | null;

    @Prop({ default: false })
    emailVerified: boolean;

    @Prop({ required: false })
    avatar?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ roles: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function (this: UserDocument) {
    return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
UserSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret: Record<string, any>) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
    },
});

UserSchema.set('toObject', {
    virtuals: true,
    transform: function (doc, ret: Record<string, any>) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
    },
});
